// app/api/super-admin/payouts/user-payouts/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma, { AcquisitionType } from "@ngvns2025/db/client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json().catch(() => ({}))) as {
			dryRun?: boolean;
		};

		const dryRun = body?.dryRun ?? false;

		const referralTypes = await prisma.userPayoutType.findMany({
			where: {
				name: {
					in: ["REFERRAL_LEVEL_1", "REFERRAL_LEVEL_2", "REFERRAL_LEVEL_3"],
				},
			},
		});

		const typeByName = Object.fromEntries(
			referralTypes.map((t) => [t.name, t])
		);

		const level1Type = typeByName["REFERRAL_LEVEL_1"];
		const level2Type = typeByName["REFERRAL_LEVEL_2"];
		const level3Type = typeByName["REFERRAL_LEVEL_3"];

		if (!level1Type || !level2Type || !level3Type) {
			return NextResponse.json(
				{
					ok: false,
					error:
						'UserPayoutType rows "REFERRAL_LEVEL_1", "REFERRAL_LEVEL_2", "REFERRAL_LEVEL_3" not found. Seed them first.',
				},
				{ status: 400 }
			);
		}

		// 2) Find users that have NO referral payouts yet
		//    `referralPayouts` should be a relation filtered only to referral-type payouts.
		const users = await prisma.user.findMany({
			where: {
				referralPayouts: { none: {} },
				acquisitionType: AcquisitionType.USER_REFERRAL,
			},
			select: {
				id: true,
				// Level 1 parent
				joinedBy: {
					select: {
						id: true,
						bankDetails: true,
					},
				},
				// Level 2 parent
				parentB: {
					select: {
						id: true,
						bankDetails: true,
					},
				},
				// Level 3 parent
				parentC: {
					select: {
						id: true,
						bankDetails: true,
					},
				},
			},
		});
		console.log(`Found ${users.length} users without referral payouts.`);
		if (users.length === 0) {
			return NextResponse.json({
				ok: true,
				createdCount: 0,
				message: "No users found without referral payouts.",
			});
		}

		type CreateInput = Parameters<typeof prisma.userPayout.create>[0]["data"];

		const createInputs: CreateInput[] = [];

		for (const u of users) {
			const parentA = u.joinedBy;
			const parentB = u.parentB;
			const parentC = u.parentC;

			// === Level 1 (parentA) ===
			if (parentA) {
				const amount = level1Type.defaultAmountPaise ?? 0; // Int field
				const approvedAmountPaise = level1Type.approvedAmountPaise ?? null;

				createInputs.push({
					userId: u.id, // the user who joined
					parentId: parentA.id, // level1 parent

					typeId: level1Type.id,
					referralId: null, // or u.parentReferralId if that matches your model

					requestedAmountPaise: Number(amount),
					approvedAmountPaise: Number(approvedAmountPaise),

					currency: "INR",
					status: "REQUESTED",
					bankReference: parentA.bankDetails?.id
						? parentA.bankDetails.id
						: undefined,
					idempotencyKey: `referral:${u.id}:L1:${parentA.id}`,
				});
			}

			// === Level 2 (parentB) ===
			if (parentB) {
				const amount = level2Type.defaultAmountPaise ?? 0;
				const approvedAmountPaise = level2Type.approvedAmountPaise ?? null;

				createInputs.push({
					userId: u.id,
					parentId: parentB.id,

					typeId: level2Type.id,
					referralId: null,

					requestedAmountPaise: amount,
					approvedAmountPaise: Number(approvedAmountPaise),

					currency: "INR",
					status: "REQUESTED",

					idempotencyKey: `referral:${u.id}:L2:${parentB.id}`,
				});
			}

			// === Level 3 (parentC) ===
			if (parentC) {
				const amount = level3Type.defaultAmountPaise ?? 0;
				const approvedAmountPaise = level3Type.approvedAmountPaise ?? null;

				createInputs.push({
					userId: u.id,
					parentId: parentC.id,

					typeId: level3Type.id,
					referralId: null,

					requestedAmountPaise: amount,
					approvedAmountPaise: Number(approvedAmountPaise),

					currency: "INR",
					status: "REQUESTED",

					idempotencyKey: `referral:${u.id}:L3:${parentC.id}`,
				});
			}
		}

		if (createInputs.length === 0) {
			return NextResponse.json({
				ok: true,
				createdCount: 0,
				message: "No parents found for these users, so no payouts created.",
			});
		}

		// 4) Dry-run option (no DB writes)
		if (dryRun) {
			return NextResponse.json({
				ok: true,
				dryRun: true,
				wouldCreateCount: createInputs.length,
				sample: createInputs.slice(0, 3),
			});
		}

		// 5) Create all payouts in a single transaction
		const created = await prisma.$transaction(
			createInputs.map((data) => prisma.userPayout.create({ data }))
		);

		return NextResponse.json({
			ok: true,
			createdCount: created.length,
			payouts: created.map((p) => ({
				id: p.id,
				userId: p.userId,
				parentId: p.parentId,
				typeId: p.typeId,
				referralId: p.referralId,
				requestedAmountPaise: p.requestedAmountPaise,
				status: p.status,
			})),
		});
	} catch (err: any) {
		console.error("Backfill referral payouts error:", err);
		return NextResponse.json(
			{
				ok: false,
				error: err?.message ?? "Unexpected error",
			},
			{ status: 500 }
		);
	}
}
