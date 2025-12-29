// apps/admin-app/app/(admin)/super-admin/payouts/GenerateBatchButton.tsx
"use client";

import { useState } from "react";

export default function GenerateBatchButton() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Optional: allow manual cycleKey or limit
	const [cycleKey, setCycleKey] = useState("");
	const [limit, setLimit] = useState<number | "">("");

	async function handleClick() {
		setLoading(true);
		setMessage(null);
		setError(null);

		try {
			const body: any = {};
			if (cycleKey.trim()) body.cycleKey = cycleKey.trim();
			if (limit !== "" && Number(limit) > 0) body.limit = Number(limit);

			const res = await fetch("/api/super-admin/payouts/batch", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: Object.keys(body).length ? JSON.stringify(body) : undefined,
			});

			const json = await res.json();

			if (!res.ok || !json.ok) {
				setError(json.error || "Failed to create batch");
				return;
			}

			setMessage(
				`Batch ${json.batch.id} created with ${json.transferCount} transfers (total ${json.batch.totalAmountPaise} paise)`
			);
		} catch (e: any) {
			setError(e?.message || "Request failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-wrap items-center gap-3">
				<input
					type="text"
					placeholder="Optional cycleKey (e.g. 2025-12-07)"
					value={cycleKey}
					onChange={(e) => setCycleKey(e.target.value)}
					className="min-w-[260px] rounded-md border px-3 py-1.5 text-sm"
				/>
				<input
					type="number"
					placeholder="Optional limit"
					value={limit}
					onChange={(e) =>
						setLimit(e.target.value ? Number(e.target.value) : "")
					}
					className="w-32 rounded-md border px-3 py-1.5 text-sm"
				/>
				<button
					onClick={handleClick}
					disabled={loading}
					className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
					{loading ? "Creating..." : "Create Batch from Transfers"}
				</button>
			</div>

			{message && <p className="text-sm text-emerald-600">{message}</p>}
			{error && <p className="text-sm text-red-600">{error}</p>}
		</div>
	);
}
