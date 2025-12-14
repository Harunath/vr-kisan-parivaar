import React from "react";
import InsuranceDetails from "./InsuranceDetails";
import prisma from "@ngvns2025/db/client";
import MakeBatch from "./MakeBatch";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const memberCount = await prisma.userInsuranceEnrollment.count({
		where: { insuranceRecordId: id },
	});
	return (
		<div>
			<InsuranceDetails id={id} />
			<MakeBatch id={id} />
		</div>
	);
};

export default page;
