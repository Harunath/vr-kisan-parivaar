"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

type PayoutItem = {
	id: string;
	userId: string;
	parentId: string;
	userName: string;
	parentName: string;
	typeId: string;
	typeName: string;
	requestedAmountPaise: number;
	approvedAmountPaise: number | null;
	currency: string;
	status: string;
	referralId: string | null;
	requestedById: string | null;
	approvedById: string | null;
	approvedAt: string | null;
	paymentDate: string | null;
	transferReference: string | null;
	createdAt: string;
	updatedAt: string;
};

type PayoutTypeOption = {
	id: string;
	name: string;
	description: string | null;
};

type ApiResponse = {
	ok: boolean;
	data?: {
		page: number;
		limit: number;
		total: number;
		items: PayoutItem[];
		types: PayoutTypeOption[];
	};
	error?: string;
};

const PAGE_SIZE = 20;

function fmtDate(dateStr?: string | null) {
	if (!dateStr) return "-";
	const d = new Date(dateStr);
	return new Intl.DateTimeFormat("en-IN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(d);
}

// If you're storing *rupees* directly in paise column, remove `/ 100`.
function fmtAmountFromPaise(paise: number | null | undefined) {
	if (paise == null) return "-";
	const rupees = paise;
	return rupees.toLocaleString("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 2,
	});
}

export default function PayoutsPage() {
	const [items, setItems] = useState<PayoutItem[]>([]);
	const [types, setTypes] = useState<PayoutTypeOption[]>([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [typeId, setTypeId] = useState("");
	const [status, setStatus] = useState("");

	// Fetch payouts with filters
	useEffect(() => {
		async function fetchPayouts() {
			setLoading(true);
			setError(null);

			const params = new URLSearchParams();
			params.set("page", String(page));
			params.set("limit", String(PAGE_SIZE));
			if (from) params.set("from", from);
			if (to) params.set("to", to);
			if (typeId) params.set("typeId", typeId);
			if (status) params.set("status", status);

			try {
				const res = await fetch(
					`/api/super-admin/payouts/user-payout?${params.toString()}`,
					{
						method: "GET",
					}
				);

				const json: ApiResponse = await res.json();

				if (!json.ok || !json.data) {
					setError(json.error ?? "Failed to load payouts");
					setItems([]);
					setTypes([]);
					setTotal(0);
					return;
				}

				setItems(json.data.items);
				setTypes(json.data.types);
				setTotal(json.data.total);
			} catch (err) {
				console.error(err);
				setError("Failed to load payouts");
			} finally {
				setLoading(false);
			}
		}

		fetchPayouts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, from, to, typeId, status]);

	const generateReferralPayouts = async () => {
		try {
			const res = await fetch("/api/super-admin/payouts/user-payout/referral", {
				method: "POST",
			});
			const json = await res.json();
			if (!res.ok || !json.ok) {
				toast.error(json.error || "Failed to generate referral payouts");
				throw new Error(json.error || "Failed to generate referral payouts");
			}
			toast.success("Referral payouts generated successfully");
			// Optionally, you can refresh the payouts list or show a success message here
		} catch (err: any) {
			toast.error(err.message || "Failed to generate referral payouts");
			console.error(err);
			setError(err.message || "Failed to generate referral payouts");
		}
	};
	const generateMarketingPayouts = async () => {
		try {
			const res = await fetch(
				"/api/super-admin/payouts/user-payout/marketing",
				{
					method: "POST",
				}
			);
			const json = await res.json();
			if (!res.ok || !json.ok) {
				toast.error(json.error || "Failed to generate referral payouts");
				throw new Error(json.error || "Failed to generate referral payouts");
			}
			toast.success("Referral payouts generated successfully");
			// Optionally, you can refresh the payouts list or show a success message here
		} catch (err: any) {
			toast.error(err.message || "Failed to generate referral payouts");
			console.error(err);
			setError(err.message || "Failed to generate referral payouts");
		}
	};
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

	function resetFilters() {
		setFrom("");
		setTo("");
		setTypeId("");
		setStatus("");
		setPage(1);
	}

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl space-y-6">
				{/* Header + actions */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
							User Payouts
						</h1>
						<p className="mt-1 text-sm text-slate-600">
							View, filter, and review referral & marketing payouts.
						</p>
					</div>

					<div className="flex flex-wrap gap-2">
						<button
							onClick={generateMarketingPayouts}
							className="inline-flex items-center rounded-md border border-emerald-500/60 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50">
							Generate Marketing Payouts
						</button>
						<button
							onClick={generateReferralPayouts}
							className="inline-flex items-center rounded-md border border-blue-500/60 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-50">
							Generate Referral Payouts
						</button>
					</div>
				</div>

				{/* Filters */}
				<div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
					<div className="grid gap-4 md:grid-cols-4">
						<div className="flex flex-col gap-1">
							<label className="text-xs font-medium text-slate-700">
								From date
							</label>
							<input
								type="date"
								value={from}
								onChange={(e) => {
									setFrom(e.target.value);
									setPage(1);
								}}
								className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
							/>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-xs font-medium text-slate-700">
								To date
							</label>
							<input
								type="date"
								value={to}
								onChange={(e) => {
									setTo(e.target.value);
									setPage(1);
								}}
								className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
							/>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-xs font-medium text-slate-700">
								Payout type
							</label>
							<select
								value={typeId}
								onChange={(e) => {
									setTypeId(e.target.value);
									setPage(1);
								}}
								className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
								<option value="">All types</option>
								{types.map((t) => (
									<option key={t.id} value={t.id}>
										{t.name}
									</option>
								))}
							</select>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-xs font-medium text-slate-700">
								Status
							</label>
							<select
								value={status}
								onChange={(e) => {
									setStatus(e.target.value);
									setPage(1);
								}}
								className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
								<option value="">All statuses</option>
								<option value="REQUESTED">Requested</option>
								<option value="APPROVED">Approved</option>
								<option value="REJECTED">Rejected</option>
								<option value="PAID">Paid</option>
								{/* add more if your enum has them */}
							</select>
						</div>
					</div>

					<div className="mt-3 flex items-center justify-between">
						<button
							type="button"
							onClick={resetFilters}
							className="text-xs font-medium text-slate-600 hover:text-slate-900">
							Reset filters
						</button>
						{total > 0 && (
							<p className="text-xs text-slate-500">
								Showing {(page - 1) * PAGE_SIZE + 1}–
								{Math.min(page * PAGE_SIZE, total)} of {total} payouts
							</p>
						)}
					</div>
				</div>

				{/* Table */}
				<div className="overflow-hidden rounded-xl border border-slate-200 bg-white/90 shadow-sm">
					<div className="overflow-x-auto">
						<table className="min-w-full text-left text-sm">
							<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
								<tr>
									<th className="px-4 py-3">Member</th>
									<th className="px-4 py-3">Parent</th>
									<th className="px-4 py-3">Type</th>
									<th className="px-4 py-3">Requested</th>
									<th className="px-4 py-3">Approved</th>
									<th className="px-4 py-3">Status</th>
									<th className="px-4 py-3">Requested at</th>
									<th className="px-4 py-3">Paid on</th>
									<th className="px-4 py-3"></th>
								</tr>
							</thead>
							<tbody>
								{loading && (
									<tr>
										<td
											colSpan={9}
											className="px-4 py-6 text-center text-sm text-slate-500">
											Loading payouts…
										</td>
									</tr>
								)}

								{!loading && items.length === 0 && (
									<tr>
										<td
											colSpan={9}
											className="px-4 py-6 text-center text-sm text-slate-500">
											No payouts found for the selected filters.
										</td>
									</tr>
								)}

								{!loading &&
									items.map((p) => (
										<tr
											key={p.id}
											className="border-t border-slate-100 hover:bg-slate-50/80">
											<td className="px-4 py-3">
												<div className="flex flex-col">
													<span className="font-medium text-slate-900">
														{p.userName || p.userId}
													</span>
													<span className="text-xs text-slate-500">
														User ID: {p.userId}
													</span>
												</div>
											</td>

											<td className="px-4 py-3">
												<div className="flex flex-col">
													<span className="text-sm text-slate-800">
														{p.parentName || "-"}
													</span>
													{p.parentId && (
														<span className="text-xs text-slate-500">
															Parent ID: {p.parentId}
														</span>
													)}
												</div>
											</td>

											<td className="px-4 py-3">
												<span className="text-sm text-slate-800">
													{p.typeName}
												</span>
											</td>

											<td className="px-4 py-3">
												<span className="text-sm font-medium text-slate-900">
													{fmtAmountFromPaise(p.requestedAmountPaise)}
												</span>
											</td>

											<td className="px-4 py-3">
												<span className="text-sm text-slate-900">
													{fmtAmountFromPaise(p.approvedAmountPaise)}
												</span>
											</td>

											<td className="px-4 py-3">
												<span
													className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
														p.status === "PAID"
															? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
															: p.status === "APPROVED"
																? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
																: p.status === "REJECTED"
																	? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
																	: "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
													}`}>
													{p.status}
												</span>
											</td>

											<td className="px-4 py-3 text-sm text-slate-700">
												{fmtDate(p.createdAt)}
											</td>

											<td className="px-4 py-3 text-sm text-slate-700">
												{fmtDate(p.paymentDate)}
											</td>

											<td className="px-4 py-3 text-right text-xs">
												<Link
													href={`/super-admin/payouts/${p.id}`}
													className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
													View
												</Link>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-600">
						<div>
							Page {page} of {totalPages}
						</div>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page <= 1}
								className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
								Prev
							</button>
							<button
								type="button"
								onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
								disabled={page >= totalPages}
								className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
								Next
							</button>
						</div>
					</div>
				</div>

				{error && <p className="text-sm text-rose-600">{error}</p>}
			</div>
		</div>
	);
}
