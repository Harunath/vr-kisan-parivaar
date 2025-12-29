import prisma from "@ngvns2025/db/client";
import { NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		console.log(params);
		const { id } = await params;
		console.log("Fetching districts for state ID:", id);
		if (!id) {
			return NextResponse.json(
				{ error: "State ID is required" },
				{ status: 400 }
			);
		}
		const state = await prisma.states.findUnique({
			where: { id, isActive: true },
		});
		if (!state) {
			return NextResponse.json({ error: "State not found" }, { status: 404 });
		}
		const districts = await prisma.districts.findMany({
			where: { stateId: state.id, isActive: true },
		});
		return NextResponse.json(districts);
	} catch (error) {
		console.log("Error in fetching districts", error);
		return NextResponse.json(
			{ error: "Error in fetching districts" },
			{ status: 500 }
		);
	}
};
