import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../../../lib/auth/auth";
import { redirect } from "next/navigation";
import prisma from "@ngvns2025/db/client";
import Link from "next/link";
import GetLandAlloted from "./GetLandAlloted";

const LandAllocationPage = async () => {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) redirect("/logout");
	const allottedLand = await prisma.landAllocation.findFirst({
		where: {
			userId: session.user.id,
		},
		select: {
			id: true,
			referenceNo: true,
			status: true,
			unit: {
				select: {
					unitNumber: true,
					landParcel: {
						select: {
							title: true,
							surveyNumber: true,
							addressLine: true,
						},
					},
				},
			},
		},
	});
	return (
		<>
			<GetLandAlloted landDetails={allottedLand || null} />
		</>
	);
};

export default LandAllocationPage;
