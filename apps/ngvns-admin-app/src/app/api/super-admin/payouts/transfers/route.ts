import { NextRequest, NextResponse } from "next/server";
import prisma, { AdminRole, PayoutStatus } from "@ngvns2025/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth/auth";

export const runtime = "nodejs";

// ----- IST + weekly helpers (from above) -----
const IST_OFFSET_MINUTES = 5 * 60 + 30; // +05:30

function toIST(date: Date) {
	const utcMs = date.getTime();
	const istMs = utcMs + IST_OFFSET_MINUTES * 60 * 1000;
	return new Date(istMs);
}

function fromIST(istDate: Date) {
	const istMs = istDate.getTime();
	const utcMs = istMs - IST_OFFSET_MINUTES * 60 * 1000;
	return new Date(utcMs);
}

function startOfISTDay(date: Date) {
	const d = toIST(date);
	d.setHours(0, 0, 0, 0);
	return fromIST(d);
}

function addDays(date: Date, days: number) {
	return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Weekly window: last Monday 00:00 IST -> this Monday 00:00 IST (exclusive).
 * cycleKey = Sunday date (YYYY-MM-DD IST) closing that week.
 */
// ----- IST weekly helpers (correct boundaries) -----
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000; // +05:30 in ms
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Returns "00:00 IST of the given date" expressed as a UTC Date.
 * This avoids the common JS Date timezone drift issues.
 */
function istStartOfDayUTC(d: Date) {
	// shift into IST "clock space"
	const ist = new Date(d.getTime() + IST_OFFSET_MS);

	// read Y-M-D in IST clock space using UTC getters
	const y = ist.getUTCFullYear();
	const m = ist.getUTCMonth();
	const day = ist.getUTCDate();

	// 00:00 IST for that Y-M-D, converted back to UTC by subtracting offset
	return new Date(Date.UTC(y, m, day, 0, 0, 0) - IST_OFFSET_MS);
}

function addDaysUTC(d: Date, days: number) {
	return new Date(d.getTime() + days * DAY_MS);
}

/**
 * Weekly window: last Monday 00:00 IST -> this Monday 00:00 IST (exclusive).
 * cycleKey = Sunday date (YYYY-MM-DD IST) closing that week.
 *
 * NOTE:
 * - cycleEnd is "this Monday 00:00 IST" (exclusive)
 * - cycleStart is "previous Monday 00:00 IST"
 */
function getWeeklyCycleWindow(): {
	cycleStart: Date;
	cycleEnd: Date;
	cycleKey: string;
} {
	const now = new Date();

	// "today 00:00 IST" represented in UTC
	const todayStartUTC = istStartOfDayUTC(now);

	// Determine day-of-week in IST for todayStartUTC
	const todayISTClock = new Date(todayStartUTC.getTime() + IST_OFFSET_MS);
	const day = todayISTClock.getUTCDay(); // 0=Sun..6=Sat (in IST context)

	// Find "this Monday 00:00 IST" (in UTC)
	const diffToMonday = (day + 6) % 7; // days since Monday
	const thisMondayUTC = addDaysUTC(todayStartUTC, -diffToMonday);

	// Previous week cycle
	const cycleStart = addDaysUTC(thisMondayUTC, -7);
	const cycleEnd = thisMondayUTC; // exclusive

	// Sunday IST is 6 days after cycleStart
	const sundayUTC = addDaysUTC(cycleStart, 6);
	const sundayISTClock = new Date(sundayUTC.getTime() + IST_OFFSET_MS);

	const yyyy = sundayISTClock.getUTCFullYear();
	const mm = String(sundayISTClock.getUTCMonth() + 1).padStart(2, "0");
	const dd = String(sundayISTClock.getUTCDate()).padStart(2, "0");

	const cycleKey = `${yyyy}-${mm}-${dd}`;

	return { cycleStart, cycleEnd, cycleKey };
}

// Build a unique idempotency key per (user, bank, week)
function buildIdempotencyKey(params: {
	cycleKey: string;
	userId: string;
	bankAccountId: string;
}) {
	return `payout-transfer:${params.cycleKey}:${params.userId}:${params.bankAccountId}`;
}

type Group = {
	userId: string;
	bankAccountId: string;
	payoutIds: string[];
	total: bigint;
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

		// 2) Determine weekly window (Sunday-ending cycle)
		const { cycleStart, cycleEnd, cycleKey } = getWeeklyCycleWindow();
		console.log(
			`Creating payout transfers for weekly cycle ${cycleKey}: ${cycleStart.toISOString()} -> ${cycleEnd.toISOString()}`
		);
		// 3) Pick eligible payouts for this window
		//    (Adjust status as per your logic: APPROVED vs REQUESTED)
		const payouts = await prisma.userPayout.findMany({
			where: {
				bankReference: { not: null },
				transferReference: null, // not yet assigned to any transfer
				status: PayoutStatus.REQUESTED, // or REQUESTED if that's "eligible"
				createdAt: {
					lt: cycleEnd,
				},
			},
			select: {
				id: true,
				userId: true,
				bankReference: true,
				requestedAmountPaise: true,
				approvedAmountPaise: true,
			},
		});
		console.log(
			`Found ${payouts.length} eligible payouts for cycle ${cycleKey}.`
		);
		if (!payouts.length) {
			return NextResponse.json(
				{
					ok: false,
					error: "No eligible payouts found for this weekly cycle.",
					cycleKey,
				},
				{ status: 400 }
			);
		}

		// 4) Group payouts by (userId, bankReference)
		const groupsMap = new Map<string, Group>();

		for (const p of payouts) {
			console.log("Processing payout:", p);
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
		console.log(
			`Created ${groups.length} payout groups from ${payouts.length} eligible payouts.`
		);
		if (!groups.length) {
			return NextResponse.json(
				{
					ok: false,
					error: "No payout groups created from eligible payouts.",
					cycleKey,
				},
				{ status: 400 }
			);
		}

		// 5) For each group, create/update a PayoutTransfer in a *small transaction*
		const createdTransfers = [];

		for (const group of groups) {
			const idempotencyKey = buildIdempotencyKey({
				cycleKey,
				userId: group.userId,
				bankAccountId: group.bankAccountId,
			});

			const transfer = await prisma.$transaction(async (tx) => {
				// Ensure BankDetails exists (defensive)
				const bankAccount = await tx.bankDetails.findUnique({
					where: { id: group.bankAccountId },
					select: { id: true },
				});

				if (!bankAccount) {
					throw new Error(
						`BankDetails not found for id=${group.bankAccountId} (user=${group.userId})`
					);
				}

				// Idempotent upsert
				const t = await tx.payoutTransfer.upsert({
					where: { idempotencyKey },
					update: {
						amountPaise: group.total,
						cycleStart,
						cycleEnd,
					},
					create: {
						idempotencyKey,
						userId: group.userId,
						bankAccountId: bankAccount.id,
						amountPaise: group.total,
						status: PayoutStatus.REQUESTED, // or READY_FOR_BATCH
						cycleKey,
						cycleStart,
						cycleEnd,
					},
				});

				// Link UserPayouts -> this transfer
				await tx.userPayout.updateMany({
					where: { id: { in: group.payoutIds } },
					data: {
						transferReference: t.id,
						// optionally bump status:
						status: PayoutStatus.APPROVED,
					},
				});

				return t;
			});

			createdTransfers.push(transfer);
		}

		// 6) Format BigInt fields for JSON
		const responseTransfers = createdTransfers.map((t) => ({
			...t,
			amountPaise: t.amountPaise.toString(),
		}));

		return NextResponse.json(
			{
				ok: true,
				cycleKey,
				cycleStart,
				cycleEnd,
				transferCount: responseTransfers.length,
				transfers: responseTransfers,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("Error creating payout transfers:", error);
		return NextResponse.json(
			{
				ok: false,
				error: "Failed to create payout transfers",
				details: error?.message,
			},
			{ status: 500 }
		);
	}
}
