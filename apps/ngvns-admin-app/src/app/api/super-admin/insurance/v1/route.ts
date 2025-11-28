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
				insuranceRecord: { is: null }, // users without insurance
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
				action: "EXPORT_USERS_WITHOUT_INSURANCE v1",
				metadata: `Exported ${rows.length} users without insurance records v1`,
				actorId: session.user.id, // In a real scenario, capture the admin's ID performing the export
				reason: "Exported for Insurance File",
				targetType: "User",
				targetId: null,
			},
		});
		// 2) Build workbook
		const wb = new ExcelJS.Workbook();
		wb.creator = "VRKISANPARIVAAR";
		wb.created = new Date();

		const ws = wb.addWorksheet("Users Without Insurance");
		ws.columns = [
			{ header: "VRKP Mem ID", key: "vrkpid", width: 24 },
			{ header: "Full Name", key: "fullname", width: 24 },
			{ header: "dob", key: "dob", width: 20 },
			{ header: "doj", key: "doj", width: 20 },
			{ header: "location", key: "location", width: 30 },
			{ header: "nominieeName", key: "nominieeName", width: 24 },
			{ header: "nominieeDob", key: "nominieeDob", width: 20 },
			{
				header: "nominee relationship",
				key: "nominee Relationship",
				width: 16,
			},
		];

		for (const u of rows) {
			ws.addRow({
				vrkpid: u.vrKpId,
				fullname: u.fullname,
				dob: u.dob.toISOString().split("T")[0],
				doj: u.createdAt.toISOString().split("T")[0],
				location: "hyderabad",
				nominieeName: u.nominieeName,
				nominieeDob: u.nominieeDob?.toISOString().split("T")[0],
				"nominee Relationship": u.relationship,
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
