import { NextRequest, NextResponse } from "next/server";
import prisma, {
	AdminRole,
	PayoutStatus,
	BatchStatus,
} from "@ngvns2025/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../lib/auth/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user || session.user.role !== AdminRole.SUPER) {
			return NextResponse.json(
				{ ok: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// 1) Pick eligible payouts (consider adding take to prevent overload)
		const payouts = await prisma.userPayout.findMany({
			where: {
				bankReference: { not: null },
				transferReference: null,
				status: PayoutStatus.REQUESTED,
			},
			select: {
				id: true,
				userId: true,
				bankReference: true,
				requestedAmountPaise: true,
				approvedAmountPaise: true,
			},
			// take: 500,
			// orderBy: { createdAt: "asc" },
		});

		if (!payouts.length) {
			return NextResponse.json(
				{ ok: false, error: "No eligible payouts found to create a batch." },
				{ status: 400 }
			);
		}

		// 2) Group payouts by (userId, bankReference)
		type Group = {
			userId: string;
			bankAccountId: string;
			payoutIds: string[];
			total: bigint;
		};

		const groupsMap = new Map<string, Group>();

		for (const p of payouts) {
			if (!p.bankReference) continue;

			const key = `${p.userId}:${p.bankReference}`;
			const amount = BigInt(
				p.approvedAmountPaise ?? p.requestedAmountPaise ?? 0
			);

			if (!groupsMap.has(key)) {
				groupsMap.set(key, {
					userId: p.userId,
					bankAccountId: p.bankReference,
					payoutIds: [],
					total: 0n,
				});
			}

			const g = groupsMap.get(key)!;
			g.payoutIds.push(p.id);
			g.total += amount;
		}

		const groups = Array.from(groupsMap.values());
		if (!groups.length) {
			return NextResponse.json(
				{ ok: false, error: "No payout groups created." },
				{ status: 400 }
			);
		}

		// 3) Create the batch (small and quick)
		const batch = await prisma.payoutBatch.create({
			data: {
				createdById: session.user.id,
				name: new Date().toISOString(),
				status: BatchStatus.DRAFT,
			},
		});

		let batchTotal: bigint = 0n;
		const transfers: any[] = [];
		const errors: { groupKey: string; message: string }[] = [];

		// 4) Process each group in its OWN transaction (serverless friendly)
		for (const group of groups) {
			const groupKey = `${group.userId}:${group.bankAccountId}`;

			try {
				const created = await prisma.$transaction(async (tx) => {
					// verify bank exists
					const bankAccount = await tx.bankDetails.findUnique({
						where: { id: group.bankAccountId },
						select: { id: true },
					});
					if (!bankAccount) {
						throw new Error("BankDetails not found");
					}

					// create transfer
					const transfer = await tx.payoutTransfer.create({
						data: {
							batchId: batch.id,
							userId: group.userId,
							bankAccountId: bankAccount.id,
							amountPaise: group.total,
							status: PayoutStatus.REQUESTED,
						},
					});

					// link payouts BUT only if still unlinked (prevents double-pick concurrency issues)
					const upd = await tx.userPayout.updateMany({
						where: {
							id: { in: group.payoutIds },
							transferReference: null,
							status: PayoutStatus.REQUESTED,
						},
						data: {
							transferReference: transfer.id,
						},
					});

					// if some payouts were taken by another run, rollback this group
					if (upd.count !== group.payoutIds.length) {
						throw new Error(
							`Only linked ${upd.count}/${group.payoutIds.length} payouts (concurrency or state changed)`
						);
					}

					return transfer;
				});

				transfers.push(created);
				batchTotal += group.total;
			} catch (e: any) {
				errors.push({ groupKey, message: e?.message ?? "Unknown error" });
			}
		}

		if (!transfers.length) {
			// no transfers created at all -> mark batch failed (optional)
			await prisma.payoutBatch.update({
				where: { id: batch.id },
				data: { status: BatchStatus.CANCELLED },
			});

			return NextResponse.json(
				{
					ok: false,
					error: "No transfers created.",
					batchId: batch.id,
					errors,
				},
				{ status: 500 }
			);
		}

		// 5) Update batch total
		const updatedBatch = await prisma.payoutBatch.update({
			where: { id: batch.id },
			data: { totalAmountPaise: batchTotal },
		});

		// 6) BigInt -> string for JSON
		return NextResponse.json(
			{
				ok: true,
				batch: {
					...updatedBatch,
					totalAmountPaise: updatedBatch.totalAmountPaise?.toString?.() ?? "0",
				},
				transfers: transfers.map((t) => ({
					...t,
					amountPaise: t.amountPaise.toString(),
				})),
				errors, // keep so you can see skipped/failed groups
			},
			{ status: 201 }
		);
	} catch (err: any) {
		console.error("Error creating payout batch & transfers:", err);
		return NextResponse.json(
			{
				ok: false,
				error: "Failed to create payout batch & transfers",
				details: err?.message,
			},
			{ status: 500 }
		);
	}
}
