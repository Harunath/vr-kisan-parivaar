import prisma from "@ngvns2025/db/client";
import { NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const { id } = await params;
		const state = await prisma.states.findUnique({
			where: { id, isActive: true },
		});
		if (!state) {
			return NextResponse.json({ error: "State not found" }, { status: 404 });
		}
		return NextResponse.json(state);
	} catch (error) {
		console.log("Error in fetching state", error);
		return NextResponse.json(
			{ error: "Error in fetching state" },
			{ status: 500 }
		);
	}
};
