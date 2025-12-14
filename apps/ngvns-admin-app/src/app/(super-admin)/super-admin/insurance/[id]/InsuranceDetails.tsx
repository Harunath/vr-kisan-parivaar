"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type InsuranceBatchStatus = "DRAFT" | "ACTIVE" | "EXPIRED" | "CANCELLED";

type InsuranceRecord = {
	id: string;
	name: string;
	policyNumber: string | null;
	insurerName: string | null;
	activationDate: string | null;
	expiryDate: string | null;
	status: InsuranceBatchStatus;
	batchDocumentUrl: string | null;
	policyDocumentUrl: string | null;
	otherDocumentUrls: string[];
	createdAt: string;
	updatedAt: string;
	_count: {
		enrollments: number;
	};
};

type Props = {
	id: string;
};

function toDateInputValue(iso: string | null) {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	// yyyy-mm-dd
	return d.toISOString().slice(0, 10);
}

export default function InsuranceDetails({ id }: Props) {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [editMode, setEditMode] = useState(false);

	const [record, setRecord] = useState<InsuranceRecord | null>(null);

	// editable form state
	const [form, setForm] = useState({
		name: "",
		policyNumber: "",
		insurerName: "",
		activationDate: "",
		expiryDate: "",
		status: "DRAFT" as InsuranceBatchStatus,
		batchDocumentUrl: "",
		policyDocumentUrl: "",
		otherDocumentUrlsText: "", // textarea (one per line)
		_count: {
			enrollments: 0,
		},
	});

	const endpoint = useMemo(() => `/api/super-admin/insurance/${id}`, [id]);

	const load = async () => {
		try {
			setLoading(true);
			const res = await fetch(endpoint, { method: "GET" });
			if (!res.ok) {
				const j = await res.json().catch(() => null);
				throw new Error(j?.error || `Failed to fetch (${res.status})`);
			}
			const j = await res.json();
			const r: InsuranceRecord = j.data;

			setRecord(r);
			setForm({
				name: r.name ?? "",
				policyNumber: r.policyNumber ?? "",
				insurerName: r.insurerName ?? "",
				activationDate: toDateInputValue(r.activationDate),
				expiryDate: toDateInputValue(r.expiryDate),
				status: r.status,
				batchDocumentUrl: r.batchDocumentUrl ?? "",
				policyDocumentUrl: r.policyDocumentUrl ?? "",
				otherDocumentUrlsText: (r.otherDocumentUrls ?? []).join("\n"),
				_count: {
					enrollments: r._count.enrollments,
				},
			});
		} catch (e: any) {
			console.error(e);
			toast.error(e?.message ?? "Failed to load insurance");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const setField = (key: keyof typeof form, value: any) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const parseOtherDocs = () => {
		return form.otherDocumentUrlsText
			.split("\n")
			.map((s) => s.trim())
			.filter(Boolean);
	};

	const handleCancel = () => {
		if (!record) return;
		setEditMode(false);
		setForm({
			name: record.name ?? "",
			policyNumber: record.policyNumber ?? "",
			insurerName: record.insurerName ?? "",
			activationDate: toDateInputValue(record.activationDate),
			expiryDate: toDateInputValue(record.expiryDate),
			status: record.status,
			batchDocumentUrl: record.batchDocumentUrl ?? "",
			policyDocumentUrl: record.policyDocumentUrl ?? "",
			otherDocumentUrlsText: (record.otherDocumentUrls ?? []).join("\n"),
			_count: {
				enrollments: record._count.enrollments,
			},
		});
		toast.info("Changes discarded");
	};

	const handleSave = async () => {
		if (!record) return;

		// build PATCH payload ONLY for changed fields
		const otherDocs = parseOtherDocs();

		const payload: Record<string, any> = {};

		if (form.name !== (record.name ?? ""))
			payload.name = form.name.trim() || null;
		if (form.policyNumber !== (record.policyNumber ?? ""))
			payload.policyNumber = form.policyNumber.trim() || null;
		if (form.insurerName !== (record.insurerName ?? ""))
			payload.insurerName = form.insurerName.trim() || null;

		const activationIso = form.activationDate
			? new Date(form.activationDate).toISOString()
			: null;
		const expiryIso = form.expiryDate
			? new Date(form.expiryDate).toISOString()
			: null;

		if (toDateInputValue(record.activationDate) !== form.activationDate)
			payload.activationDate = activationIso;
		if (toDateInputValue(record.expiryDate) !== form.expiryDate)
			payload.expiryDate = expiryIso;

		if (form.status !== record.status) payload.status = form.status;

		if (form.batchDocumentUrl !== (record.batchDocumentUrl ?? "")) {
			payload.batchDocumentUrl = form.batchDocumentUrl.trim() || null;
		}
		if (form.policyDocumentUrl !== (record.policyDocumentUrl ?? "")) {
			payload.policyDocumentUrl = form.policyDocumentUrl.trim() || null;
		}

		const prevOther = (record.otherDocumentUrls ?? []).join("\n");
		const nextOther = otherDocs.join("\n");
		if (prevOther !== nextOther) payload.otherDocumentUrls = otherDocs;

		if (Object.keys(payload).length === 0) {
			toast.info("No changes to save");
			setEditMode(false);
			return;
		}

		try {
			setSaving(true);
			const res = await fetch(endpoint, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const j = await res.json().catch(() => null);
				throw new Error(j?.error || `Update failed (${res.status})`);
			}

			const j = await res.json();
			const updated: InsuranceRecord = j.data;

			setRecord(updated);
			setEditMode(false);

			// refresh form from updated data
			setForm({
				name: updated.name ?? "",
				policyNumber: updated.policyNumber ?? "",
				insurerName: updated.insurerName ?? "",
				activationDate: toDateInputValue(updated.activationDate),
				expiryDate: toDateInputValue(updated.expiryDate),
				status: updated.status,
				batchDocumentUrl: updated.batchDocumentUrl ?? "",
				policyDocumentUrl: updated.policyDocumentUrl ?? "",
				otherDocumentUrlsText: (updated.otherDocumentUrls ?? []).join("\n"),
				_count: {
					enrollments: updated._count.enrollments,
				},
			});

			toast.success("Insurance record updated");
		} catch (e: any) {
			console.error(e);
			toast.error(e?.message ?? "Failed to update insurance");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="rounded-2xl border border-slate-200 bg-white p-6">
				<p className="text-sm text-slate-600">Loading...</p>
			</div>
		);
	}

	if (!record) {
		return (
			<div className="rounded-2xl border border-slate-200 bg-white p-6">
				<p className="text-sm text-rose-600">Insurance record not found.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 p-2 bg-neutral-100 rounded">
			{/* Header */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-xl font-semibold text-slate-900">
						{record.name}
					</h1>
					<p className="mt-1 text-sm text-slate-500">
						ID: <span className="font-mono text-[0.8rem]">{record.id}</span>
					</p>
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => setEditMode((v) => !v)}
						disabled={saving}
						className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-60">
						{editMode ? "View mode" : "Edit mode"}
					</button>

					{editMode && (
						<>
							<button
								type="button"
								onClick={handleCancel}
								disabled={saving}
								className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">
								Cancel
							</button>

							<button
								type="button"
								onClick={handleSave}
								disabled={saving}
								className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70">
								{saving ? "Saving..." : "Save"}
							</button>
						</>
					)}
				</div>
			</div>

			{/* Card */}
			<div className="rounded-2xl border border-slate-200 bg-white p-6">
				<div className="grid gap-4 sm:grid-cols-2">
					<Field
						label="Name"
						value={form.name}
						readOnly={!editMode}
						onChange={(v) => setField("name", v)}
						placeholder="ULHC Batch Dec 2025"
					/>

					<Field
						label="Status"
						value={form.status}
						readOnly={!editMode}
						asSelect
						options={["DRAFT", "ACTIVE", "EXPIRED", "CANCELLED"]}
						onChange={(v) => setField("status", v as InsuranceBatchStatus)}
					/>

					<Field
						label="Policy Number"
						value={form.policyNumber}
						readOnly={!editMode}
						onChange={(v) => setField("policyNumber", v)}
						placeholder="NIC/ULHC/DEC-2025/001"
					/>

					<Field
						label="Insurer Name"
						value={form.insurerName}
						readOnly={!editMode}
						onChange={(v) => setField("insurerName", v)}
						placeholder="NIC / ULHC"
					/>

					<Field
						label="Activation Date"
						value={form.activationDate}
						readOnly={!editMode}
						type="date"
						onChange={(v) => setField("activationDate", v)}
					/>

					<Field
						label="Expiry Date"
						value={form.expiryDate}
						readOnly={!editMode}
						type="date"
						onChange={(v) => setField("expiryDate", v)}
					/>

					<Field
						label="Batch Document URL"
						value={form.batchDocumentUrl}
						readOnly={!editMode}
						onChange={(v) => setField("batchDocumentUrl", v)}
						placeholder="https://..."
					/>

					<Field
						label="Policy Document URL"
						value={form.policyDocumentUrl}
						readOnly={!editMode}
						onChange={(v) => setField("policyDocumentUrl", v)}
						placeholder="https://..."
					/>
					<Field
						label="Enrollments _Count"
						value={form._count.enrollments.toString()}
						readOnly={!editMode}
						onChange={(v) =>
							setForm((prev) => ({
								...prev,
								_count: {
									...prev._count,
									enrollments: parseInt(v) || 0,
								},
							}))
						}
						placeholder="0"
					/>
				</div>

				<div className="mt-5">
					<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
						Other Document URLs (one per line)
					</label>

					{editMode ? (
						<textarea
							value={form.otherDocumentUrlsText}
							onChange={(e) =>
								setField("otherDocumentUrlsText", e.target.value)
							}
							rows={5}
							className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
							placeholder="https://.../annexure-a.pdf"
						/>
					) : (
						<div className="mt-2 space-y-2">
							{record.otherDocumentUrls?.length ? (
								record.otherDocumentUrls.map((url) => (
									<a
										key={url}
										href={url}
										target="_blank"
										rel="noreferrer"
										className="block truncate text-sm text-emerald-700 underline underline-offset-2 hover:text-emerald-800">
										{url}
									</a>
								))
							) : (
								<p className="text-sm text-slate-500">—</p>
							)}
						</div>
					)}
				</div>

				<div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
					<div className="flex flex-wrap gap-x-6 gap-y-1">
						<span>
							Created:{" "}
							<span className="text-slate-700">
								{new Date(record.createdAt).toLocaleString("en-IN")}
							</span>
						</span>
						<span>
							Updated:{" "}
							<span className="text-slate-700">
								{new Date(record.updatedAt).toLocaleString("en-IN")}
							</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

/** Small reusable field component (no libs) */
function Field(props: {
	label: string;
	value: string;
	readOnly: boolean;
	onChange?: (v: string) => void;
	placeholder?: string;
	type?: "text" | "date";
	asSelect?: boolean;
	options?: string[];
}) {
	const {
		label,
		value,
		readOnly,
		onChange,
		placeholder,
		type,
		asSelect,
		options,
	} = props;

	return (
		<div>
			<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
				{label}
			</label>

			{asSelect ? (
				readOnly ? (
					<div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
						{value || "—"}
					</div>
				) : (
					<select
						value={value}
						onChange={(e) => onChange?.(e.target.value)}
						className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
						{(options ?? []).map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
					</select>
				)
			) : readOnly ? (
				<div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
					{value
						? type === "date"
							? // input date value is yyyy-mm-dd
								new Date(value).toLocaleDateString("en-IN", {
									year: "numeric",
									month: "short",
									day: "2-digit",
								})
							: value
						: "—"}
				</div>
			) : (
				<input
					type={type ?? "text"}
					value={value}
					onChange={(e) => onChange?.(e.target.value)}
					placeholder={placeholder}
					className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
				/>
			)}
		</div>
	);
}
