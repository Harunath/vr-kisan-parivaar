"use client";

import React, { useEffect, useState } from "react";
import StatesTable from "./StatesTable";
import StateForm from "./StateForm";
import type { StateRow, StateCreateInput } from "../../../lib/states/types";
import { createState, getStates } from "../../../lib/states/api";

export default function StatesPage() {
	const [states, setStates] = useState<StateRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [openCreateForm, setOpenCreateForm] = useState(false);

	async function refresh() {
		setError(null);
		setLoading(true);
		try {
			const data = await getStates();
			setStates(data);
		} catch (e: any) {
			setError(e?.message || "Failed to load states");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		refresh();
	}, []);

	async function handleCreate(
		payload: StateCreateInput | Partial<StateCreateInput>
	) {
		// Ensure required fields are present before calling createState
		if (!payload.name) {
			setError("State name is required.");
			return;
		}
		const created = await createState(payload as StateCreateInput);
		// optimistic add (or just refresh)
		setStates((p) => [created, ...p]);
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-extrabold tracking-tight text-[#0B1220]">
					States
				</h1>
				<p className="text-sm text-black/60">
					Create and manage states (used in district/city mapping).
				</p>
			</div>

			<div className="">
				{openCreateForm ? (
					<StateForm
						mode="create"
						onSubmit={handleCreate}
						close={() => setOpenCreateForm(false)}
					/>
				) : (
					<button
						onClick={() => setOpenCreateForm(true)}
						className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold hover:bg-black/5">
						+ Create New State
					</button>
				)}

				<div className="space-y-4">
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
						<StatesTable states={states} />
					)}
				</div>
			</div>
		</div>
	);
}
