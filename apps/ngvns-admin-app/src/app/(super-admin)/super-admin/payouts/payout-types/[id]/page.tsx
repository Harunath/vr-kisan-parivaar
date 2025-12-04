import React from "react";
import EditPayout from "./EditPayout";
import Link from "next/link";

async function page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return (
		<div>
			Payout Type Details Page - {id}{" "}
			<Link href="/super-admin/payouts/payout-types" className=" text-sm ">
				← Back to List
			</Link>
			<EditPayout id={id} />
		</div>
	);
}

export default page;
