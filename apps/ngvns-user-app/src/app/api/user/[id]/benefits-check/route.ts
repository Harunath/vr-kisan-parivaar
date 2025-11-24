import { NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;

		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				healthCard: true,
				landAllotments: {
					select: {
						id: true,
					},
				},
				VRKP_Card: {
					select: {
						id: true,
						cardNumber: true,
					},
				},
			},
		});

		if (!user) {
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: user,
		});
	} catch (error) {
		console.error("USER_DETAILS_ERROR:", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
