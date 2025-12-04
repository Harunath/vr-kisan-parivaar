import Link from "next/link";
import React from "react";

const page = () => {
	return (
		<div className=" p-4 bg-neutral-50 rounded h-full w-full">
			<h1 className=" text-2xl">Payouts</h1>

			<div className="flex gap-x-4 my-4">
				<Link
					href="/super-admin/payouts/payout-types"
					className=" p-2 rounded bg-blue-400 text-neutral-100">
					Payout Types
				</Link>
				<Link
					href="/super-admin/payouts/user-payouts/batch"
					className=" p-2 rounded bg-blue-400 text-neutral-100">
					Payout Batches
				</Link>
				<Link
					href="/super-admin/payouts/user-payouts"
					className=" p-2 rounded bg-blue-400 text-neutral-100">
					User Payouts
				</Link>
			</div>
		</div>
	);
};

export default page;
