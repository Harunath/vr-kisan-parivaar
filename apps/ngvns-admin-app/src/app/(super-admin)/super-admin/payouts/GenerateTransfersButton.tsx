// apps/admin-app/app/(admin)/super-admin/payouts/GenerateTransfersButton.tsx
"use client";

import { useState } from "react";

export default function GenerateTransfersButton() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function handleClick() {
		setLoading(true);
		setMessage(null);
		setError(null);

		try {
			const res = await fetch("/api/super-admin/payouts/transfers", {
				method: "POST",
			});

			const json = await res.json();

			if (!res.ok || !json.ok) {
				setError(json.error || "Failed to generate transfers");
				return;
			}

			setMessage(
				`Created/updated ${json.transferCount} transfers for cycle ${json.cycleKey}`
			);
		} catch (e: any) {
			setError(e?.message || "Request failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex items-center gap-3">
			<button
				onClick={handleClick}
				disabled={loading}
				className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
				{loading ? "Running..." : "Generate Weekly Transfers"}
			</button>

			{message && <p className="text-sm text-emerald-600">{message}</p>}
			{error && <p className="text-sm text-red-600">{error}</p>}
		</div>
	);
}
