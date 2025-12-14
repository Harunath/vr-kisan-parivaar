// apps/admin-app/app/api/super-admin/insurance/records/route.ts
import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const {
			name,
			policyNumber,
			insurerName,
			activationDate,
			expiryDate,
			status, // optional: "DRAFT" | "ACTIVE" | "EXPIRED" | "CANCELLED"
			batchDocumentUrl,
			policyDocumentUrl,
			otherDocumentUrls,
		} = body ?? {};

		// Basic validation
		if (!name || typeof name !== "string") {
			return NextResponse.json(
				{ error: "Field 'name' is required" },
				{ status: 400 }
			);
		}

		// Type guard for otherDocumentUrls
		const otherDocs: string[] = Array.isArray(otherDocumentUrls)
			? otherDocumentUrls.filter((u) => typeof u === "string")
			: [];

		const record = await prisma.insuranceRecord.create({
			data: {
				name,
				policyNumber: policyNumber ?? null,
				insurerName: insurerName ?? null,
				activationDate: activationDate ? new Date(activationDate) : null,
				expiryDate: expiryDate ? new Date(expiryDate) : null,
				status: status ?? "DRAFT",
				batchDocumentUrl: batchDocumentUrl ?? null,
				policyDocumentUrl: policyDocumentUrl ?? null,
				otherDocumentUrls: otherDocs,
			},
		});

		return NextResponse.json(
			{
				message: "Insurance record created successfully",
				data: record,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("Error creating insurance record:", error);

		// Handle unique policyNumber case nicely
		if (error.code === "P2002") {
			return NextResponse.json(
				{
					error: "Insurance record with this policyNumber already exists",
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
