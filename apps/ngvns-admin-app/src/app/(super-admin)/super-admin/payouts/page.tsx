import Link from "next/link";
import React from "react";
import GenerateTransfersButton from "./GenerateTransfersButton";
import GenerateBatchButton from "./GenerateBatchButton";

const page = () => {
	return (
		<div className=" p-4 bg-neutral-50 rounded h-full w-full">
			<h1 className=" text-2xl">Payouts</h1>
			<div className="space-y-6 p-6">
				<h1 className="text-2xl font-semibold">Payout Admin</h1>

				<div className="space-y-3 rounded-lg border bg-white p-4">
					<h2 className="text-lg font-medium">
						Step 1: Generate Weekly Transfers
					</h2>
					<p className="text-sm text-slate-600">
						Groups approved user payouts by user + bank for the last full week
						and creates <code>PayoutTransfer</code> records.
					</p>
					<GenerateTransfersButton />
				</div>

				<div className="space-y-3 rounded-lg border bg-white p-4">
					<h2 className="text-lg font-medium">
						Step 2: Create Batch from Transfers
					</h2>
					<p className="text-sm text-slate-600">
						Takes all pending transfers (or a specific cycle) and creates a
						draft <code>PayoutBatch</code>.
					</p>
					<GenerateBatchButton />
				</div>
			</div>
			<div className="flex gap-x-4 my-4">
				<Link
					href="/super-admin/payouts/payout-types"
					className=" p-2 rounded bg-blue-400 text-neutral-100">
					Payout Types
				</Link>
				<Link
					href="/super-admin/payouts/batch"
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
