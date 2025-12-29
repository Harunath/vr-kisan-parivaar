import prisma from "@ngvns2025/db/client";
import { NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ id: string; districtid: string }> }
) => {
	try {
		const { id, districtid } = await params;
		const state = await prisma.states.findUnique({
			where: { id, isActive: true },
		});
		if (!state) {
			return NextResponse.json({ error: "State not found" }, { status: 404 });
		}
		const district = await prisma.districts.findUnique({
			where: { id: districtid, stateId: state.id, isActive: true },
		});
		return NextResponse.json(district);
	} catch (error) {
		console.log("Error in fetching district", error);
		return NextResponse.json(
			{ error: "Error in fetching district" },
			{ status: 500 }
		);
	}
};
