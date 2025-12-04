import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const payoutType = await prisma.userPayoutType.findUnique({
			where: { id },
		});
		if (!payoutType) {
			return NextResponse.json(
				{ ok: false, error: "User payout type not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({ ok: true, payoutType });
	} catch (error) {
		console.error("Error fetching user payout types:", error);
		return NextResponse.json(
			{ ok: false, error: "Failed to fetch user payout types" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const {
			id, // optional: if present -> update
			name,
			description,
			defaultAmountPaise,
			isActive,
		} = body ?? {};

		// Build data object only with defined fields
		const data: any = {};

		if (name !== undefined) data.name = name;
		if (description !== undefined) data.description = description;
		if (isActive !== undefined) data.isActive = isActive;
		if (defaultAmountPaise !== undefined && defaultAmountPaise !== null) {
			// allow number or string, convert to Number
			data.defaultAmountPaise =
				typeof defaultAmountPaise === "number"
					? defaultAmountPaise
					: Number(defaultAmountPaise);
		}

		if (id) {
			// UPDATE existing payout type
			const updated = await prisma.userPayoutType.update({
				where: { id },
				data,
			});

			return NextResponse.json({ ok: true, payoutType: updated });
		}

		// CREATE new payout type
		if (!name) {
			return NextResponse.json(
				{
					ok: false,
					error: "Field 'name' is required when creating a new payout type",
				},
				{ status: 400 }
			);
		}

		const created = await prisma.userPayoutType.create({
			data,
		});

		return NextResponse.json({ ok: true, payoutType: created });
	} catch (error) {
		console.error("Error creating/updating user payout type:", error);
		return NextResponse.json(
			{ ok: false, error: "Failed to create or update user payout type" },
			{ status: 500 }
		);
	}
}
