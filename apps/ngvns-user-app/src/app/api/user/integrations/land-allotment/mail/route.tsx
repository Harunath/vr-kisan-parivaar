// src/app/api/vrkp/land-allotment/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import LandAllotmentLetterPdf from "./LandAllotmentLetterPdf";
import { renderToBuffer } from "@react-pdf/renderer";
import prisma, { MailStatus } from "@ngvns2025/db/client";
import { SendMailClient } from "zeptomail";

export const runtime = "nodejs"; // IMPORTANT: react-pdf needs Node

type LandAllotmentRequestBody = {
	userId: string;
};

export async function POST(req: NextRequest) {
	try {
		return NextResponse.json(
			{
				message: "Removed feature. For more details contact VR KISAN PARIVAAR",
			},
			{ status: 501 }
		);

		// const body = (await req.json()) as LandAllotmentRequestBody;

		// const { userId } = body;

		// if (!userId) {
		// 	return NextResponse.json({ error: "User Id required" }, { status: 400 });
		// }
		// const user = await prisma.user.findUnique({
		// 	where: { id: userId },
		// 	select: {
		// 		fullname: true,
		// 		email: true,
		// 		vrKpId: true,
		// 		landAllotments: true,
		// 	},
		// });
		// if (!user) {
		// 	return NextResponse.json({ error: "User not found" }, { status: 404 });
		// }

		// if (!user.landAllotments || !user.landAllotments[0]) {
		// 	return NextResponse.json(
		// 		{ error: "No land allotment found for user" },
		// 		{ status: 400 }
		// 	);
		// }
		// console.log("User land allotment:", user.landAllotments[0]);
		// const landparcel = await prisma.landParcel.findUnique({
		// 	where: { id: user.landAllotments[0].landParcelId },
		// });
		// const landparcelUnit = await prisma.landParcelUnit.findUnique({
		// 	where: { id: user.landAllotments[0].landParcelUnitId },
		// });
		// if (!landparcel || !landparcelUnit) {
		// 	return NextResponse.json(
		// 		{ error: "Land parcel or unit not found" },
		// 		{ status: 400 }
		// 	);
		// }
		// console.log("Land Parcel:", landparcel);
		// console.log("Land Parcel Unit:", landparcelUnit);
		// // 1) Generate PDF as Buffer using @react-pdf/renderer
		// const pdfUint8Array = await renderToBuffer(
		// 	<LandAllotmentLetterPdf
		// 		date={user.landAllotments[0].allocatedAt.toLocaleDateString("en-GB")}
		// 		memberId={user.vrKpId}
		// 		memberName={user.fullname}
		// 		landName="2 sq. yards"
		// 		unit={String(landparcelUnit?.unitNumber)}
		// 		surveyNo={landparcel?.surveyNumber}
		// 		address={landparcel?.addressLine!}
		// 	/>
		// );

		// // Make sure it's a Node Buffer
		// const pdfBuffer = Buffer.isBuffer(pdfUint8Array)
		// 	? pdfUint8Array
		// 	: Buffer.from(pdfUint8Array);

		// // DEBUG: check sizes
		// console.log("PDF byte length:", pdfBuffer.length);
		// const pdfBase64 = pdfBuffer.toString("base64");
		// console.log("PDF base64 length:", pdfBase64.length);

		// // 2) Prepare ZeptoMail request
		// const apiUrl = process.env.EMAIL_API_URL!;

		// const token = process.env.EMAIL_TOKEN; // raw token (without prefix)
		// const templateKey = process.env.EMAIL_TEMPLATE_KEY;
		// const fromAddress = process.env.EMAIL_FROM_ADDRESS;
		// const fromName = process.env.EMAIL_FROM_NAME ?? "VR Kisan Parivaar";

		// console.log(
		// 	"token : ",
		// 	token,
		// 	"\n",
		// 	"templateKey : ",
		// 	templateKey,
		// 	"\n",
		// 	"fromAddress : ",
		// 	fromAddress
		// );

		// if (!token || !templateKey || !fromAddress) {
		// 	return NextResponse.json(
		// 		{
		// 			error:
		// 				"ZeptoMail env vars missing. Set ZEPTOMAIL_TOKEN, ZEPTOMAIL_LAND_TEMPLATE_KEY, ZEPTOMAIL_FROM_ADDRESS.",
		// 		},
		// 		{ status: 500 }
		// 	);
		// }

		// const htmlbody = landAllotmentEmailBody({
		// 	date: user.landAllotments[0].allocatedAt.toISOString().split("T")[0]!,
		// 	memberName: user.fullname,
		// 	memberId: user.vrKpId,
		// 	landName: "2 sq. yards",
		// 	unit: String(landparcelUnit?.unitNumber),
		// 	surveyNo: landparcel?.surveyNumber,
		// 	address: landparcel?.addressLine!,
		// });
		// const merge_info = {
		// 	date: user.landAllotments[0].allocatedAt.toISOString().split("T")[0],
		// 	landName: "2 sq. yards",
		// 	unit: String(landparcelUnit?.unitNumber),
		// 	address: landparcel?.addressLine!,
		// 	memberName: user.fullname,
		// 	surveyNo: landparcel?.surveyNumber,
		// 	memberId: user.vrKpId,
		// };
		// const url = `${apiUrl.replace(/\/$/, "")}`;
		// const client = new SendMailClient({ url: url, token });
		// const res = await client.sendMail({
		// 	from: { address: fromAddress, name: fromName },
		// 	to: [
		// 		{
		// 			email_address: {
		// 				address: user.email,
		// 				name: user.fullname,
		// 			},
		// 		},
		// 	],
		// 	subject: "VRKP Land Allotment Letter",
		// 	htmlbody,
		// 	attachments: [
		// 		{
		// 			name: `VRKP-Land-Allotment-${user.vrKpId}.pdf`,
		// 			mime_type: "application/pdf",
		// 			content: pdfBase64, // from your @react-pdf render
		// 		},
		// 	],
		// });

		// console.log("Zepto response:", res);
		// if (res.error) {
		// 	await prisma.landAllotmentMailLog.create({
		// 		data: {
		// 			memberId: userId,
		// 			toAddress: user.email,
		// 			deliveryStatus: MailStatus.FAILED,
		// 			responseData: JSON.stringify(res),
		// 			responseStatus: res.code,
		// 			templateKey: templateKey,
		// 			mergeInfo: merge_info,
		// 			retryCount: 0,
		// 		},
		// 	});
		// } else {
		// 	await prisma.landAllotmentMailLog.create({
		// 		data: {
		// 			memberId: userId,
		// 			toAddress: user.email,
		// 			deliveryStatus: MailStatus.SENT,
		// 			responseData: JSON.stringify(res),
		// 			responseStatus: res.code,
		// 			templateKey: templateKey,
		// 			mergeInfo: merge_info,
		// 			retryCount: 0,
		// 		},
		// 	});
		// }

		// return NextResponse.json(
		// 	{
		// 		message: "Land allotment mail triggered",
		// 		zepto: res,
		// 	},
		// 	{ status: 200 }
		// );
	} catch (err: any) {
		console.error("Error in land allotment send API RAW:", err);

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

// src/lib/email/landAllotmentEmail.ts

type LandAllotmentEmailParams = {
	date: string;
	memberName: string;
	memberId: string;
	landName: string;
	unit: string;
	surveyNo: string;
	address: string;
};

function landAllotmentEmailBody({
	date,
	memberName,
	memberId,
	landName,
	unit,
	surveyNo,
	address,
}: LandAllotmentEmailParams) {
	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VRKP Land Allotment Letter</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, sans-serif; color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0; background-color:#f3f4f6;">
    <tbody>
      <tr>
        <td align="center">
          <!-- CARD -->
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:650px; background:#ffffff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.12); overflow:hidden;">
            <tbody>
              <!-- HEADER -->
              <tr>
                <td align="center" style="padding:20px; background:linear-gradient(90deg,#FF9933,#ffffff,#138808);">
                  <img src="https://res.cloudinary.com/diaoy3wzi/image/upload/v1756982391/vrKP-4_no_bg_jndjxt.png" alt="VR KISAN PARIVAAR" style="max-height:70px; display:block;">
                </td>
              </tr>
              <!-- TITLE -->
              <tr>
                <td style="padding:16px 24px 4px;">
                  <h1 style="margin:0; font-size:22px; font-weight:700; text-align:center;">
                    VR Kisan Parivaar Land Allotment Letter
                  </h1>
                </td>
              </tr>
              <!-- WEBSITE -->
              <tr>
                <td style="padding:4px 24px; text-align:center;">
                  <p style="margin:0; font-size:13px; color:#4b5563;">
                    Website:
                    <a href="https://www.vrkisanparivaar.com" style="color:#0ea5e9; text-decoration:none;">
                      www.vrkisanparivaar.com
                    </a>
                  </p>
                </td>
              </tr>
              <!-- DATE -->
              <tr>
                <td style="padding:10px 24px 0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td style="font-size:13px; padding-bottom:4px;">
                          <strong>Date:</strong> ${date}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <!-- DIVIDER -->
              <tr>
                <td style="padding: 0 24px;">
                  <hr style="border:none; border-top:1px solid #e5e7eb; margin:12px 0;">
                </td>
              </tr>
              <!-- DETAILS BLOCK -->
              <tr>
                <td style="padding: 0 24px 10px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                    <tbody>
                      <tr>
                        <td style="padding:6px 0; width:160px; font-weight:600;">Name</td>
                        <td style="padding:6px 0;">${memberName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; width:160px; font-weight:600;">Member Id</td>
                        <td style="padding:6px 0;">${memberId}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-weight:600;">Land</td>
                        <td style="padding:6px 0;">${landName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-weight:600;">Unit</td>
                        <td style="padding:6px 0;">${unit}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-weight:600;">Survey No.</td>
                        <td style="padding:6px 0;">${surveyNo}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; vertical-align:top; font-weight:600;">Address</td>
                        <td style="padding:6px 0; line-height:1.5;">${address}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <!-- MAIN CONTENT -->
              <tr>
                <td style="padding:0 24px 16px;">
                  <p style="margin:0 0 12px; font-size:14px; line-height:1.6;">
                    Under the <strong>Lifetime Membership Program</strong>, the above member is allotted agricultural land as detailed above.
                  </p>
                  <p style="margin:0 0 12px; font-size:14px; line-height:1.6;">
                    The member is understood to have agreed to lease the land for
                    <strong>VRKP agricultural purposes</strong> for a period of
                    <strong>5 years</strong> from the date of allotment.
                  </p>
                  <p style="margin:0 0 12px; font-size:14px; line-height:1.6;">
                    Members cannot sell, transfer, or claim ownership during the lease period.
                    After the completion of the lease tenure, the land will be available for sale only if mutually agreed by other members linked to the site,
                    and the sale proceeds will be paid through <strong>VR Kisan Parivaar</strong>
                    at the prevailing market rate at that time.
                  </p>
                  <p style="margin:0 0 12px; font-size:14px; line-height:1.6;">
                    This allotment is a <strong>membership benefit only</strong> and does not grant ownership or property rights.
                    All matters are subject to the jurisdiction of <strong>Hyderabad, Telangana</strong>.
                  </p>
                </td>
              </tr>
              <!-- SIGNATURE -->
              <tr>
                <td style="padding:12px 24px;">
                  <p style="margin:0; font-size:14px; font-weight:600;">For VR Kisan Parivaar</p>
                  <p style="margin:4px 0 0; font-size:13px; color:#4b5563;">Authorized Signatory (Digitally Authorized)</p>
                </td>
              </tr>
              <!-- FOOTER -->
              <tr>
                <td style="padding:14px 24px; background:#f9fafb; border-top:1px solid #e5e7eb;">
                  <p style="margin:0; font-size:11px; line-height:1.6; color:#6b7280;">
                    <strong>Note:</strong> This is a system-generated document under the VRKP Membership Program.
                    It does not require a member signature and does not confer ownership or legal title.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- END CARD -->
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>`;
}
