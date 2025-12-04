"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const CreatePayoutType: React.FC = () => {
	const [form, setForm] = useState({
		name: "",
		description: "",
		defaultAmountRupees: "",
		isActive: true,
	});

	const [saving, setSaving] = useState(false);

	function handleChange<K extends keyof typeof form>(
		field: K,
		value: (typeof form)[K]
	) {
		setForm((prev) => ({ ...prev, [field]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!form.name.trim()) {
			return toast.error("Name is required");
		}

		let defaultAmountRupees = form.defaultAmountRupees.trim();
		let defaultAmountPaise: string | null = null;

		if (defaultAmountRupees) {
			const num = Number(defaultAmountRupees);
			if (Number.isNaN(num) || num < 0) {
				return toast.error(
					"Default amount must be a valid non-negative number"
				);
			}
			const paise = num;
			defaultAmountPaise = String(paise);
		}

		try {
			setSaving(true);

			const res = await fetch("/api/super-admin/payouts/userPayoutType", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: form.name.trim(),
					description: form.description.trim() || null,
					isActive: form.isActive,
					defaultAmountPaise,
				}),
			});

			const json = await res.json().catch(() => ({}));

			if (!res.ok || !json.ok) {
				throw new Error(json.error || "Failed to create payout type");
			}

			toast.success("Payout type created successfully");

			// Reset form
			setForm({
				name: "",
				description: "",
				defaultAmountRupees: "",
				isActive: true,
			});
		} catch (err: any) {
			console.error(err);
			toast.error(err.message || "Failed to create payout type");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
			{/* If you already have a global ToastContainer, remove this one */}

			<div className="mx-auto max-w-3xl">
				{/* Page header */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					className="mb-6 flex flex-col gap-2">
					<h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
						Create Payout Type
					</h1>
					<p className="text-sm text-slate-500">
						Define new payout categories used for automated and manual payouts
						in VRKP.
					</p>
				</motion.div>

				{/* Card */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
					className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
					{/* Tricolor accent */}
					<div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

					<div className="p-4 sm:p-6">
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Status */}
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
								<p className="text-[11px] text-slate-500">
									New payout type for referrals, commissions, incentives, etc.
								</p>
							</div>

							{/* Name */}
							<div className="space-y-1.5">
								<label className="block text-sm font-medium text-slate-800">
									Payout Type Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
									placeholder="e.g., Referral Bonus, Land Commission"
									value={form.name}
									onChange={(e) => handleChange("name", e.target.value)}
								/>
								<p className="text-xs text-slate-500">
									This will be shown across ledgers, payout summary, and
									reports.
								</p>
							</div>

							{/* Default amount + Active toggle */}
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
										Optional. Used as the default when generating payouts. You
										can override per transaction.
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
												? "This payout type will be available for use"
												: "Keep it disabled for now"}
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
										You can toggle this later from the edit screen.
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
									placeholder="Internal notes about when this payout is used, calculation logic, conditions, etc."
									value={form.description}
									onChange={(e) => handleChange("description", e.target.value)}
								/>
							</div>

							{/* Actions */}
							<div className="flex items-center justify-end gap-3 pt-2">
								<button
									type="button"
									onClick={() =>
										setForm({
											name: "",
											description: "",
											defaultAmountRupees: "",
											isActive: true,
										})
									}
									className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
									disabled={saving}>
									Clear
								</button>

								<motion.button
									whileTap={{ scale: 0.97 }}
									type="submit"
									disabled={saving}
									className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
									{saving && (
										<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
									)}
									<span>{saving ? "Creating..." : "Create Payout Type"}</span>
								</motion.button>
							</div>
						</form>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default CreatePayoutType;
