import prisma, { AllocationStatus, LandUnitStatus } from "@ngvns2025/db/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth/auth";

export const POST = async () => {
	try {
		return NextResponse.json(
			{
				message: "Removed feature. For more details contact VR KISAN PARIVAAR",
			},
			{ status: 501 }
		);
		// const session = await getServerSession(authOptions);
		// if (!session || !session.user) {
		// 	return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		// }
		// const ALreadyExists = await prisma.landAllocation.findFirst({
		// 	where: {
		// 		userId: session.user.id,
		// 	},
		// });
		// if (ALreadyExists) {
		// 	return NextResponse.json(
		// 		{ message: "User already has a land allocation" },
		// 		{ status: 400 }
		// 	);
		// }
		// const land = await prisma.landParcel.findUnique({
		// 	where: {
		// 		id: "b39e2212-4421-4445-b48d-4d8371012cdd",
		// 	},
		// });
		// if (!land) {
		// 	return NextResponse.json(
		// 		{ message: "No land parcels found" },
		// 		{ status: 404 }
		// 	);
		// }
		// const landAllocation = await prisma.$transaction(async (tx) => {
		// 	if (land.unitsAvailable! > 0) {
		// 		const updatedLand = await tx.landParcel.update({
		// 			where: { id: land.id! },
		// 			data: {
		// 				unitsAvailable: { decrement: 1 },
		// 			},
		// 		});
		// 		const parcelUnit = await tx.landParcelUnit.create({
		// 			data: {
		// 				landParcelId: updatedLand.id,
		// 				unitNumber: updatedLand.unitsTotal - updatedLand.unitsAvailable,
		// 				status: LandUnitStatus.ALLOTTED,
		// 				lockedUntil: new Date(
		// 					new Date().getFullYear() + 5,
		// 					new Date().getMonth(),
		// 					new Date().getDate()
		// 				), // Lock for 5 years
		// 				note: "Direct allocation",
		// 			},
		// 		});
		// 		const newAllocation = await tx.landAllocation.create({
		// 			data: {
		// 				userId: session.user.id,
		// 				landParcelUnitId: parcelUnit.id,
		// 				status: AllocationStatus.CONFIRMED,
		// 				referenceNo: `${parcelUnit.id}${Date.now()}`,
		// 				stateId: land.stateId!,
		// 				landParcelId: land.id!,
		// 			},
		// 		});
		// 		return newAllocation;
		// 	} else {
		// 		return null;
		// 	}
		// });
		// if (!landAllocation) {
		// 	return NextResponse.json(
		// 		{ message: "No units available" },
		// 		{ status: 400 }
		// 	);
		// }
		// const mailRes = await fetch(
		// 	`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/integrations/land-allotment/mail`,
		// 	{
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 		},
		// 		body: JSON.stringify({
		// 			userId: session.user.id,
		// 		}),
		// 	}
		// );
		// if (!mailRes.ok) {
		// 	console.error("Failed to send land allotment email");
		// }

		// return NextResponse.json(landAllocation, { status: 201 });
	} catch (error) {
		console.error("Error creating land allocation:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
