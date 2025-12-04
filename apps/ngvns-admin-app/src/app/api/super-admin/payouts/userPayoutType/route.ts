import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
	try {
		const payoutTypes = await prisma.userPayoutType.findMany({
			orderBy: { createdAt: "asc" },
		});
		return NextResponse.json({ ok: true, payoutTypes });
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
		const { name, description, defaultAmountPaise, isActive } = body;
		console.log("Creating payout type with data:", body);
		const newPayoutType = await prisma.userPayoutType.create({
			data: {
				name,
				description,
				defaultAmountPaise: Number(defaultAmountPaise),
				isActive,
			},
		});
		return NextResponse.json({ ok: true, payoutType: newPayoutType });
	} catch (error) {
		console.error("Error creating user payout type:", error);
		return NextResponse.json(
			{ ok: false, error: "Failed to create user payout type" },
			{ status: 500 }
		);
	}
}
