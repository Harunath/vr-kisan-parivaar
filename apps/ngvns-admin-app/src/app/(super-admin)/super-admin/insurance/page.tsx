import Link from "next/link";
import React from "react";
import InsurancesList from "./InsurancesList";

const page = () => {
	return (
		<div>
			Insurence
			<Link
				href="/super-admin/insurance/generate-list"
				className="underline text-blue-600">
				Generate List
			</Link>
			<InsurancesList />
		</div>
	);
};

export default page;
