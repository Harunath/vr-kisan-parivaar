import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

type EnrollBody = {
	insuranceRecordId: string; // was InsuranceId
	userVrkpIds: string[]; // was userIds, but they are vrKpId values
};

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as Partial<EnrollBody>;
		const { insuranceRecordId, userVrkpIds } = body;

		// Basic validation
		if (
			!insuranceRecordId ||
			!Array.isArray(userVrkpIds) ||
			userVrkpIds.length === 0
		) {
			return NextResponse.json(
				{ error: "insuranceRecordId and userVrkpIds[] are required" },
				{ status: 400 }
			);
		}

		// Ensure insurance record exists
		const insuranceRecord = await prisma.insuranceRecord.findUnique({
			where: { id: insuranceRecordId },
			select: { id: true, name: true, status: true },
		});

		if (!insuranceRecord) {
			return NextResponse.json(
				{ error: "Insurance record not found" },
				{ status: 404 }
			);
		}

		// Fetch users by vrKpId
		const users = await prisma.user.findMany({
			where: {
				vrKpId: { in: userVrkpIds },
			},
			select: {
				id: true,
				vrKpId: true,
			},
		});

		if (users.length === 0) {
			return NextResponse.json(
				{ error: "No matching users found for provided IDs" },
				{ status: 404 }
			);
		}

		const foundVrkpIds = users.map((u) => u.vrKpId);
		const missingVrkpIds = userVrkpIds.filter(
			(id) => !foundVrkpIds.includes(id)
		);

		const data = users.map((user) => ({
			userId: user.id,
			insuranceRecordId: insuranceRecord.id,
		}));

		// One atomic DB call, uses unique([userId, insuranceRecordId]) + skipDuplicates
		const result = await prisma.userInsuranceEnrollment.createMany({
			data,
			skipDuplicates: true, // avoids P2002 if already enrolled
		});

		return NextResponse.json(
			{
				message: "Users enrolled into insurance batch successfully",
				insuranceRecordId: insuranceRecord.id,
				insuranceRecordName: insuranceRecord.name,
				enrolledCount: result.count,
				requestedCount: userVrkpIds.length,
				missingVrkpIds,
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error("Error creating insurance batch:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
