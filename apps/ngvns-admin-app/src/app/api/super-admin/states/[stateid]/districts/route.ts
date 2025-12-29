import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ stateid: string }> }
) => {
	try {
		const { stateid } = await params;
		if (!stateid) {
			return NextResponse.json(
				{ error: "State ID is required" },
				{ status: 400 }
			);
		}
		const state = await prisma.states.findUnique({
			where: { id: stateid },
		});
		if (!state) {
			return NextResponse.json({ error: "State not found" }, { status: 404 });
		}

		const districts = await prisma.districts.findMany({
			where: { stateId: state.id },
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

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ stateid: string }> }
) => {
	try {
		const { stateid } = await params;
		if (!stateid) {
			return NextResponse.json(
				{ error: "State ID is required" },
				{ status: 400 }
			);
		}
		const state = await prisma.states.findUnique({
			where: { id: stateid },
		});
		if (!state) {
			return NextResponse.json({ error: "State not found" }, { status: 404 });
		}

		const body = await req.json();
		const { name, code, isActive } = body;
		if (!name || !code) {
			return NextResponse.json(
				{ error: "Name and code are required" },
				{ status: 400 }
			);
		}
		const newState = await prisma.districts.create({
			data: {
				name,
				code,
				isActive: !!isActive,
				stateId: stateid,
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
