"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StateForm from "./StateForm";
import type { StateRow, StateUpdateInput } from "../../../lib/states/types";
import { getState, updateState } from "../../../lib/states/api";
import Link from "next/link";

export default function StateDetailPage({ stateid }: { stateid: string }) {
	const router = useRouter();

	const [state, setState] = useState<StateRow | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	async function load() {
		setError(null);
		setLoading(true);
		try {
			const data = await getState(stateid);
			setState(data);
		} catch (e: any) {
			setError(e?.message || "Failed to load state");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (!stateid) return;
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateid]);

	async function handleUpdate(payload: StateUpdateInput) {
		const updated = await updateState(stateid, payload);
		setState(updated);
	}

	return (
		<div className="mx-auto max-w-3xl px-4 py-8">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-extrabold tracking-tight text-[#0B1220]">
						Edit State
					</h1>
					<p className="text-sm text-black/60">{stateid}</p>
				</div>

				<button
					onClick={() => router.push("/super-admin/states")}
					className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/5">
					Back
				</button>
			</div>

			<div className="mt-6 bg-neutral-50 p-4 rounded-lg">
				<Link
					href={`/super-admin/states/${stateid}/districts`}
					className="my-4 inline-block rounded-lg border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/5">
					Manage Districts
				</Link>
				{loading ? (
					<div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
						Loading...
					</div>
				) : error ? (
					<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
						{error}
					</div>
				) : state ? (
					<StateForm
						mode="view"
						initial={state}
						onSubmit={handleUpdate}
						submitLabel="Save Changes"
						onCancel={() => router.push("/super-admin/states")}
					/>
				) : (
					<div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
						State not found.
					</div>
				)}
			</div>
		</div>
	);
}
