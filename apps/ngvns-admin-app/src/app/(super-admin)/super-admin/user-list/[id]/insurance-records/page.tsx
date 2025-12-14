import prisma from "@ngvns2025/db/client";
import React from "react";
import SendInsuranceMail from "./SendInsuranceMail";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const insuranceRecords = await prisma.insuranceRecord.findMany({
		where: {
			enrollments: {
				some: { userId: id },
			},
		},
		select: {
			id: true,
			name: true,
			policyNumber: true,
			status: true,
			activationDate: true,
			expiryDate: true,
		},
	});

	return (
		<div className="">
			{insuranceRecords.map((record) => (
				<div key={record.id} className="mb-4 p-4 border rounded">
					{record.status === "ACTIVE" && <SendInsuranceMail id={id} />}
					<h2 className="text-xl font-semibold">{record.name}</h2>
					<p>Policy Number: {record.policyNumber || "N/A"}</p>
					<p>Status: {record.status}</p>
					<p>
						Activation Date:{" "}
						{record.activationDate
							? record.activationDate.toDateString()
							: "N/A"}
					</p>
					<p>
						Expiry Date:{" "}
						{record.expiryDate ? record.expiryDate.toDateString() : "N/A"}
					</p>
				</div>
			))}
		</div>
	);
};

export default page;
