import { NextRequest, NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";
import crypto from "crypto";

export const runtime = "nodejs";

const ULHC_BASE_URL = process.env.ULHC_BASE_URL!; // e.g. https://ulhc.example.com
const ULHC_SHARED_SECRET = process.env.ULHC_SHARED_SECRET!; // shared with ULHC
const ULHC_PARTNER_ID = process.env.ULHC_PARTNER_ID!;

function sha256Base64(input: string) {
	return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

function signBody(body: unknown, secret: string, ts: string) {
	const bodyStr = JSON.stringify(body);
	const bodyHash = sha256Base64(bodyStr);
	const payload = `${ts}.${bodyHash}`;
	const sig = crypto
		.createHmac("sha256", secret)
		.update(payload)
		.digest("base64");
	return { sig, bodyStr };
}

export const POST = async (req: NextRequest) => {
	try {
		// (A) Auth your own user/session as needed (omitted here). You likely have NextAuth on server.
		// const session = await getServerSession(authOptions); if (!session) return 401...

		const { vrkpId } = await req.json();
		if (!vrkpId) {
			return NextResponse.json(
				{ ok: false, error: "vrkpId_required" },
				{ status: 400 }
			);
		}
		console.log("Initiating ULHC integration for VRKP ID:", vrkpId);
		// (B) Pull minimal user data to prefill on ULHC
		const user = await prisma.user.findUnique({
			where: { vrKpId: vrkpId },
			select: {
				vrKpId: true,
				fullname: true,
				email: true,
				phone: true,
				gender: true,
				aadhaar: true,
				dob: true,
			},
		});

		if (!user) {
			console.warn("User not found for VRKP ID:", vrkpId);
			return NextResponse.json(
				{ ok: false, error: "user_not_found" },
				{ status: 404 }
			);
		}

		const prefill = {
			vrkpId: user.vrKpId,
			name: user.fullname,
			email: user.email,
			phone: user.phone,
			gender: user.gender ?? null,
			aadhaar: user.aadhaar ?? null,
			dob: user.dob ? new Date(user.dob).toISOString().slice(0, 10) : null,
			// add only what ULHC needs; keep it minimal
		};

		// (C) Server→server call to ULHC with HMAC headers
		const ts = Date.now().toString();
		const { sig, bodyStr } = signBody(prefill, ULHC_SHARED_SECRET, ts);

		const res = await fetch(`${ULHC_BASE_URL}/api/integrations/vrkp`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Partner-Id": ULHC_PARTNER_ID,
				"X-Timestamp": ts,
				"X-Signature": sig,
			},
			body: bodyStr,
		});

		if (!res.ok) {
			const errText = await res.text().catch(() => "");
			return NextResponse.json(
				{
					ok: false,
					error: "ulhc_prefill_failed",
					detail: errText || res.statusText,
				},
				{ status: 502 }
			);
		}
		console.log("ULHC prefill response received.");
		const { registerUrl, token, expiresAt, alreadyRegistered } =
			await res.json();
		if (alreadyRegistered) {
			console.log("User already registered with ULHC:", vrkpId);
			await prisma.user.update({
				where: { vrKpId: vrkpId },
				data: {
					healthCard: true,
				},
			});
			return NextResponse.json({
				ok: true,
				token,
				expiresAt,
				activated: alreadyRegistered,
			});
		}

		// (D) Return a JSON for client to router.push(registerUrl). If you want,
		// detect non-fetch navigation and do a 302 instead.
		return NextResponse.json({
			ok: true,
			registerUrl,
			token,
			expiresAt,
			activated: alreadyRegistered,
		});
		// Or: return NextResponse.redirect(registerUrl, 302);
	} catch (error) {
		console.error("Error in VRKP hook POST handler:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
