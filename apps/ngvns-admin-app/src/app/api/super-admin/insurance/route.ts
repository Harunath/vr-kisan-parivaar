// apps/admin-app/app/api/super-admin/insurance/records/route.ts
import prisma, { Prisma, InsuranceBatchStatus } from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// GET /api/super-admin/insurance/records
// ?take=20&from=2025-01-01&to=2025-12-31&dateField=activation&status=ACTIVE&cursor=some-id
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		// --- pagination / limits ---
		const takeParam = searchParams.get("take");
		let take = Number.parseInt(takeParam || "20", 10);
		if (Number.isNaN(take) || take <= 0) take = 20;
		if (take > 100) take = 100; // hard cap

		const cursor = searchParams.get("cursor"); // last seen record id

		// --- status filter (optional) ---
		const statusParam = searchParams.get(
			"status"
		) as InsuranceBatchStatus | null;

		// --- date filters ---
		const from = searchParams.get("from"); // ISO date string
		const to = searchParams.get("to"); // ISO date string
		const dateFieldParam = searchParams.get("dateField") || "activation";
		// allowed: activation | expiry | created

		const where: Prisma.InsuranceRecordWhereInput = {};

		if (statusParam) {
			where.status = statusParam;
		}

		const dateFilter: Prisma.DateTimeFilter = {};

		if (from) {
			const fromDate = new Date(from);
			if (!Number.isNaN(fromDate.getTime())) {
				dateFilter.gte = fromDate;
			}
		}

		if (to) {
			const toDate = new Date(to);
			if (!Number.isNaN(toDate.getTime())) {
				dateFilter.lte = toDate;
			}
		}

		if (Object.keys(dateFilter).length > 0) {
			if (dateFieldParam === "expiry") {
				where.expiryDate = dateFilter;
			} else if (dateFieldParam === "created") {
				where.createdAt = dateFilter;
			} else {
				// default to activationDate
				where.activationDate = dateFilter;
			}
		}

		// choose order field based on dateField
		const orderByField =
			dateFieldParam === "expiry"
				? "expiryDate"
				: dateFieldParam === "created"
					? "createdAt"
					: "activationDate";

		const records = await prisma.insuranceRecord.findMany({
			where,
			orderBy: { [orderByField]: "desc" },
			take,
			...(cursor
				? {
						skip: 1,
						cursor: { id: cursor },
					}
				: {}),
		});

		const nextCursor =
			records.length === take ? records[records.length - 1]?.id : null;

		return NextResponse.json(
			{
				data: records,
				meta: {
					take,
					hasMore: Boolean(nextCursor),
					nextCursor,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching insurance records:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
