import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../../../lib/auth/auth";
import { redirect } from "next/navigation";
import prisma from "@ngvns2025/db/client";
import InsuranceDetails from "./InsuranceDetails";

const ViewInsurance = async () => {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) redirect("/logout");
	const insurance = await prisma.userInsuranceEnrollment.findFirst({
		where: {
			userId: session.user.id,
		},
		select: {
			id: true,
			insuranceRecord: {
				select: {
					id: true,
					policyNumber: true,
					insurerName: true,
					activationDate: true,
					expiryDate: true,
					status: true,
					policyDocumentUrl: true,
				},
			},
		},
	});
	return (
		<>
			<InsuranceDetails
				insuranceName={insurance?.insuranceRecord?.insurerName || undefined}
				policyNumber={insurance?.insuranceRecord?.policyNumber || undefined}
				activationDate={
					insurance?.insuranceRecord?.activationDate
						?.toISOString()
						.split("T")[0] || undefined
				}
				expirationDate={
					insurance?.insuranceRecord?.expiryDate?.toISOString().split("T")[0] ||
					undefined
				}
				status={insurance?.insuranceRecord?.status || undefined}
				link={
					insurance?.insuranceRecord?.policyDocumentUrl
						? insurance.insuranceRecord.policyDocumentUrl
						: undefined
				} // Add the appropriate link if available
			/>
		</>
	);
};

export default ViewInsurance;
