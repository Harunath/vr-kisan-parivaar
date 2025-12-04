// app/api/super-admin/payouts/user-payouts/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma, { AcquisitionType, MarketingRole } from "@ngvns2025/db/client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json().catch(() => ({}))) as {
			dryRun?: boolean;
		};

		const dryRun = body?.dryRun ?? false;

		const referralTypes = await prisma.userPayoutType.findFirst({
			where: {
				name: {
					in: ["MARKETING"],
				},
			},
		});

		if (!referralTypes) {
			return NextResponse.json(
				{
					ok: false,
					error: 'UserPayoutType rows "MARKETING" not found. Seed it first.',
				},
				{ status: 400 }
			);
		}

		const users = await prisma.user.findMany({
			where: {
				referralPayouts: { none: {} },
				acquisitionType: AcquisitionType.MARKETING,
			},
			select: {
				id: true,
				// Level 1 parent
				acquisitionType: true,
				byAcquisition: true,
				byMarketingTeam: {
					select: {
						id: true,
						name: true,
						members: {
							where: { role: MarketingRole.GENERAL_MANAGER },
							select: {
								id: true,
								user: {
									select: {
										id: true,
										fullname: true,
										email: true,
										bankDetails: true,
									},
								},
							},
						},
					},
				},
			},
		});

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
			const parentA = u.byAcquisition;
			const marketingTeam = u.byMarketingTeam;
			console.log(`	referral:${u.id}:L1:${parentA?.userId}`);

			// === Level 1 (parentA) ===
			if (parentA) {
				const amount = referralTypes.defaultAmountPaise ?? Number(0); // BigInt field

				createInputs.push({
					userId: u.id, // the user who joined
					parentId: parentA.userId, // level1 parent

					typeId: referralTypes.id,
					referralId: null, // or u.parentReferralId if that matches your model

					requestedAmountPaise: amount,
					approvedAmountPaise: amount,
					bankReference: marketingTeam?.members[0]?.user.bankDetails?.id
						? marketingTeam.members[0].user.bankDetails.id
						: undefined,
					currency: "INR",
					status: "REQUESTED",

					idempotencyKey: `referral:${u.id}:L1:${parentA.id}`,
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
		console.log(
			`Preparing to create ${createInputs.length} referral payouts for ${users.length} users.`
		);
		console.log("Sample create inputs:", createInputs.slice(0, 3));
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
