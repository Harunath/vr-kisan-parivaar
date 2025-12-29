import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth/auth";
import prisma, {
	AdminRole,
	BatchStatus,
	Currency,
	PayoutStatus,
	Prisma,
} from "@ngvns2025/db/client";

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

// Optional: shape of request body
type CreateBatchBody = {
	cycleKey?: string; // optional filter: only transfers for this cycle
	name?: string; // optional custom batch name
	limit?: number; // optional max transfers in this batch
};

export async function POST(req: NextRequest) {
	try {
		// 1) Auth check
		const session = await getServerSession(authOptions);
		if (!session || !session.user || session.user.role !== AdminRole.SUPER) {
			return NextResponse.json(
				{ ok: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// 2) Parse body (optional)
		let body: CreateBatchBody = {};
		try {
			if (req.body) {
				body = (await req.json()) as CreateBatchBody;
			}
		} catch {
			// ignore JSON errors -> use defaults
		}

		const { cycleKey, name, limit } = body;

		// 3) Pick eligible transfers: no batch yet, REQUESTED, optional cycleKey
		const whereClause: Prisma.PayoutTransferWhereInput = {
			batchId: null,
			status: PayoutStatus.REQUESTED,
		};

		if (cycleKey) {
			(whereClause as any).cycleKey = cycleKey;
		}

		const transfers = await prisma.payoutTransfer.findMany({
			where: whereClause,
			// safety: you can impose an upper bound to avoid insane batches
			take: limit && limit > 0 ? limit : undefined,
		});

		if (!transfers.length) {
			return NextResponse.json(
				{
					ok: false,
					error: "No eligible payout transfers found to create a batch.",
					cycleKey: cycleKey ?? null,
				},
				{ status: 400 }
			);
		}

		// 4) Compute total amount (BigInt)
		let totalAmountPaise: bigint = 0n;
		for (const t of transfers) {
			totalAmountPaise += BigInt(t.amountPaise);
		}

		// 5) Create batch + attach transfers in a small transaction
		const result = await prisma.$transaction(async (tx) => {
			// a) Create batch
			const batch = await tx.payoutBatch.create({
				data: {
					name:
						name ??
						`Batch-${new Date().toISOString()}${
							cycleKey ? `-${cycleKey}` : ""
						}`,
					status: BatchStatus.DRAFT,
					createdById: session.user.id,
					currency: Currency.INR, // or omit if default is IN
					totalAmountPaise, // BigInt is fine in DB
					// you can also store metadata like { cycleKey } if you want:
					metadata: cycleKey ? { cycleKey } : undefined,
				},
			});

			// b) Attach transfers to this batch
			await tx.payoutTransfer.updateMany({
				where: {
					id: { in: transfers.map((t) => t.id) },
				},
				data: {
					batchId: batch.id,
					// Optionally set a different status like IN_BATCH if you add it
				},
			});

			// No need to re-query transfers; we already have them in memory
			return { batch, transfers };
		});

		// 6) BigInt → string for JSON
		const json = {
			ok: true,
			batch: {
				...result.batch,
				totalAmountPaise: result.batch.totalAmountPaise.toString(),
			},
			transferCount: result.transfers.length,
			transfers: result.transfers.map((t) => ({
				...t,
				amountPaise: t.amountPaise.toString(),
			})),
		};

		return NextResponse.json(json, { status: 201 });
	} catch (error: any) {
		console.error("Error creating payout batch:", error);
		return NextResponse.json(
			{
				ok: false,
				error: "Failed to create payout batch",
				details: error?.message,
			},
			{ status: 500 }
		);
	}
}
