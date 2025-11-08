import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma, { AdminRole } from "@ngvns2025/db/client";
import { z } from "zod";
import { authOptions } from "../../../../lib/auth/auth";

/**
 * Zod schema to validate request body.
 * - `latitude`/`longitude` are optional decimals (up to 6 places)
 * - numeric fields are coerced to number
 */
const bodySchema = z.object({
	stateId: z.string().min(1, "stateId is required"),
	title: z.string().min(3, "Title must be at least 3 chars"),
	surveyNumber: z.string().min(1, "Survey Number is required"),
	areaSqYards: z.coerce
		.number()
		.int()
		.positive("areaSqYards must be a positive integer"),
	addressLine: z.string().optional().nullable(),
	latitude: z
		.union([z.coerce.number(), z.string()])
		.transform((v) =>
			v === "" ? undefined : typeof v === "string" ? Number(v) : v
		)
		.optional()
		.refine(
			(v) => v === undefined || (Number.isFinite(v) && Math.abs(v) <= 180),
			{
				message: "latitude must be a valid number",
			}
		),
	longitude: z
		.union([z.coerce.number(), z.string()])
		.transform((v) =>
			v === "" ? undefined : typeof v === "string" ? Number(v) : v
		)
		.optional()
		.refine(
			(v) => v === undefined || (Number.isFinite(v) && Math.abs(v) <= 180),
			{
				message: "longitude must be a valid number",
			}
		),
	unitsTotal: z.coerce
		.number()
		.int()
		.positive("unitsTotal must be a positive integer"),
	unitsAvailable: z.coerce
		.number()
		.int()
		.nonnegative("unitsAvailable must be a non-negative integer"),
});

// Helper: auth guard for Super Admin
async function requireSuperAdmin() {
	const session = await getServerSession(authOptions);
	if (!session?.user)
		return { ok: false as const, error: "Unauthorized", status: 401 };

	// If you don't have UserRole enum, you can compare against string "SUPER_ADMIN"
	const isSuper = (session.user as any).role === AdminRole?.SUPER;

	if (!isSuper) return { ok: false as const, error: "Forbidden", status: 403 };
	return { ok: true as const, session };
}

export async function POST(req: Request) {
	// 1) AuthZ
	const guard = await requireSuperAdmin();
	if (!guard.ok) {
		return NextResponse.json(
			{ message: guard.error },
			{ status: guard.status }
		);
	}

	try {
		// 2) Validate body
		const json = await req.json();
		const parsed = bodySchema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json(
				{ message: "Validation failed", issues: parsed.error.flatten() },
				{ status: 400 }
			);
		}
		const data = parsed.data;

		// 3) Ensure state exists (model name is States => Prisma client is `states`)
		const state = await prisma.states.findUnique({
			where: { id: data.stateId },
		});
		if (!state) {
			return NextResponse.json({ message: "Invalid stateId" }, { status: 400 });
		}

		// 4) Coerce decimals to 6dp strings to be safe with Prisma Decimal(9,6)
		const latStr =
			typeof data.latitude === "number" ? data.latitude.toFixed(6) : undefined;
		const lngStr =
			typeof data.longitude === "number"
				? data.longitude.toFixed(6)
				: undefined;
		if (data.unitsTotal < data.unitsAvailable) {
			return NextResponse.json(
				{ message: "unitsTotal cannot be less than unitsAvailable" },
				{ status: 400 }
			);
		}
		// 5) Create LandParcel
		const created = await prisma.landParcel.create({
			data: {
				stateId: data.stateId,
				title: data.title.trim(),
				surveyNumber: data.surveyNumber.trim(),
				areaSqYards: data.areaSqYards,
				addressLine: data.addressLine?.trim() || null,
				latitude: latStr ?? null, // Prisma Decimal(9,6)
				longitude: lngStr ?? null, // Prisma Decimal(9,6)
				unitsTotal: data.unitsTotal,
				unitsAvailable: data.unitsAvailable,
			},
			select: { id: true, title: true },
		});

		return NextResponse.json(
			{ id: created.id, message: "Land parcel created" },
			{ status: 201 }
		);
	} catch (err) {
		console.error("Create LandParcel error:", err);
		return NextResponse.json({ message: "Internal error" }, { status: 500 });
	}
}

/**
 * (Optional) GET list endpoint—also Super Admin only.
 * Supports simple pagination via ?page=1&limit=20
 */
export async function GET(req: Request) {
	const guard = await requireSuperAdmin();
	if (!guard.ok) {
		return NextResponse.json(
			{ message: guard.error },
			{ status: guard.status }
		);
	}

	const { searchParams } = new URL(req.url);
	const page = Math.max(1, Number(searchParams.get("page") || 1));
	const limit = Math.min(
		100,
		Math.max(1, Number(searchParams.get("limit") || 20))
	);
	const skip = (page - 1) * limit;

	try {
		const [items, total] = await Promise.all([
			prisma.landParcel.findMany({
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					title: true,
					surveyNumber: true,
					areaSqYards: true,
					unitsTotal: true,
					unitsAvailable: true,
					state: { select: { id: true, name: true, code: true } },
					createdAt: true,
				},
			}),
			prisma.landParcel.count(),
		]);
		console.log("Items fetched:", items.length, "Total:", total);
		return NextResponse.json({
			page,
			limit,
			total,
			items,
		});
	} catch (err) {
		console.error("List LandParcels error:", err);
		return NextResponse.json({ message: "Internal error" }, { status: 500 });
	}
}
