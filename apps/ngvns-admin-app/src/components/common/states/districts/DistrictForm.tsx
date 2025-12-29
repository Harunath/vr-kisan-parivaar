"use client";

import React, { useEffect, useMemo, useState } from "react";
import type {
	DistrictCreateInput,
	DistrictRow,
	DistrictUpdateInput,
} from "../../../../lib/districts/types";

type Mode = "create" | "view";

type Props = {
	mode: Mode;
	initial?: Partial<DistrictRow>;
	onSubmit?: (
		payload: DistrictCreateInput | DistrictUpdateInput
	) => Promise<any>;
	close?: () => void;
	closeOnSuccess?: boolean; // default false for view/edit
};

export default function DistrictForm({
	mode,
	initial,
	onSubmit,
	close,
	closeOnSuccess = false,
}: Props) {
	const [innerMode, setInnerMode] = useState<"create" | "view" | "edit">(
		mode === "create" ? "create" : "view"
	);

	const [base, setBase] = useState<Partial<DistrictRow>>(initial ?? {});

	const [name, setName] = useState(base?.name ?? "");
	const [code, setCode] = useState(base?.code ?? "");
	const [isActive, setIsActive] = useState<boolean>(base?.isActive ?? true);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	useEffect(() => {
		if (mode === "create") return;
		const nextBase = initial ?? {};
		setBase(nextBase);
		setName(nextBase.name ?? "");
		setCode(nextBase.code ?? "");
		setIsActive(nextBase.isActive ?? true);
		setInnerMode("view");
		setError(null);
		setSuccess(null);
	}, [initial, mode]);

	const isCreate = innerMode === "create";
	const isView = innerMode === "view";
	const isEdit = innerMode === "edit";
	const disabled = isView || loading;

	const dirty = useMemo(() => {
		const bName = (base?.name ?? "").trim();
		const bCode = (base?.code ?? "").trim();
		const bActive = base?.isActive ?? true;
		return (
			name.trim() !== bName || code.trim() !== bCode || isActive !== bActive
		);
	}, [name, code, isActive, base]);

	const canSubmit = useMemo(() => {
		if (loading) return false;
		if (isView) return false;
		if (isCreate) return name.trim().length > 0 && code.trim().length > 0;
		if (isEdit) return dirty;
		return false;
	}, [loading, isView, isCreate, isEdit, name, code, dirty]);

	function resetToBase() {
		setName(base?.name ?? "");
		setCode(base?.code ?? "");
		setIsActive(base?.isActive ?? true);
		setError(null);
		setSuccess(null);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setSuccess(null);

		if (!onSubmit) {
			setError("onSubmit not provided");
			return;
		}

		try {
			setLoading(true);

			if (isCreate) {
				const payload: DistrictCreateInput = {
					name: name.trim(),
					code: code.trim(),
					isActive,
				};
				const created = await onSubmit(payload);
				setSuccess("District created");
				setName("");
				setCode("");
				setIsActive(true);
				if (closeOnSuccess) close?.();
				return;
			}

			const payload: DistrictUpdateInput = {};
			if (name.trim() !== (base?.name ?? "").trim()) payload.name = name.trim();
			if (code.trim() !== (base?.code ?? "").trim()) payload.code = code.trim();
			if (isActive !== (base?.isActive ?? true)) payload.isActive = isActive;

			if (Object.keys(payload).length === 0) {
				setSuccess("No changes to save");
				return;
			}

			const updated = await onSubmit(payload);

			const nextBase: Partial<DistrictRow> = {
				...base,
				...(updated ?? {}),
				name: (updated?.name ?? name).trim(),
				code: (updated?.code ?? code).trim(),
				isActive: updated?.isActive ?? isActive,
			};

			setBase(nextBase);
			setName(nextBase.name ?? "");
			setCode(nextBase.code ?? "");
			setIsActive(nextBase.isActive ?? true);

			setSuccess("District updated");
			setInnerMode("view");
			if (closeOnSuccess) close?.();
		} catch (err: any) {
			setError(err?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="text-lg font-bold tracking-tight text-[#0B1220]">
						{isCreate
							? "Create District"
							: isEdit
								? "Edit District"
								: "View District"}
					</h3>
					<p className="text-sm text-black/60">
						{isCreate
							? "Add a new district to this state."
							: isEdit
								? "Make changes and save."
								: "Read-only details."}
					</p>
				</div>

				<div className="flex items-center gap-2">
					{mode !== "create" && isView ? (
						<button
							type="button"
							onClick={() => {
								setInnerMode("edit");
								setError(null);
								setSuccess(null);
							}}
							className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700">
							Edit
						</button>
					) : null}

					{mode !== "create" && isEdit ? (
						<button
							type="button"
							onClick={() => {
								resetToBase();
								setInnerMode("view");
							}}
							className="rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold hover:bg-black/5">
							Cancel Edit
						</button>
					) : null}

					{close ? (
						<button
							type="button"
							onClick={close}
							className="rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold hover:bg-black/5">
							Close
						</button>
					) : null}
				</div>
			</div>

			<div className="mt-4 grid gap-4 sm:grid-cols-2">
				<div>
					<label className="text-sm font-medium text-black/80">
						District Name
					</label>
					<input
						value={name}
						disabled={disabled}
						onChange={(e) => setName(e.target.value)}
						className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-green-600 disabled:bg-black/[0.03] disabled:text-black/60"
					/>
				</div>

				<div>
					<label className="text-sm font-medium text-black/80">
						District Code
					</label>
					<input
						value={code}
						disabled={disabled}
						onChange={(e) => setCode(e.target.value.toUpperCase())}
						className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-green-600 disabled:bg-black/[0.03] disabled:text-black/60"
					/>
				</div>

				<div className="sm:col-span-2 flex items-center gap-3">
					<input
						id="isActive"
						type="checkbox"
						checked={isActive}
						disabled={disabled}
						onChange={(e) => setIsActive(e.target.checked)}
						className="h-4 w-4 accent-green-600 disabled:opacity-60"
					/>
					<label
						htmlFor="isActive"
						className="text-sm font-medium text-black/80">
						Active
					</label>

					{isView ? (
						<span className="ml-auto rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-xs font-semibold text-black/70">
							Read only
						</span>
					) : isEdit && !dirty ? (
						<span className="ml-auto text-xs text-black/50">No changes</span>
					) : null}
				</div>
			</div>

			{error ? (
				<div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					{error}
				</div>
			) : null}

			{success ? (
				<div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
					{success}
				</div>
			) : null}

			{!isView ? (
				<div className="mt-5 flex items-center gap-3">
					<button
						type="submit"
						disabled={!canSubmit}
						className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
						{loading ? "Saving..." : isCreate ? "Create" : "Save Changes"}
					</button>
				</div>
			) : null}
		</form>
	);
}
