import React from "react";
import CreatePayoutType from "./CreatePayoutType";
import Link from "next/link";

const page = () => {
	return (
		<div>
			Create Payout Type Page
			<Link href="/super-admin/payouts/payout-types" className=" text-sm ">
				← Back to List
			</Link>
			<CreatePayoutType />
		</div>
	);
};

export default page;
