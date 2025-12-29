import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ stateid: string }> }
) => {
	try {
		const { stateid } = await params;
		const state = await prisma.states.findUnique({
			where: { id: stateid },
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

export const PUT = async (
	req: NextRequest,
	{ params }: { params: Promise<{ stateid: string }> }
) => {
	try {
		const { stateid } = await params;
		const body = await req.json();
		const { name, code, isActive } = body;
		const data: { [key: string]: string | boolean } = {};
		if (name !== undefined) data["name"] = name;
		if (code !== undefined) data["code"] = code;
		if (isActive !== undefined) data["isActive"] = !!isActive;
		const state = await prisma.states.update({
			where: { id: stateid },
			data: data,
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
