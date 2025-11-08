import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma, { AdminRole } from "@ngvns2025/db/client";
import { z } from "zod";
import { authOptions } from "../../../../../lib/auth/auth";

// Super Admin guard
async function requireSuperAdmin() {
	const session = await getServerSession(authOptions);
	if (!session?.user)
		return { ok: false as const, status: 401, message: "Unauthorized" };
	const role = (session.user as any).role;
	const isSuper = role === AdminRole?.SUPER;
	if (!isSuper)
		return { ok: false as const, status: 403, message: "Forbidden" };
	return { ok: true as const, session };
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ landId: string }> }
) {
	const guard = await requireSuperAdmin();
	if (!guard.ok)
		return NextResponse.json(
			{ message: guard.message },
			{ status: guard.status }
		);

	const { landId } = await params;

	try {
		const item = await prisma.landParcel.findUnique({
			where: { id: landId },
			include: { state: { select: { id: true, name: true, code: true } } },
		});
		if (!item)
			return NextResponse.json({ message: "Not found" }, { status: 404 });
		return NextResponse.json({ item });
	} catch (e) {
		console.error("GET land allocation error:", e);
		return NextResponse.json({ message: "Internal error" }, { status: 500 });
	}
}

const updateSchema = z.object({
	title: z.string().min(1),
	surveyNumber: z.string().min(1),
	areaSqYards: z.coerce.number().int().positive(),
	addressLine: z.string().nullable().optional(),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
	unitsTotal: z.coerce.number().int().positive(),
	unitsAvailable: z.coerce.number().int().nonnegative(),
});

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ landId: string }> }
) {
	const guard = await requireSuperAdmin();
	if (!guard.ok)
		return NextResponse.json(
			{ message: guard.message },
			{ status: guard.status }
		);

	const { landId } = await params;

	try {
		const json = await req.json();
		const parsed = updateSchema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json(
				{ message: "Validation failed", issues: parsed.error.flatten() },
				{ status: 400 }
			);
		}
		const d = parsed.data;

		const lat = d.latitude == null ? null : Number(d.latitude.toFixed(6));
		const lng = d.longitude == null ? null : Number(d.longitude.toFixed(6));

		if (d.unitsTotal < d.unitsAvailable) {
			return NextResponse.json(
				{ message: "unitsTotal cannot be less than unitsAvailable" },
				{ status: 400 }
			);
		}

		// Guard: available <= total
		if (d.unitsAvailable > d.unitsTotal) {
			return NextResponse.json(
				{ message: "unitsAvailable cannot exceed unitsTotal" },
				{ status: 400 }
			);
		}

		const updated = await prisma.landParcel.update({
			where: { id: landId },
			data: {
				title: d.title.trim(),
				surveyNumber: d.surveyNumber.trim(),
				areaSqYards: d.areaSqYards,
				addressLine: d.addressLine ?? null,
				latitude: lat,
				longitude: lng,
				unitsTotal: d.unitsTotal,
				unitsAvailable: d.unitsAvailable,
			},
			select: { id: true, updatedAt: true },
		});

		return NextResponse.json({ id: updated.id, updatedAt: updated.updatedAt });
	} catch (e) {
		console.error("PUT land allocation error:", e);
		return NextResponse.json({ message: "Internal error" }, { status: 500 });
	}
}
