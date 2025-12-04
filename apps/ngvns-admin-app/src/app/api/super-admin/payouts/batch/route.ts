import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth/auth";
import prisma, { AdminRole } from "@ngvns2025/db/client";

export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user || session.user.role !== AdminRole.SUPER) {
			return NextResponse.json(
				{ ok: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(req.url);

		const page = Math.max(Number(searchParams.get("page") ?? "1"), 1);
		const limit = Math.min(
			Math.max(Number(searchParams.get("limit") ?? "20"), 1),
			100
		);

		const status = searchParams.get("status"); // optional: DRAFT, POSTED, etc.
		const q = searchParams.get("q"); // optional search by name

		const where: any = {};

		if (status) {
			where.status = status; // must match your BatchStatus enum values
		}

		if (q) {
			where.name = {
				contains: q,
				mode: "insensitive",
			};
		}

		const [items, total] = await prisma.$transaction([
			prisma.payoutBatch.findMany({
				where,
				orderBy: { createdAt: "desc" },
				skip: (page - 1) * limit,
				take: limit,
				include: {
					createdBy: {
						select: { id: true, fullname: true, email: true },
					},
					approvedBy: {
						select: { id: true, fullname: true, email: true },
					},
					_count: {
						select: {
							transfers: true,
							// if later you add payouts relation back, you can add here
							// payouts: true,
						},
					},
				},
			}),
			prisma.payoutBatch.count({ where }),
		]);

		// BigInt -> string in JSON
		const mapped = items.map((b) => ({
			...b,
			totalAmountPaise: b.totalAmountPaise.toString(),
		}));

		return NextResponse.json(
			{
				ok: true,
				page,
				limit,
				total,
				items: mapped,
			},
			{ status: 200 }
		);
	} catch (err: any) {
		console.error("Error fetching payout batches:", err);
		return NextResponse.json(
			{
				ok: false,
				error: "Failed to fetch payout batches",
				details: err?.message,
			},
			{ status: 500 }
		);
	}
}
