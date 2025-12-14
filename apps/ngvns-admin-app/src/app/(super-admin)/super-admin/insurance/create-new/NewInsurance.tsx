"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
type InsuranceBatchStatus = "DRAFT" | "ACTIVE" | "EXPIRED" | "CANCELLED";

const NewInsurance: React.FC = () => {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [form, setForm] = useState({
		name: "",
		policyNumber: "",
		insurerName: "",
		activationDate: "",
		expiryDate: "",
		status: "DRAFT" as InsuranceBatchStatus,
		batchDocumentUrl: "",
		policyDocumentUrl: "",
		otherDocumentUrls: [] as string[],
	});

	const updateField = (
		key: keyof typeof form,
		value: string | InsuranceBatchStatus
	) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!form.name.trim()) {
			setError("Insurance name is required");
			return;
		}

		setLoading(true);

		try {
			const payload = {
				name: form.name.trim(),
				policyNumber: form.policyNumber || undefined,
				insurerName: form.insurerName || undefined,
				activationDate: form.activationDate || undefined,
				expiryDate: form.expiryDate || undefined,
				status: form.status,
				batchDocumentUrl: form.batchDocumentUrl || undefined,
				policyDocumentUrl: form.policyDocumentUrl || undefined,
				otherDocumentUrls: form.otherDocumentUrls.filter(Boolean),
			};

			const res = await fetch("/api/super-admin/insurance/create-new", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const json = await res.json();
				toast.error(json?.error || "Failed to create insurance");
				throw new Error(json?.error || "Failed to create insurance");
			}

			const json = await res.json();
			toast.success("Insurance created successfully");
			// redirect to details page
			router.push(`/super-admin/insurance/${json.data.id}`);
		} catch (err: any) {
			console.error(err);
			setError(err.message ?? "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
			{/* Header */}
			<div>
				<h1 className="text-xl font-semibold text-slate-900">
					Create Insurance Record
				</h1>
				<p className="mt-1 text-sm text-slate-500">
					Create a new group insurance batch/policy.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Name */}
				<div>
					<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
						Insurance Name *
					</label>
					<input
						type="text"
						value={form.name}
						onChange={(e) => updateField("name", e.target.value)}
						className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
						placeholder="ULHC Batch Dec 2025"
					/>
				</div>

				{/* Policy & Insurer */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
							Policy Number
						</label>
						<input
							type="text"
							value={form.policyNumber}
							onChange={(e) => updateField("policyNumber", e.target.value)}
							className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
						/>
					</div>

					<div>
						<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
							Insurer Name
						</label>
						<input
							type="text"
							value={form.insurerName}
							onChange={(e) => updateField("insurerName", e.target.value)}
							className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
						/>
					</div>
				</div>

				{/* Dates */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
							Activation Date
						</label>
						<input
							type="date"
							value={form.activationDate}
							onChange={(e) => updateField("activationDate", e.target.value)}
							className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
						/>
					</div>

					<div>
						<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
							Expiry Date
						</label>
						<input
							type="date"
							value={form.expiryDate}
							onChange={(e) => updateField("expiryDate", e.target.value)}
							className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
						/>
					</div>
				</div>

				{/* Status */}
				<div>
					<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
						Status
					</label>
					<select
						value={form.status}
						onChange={(e) =>
							updateField("status", e.target.value as InsuranceBatchStatus)
						}
						className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
						<option value="DRAFT">Draft</option>
						<option value="ACTIVE">Active</option>
						<option value="EXPIRED">Expired</option>
						<option value="CANCELLED">Cancelled</option>
					</select>
				</div>

				{/* Documents */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
							Batch Document URL
						</label>
						<input
							type="url"
							value={form.batchDocumentUrl}
							onChange={(e) => updateField("batchDocumentUrl", e.target.value)}
							className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
						/>
					</div>

					<div>
						<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
							Policy Document URL
						</label>
						<input
							type="url"
							value={form.policyDocumentUrl}
							onChange={(e) => updateField("policyDocumentUrl", e.target.value)}
							className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
						/>
					</div>
				</div>

				{/* Submit */}
				<div className="flex items-center justify-end gap-3 pt-2">
					<button
						type="submit"
						disabled={loading}
						className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
						{loading ? "Creating..." : "Create Insurance"}
					</button>
				</div>
			</form>

			{error && <p className="text-sm text-rose-600">{error}</p>}
		</div>
	);
};

export default NewInsurance;
