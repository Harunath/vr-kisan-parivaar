"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DistrictForm from "./DistrictForm";
import type {
	DistrictRow,
	DistrictUpdateInput,
} from "../../../../lib/districts/types";
import { getDistrict, updateDistrict } from "../../../../lib/districts/api";

export default function DistrictDetailPage({
	stateid,
	districtid,
}: {
	stateid: string;
	districtid: string;
}) {
	const router = useRouter();

	const [district, setDistrict] = useState<DistrictRow | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	async function load() {
		setError(null);
		setLoading(true);
		try {
			const data = await getDistrict(stateid, districtid);
			setDistrict(data);
		} catch (e: any) {
			setError(e?.message || "Failed to load district");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (!stateid || !districtid) return;
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateid, districtid]);

	async function handleUpdate(payload: DistrictUpdateInput) {
		const updated = await updateDistrict(stateid, districtid, payload);
		setDistrict(updated);
		return updated; // important: DistrictForm uses returned data as next base snapshot
	}

	return (
		<div className="mx-auto max-w-3xl px-4 py-8">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-extrabold tracking-tight text-[#0B1220]">
						District
					</h1>
					<p className="text-sm text-black/60">
						State: {stateid} • District: {districtid}
					</p>
				</div>

				<button
					onClick={() =>
						router.push(`/super-admin/states/${stateid}/districts`)
					}
					className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/5">
					Back
				</button>
			</div>

			<div className="mt-6">
				{loading ? (
					<div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
						Loading...
					</div>
				) : error ? (
					<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
						{error}
					</div>
				) : district ? (
					<DistrictForm
						mode="view"
						initial={district}
						onSubmit={handleUpdate}
					/>
				) : (
					<div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
						District not found.
					</div>
				)}
			</div>
		</div>
	);
}
