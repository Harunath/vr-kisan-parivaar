import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ stateid: string; districtid: string }> }
) => {
	try {
		const { stateid, districtid } = await params;
		if (!stateid || !districtid) {
			return NextResponse.json(
				{ error: "Invalid parameters" },
				{ status: 400 }
			);
		}
		console.log("stateid", stateid, "districtid", districtid);
		const state = await prisma.states.findUnique({
			where: { id: stateid },
		});
		if (!state) {
			return NextResponse.json({ error: "State not found" }, { status: 404 });
		}
		const district = await prisma.districts.findUnique({
			where: { id: districtid, stateId: state.id },
		});
		if (!district) {
			return NextResponse.json(
				{ error: "District not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(district);
	} catch (error) {
		console.log("Error in fetching district", error);
		return NextResponse.json(
			{ error: "Error in fetching district" },
			{ status: 500 }
		);
	}
};

export const PUT = async (
	req: Request,
	{ params }: { params: Promise<{ stateid: string; districtid: string }> }
) => {
	try {
		const { stateid, districtid } = await params;
		const body = await req.json();
		const { name, code, isActive } = body;
		const data: { [key: string]: string | boolean } = {};
		if (name !== undefined) data["name"] = name;
		if (code !== undefined) data["code"] = code;
		if (isActive !== undefined) data["isActive"] = !!isActive;
		const state = await prisma.states.findUnique({
			where: { id: stateid },
			include: { districts: { where: { id: districtid } } },
		});
		if (!state || state.districts.length === 0) {
			return NextResponse.json({ error: "State not found" }, { status: 404 });
		}
		const updateDistrict = await prisma.districts.update({
			where: { id: districtid },
			data: data,
		});
		if (!updateDistrict) {
			return NextResponse.json(
				{ error: "District not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(updateDistrict);
	} catch (error) {
		console.log("Error in fetching district", error);
		return NextResponse.json(
			{ error: "Error in fetching district" },
			{ status: 500 }
		);
	}
};
