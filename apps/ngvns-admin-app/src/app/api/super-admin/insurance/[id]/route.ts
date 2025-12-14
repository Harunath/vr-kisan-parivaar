// apps/admin-app/app/api/super-admin/insurance/records/[id]/route.ts
import prisma, { Prisma } from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET /api/super-admin/insurance/records/:id
 * Fetch a single insurance record (optionally with enrollments later)
 */
export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: insuranceRecordId } = await params;

		if (!insuranceRecordId) {
			return NextResponse.json(
				{ error: "InsuranceRecord ID is required" },
				{ status: 400 }
			);
		}

		const record = await prisma.insuranceRecord.findUnique({
			where: { id: insuranceRecordId },
			include: {
				_count: {
					select: { enrollments: true },
				},
			},
		});

		if (!record) {
			return NextResponse.json(
				{ error: "Insurance record not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ data: record }, { status: 200 });
	} catch (error) {
		console.error("Error fetching insurance record:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

/**
 * PATCH /api/super-admin/insurance/records/:id
 * Partial update – only fields sent are changed
 */
export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: insuranceRecordId } = await params;

		if (!insuranceRecordId) {
			return NextResponse.json(
				{ error: "InsuranceRecord ID is required" },
				{ status: 400 }
			);
		}

		const body = (await req.json()) as Record<string, unknown>;

		// Make sure record exists first (optional but nicer error)
		const existing = await prisma.insuranceRecord.findUnique({
			where: { id: insuranceRecordId },
			select: { id: true },
		});

		if (!existing) {
			return NextResponse.json(
				{ error: "Insurance record not found" },
				{ status: 404 }
			);
		}

		// Build update data dynamically from provided keys
		const data: Prisma.InsuranceRecordUpdateInput = {};

		if ("name" in body) {
			data.name = body.name as string;
		}

		if ("policyNumber" in body) {
			data.policyNumber = body.policyNumber as string | null;
		}

		if ("insurerName" in body) {
			data.insurerName = body.insurerName as string | null;
		}

		if ("status" in body) {
			data.status = body.status as any; // or your enum type
		}

		if ("activationDate" in body) {
			const raw = body.activationDate as string | null;
			data.activationDate = raw ? new Date(raw) : null;
		}

		if ("expiryDate" in body) {
			const raw = body.expiryDate as string | null;
			data.expiryDate = raw ? new Date(raw) : null;
		}

		if ("batchDocumentUrl" in body) {
			data.batchDocumentUrl = body.batchDocumentUrl as string | null;
		}

		if ("policyDocumentUrl" in body) {
			data.policyDocumentUrl = body.policyDocumentUrl as string | null;
		}

		if ("otherDocumentUrls" in body) {
			const other = body.otherDocumentUrls;
			if (Array.isArray(other)) {
				data.otherDocumentUrls = other.filter(
					(u): u is string => typeof u === "string"
				);
			} else if (other === null) {
				// if you ever want to clear it
				data.otherDocumentUrls = [];
			}
		}

		const updated = await prisma.insuranceRecord.update({
			where: { id: insuranceRecordId },
			data,
		});

		return NextResponse.json(
			{
				message: "Insurance record updated successfully",
				data: updated,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error updating insurance record:", error);

		if (error.code === "P2002") {
			return NextResponse.json(
				{
					error: "Duplicate value for a unique field (likely policyNumber).",
				},
				{ status: 409 }
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
