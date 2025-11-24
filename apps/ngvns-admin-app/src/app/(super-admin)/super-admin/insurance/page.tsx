import Link from "next/link";
import React from "react";

const page = () => {
	return (
		<div>
			Insurence
			<Link
				href="/super-admin/insurance/generate-list"
				className="underline text-blue-600">
				Generate List
			</Link>
		</div>
	);
};

export default page;
