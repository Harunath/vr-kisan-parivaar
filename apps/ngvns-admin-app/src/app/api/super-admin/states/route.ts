import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
	try {
		const states = await prisma.states.findMany();
		return NextResponse.json(states);
	} catch (error) {
		console.log("Error in fetching states", error);
		return NextResponse.json(
			{ error: "Error in fetching states" },
			{ status: 500 }
		);
	}
};

export const POST = async (req: NextRequest) => {
	try {
		const body = await req.json();
		const { name, code, isActive } = body;
		if (!name || !code) {
			return NextResponse.json(
				{ error: "Name and code are required" },
				{ status: 400 }
			);
		}
		const newState = await prisma.states.create({
			data: {
				name,
				code,
				isActive: !!isActive,
			},
		});
		return NextResponse.json(newState, { status: 201 });
	} catch (error) {
		console.log("Error in creating state", error);
		return NextResponse.json(
			{ error: "Error in creating state" },
			{ status: 500 }
		);
	}
};
