// app/api/user/vrkp-card/route.ts
import { createCanvas, loadImage, registerFont } from "canvas";
import type { CanvasRenderingContext2D as NodeCanvasRenderingContext2D } from "canvas";
import sharp from "sharp";
import { NextResponse } from "next/server";

import path from "path";
import fs from "fs";
import prisma, { AdminRole } from "@ngvns2025/db/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth/auth";

// app/api/uploads/vrkp-card/cloudflare/route.ts

export const runtime = "nodejs"; // sharp/R2 on Node

const r2 = new S3Client({
	region: "auto",
	endpoint: process.env.R2_S3_ENDPOINT,
	forcePathStyle: true,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

function mustExist(p: string) {
	if (!fs.existsSync(p)) {
		throw new Error(`Font file not found at: ${p}`);
	}
}

// 👉 Resolve relative to this app's CWD (the app root at runtime)
const REGULAR_PATH = path.join(
	process.cwd(),
	"public",
	"fonts",
	"static",
	"Inter_28pt-Regular.ttf"
);
const BOLD_PATH = path.join(
	process.cwd(),
	"public",
	"fonts",
	"static",
	"Inter_28pt-Bold.ttf"
);

// Helpful log once to verify
console.log("[font] regular:", REGULAR_PATH);
console.log("[font] bold   :", BOLD_PATH);

mustExist(REGULAR_PATH);
mustExist(BOLD_PATH);

// DO NOT CHANGE: Inter registration you set up
registerFont(REGULAR_PATH, { family: "Inter" });
registerFont(BOLD_PATH, { family: "Inter", weight: "bold" });

type Body = {
	vrkpid: string;
	name: string;
	dob: string;
	createdAt: string;
	issuedAt: string;
	// userPhoto: string; // URL or data URL
};

// helper to draw rounded-rect image
function drawRoundedImage(
	ctx: NodeCanvasRenderingContext2D,
	img: any,
	x: number,
	y: number,
	w: number,
	h: number,
	r = 28
) {
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
	ctx.clip();

	// subtle shadow
	ctx.shadowColor = "rgba(0,0,0,0.18)";
	ctx.shadowBlur = 12;
	// ctx.drawImage(img, x, y, w, h);

	ctx.restore();

	// (optional) white border
	ctx.lineWidth = 6;
	ctx.strokeStyle = "rgba(255,255,255,0.9)";
	ctx.stroke();
}

// ----------------------
// Name drawing utilities
// ----------------------
const NAME_X = 1210;
const NAME_MAX_RIGHT = 1800;
const NAME_MAX_WIDTH = NAME_MAX_RIGHT - NAME_X; // 590

const NAME_FONT_BASE = 64; // short names (<=17)
const NAME_FONT_REDUCED = 54; // medium names (18..30)
const NAME_FONT_MIN = 36; // absolute minimum
const NAME_LINE_HEIGHT_FACTOR = 1.15; // for two lines

function setFont(
	ctx: CanvasRenderingContext2D,
	px: number,
	weight = 700,
	family = "Inter"
) {
	ctx.font = `${weight} ${px}px ${family}`;
}
function fits(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
	return ctx.measureText(text).width <= maxWidth;
}
function shrinkUntilFits(
	ctx: CanvasRenderingContext2D,
	text: string,
	startPx: number,
	minPx: number,
	maxWidth: number,
	weight = 700,
	family = "Inter"
) {
	let px = startPx;
	while (px > minPx) {
		setFont(ctx, px, weight, family);
		if (fits(ctx, text, maxWidth)) return px;
		px -= 1;
	}
	setFont(ctx, minPx, weight, family);
	return minPx;
}
/** Split by spaces into up to 2 lines; shrink font so BOTH lines fit. */
function splitIntoTwoLinesWithShrink(
	ctx: CanvasRenderingContext2D,
	full: string,
	startPx: number,
	minPx: number,
	maxWidth: number
) {
	if (!full.includes(" ")) return { ok: false as const };

	let px = startPx;

	while (px >= minPx) {
		setFont(ctx, px, 700, "Inter");

		const words = full.split(/\s+/);
		let first = "";
		let i = 0;
		for (; i < words.length; i++) {
			const test = first ? first + " " + words[i] : words[i];
			if (fits(ctx, test!, maxWidth)) first = test!;
			else break;
		}

		if (!first) {
			px -= 1;
			continue;
		}

		const second = words.slice(i).join(" ").trim();

		// Everything fit on first line (rare for >30 chars, but safe to handle)
		if (!second) {
			return { ok: true as const, px, lines: [first] };
		}

		if (fits(ctx, second, maxWidth)) {
			return { ok: true as const, px, lines: [first, second] };
		}

		px -= 1; // shrink and try again
	}

	return { ok: false as const };
}

/** Your exact rules:
 *  - <= 17 chars: single line at 64 (shrink if needed)
 *  - 18..30 chars: single line at 54 (shrink if needed)
 *  - > 30 chars: split by spaces into 2 lines; shrink so both fit
 *  Fallback for no-space tokens: shrink single-line.
 */
function drawName(
	ctx: CanvasRenderingContext2D,
	name: string,
	baselineY: number
) {
	name = ": " + name;
	if (name.length <= 17) {
		const px = shrinkUntilFits(
			ctx,
			name,
			NAME_FONT_BASE,
			NAME_FONT_MIN,
			NAME_MAX_WIDTH
		);
		setFont(ctx, px, 700, "Inter");
		ctx.fillText(name, NAME_X, baselineY);
		return;
	}

	if (name.length <= 30) {
		const px = shrinkUntilFits(
			ctx,
			name,
			NAME_FONT_REDUCED,
			NAME_FONT_MIN,
			NAME_MAX_WIDTH
		);
		setFont(ctx, px, 700, "Inter");
		ctx.fillText(name, NAME_X, baselineY);
		return;
	}

	// > 30 → try two lines split by space
	const res = splitIntoTwoLinesWithShrink(
		ctx,
		name,
		NAME_FONT_REDUCED,
		NAME_FONT_MIN,
		NAME_MAX_WIDTH
	);

	if (res.ok) {
		const { px, lines } = res;
		setFont(ctx, px, 700, "Inter");
		if (!lines[0]) throw new Error("Internal error: no lines after split");
		if (lines.length === 1) {
			// if everything somehow fit in one line, just draw it
			ctx.fillText(lines[0], NAME_X, baselineY);
			return;
		}

		// draw two lines
		const lineHeight = Math.round(px * NAME_LINE_HEIGHT_FACTOR);
		ctx.fillText(lines[0], NAME_X, baselineY);
		lines[1] && ctx.fillText(lines[1], NAME_X, baselineY + lineHeight);
		return;
	}

	// fallback: no spaces or couldn't fit two lines → shrink single line
	const px = shrinkUntilFits(
		ctx,
		name,
		NAME_FONT_REDUCED,
		NAME_FONT_MIN,
		NAME_MAX_WIDTH
	);
	setFont(ctx, px, 700, "Inter");
	ctx.fillText(name, NAME_X, baselineY);
}

// ----------------------

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (
			!session ||
			!session.user ||
			!session.user.id ||
			session.user.role !== AdminRole.COMMAND
		) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const { userId } = await req.json();
		if (!userId) {
			return NextResponse.json(
				{ error: "Missing userId parameter" },
				{ status: 400 }
			);
		}
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				vrKpId: true,
				fullname: true,
				dob: true,
				createdAt: true,
				// userPhoto: true,
				VRKP_Card: {
					select: {
						cardNumber: true,
						cardUrl: true,
					},
				},
			},
		});
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}
		if (
			!user.vrKpId ||
			!user.fullname ||
			!user.dob ||
			!user.createdAt
			// ||
			// !user.userPhoto
		) {
			return NextResponse.json(
				{ error: "User missing required fields for VRKP card generation" },
				{ status: 400 }
			);
		}
		const { vrKpId: vrkpid, dob, createdAt } = user;
		const issuedAt = new Date().toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
		let { fullname: name } = user;

		if (
			!vrkpid ||
			!name ||
			!dob ||
			!createdAt ||
			!issuedAt

			// || !userPhoto
		) {
			return NextResponse.json(
				{ error: "Missing parameters" },
				{ status: 400 }
			);
		}
		if (name.length > 50) name = name.slice(0, 50); // hard limit
		// canvas
		const width = 1920;
		const height = 1080;
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// background
		const bgUrl =
			"https://pub-98a0b13dd37c4b7b84e18b52d9c03d5e.r2.dev/users/vrkp-card-template.png";
		const bgImage = await loadImage(bgUrl);
		ctx.drawImage(bgImage, 0, 0, width, height);

		// --- USER PHOTO ---
		// const photoResp = await fetch(
		// 	userPhoto,
		// 	{ cache: "no-store" });
		// if (!photoResp.ok)
		// 	throw new Error(`userPhoto fetch failed: ${photoResp.status}`);
		// const photoBuf = Buffer.from(await photoResp.arrayBuffer());

		// auto-orient and square crop to fit the slot nicely
		const AVATAR_W = 560;
		const AVATAR_H = 560;
		const AVATAR_X = 215;
		const AVATAR_Y = 350;

		// const squared = await sharp(photoBuf)
		// 	.rotate() // respect EXIF
		// 	.resize(AVATAR_W, AVATAR_H, { fit: "cover", position: "attention" })
		// 	.toBuffer();

		// const userImg = await loadImage(squared);
		// drawRoundedImage(ctx, userImg, AVATAR_X, AVATAR_Y, AVATAR_W, AVATAR_H, 30);

		// text styles
		ctx.shadowColor = "transparent"; // crisp text
		ctx.shadowBlur = 0;
		ctx.fillStyle = "#0f172a";
		ctx.textAlign = "left";
		ctx.textBaseline = "alphabetic";

		// choose readable sizes (Inter-Bold is weight 700)
		const FONT_LABEL = "700 60px Inter"; // labels: VRKP ID, Name, DOB, Reg Date
		const FONT_VALUE = "700 64px Inter"; // values: : VR500..., : Harunath...
		const FONT_ISSUED = "700 50px Inter"; // rotated issued date

		// small helper to keep spacing consistent (adds colon block)
		function drawRow(
			label: string,
			value: string,
			y: number,
			xLabel = 910,
			xColon = 1180,
			xValue = 1210
		) {
			ctx.font = FONT_LABEL;
			ctx.fillText(label, xLabel, y);

			ctx.font = FONT_VALUE;
			ctx.fillText(":", xColon, y);
			ctx.fillText(value, xValue, y);
		}
		function drawNameLable(label: string, y: number, xLabel = 910) {
			ctx.font = FONT_LABEL;
			ctx.fillText(label, xLabel, y);
		}

		// --- TEXT ---
		drawRow("VRKP ID", vrkpid, 460);
		drawNameLable("Name", 585);
		drawName(ctx as unknown as CanvasRenderingContext2D, name, 585);
		drawRow(
			"DOB",
			dob.toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			}),
			710
		);
		drawRow(
			"Reg Date",
			createdAt.toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "short",
				year: "numeric",
			}),
			835
		);

		// rotated issued date (left vertical)
		ctx.save();
		ctx.translate(140, 960);
		ctx.rotate(-Math.PI / 2);
		ctx.font = FONT_ISSUED;
		ctx.fillText(`ISSUED DATE : ${issuedAt}`, 0, 0);
		ctx.restore();

		// PNG → WebP (smaller)
		const webpBuffer = await sharp(canvas.toBuffer("image/png"))
			.webp({ quality: 85 })
			.toBuffer();

		const arrayBuf = webpBuffer;
		const key = `${user.vrKpId}/vrkp-card-${Date.now()}.webp`;

		// Upload to R2 with the correct ContentType
		const put = new PutObjectCommand({
			Bucket: process.env.R2_VRKP_CARD_BUCKET!,
			Key: key,
			Body: Buffer.from(arrayBuf),
			ContentType: "image/webp",
		});
		const r2Resp = await r2.send(put);
		console.log("R2 upload response:", r2Resp);
		const publicUrl = `${process.env.R2_VRKP_CARD_PUBLIC_BASE}/${key}`;

		await prisma.vRKP_Card.create({
			data: {
				userId: user.id,
				cardUrl: publicUrl,
				cardNumber: user.vrKpId,
				cardIssuedAt: new Date(),
				createdAt: new Date(),
			},
		});

		try {
			await prisma.adminAuditLog.create({
				data: {
					actorId: session.user.id,
					action: "GENERATE_VRKP_CARD",
					targetId: user.id,
					targetType: "USER",
					reason: "Generated via command-admin panel on request",
					metadata: `Generated VRKP Card for user ${user.id}`,
				},
			});
		} catch (err) {
			console.error("Failed to log admin action:", err);
		}

		return NextResponse.json({
			publicUrl,
			cardNumber: user.vrKpId,
		});
	} catch (err: any) {
		console.error("Error generating card:", err);
		return NextResponse.json(
			{ error: "Failed to generate card", detail: err?.message ?? String(err) },
			{ status: 500 }
		);
	}
}
