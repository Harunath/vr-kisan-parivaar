// app/api/onboarding/init/route.ts
import { NextRequest } from "next/server";
import prisma, { RelationType } from "@ngvns2025/db/client";
import { onboardingSchema } from "../../../../lib/validators/onboarding";
import { ok, bad } from "../../../../lib/responses";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const data = onboardingSchema.parse(body);

		const { phone, aadhaar, email, relationType, referralId } = data;

		if (!referralId) {
			return bad("Referral ID is required.", 400, { field: "referralId" });
		}

		const parent = await prisma.user.findUnique({
			where: { vrKpId: referralId },
			select: { id: true, vrKpId: true, canRefer: true },
		});

		if (!parent || parent.canRefer == false) {
			return bad("Invalid Referral ID.", 400, { field: "referralId" });
		}
		const state = await prisma.states.findUnique({
			where: { id: data.address.stateId },
			select: { name: true },
		});
		let purerelationType = "";
		if (relationType == "s/o") purerelationType = "So";
		else if (relationType == "d/o") purerelationType = "Do";
		else purerelationType = "Wo";

		if (!state) {
			return bad("Invalid state selected.", 400, { field: "address.stateId" });
		}

		// 1) Hard conflicts in main User
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{ phone: phone ?? undefined },
					{ aadhaar: aadhaar ?? undefined },
					{ email: email ?? undefined },
				],
			},
			select: { id: true, phone: true, aadhaar: true, email: true },
		});

		if (existingUser) {
			const conflict =
				existingUser.phone === phone
					? "phone"
					: existingUser.aadhaar === aadhaar
						? "aadhaar"
						: "email";

			return bad(`User already exists in main system with ${conflict}.`, 409, {
				conflict,
			});
		}

		// 2) Conflicts within Onboarding
		const conflicts = await prisma.onboarding.findMany({
			where: {
				OR: [
					{ phone: phone ?? undefined },
					{ aadhaar: aadhaar ?? undefined },
					{ email: email ?? undefined },
				],
			},
		});

		for (const r of conflicts) {
			if (r.aadhaar && r.aadhaar === aadhaar && r.onBoardingFinished) {
				return bad("User with this Aadhaar already onboarded.", 409, {
					conflict: "aadhaar",
				});
			}
			if (r.phone && r.phone === phone) {
				if (!r.onBoardingFinished) {
					return bad(
						"User already started onboarding. Please verify OTP to continue.",
						409,
						{
							phone: r.phone,
							conflict: "phone",
							resume: true,
							onboardingId: r.id,
						}
					);
				}
			}
			if (r.email && r.email === email && r.onBoardingFinished) {
				return bad("User with this email already onboarded.", 409, {
					conflict: "email",
				});
			}
		}

		const result = await prisma.$transaction(async (tx) => {
			// 1) Upsert the onboarding draft by unique phone
			const draft = await tx.onboarding.upsert({
				where: { phone: phone ?? "" }, // phone must be unique in the schema
				update: {
					...data,
					referralId: null,
					parentreferralId: parent.vrKpId,
					dob: ymdToUTCDate(data.dob),
					nominieeDob: ymdToUTCDate(data.nominieeDob),
					address: undefined,
					relationType: purerelationType as RelationType,
					phoneVerified: false,
					emailVerified: false,
					aadhaarVerified: false,
				},
				create: {
					...data,
					referralId: null,
					parentreferralId: parent.vrKpId,
					relationType: purerelationType as RelationType,
					dob: ymdToUTCDate(data.dob),
					nominieeDob: ymdToUTCDate(data.nominieeDob),
					address: undefined,
					phoneVerified: false,
					emailVerified: false,
					aadhaarVerified: false,
					email: data.email ?? "",
				},
			});

			// 2) Upsert the address tied to this onboarding (prevents duplicates on resume)
			const address = await tx.address.upsert({
				where: { onboardingId: draft.id }, // needs @unique in your schema
				update: {
					city: data.address.cityorvillage,
					districtId: data.address.districtId,
					StateId: data.address.stateId,
					pincode: data.address.pincode,
				},
				create: {
					city: data.address.cityorvillage,
					districtId: data.address.districtId,
					StateId: data.address.stateId,
					onboardingId: draft.id,
					pincode: data.address.pincode,
				},
			});

			return { draft, address };
		});

		return ok({
			message: "Draft created. Proceed to phone OTP.",
		});
	} catch (e: any) {
		console.error("onboarding/init error", e);
		return bad("Something went wrong. Please try again later.", 500);
	}
}

// Converts "1999-06-06" -> Date at 00:00:00Z
function ymdToUTCDate(ymd: string): Date {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
	if (!m) throw new Error("Invalid YYYY-MM-DD");
	const [_, y, mo, d] = m;
	return new Date(Date.UTC(+y!, +mo! - 1, +d!));
}
