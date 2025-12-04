// apps/admin-app/app/super-admin/payouts/batch/PayoutBatchPage.tsx
"use client";

import { useEffect, useState } from "react";

type BatchStatus = "DRAFT" | "POSTED" | "DISBURSED" | "RECONCILED" | string;

type PayoutBatchItem = {
	id: string;
	name: string;
	status: BatchStatus;
	totalAmountPaise: string; // comes as string from API
	createdAt: string;
	updatedAt: string;
	createdBy?: {
		id: string;
		name: string | null;
		email: string | null;
	} | null;
	approvedBy?: {
		id: string;
		name: string | null;
		email: string | null;
	} | null;
	_count: {
		transfers: number;
	};
};

type ListResponse = {
	ok: boolean;
	page: number;
	limit: number;
	total: number;
	items: PayoutBatchItem[];
	error?: string;
};

export default function PayoutBatchPage() {
	const [batches, setBatches] = useState<PayoutBatchItem[]>([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [limit] = useState(20);
	const [loading, setLoading] = useState(false);
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const totalPages = Math.max(1, Math.ceil(total / limit));

	async function fetchBatches(pageNum: number) {
		try {
			setLoading(true);
			setError(null);

			const res = await fetch(
				`/api/super-admin/payouts/batch?page=${pageNum}&limit=${limit}`,
				{ cache: "no-store" }
			);

			if (!res.ok) {
				const json = await res.json().catch(() => ({}));
				throw new Error(json.error || `Failed with status ${res.status}`);
			}

			const json: ListResponse = await res.json();
			if (!json.ok) {
				throw new Error(json.error || "Failed to load payout batches");
			}

			setBatches(json.items);
			setPage(json.page);
			setTotal(json.total);
		} catch (err: any) {
			console.error(err);
			setError(err.message || "Something went wrong while loading batches");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchBatches(1);
	}, []);

	async function handleCreateBatch() {
		try {
			setCreating(true);
			setError(null);

			const res = await fetch("/api/super-admin/payouts/batch/create-batch", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({}), // name is auto-generated on backend
			});

			const json = await res.json();

			if (!res.ok || !json.ok) {
				throw new Error(json.error || "Failed to create payout batch");
			}

			// Refresh list – new batch will appear at top
			await fetchBatches(1);
		} catch (err: any) {
			console.error(err);
			setError(err.message || "Failed to create payout batch");
		} finally {
			setCreating(false);
		}
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-8">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900">
						Payout Batches
					</h1>
					<p className="text-sm text-slate-600">
						Manage generated payout batches and track disbursement.
					</p>
				</div>

				<button
					type="button"
					onClick={handleCreateBatch}
					disabled={creating}
					className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
					{creating ? (
						<span className="inline-flex items-center gap-2">
							<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
							Creating…
						</span>
					) : (
						<span className="inline-flex items-center gap-2">
							<span className="text-lg">＋</span>
							Generate Payout Batch
						</span>
					)}
				</button>
			</div>

			{error && (
				<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
					{error}
				</div>
			)}

			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
				<div className="min-h-[160px] overflow-x-auto">
					<table className="min-w-full divide-y divide-slate-200 text-sm">
						<thead className="bg-slate-50">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
									Batch
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
									Status
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
									Total Amount
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
									Transfers
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
									Created
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
									Created By
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 bg-white">
							{loading && !batches.length ? (
								<tr>
									<td
										colSpan={6}
										className="px-4 py-10 text-center text-sm text-slate-500">
										<div className="inline-flex items-center gap-2">
											<span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
											<span>Loading payout batches…</span>
										</div>
									</td>
								</tr>
							) : !batches.length ? (
								<tr>
									<td
										colSpan={6}
										className="px-4 py-10 text-center text-sm text-slate-500">
										No payout batches found yet.
									</td>
								</tr>
							) : (
								batches.map((b) => {
									const amountRs = Number(b.totalAmountPaise ?? "0");

									return (
										<tr key={b.id} className="hover:bg-slate-50/70">
											<td className="px-4 py-3 align-top">
												<div className="flex flex-col">
													<span className="font-medium text-slate-900">
														{b.name}
													</span>
													<span className="text-xs text-slate-500">
														ID: {b.id.slice(0, 8)}…
													</span>
												</div>
											</td>
											<td className="px-4 py-3 align-top">
												<span
													className={[
														"inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
														b.status === "DRAFT"
															? "bg-slate-100 text-slate-700"
															: b.status === "DISBURSED"
																? "bg-emerald-100 text-emerald-700"
																: b.status === "POSTED"
																	? "bg-blue-100 text-blue-700"
																	: b.status === "RECONCILED"
																		? "bg-purple-100 text-purple-700"
																		: "bg-slate-100 text-slate-700",
													].join(" ")}>
													{b.status}
												</span>
											</td>
											<td className="px-4 py-3 align-top">
												<div className="flex flex-col">
													<span className="font-medium text-slate-900">
														₹ {amountRs.toLocaleString("en-IN")}
													</span>
													<span className="text-[11px] text-slate-500">
														({b.totalAmountPaise})
													</span>
												</div>
											</td>
											<td className="px-4 py-3 align-top">
												<span className="text-sm text-slate-700">
													{b._count.transfers}
												</span>
											</td>
											<td className="px-4 py-3 align-top text-xs text-slate-600">
												{new Date(b.createdAt).toLocaleString("en-IN", {
													timeZone: "Asia/Kolkata",
												})}
											</td>
											<td className="px-4 py-3 align-top text-xs text-slate-600">
												{b.createdBy?.name || b.createdBy?.email || "—"}
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
						<div>
							Page {page} of {totalPages} · {total} batches
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
								disabled={page <= 1 || loading}
								onClick={() => fetchBatches(page - 1)}>
								Previous
							</button>
							<button
								type="button"
								className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
								disabled={page >= totalPages || loading}
								onClick={() => fetchBatches(page + 1)}>
								Next
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
