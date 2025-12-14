// src/app/api/vrkp/land-allotment/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma, { InsuranceBatchStatus, MailStatus } from "@ngvns2025/db/client";
import { SendMailClient } from "zeptomail";

export const runtime = "nodejs"; // IMPORTANT: react-pdf needs Node

type UserId = {
	userId: string;
};

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as UserId;

		const { userId } = body;

		if (!userId) {
			return NextResponse.json({ error: "User Id required" }, { status: 400 });
		}
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				fullname: true,
				email: true,
				vrKpId: true,
				insuranceRecord: {
					include: { insuranceRecord: true },
					orderBy: { createdAt: "asc" },
				},
			},
		});
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		if (
			!user.insuranceRecord ||
			!user.insuranceRecord[user.insuranceRecord.length - 1] ||
			user.insuranceRecord[user.insuranceRecord.length - 1]?.insuranceRecord
				.status !== InsuranceBatchStatus.ACTIVE
		) {
			return NextResponse.json(
				{ error: "User do not have a active Insurance" },
				{ status: 400 }
			);
		}
		// 2) Prepare ZeptoMail request
		const apiUrl = process.env.EMAIL_API_URL!;

		const token = process.env.INSURANCE_EMAIL_TOKEN; // raw token (without prefix)
		const templateKey = process.env.INSURANCE_EMAIL_TEMPLATE_KEY;
		const fromAddress = process.env.EMAIL_FROM_ADDRESS;
		const fromName = process.env.EMAIL_FROM_NAME ?? "VR Kisan Parivaar";

		if (!token || !templateKey || !fromAddress) {
			return NextResponse.json(
				{
					error:
						"ZeptoMail env vars missing. Set ZEPTOMAIL_TOKEN, ZEPTOMAIL_LAND_TEMPLATE_KEY, ZEPTOMAIL_FROM_ADDRESS.",
				},
				{ status: 500 }
			);
		}

		const merge_info = {
			date: new Date().toISOString().split("T")[0],
			name: user.fullname,
			vrkpid: user.vrKpId,
			policyNumber:
				user.insuranceRecord[user.insuranceRecord.length - 1]?.insuranceRecord
					.policyNumber,
			activationDate: user.insuranceRecord[
				user.insuranceRecord.length - 1
			]?.insuranceRecord.activationDate
				?.toISOString()
				.split("T")[0],
			expiryDate: user.insuranceRecord[
				user.insuranceRecord.length - 1
			]?.insuranceRecord.expiryDate
				?.toISOString()
				.split("T")[0],
		};
		const url = `${apiUrl.replace(/\/$/, "")}/template`;
		const client = new SendMailClient({ url: url, token });
		// console.log(client);
		console.log(
			"templateKey:",
			templateKey,
			"fromAddress:",
			fromAddress,
			"fromName:",
			fromName,
			"token : ",
			token
		);
		// console.log("merge_info:", merge_info);
		const res = await client.sendMailWithTemplate({
			template_key: templateKey,
			from: { address: fromAddress, name: fromName },
			to: [
				{
					email_address: {
						address: user.email,
						name: user.fullname,
					},
				},
			],
			subject: "VR Kisan Parivaar - Insurance Details",
			merge_info: merge_info,
		});

		console.log("Zepto response:", res);
		if (res.error) {
			await prisma.insuranceMailLog.create({
				data: {
					memberId: userId,
					toAddress: user.email,
					deliveryStatus: MailStatus.FAILED,
					responseData: JSON.stringify(res),
					responseStatus: res.code,
					templateKey: templateKey,
					mergeInfo: merge_info,
					retryCount: 0,
				},
			});
		} else {
			await prisma.insuranceMailLog.create({
				data: {
					memberId: userId,
					toAddress: user.email,
					deliveryStatus: MailStatus.SENT,
					responseData: JSON.stringify(res),
					responseStatus: res.code,
					templateKey: templateKey,
					mergeInfo: merge_info,
					retryCount: 0,
				},
			});
		}
		return NextResponse.json(
			{
				message: "Email sent successfully",
				zepto: res,
			},
			{ status: 200 }
		);
	} catch (err: any) {
		console.error("Error in insurance send API RAW:", err);

		const zeptoErr = err?.error ?? err;
		if (zeptoErr?.details) {
			console.error(
				"Zepto details:",
				JSON.stringify(zeptoErr.details, null, 2)
			);
		}
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
