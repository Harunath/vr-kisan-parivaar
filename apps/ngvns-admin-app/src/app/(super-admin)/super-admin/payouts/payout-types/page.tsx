import prisma from "@ngvns2025/db/client";
import Link from "next/link";
import React from "react";

const page = async () => {
	const payoutTypes = await prisma.userPayoutType.findMany({
		orderBy: { createdAt: "asc" },
	});
	return (
		<div className=" bg-neutral-50 w-full h-full rounded p-4 space-y-4">
			<h1 className="text-2xl font-bold mb-4">
				Payout Types ({payoutTypes.length})
			</h1>

			<Link
				href="/super-admin/payouts/payout-types/create"
				className=" p-2 my-4 bg-blue-400 text-neutral-100 rounded-2xl ">
				Create Payout Type
			</Link>
			<div className="space-y-4">
				{payoutTypes.map((type) => (
					<Link
						href={`/super-admin/payouts/payout-types/${type.id}`}
						key={type.id}
						className="bg-neutral-100 p-4 rounded shadow min-w-full block hover:bg-neutral-200 transition">
						<h2 className="text-xl font-semibold">{type.name}</h2>
						<p className="text-gray-600">{type.description}</p>
						<p className="text-gray-800">
							Default Amount:{" "}
							{type.defaultAmountPaise ? `₹${type.defaultAmountPaise}` : "N/A"}
						</p>
						<p className="text-gray-800">
							Approved Amount:{" "}
							{type.approvedAmountPaise
								? `₹${type.approvedAmountPaise}`
								: "N/A"}
						</p>
						<p
							className={`font-medium ${type.isActive ? "text-green-600" : "text-red-600"}`}>
							Status: {type.isActive ? "Active" : "Inactive"}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
};

export default page;
