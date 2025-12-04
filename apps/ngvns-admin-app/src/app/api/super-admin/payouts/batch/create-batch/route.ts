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

		// 1) Pick eligible payouts
		const payouts = await prisma.userPayout.findMany({
			where: {
				bankReference: { not: null }, // has linked BankDetails
				transferReference: null, // not already in a transfer
				status: PayoutStatus.REQUESTED, // or whatever you treat as eligible
			},
			select: {
				id: true,
				userId: true,
				bankReference: true,
				requestedAmountPaise: true,
				approvedAmountPaise: true,
			},
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
			if (!p.bankReference) continue; // safety check

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
				{
					ok: false,
					error: "No payout groups created from eligible payouts.",
				},
				{ status: 400 }
			);
		}

		// 3) Transaction: one batch, many transfers, link payouts
		const result = await prisma.$transaction(async (tx) => {
			// a) Create batch
			const batch = await tx.payoutBatch.create({
				data: {
					createdById: session.user.id,
					name: new Date().toISOString(), // or a nicer name
					status: BatchStatus.DRAFT,
				},
			});

			let batchTotal: bigint = 0n;
			const transfers = [];

			for (const group of groups) {
				// Optional: verify BankDetails exists (for safety)
				const bankAccount = await tx.bankDetails.findUnique({
					where: { id: group.bankAccountId },
				});

				if (!bankAccount) {
					// If you prefer hard failure instead of skipping, throw here
					console.warn(
						`Skipping group user=${group.userId} bankAccount=${group.bankAccountId} because BankDetails not found`
					);
					continue;
				}

				// b) Create transfer for this (user, bank)
				const transfer = await tx.payoutTransfer.create({
					data: {
						batchId: batch.id,
						userId: group.userId,
						bankAccountId: bankAccount.id,
						amountPaise: group.total,
						status: PayoutStatus.REQUESTED,
					},
				});

				batchTotal += group.total;
				transfers.push(transfer);

				// c) Link UserPayouts -> this transfer
				await tx.userPayout.updateMany({
					where: { id: { in: group.payoutIds } },
					data: {
						transferReference: transfer.id,
						// optionally bump status:
						// status: PayoutStatus.REQUESTED,
					},
				});
			}

			if (!transfers.length) {
				throw new Error(
					"No transfers created. Likely no valid BankDetails for any group."
				);
			}

			// d) Update batch total
			const updatedBatch = await tx.payoutBatch.update({
				where: { id: batch.id },
				data: { totalAmountPaise: batchTotal },
			});

			return { batch: updatedBatch, transfers };
		});

		// 4) BigInt → string for JSON
		const json = {
			ok: true,
			batch: {
				...result.batch,
				totalAmountPaise: result.batch.totalAmountPaise.toString(),
			},
			transfers: result.transfers.map((t) => ({
				...t,
				amountPaise: t.amountPaise.toString(),
			})),
		};

		return NextResponse.json(json, { status: 201 });
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
