"use client";

import React, { useEffect, useState } from "react";
import DistrictForm from "./DistrictForm";
import DistrictsTable from "./DistrictsTable";
import type {
	DistrictCreateInput,
	DistrictRow,
} from "../../../../lib/districts/types";
import { createDistrict, getDistricts } from "../../../../lib/districts/api";

export default function DistrictsPage({ stateid }: { stateid: string }) {
	const [districts, setDistricts] = useState<DistrictRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	async function refresh() {
		setError(null);
		setLoading(true);
		try {
			const data = await getDistricts(stateid);
			setDistricts(data);
		} catch (e: any) {
			setError(e?.message || "Failed to load districts");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (!stateid) return;
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateid]);

	async function handleCreate(
		payload: DistrictCreateInput | Partial<DistrictCreateInput>
	) {
		// Ensure required fields are present
		if (!payload || typeof payload.name !== "string" || !payload.name) {
			setError("District name is required.");
			return;
		}
		const created = await createDistrict(
			stateid,
			payload as DistrictCreateInput
		);
		setDistricts((p) => [created, ...p]);
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-8">
			<div>
				<h1 className="text-2xl font-extrabold tracking-tight text-[#0B1220]">
					Districts
				</h1>
				<p className="text-sm text-black/60">State: {stateid}</p>
			</div>

			<div className="">
				<DistrictForm
					mode="create"
					onSubmit={handleCreate}
					closeOnSuccess={false}
				/>

				<div className="space-y-4 pt-4">
					<div className="flex items-center justify-between">
						{error ? (
							<div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
								{error}
							</div>
						) : (
							<div />
						)}

						<button
							onClick={refresh}
							className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/5">
							Refresh
						</button>
					</div>

					{loading ? (
						<div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
							Loading...
						</div>
					) : (
						<DistrictsTable stateid={stateid} districts={districts} />
					)}
				</div>
			</div>
		</div>
	);
}
