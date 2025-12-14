"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

type EnrollResponse = {
	message?: string;
	insuranceRecordId?: string;
	enrolledCount?: number;
	requestedCount?: number;
	missingVrkpIds?: string[];
	data?: any;
};

function parseIds(input: string) {
	// supports newline, comma, space
	const raw = input
		.split(/[\n, ]+/g)
		.map((s) => s.trim())
		.filter(Boolean);

	// dedupe while preserving order
	const seen = new Set<string>();
	const unique: string[] = [];
	for (const id of raw) {
		if (!seen.has(id)) {
			seen.add(id);
			unique.push(id);
		}
	}
	return unique;
}

const MakeBatch = ({ id }: { id: string }) => {
	const [idsText, setIdsText] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const [result, setResult] = useState<EnrollResponse | null>(null);

	const userIds = useMemo(() => parseIds(idsText), [idsText]);
	const canSubmit = useMemo(() => {
		return id.trim().length > 0 && userIds.length > 0 && !submitting;
	}, [id, userIds.length, submitting]);
	const handleSubmit = async () => {
		if (!id.trim()) {
			toast.error("Insurance Record ID is required");
			return;
		}
		if (userIds.length === 0) {
			toast.error("Please paste at least one VRKP ID");
			return;
		}

		try {
			setSubmitting(true);
			setResult(null);

			const res = await fetch("/api/super-admin/insurance/generate-batch", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					insuranceRecordId: id.trim(),
					userVrkpIds: userIds, // these are vrKpId values
				}),
			});

			const json = (await res
				.json()
				.catch(() => null)) as EnrollResponse | null;

			if (!res.ok) {
				throw new Error(
					json?.message || (json as any)?.error || "Failed to enroll users"
				);
			}

			setResult(json ?? {});
			toast.success(
				`Enrolled ${json?.enrolledCount ?? 0} / ${json?.requestedCount ?? userIds.length}`
			);
		} catch (err: any) {
			console.error(err);
			toast.error(err?.message ?? "Something went wrong");
		} finally {
			setSubmitting(false);
		}
	};

	const handleClear = () => {
		setIdsText("");
		setResult(null);
		toast.info("Cleared");
	};

	return (
		<div className="max-w-4xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
			{/* Header */}
			<div>
				<h1 className="text-xl font-semibold text-slate-900">
					Manual Insurance Batch Enrollment
				</h1>
				<p className="mt-1 text-sm text-slate-500">
					Paste VRKP IDs and enroll them into a specific insurance record.
				</p>
			</div>

			{/* Form */}
			<div className="grid gap-4">
				<div>
					<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
						Insurance Record ID *
					</label>
					<input
						value={id}
						disabled
						placeholder="clfh9r8i30000l6mk3v6j3qzv"
						className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
					/>
					<p className="mt-1 text-xs text-slate-500">
						This is your InsuranceRecord ID (UUID/cuid).
					</p>
				</div>

				<div>
					<label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
						VRKP Member IDs *
					</label>

					<textarea
						value={idsText}
						onChange={(e) => setIdsText(e.target.value)}
						rows={8}
						placeholder={`Paste VRKP IDs here\nExample:\nVRKP-00123\nVRKP-00999\nVRKP-01000`}
						className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
					/>

					<div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
						<span className="rounded-full bg-slate-100 px-3 py-1">
							Parsed: <b className="text-slate-900">{userIds.length}</b>
						</span>
						<span className="text-slate-500">
							Splits by newline / comma / spaces, and auto-dedupes.
						</span>
					</div>
				</div>

				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
					<button
						type="button"
						onClick={handleClear}
						disabled={submitting}
						className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">
						Clear
					</button>

					<button
						type="button"
						onClick={handleSubmit}
						disabled={!canSubmit}
						className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
						{submitting ? "Enrolling..." : "Enroll Users"}
					</button>
				</div>
			</div>

			{/* Result */}
			{result && (
				<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
					<h2 className="text-sm font-semibold text-slate-900">Result</h2>

					<div className="mt-2 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
						<div className="rounded-lg bg-white p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
								Requested
							</p>
							<p className="mt-1 text-lg font-semibold text-slate-900">
								{result.requestedCount ?? userIds.length}
							</p>
						</div>
						<div className="rounded-lg bg-white p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
								Enrolled
							</p>
							<p className="mt-1 text-lg font-semibold text-emerald-700">
								{result.enrolledCount ?? 0}
							</p>
						</div>
						<div className="rounded-lg bg-white p-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
								Missing IDs
							</p>
							<p className="mt-1 text-lg font-semibold text-rose-700">
								{result.missingVrkpIds?.length ?? 0}
							</p>
						</div>
					</div>

					{result.missingVrkpIds?.length ? (
						<div className="mt-3">
							<p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
								Not found (missing VRKP IDs)
							</p>
							<div className="mt-2 max-h-44 overflow-auto rounded-lg border border-slate-200 bg-white p-3">
								<ul className="space-y-1 text-sm text-slate-700">
									{result.missingVrkpIds.map((id) => (
										<li key={id} className="font-mono text-xs">
											{id}
										</li>
									))}
								</ul>
							</div>
						</div>
					) : null}
				</div>
			)}
		</div>
	);
};

export default MakeBatch;
