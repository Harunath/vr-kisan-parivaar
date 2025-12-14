"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type InsuranceBatchStatus = "DRAFT" | "ACTIVE" | "EXPIRED" | "CANCELLED";

type InsuranceRecord = {
	id: string;
	name: string;
	policyNumber: string | null;
	insurerName: string | null;
	activationDate: string | null;
	expiryDate: string | null;
	status: InsuranceBatchStatus;
	createdAt: string;
};

type ApiResponse = {
	data: InsuranceRecord[];
	meta: {
		take: number;
		hasMore: boolean;
		nextCursor: string | null;
	};
};

const STATUS_OPTIONS: InsuranceBatchStatus[] = [
	"DRAFT",
	"ACTIVE",
	"EXPIRED",
	"CANCELLED",
];

const InsurancesList: React.FC = () => {
	const [records, setRecords] = useState<InsuranceRecord[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// filters
	const [status, setStatus] = useState<string>("");
	const [dateField, setDateField] = useState<
		"activation" | "expiry" | "created"
	>("activation");
	const [from, setFrom] = useState<string>("");
	const [to, setTo] = useState<string>("");

	// pagination
	const [take, setTake] = useState<number>(20);
	const [cursor, setCursor] = useState<string | null>(null);
	const [nextCursor, setNextCursor] = useState<string | null>(null);

	const fetchInsurances = async (opts?: { cursor?: string | null }) => {
		try {
			setLoading(true);
			setError(null);

			const params = new URLSearchParams();
			params.set("take", String(take));

			if (status) params.set("status", status);
			if (dateField) params.set("dateField", dateField);
			if (from) params.set("from", from);
			if (to) params.set("to", to);
			if (opts?.cursor) params.set("cursor", opts.cursor);

			const res = await fetch(
				`/api/super-admin/insurance?${params.toString()}`,
				{
					method: "GET",
				}
			);

			if (!res.ok) {
				throw new Error(`Failed to fetch: ${res.status}`);
			}

			const json: ApiResponse = await res.json();

			// If cursor passed → append, else replace
			if (opts?.cursor) {
				setRecords((prev) => [...prev, ...json.data]);
			} else {
				setRecords(json.data);
			}

			setNextCursor(json.meta.nextCursor);
			setCursor(opts?.cursor ?? null);
		} catch (err: any) {
			console.error(err);
			setError(err.message ?? "Failed to fetch insurances");
		} finally {
			setLoading(false);
		}
	};

	// initial load
	useEffect(() => {
		fetchInsurances();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// apply filters
	const handleApplyFilters = () => {
		setCursor(null);
		setNextCursor(null);
		fetchInsurances({ cursor: null });
	};

	const formatDate = (value: string | null) => {
		if (!value) return "-";
		const d = new Date(value);
		if (Number.isNaN(d.getTime())) return "-";
		return d.toLocaleDateString("en-IN", {
			year: "numeric",
			month: "short",
			day: "2-digit",
		});
	};

	return (
		<div className="space-y-6 bg-neutral-100 p-2 rounded">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="">
					<h1 className="text-xl font-semibold text-slate-900">
						Insurance Records
					</h1>
					<p className="mt-1 text-sm text-slate-500">
						View and manage group insurance batches.
					</p>
				</div>
				<div>
					<Link
						href="/super-admin/insurance/create-new"
						className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700">
						Create New Insurance
					</Link>
				</div>
			</div>

			{/* Filters */}
			<div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium uppercase tracking-wide text-slate-500">
						Status
					</label>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
						<option value="">All</option>
						{STATUS_OPTIONS.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium uppercase tracking-wide text-slate-500">
						Date Field
					</label>
					<select
						value={dateField}
						onChange={(e) => setDateField(e.target.value as typeof dateField)}
						className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
						<option value="activation">Activation Date</option>
						<option value="expiry">Expiry Date</option>
						<option value="created">Created At</option>
					</select>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium uppercase tracking-wide text-slate-500">
						From
					</label>
					<input
						type="date"
						value={from}
						onChange={(e) => setFrom(e.target.value)}
						className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium uppercase tracking-wide text-slate-500">
						To
					</label>
					<input
						type="date"
						value={to}
						onChange={(e) => setTo(e.target.value)}
						className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
					/>
				</div>

				<div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
					<button
						type="button"
						onClick={handleApplyFilters}
						disabled={loading}
						className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
						{loading ? "Applying..." : "Apply Filters"}
					</button>

					<div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
						<span>Per page:</span>
						<select
							value={take}
							onChange={(e) =>
								setTake(Number.parseInt(e.target.value, 10) || 20)
							}
							className="rounded-md border border-slate-200 px-2 py-1 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
							<option value={10}>10</option>
							<option value={20}>20</option>
							<option value={50}>50</option>
						</select>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
				<table className="min-w-full divide-y divide-slate-200 text-sm">
					<thead className="bg-slate-50">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
								Name
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
								Policy #
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
								Insurer
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
								Activation
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
								Expiry
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
								Status
							</th>
							<th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{records.length === 0 && !loading && (
							<tr>
								<td
									colSpan={7}
									className="px-4 py-8 text-center text-sm text-slate-500">
									No insurance records found.
								</td>
							</tr>
						)}

						{records.map((record) => (
							<tr key={record.id} className="hover:bg-slate-50/60">
								<td className="px-4 py-3 align-middle text-sm font-medium text-slate-900">
									{record.name}
								</td>
								<td className="px-4 py-3 align-middle text-xs text-slate-600">
									{record.policyNumber || "—"}
								</td>
								<td className="px-4 py-3 align-middle text-xs text-slate-600">
									{record.insurerName || "—"}
								</td>
								<td className="px-4 py-3 align-middle text-xs text-slate-600">
									{formatDate(record.activationDate)}
								</td>
								<td className="px-4 py-3 align-middle text-xs text-slate-600">
									{formatDate(record.expiryDate)}
								</td>
								<td className="px-4 py-3 align-middle text-xs font-semibold">
									<span
										className={
											record.status === "ACTIVE"
												? "rounded-full bg-emerald-50 px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-700 ring-1 ring-emerald-100"
												: record.status === "EXPIRED"
													? "rounded-full bg-rose-50 px-2.5 py-1 text-[0.7rem] font-semibold text-rose-700 ring-1 ring-rose-100"
													: record.status === "DRAFT"
														? "rounded-full bg-slate-50 px-2.5 py-1 text-[0.7rem] font-semibold text-slate-700 ring-1 ring-slate-200"
														: "rounded-full bg-amber-50 px-2.5 py-1 text-[0.7rem] font-semibold text-amber-700 ring-1 ring-amber-100"
										}>
										{record.status}
									</span>
								</td>
								<td className="px-4 py-3 align-middle text-right">
									<Link
										href={`/super-admin/insurance/${record.id}`}
										className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600">
										Open
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{/* Footer / Pagination */}
				<div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
					<div>
						{loading
							? "Loading..."
							: `Showing ${records.length} record${records.length === 1 ? "" : "s"}`}
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => {
								if (!nextCursor) return;
								fetchInsurances({ cursor: nextCursor });
							}}
							disabled={!nextCursor || loading}
							className="inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60">
							{nextCursor ? "Load more" : "No more"}
						</button>
					</div>
				</div>
			</div>

			{error && <p className="text-sm text-rose-600">{error}</p>}
		</div>
	);
};

export default InsurancesList;
