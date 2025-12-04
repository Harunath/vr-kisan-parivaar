import { NextRequest, NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		const page = Number(searchParams.get("page") ?? "1");
		const limit = Number(searchParams.get("limit") ?? "20");

		const from = searchParams.get("from"); // YYYY-MM-DD
		const to = searchParams.get("to"); // YYYY-MM-DD
		const typeId = searchParams.get("typeId");
		const status = searchParams.get("status");

		const where: Prisma.UserPayoutWhereInput = {};

		// Date filter on createdAt
		if (from || to) {
			where.createdAt = {};
			if (from) {
				(where.createdAt as Prisma.DateTimeFilter).gte = new Date(
					from + "T00:00:00.000Z"
				);
			}
			if (to) {
				(where.createdAt as Prisma.DateTimeFilter).lte = new Date(
					to + "T23:59:59.999Z"
				);
			}
		}

		if (typeId) {
			where.typeId = typeId;
		}

		if (status) {
			where.status = status as any; // or your PayoutStatus type
		}

		const skip = (page - 1) * limit;

		const [payouts, total, types] = await Promise.all([
			prisma.userPayout.findMany({
				where,
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
				include: {
					user: {
						select: {
							id: true,
							fullname: true,
							// add your other fields like vrkpId if needed
						},
					},
					parent: {
						select: {
							id: true,
							fullname: true,
						},
					},
					type: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			}),
			prisma.userPayout.count({ where }),
			prisma.userPayoutType.findMany({
				where: { isActive: true },
				orderBy: { name: "asc" },
			}),
		]);

		// BigInt → number for JSON safety
		const items = payouts.map((p) => ({
			id: p.id,
			userId: p.userId,
			parentId: p.parentId,
			userName: p.user?.fullname ?? "",
			parentName: p.parent?.fullname ?? "",
			typeId: p.typeId,
			typeName: p.type?.name ?? "",
			requestedAmountPaise: Number(p.requestedAmountPaise),
			approvedAmountPaise:
				p.approvedAmountPaise != null ? Number(p.approvedAmountPaise) : null,
			currency: p.currency,
			status: p.status,
			referralId: p.referralId,
			requestedById: p.requestedById,
			approvedById: p.approvedById,
			approvedAt: p.approvedAt,
			paymentDate: p.paymentDate,
			transferReference: p.transferReference,
			createdAt: p.createdAt,
			updatedAt: p.updatedAt,
		}));

		const safeTypes = types.map((t) => ({
			id: t.id,
			name: t.name,
			description: t.description,
		}));

		return NextResponse.json({
			ok: true,
			data: {
				page,
				limit,
				total,
				items,
				types: safeTypes,
			},
		});
	} catch (error) {
		console.error("Error fetching user payouts:", error);
		return NextResponse.json(
			{ ok: false, error: "Failed to fetch user payouts" },
			{ status: 500 }
		);
	}
}
