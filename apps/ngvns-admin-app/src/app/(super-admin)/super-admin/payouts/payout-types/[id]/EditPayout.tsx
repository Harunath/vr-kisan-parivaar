"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

type PayoutType = {
	id: string;
	name: string;
	description: string | null;
	defaultAmountPaise: number | string | null;
	approvedAmountPaise: bigint | null;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
};

type EditPayoutProps = {
	id: string;
};

const EditPayout: React.FC<EditPayoutProps> = ({ id }) => {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [form, setForm] = useState({
		name: "",
		description: "",
		approvedAmountPaise: "",
		defaultAmountRupees: "",
		isActive: true,
	});

	const [meta, setMeta] = useState<{
		createdAt?: string;
		updatedAt?: string;
	}>({});

	useEffect(() => {
		if (!id) return;

		let cancelled = false;

		async function fetchPayout() {
			try {
				setLoading(true);
				setError(null);

				const res = await fetch(
					`/api/super-admin/payouts/userPayoutType/${id}`,
					{
						method: "GET",
					}
				);

				if (!res.ok) {
					const json = await res.json().catch(() => ({}));
					throw new Error(json?.error || "Failed to fetch payout type");
				}

				const json = await res.json();
				const payout: PayoutType = json.payoutType;

				if (cancelled) return;

				// Convert paise → rupees for UI
				let rupees = "";
				if (
					payout.defaultAmountPaise !== null &&
					payout.defaultAmountPaise !== undefined
				) {
					const paiseNum = Number(payout.defaultAmountPaise);
					if (!Number.isNaN(paiseNum)) {
						rupees = paiseNum.toString();
					}
				}

				setForm({
					name: payout.name ?? "",
					description: payout.description ?? "",
					defaultAmountRupees: rupees,
					approvedAmountPaise: payout.approvedAmountPaise
						? payout.approvedAmountPaise.toString()
						: "",
					isActive: payout.isActive,
				});

				setMeta({
					createdAt: payout.createdAt,
					updatedAt: payout.updatedAt,
				});
			} catch (err: any) {
				console.error(err);
				if (!cancelled) {
					setError(err.message || "Failed to load payout type");
					toast.error(err.message || "Failed to load payout type");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		fetchPayout();

		return () => {
			cancelled = true;
		};
	}, [id]);

	function handleChange<K extends keyof typeof form>(
		field: K,
		value: (typeof form)[K]
	) {
		setForm((prev) => ({ ...prev, [field]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!id) {
			toast.error("Missing payout type ID");
			return;
		}

		if (!form.name.trim()) {
			toast.error("Name is required");
			return;
		}

		let defaultAmountRupees = form.defaultAmountRupees.trim();
		let defaultAmountPaise: string | null = null;
		let approvedAmountPaise = form.approvedAmountPaise.trim();

		if (defaultAmountRupees) {
			const num = Number(defaultAmountRupees);
			if (Number.isNaN(num) || num < 0) {
				toast.error("Default amount must be a valid non-negative number");
				return;
			}
			const paise = Math.round(num);
			defaultAmountPaise = String(paise);
		}

		try {
			setSaving(true);
			setError(null);

			const res = await fetch(`/api/super-admin/payouts/userPayoutType/${id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
					name: form.name.trim(),
					description: form.description.trim() || null,
					isActive: form.isActive,
					defaultAmountPaise: defaultAmountPaise,
					approvedAmountPaise: approvedAmountPaise,
				}),
			});

			const json = await res.json().catch(() => ({}));

			if (!res.ok || !json.ok) {
				throw new Error(json.error || "Failed to save payout type");
			}

			const updated: PayoutType = json.payoutType;

			// sync meta + form
			setMeta({
				createdAt: updated.createdAt,
				updatedAt: updated.updatedAt,
			});

			toast.success("Payout type updated successfully");
		} catch (err: any) {
			console.error(err);
			setError(err.message || "Failed to save payout type");
			toast.error(err.message || "Failed to save payout type");
		} finally {
			setSaving(false);
		}
	}

	const formattedCreatedAt = meta.createdAt
		? new Date(meta.createdAt).toLocaleString("en-IN", {
				timeZone: "Asia/Kolkata",
			})
		: null;
	const formattedUpdatedAt = meta.updatedAt
		? new Date(meta.updatedAt).toLocaleString("en-IN", {
				timeZone: "Asia/Kolkata",
			})
		: null;

	return (
		<div className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl">
				{/* Page header */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
							Edit Payout Type
						</h1>
						<p className="mt-1 text-sm text-slate-500">
							Update the configuration used for automated payouts in VRKP.
						</p>
					</div>

					{Boolean(id) && (
						<div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
							<span className="h-2 w-2 rounded-full bg-emerald-500" />
							ID: <span className="font-mono text-[11px]">{id}</span>
						</div>
					)}
				</motion.div>

				{/* Error banner */}
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
						{error}
					</motion.div>
				)}

				{/* Card */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
					className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
					{/* Subtle accent */}
					<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

					<div className="p-4 sm:p-6">
						{loading ? (
							<div className="space-y-4">
								<div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
								<div className="h-10 w-full animate-pulse rounded bg-slate-100" />
								<div className="h-10 w-full animate-pulse rounded bg-slate-100" />
								<div className="h-24 w-full animate-pulse rounded bg-slate-100" />
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Status + meta */}
								<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
									<div className="flex items-center gap-2">
										<span className="text-xs font-medium uppercase tracking-wide text-slate-500">
											Status
										</span>
										<span
											className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
												form.isActive
													? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
													: "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
											}`}>
											<span
												className={`h-1.5 w-1.5 rounded-full ${
													form.isActive ? "bg-emerald-500" : "bg-slate-400"
												}`}
											/>
											{form.isActive ? "Active" : "Inactive"}
										</span>
									</div>

									<div className="flex flex-col items-end gap-1 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:gap-3">
										{formattedCreatedAt && (
											<span>Created: {formattedCreatedAt}</span>
										)}
										{formattedUpdatedAt && (
											<span>Last Updated: {formattedUpdatedAt}</span>
										)}
									</div>
								</div>

								{/* Name */}
								<div className="space-y-1.5">
									<label className="block text-sm font-medium text-slate-800">
										Payout Type Name <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
										placeholder="e.g., Referral Bonus, Land Allocation Commission"
										value={form.name}
										onChange={(e) => handleChange("name", e.target.value)}
									/>
									<p className="text-xs text-slate-500">
										This name will appear in ledgers, payout batches, and admin
										reports.
									</p>
								</div>

								{/* Default amount & Active toggle */}
								<div className="grid gap-4 sm:grid-cols-[2fr,1fr]">
									<div className="space-y-1.5">
										<label className="block text-sm font-medium text-slate-800">
											Default Amount (₹)
										</label>
										<div className="relative">
											<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
												₹
											</span>
											<input
												type="number"
												step="0.01"
												min="0"
												className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-7 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
												placeholder="e.g., 500.00"
												value={form.defaultAmountRupees}
												onChange={(e) =>
													handleChange("defaultAmountRupees", e.target.value)
												}
											/>
										</div>
										<p className="text-xs text-slate-500">
											This is the default payout amount used when generating
											payout entries. You can still override it at transaction
											level.
										</p>
									</div>

									<div className="space-y-1.5">
										<span className="block text-sm font-medium text-slate-800">
											Active
										</span>
										<button
											type="button"
											onClick={() => handleChange("isActive", !form.isActive)}
											className={`flex h-[42px] w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
												form.isActive
													? "border-emerald-200 bg-emerald-50 text-emerald-800"
													: "border-slate-200 bg-slate-50 text-slate-700"
											}`}>
											<span>
												{form.isActive
													? "This payout type can be used in system"
													: "Disabled for new payouts"}
											</span>
											<span
												className={`inline-flex h-5 w-9 items-center rounded-full p-[2px] transition ${
													form.isActive ? "bg-emerald-500" : "bg-slate-400"
												}`}>
												<span
													className={`h-4 w-4 rounded-full bg-white shadow transition ${
														form.isActive ? "translate-x-4" : "translate-x-0"
													}`}
												/>
											</span>
										</button>
										<p className="text-xs text-slate-500">
											Inactive payout types will not be available for new
											allocations but existing records stay intact.
										</p>
									</div>
								</div>
								{/* Approved amount & Active toggle */}
								<div className="grid gap-4 sm:grid-cols-[2fr,1fr]">
									<div className="space-y-1.5">
										<label className="block text-sm font-medium text-slate-800">
											Approved Amount (₹)
										</label>
										<div className="relative">
											<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
												₹
											</span>
											<input
												type="number"
												step="0.01"
												min="0"
												className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-7 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
												placeholder="e.g., 500.00"
												value={form.approvedAmountPaise}
												onChange={(e) =>
													handleChange("approvedAmountPaise", e.target.value)
												}
											/>
										</div>
										<p className="text-xs text-slate-500">
											This is the default payout amount used when generating
											payout entries. You can still override it at transaction
											level.
										</p>
									</div>

									<div className="space-y-1.5">
										<span className="block text-sm font-medium text-slate-800">
											Active
										</span>
										<button
											type="button"
											onClick={() => handleChange("isActive", !form.isActive)}
											className={`flex h-[42px] w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
												form.isActive
													? "border-emerald-200 bg-emerald-50 text-emerald-800"
													: "border-slate-200 bg-slate-50 text-slate-700"
											}`}>
											<span>
												{form.isActive
													? "This payout type can be used in system"
													: "Disabled for new payouts"}
											</span>
											<span
												className={`inline-flex h-5 w-9 items-center rounded-full p-[2px] transition ${
													form.isActive ? "bg-emerald-500" : "bg-slate-400"
												}`}>
												<span
													className={`h-4 w-4 rounded-full bg-white shadow transition ${
														form.isActive ? "translate-x-4" : "translate-x-0"
													}`}
												/>
											</span>
										</button>
										<p className="text-xs text-slate-500">
											Inactive payout types will not be available for new
											allocations but existing records stay intact.
										</p>
									</div>
								</div>

								{/* Description */}
								<div className="space-y-1.5">
									<label className="block text-sm font-medium text-slate-800">
										Description
									</label>
									<textarea
										rows={4}
										className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
										placeholder="Internal notes about when this payout is used, calculation logic, etc."
										value={form.description}
										onChange={(e) =>
											handleChange("description", e.target.value)
										}
									/>
								</div>

								{/* Actions */}
								<div className="flex items-center justify-end gap-3 pt-2">
									<button
										type="button"
										onClick={() => {
											// Quick reset = refetch
											setLoading(true);
											setError(null);
											// trigger effect by changing id? easier: just reload
											window.location.reload();
										}}
										className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
										disabled={saving}>
										Reset
									</button>
									<motion.button
										whileTap={{ scale: 0.97 }}
										type="submit"
										disabled={saving}
										className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
										{saving && (
											<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
										)}
										<span>{saving ? "Saving..." : "Save Changes"}</span>
									</motion.button>
								</div>
							</form>
						)}
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default EditPayout;
