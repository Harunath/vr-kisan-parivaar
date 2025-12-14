import { NextRequest, NextResponse } from "next/server";
import prisma, { AdminRole } from "@ngvns2025/db/client";
import ExcelJS from "exceljs"; // npm i exceljs
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth/auth";

export const runtime = "nodejs"; // exceljs requires Node runtime

function fmtIST(d?: Date | null) {
	if (!d) return "";
	return new Intl.DateTimeFormat("en-IN", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(d);
}

export async function GET(_req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || session.user.role !== AdminRole.SUPER) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		// 1) Fetch data
		const rows = await prisma.user.findMany({
			where: {
				insuranceRecord: {
					none: {},
				}, // users without insurance
			},
			select: {
				id: true,
				fullname: true,
				email: true,
				phone: true,
				createdAt: true,
				vrKpId: true,
				dob: true,
				address: {
					select: {
						addressLine: true,
						addressLine2: true,
						State: true,
						pincode: true,
					},
				},
				nominieeName: true,
				nominieeDob: true,
				relationship: true,
			},
			orderBy: { createdAt: "desc" },
		});

		await prisma.adminAuditLog.create({
			data: {
				action: "EXPORT_USERS_WITHOUT_INSURANCE",
				metadata: `Exported ${rows.length} users without insurance records`,
				actorId: session.user.id, // In a real scenario, capture the admin's ID performing the export
				reason: "Exported for Insurance File",
				targetType: "User",
				targetId: null,
			},
		});
		// 2) Build workbook
		const wb = new ExcelJS.Workbook();
		wb.creator = "NGVNS/VRKP";
		wb.created = new Date();

		const ws = wb.addWorksheet("Users Without Insurance");
		ws.columns = [
			{ header: "VRKP Mem ID", key: "vrkpid", width: 24 },
			{ header: "Full Name", key: "fullname", width: 24 },
			{ header: "dob", key: "dob", width: 20 },
			{ header: "Email", key: "email", width: 28 },
			{ header: "Phone", key: "phone", width: 16 },
			{ header: "address", key: "address", width: 30 },
			{ header: "nominieeName", key: "nominieeName", width: 24 },
			{ header: "nominieeDob", key: "nominieeDob", width: 20 },
			{ header: "relationship", key: "relationship", width: 16 },
		];

		for (const u of rows) {
			ws.addRow({
				vrkpid: u.vrKpId,
				fullname: u.fullname,
				dob: u.dob.toISOString().split("T")[0],
				email: u.email,
				phone: u.phone,
				address:
					u.address?.addressLine +
					", " +
					u.address?.addressLine2 +
					", " +
					u.address?.State.name +
					", pincode : " +
					u.address?.pincode,
				nominieeName: u.nominieeName,
				nominieeDob: u.nominieeDob?.toISOString().split("T")[0],
				relationship: u.relationship,
			});
		}

		ws.getRow(1).font = { bold: true };

		const buffer = await wb.xlsx.writeBuffer();
		const filename = `users-without-insurance-${new Date()
			.toISOString()
			.slice(0, 10)}.xlsx`;

		return new NextResponse(buffer, {
			status: 200,
			headers: {
				"Content-Type":
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"Content-Disposition": `attachment; filename="${filename}"`,
				"Cache-Control": "no-store",
			},
		});
	} catch (err) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
