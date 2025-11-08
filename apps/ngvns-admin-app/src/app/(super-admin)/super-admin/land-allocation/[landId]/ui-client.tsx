"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

type StateLite = { id: string; name: string; code: string };

type Parcel = {
	id: string;
	stateId: string;
	title: string;
	surveyNumber: string;
	areaSqYards: number;
	addressLine: string | null;
	latitude: number | null;
	longitude: number | null;
	unitsTotal: number;
	unitsAvailable: number;
	createdAt: string;
	updatedAt: string;
	state?: StateLite;
};

export default function LandAllocationEditor({ landId }: { landId: string }) {
	const router = useRouter();
	const [loading, setLoading] = React.useState(true);
	const [saving, setSaving] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [parcel, setParcel] = React.useState<Parcel | null>(null);

	// Local form state
	const [form, setForm] = React.useState({
		title: "",
		surveyNumber: "",
		areaSqYards: "",
		addressLine: "",
		latitude: "",
		longitude: "",
		unitsTotal: "",
		unitsAvailable: "",
	});

	const base = typeof window !== "undefined" ? window.location.origin : "";

	React.useEffect(() => {
		const ac = new AbortController();

		async function run() {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch(
					`${base}/api/super-admin/land-allocation/${landId}`,
					{
						method: "GET",
						cache: "no-store",
						signal: ac.signal,
					}
				);
				if (!res.ok) throw new Error(`Load failed (${res.status})`);
				const json = (await res.json()) as { item: Parcel };
				setParcel(json.item);
				setForm({
					title: json.item.title ?? "",
					surveyNumber: json.item.surveyNumber ?? "",
					areaSqYards: String(json.item.areaSqYards ?? ""),
					addressLine: json.item.addressLine ?? "",
					latitude:
						json.item.latitude != null ? json.item.latitude.toString() : "",
					longitude:
						json.item.longitude != null ? json.item.longitude.toString() : "",
					unitsTotal: String(json.item.unitsTotal ?? ""),
					unitsAvailable: String(json.item.unitsAvailable ?? ""),
				});
			} catch (e: any) {
				if (e.name !== "AbortError") setError(e.message || "Failed to load");
			} finally {
				setLoading(false);
			}
		}
		run();

		return () => ac.abort();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [landId]);

	const onChange =
		(key: keyof typeof form) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setForm((s) => ({ ...s, [key]: e.target.value }));
		};

	const pct = React.useMemo(() => {
		const ua = Number(form.unitsAvailable || 0);
		const ut = Number(form.unitsTotal || 0);
		if (ut <= 0) return 0;
		return Math.max(0, Math.min(100, Math.round((ua / ut) * 100)));
	}, [form.unitsAvailable, form.unitsTotal]);

	const fmtDate = (iso?: string) => {
		if (!iso) return "-";
		const d = new Date(iso);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
			d.getDate()
		).padStart(2, "0")}`;
	};

	const handleSave = async () => {
		setSaving(true);
		setError(null);
		try {
			const payload = {
				title: form.title.trim(),
				surveyNumber: form.surveyNumber.trim(),
				areaSqYards: Number(form.areaSqYards),
				addressLine: form.addressLine?.trim() || null,
				latitude: form.latitude
					? Number(Number(form.latitude).toFixed(6))
					: null,
				longitude: form.longitude
					? Number(Number(form.longitude).toFixed(6))
					: null,
				unitsTotal: Number(form.unitsTotal),
				unitsAvailable: Number(form.unitsAvailable),
			};

			const res = await fetch(
				`${base}/api/super-admin/land-allocation/${landId}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}
			);
			if (!res.ok) {
				const j = await res.json().catch(() => null);
				toast.error(j?.message || `Save failed (${res.status})`);
				return;
			}
			toast.success("Changes saved");
			// refetch to refresh timestamps/derived values
			router.refresh();
		} catch (e: any) {
			setError(e.message || "Save failed");
		} finally {
			setSaving(false);
		}
	};

	return (
		<section className="relative mx-auto w-full max-w-5xl px-4 py-6">
			<div className="mb-6 flex items-start justify-between gap-3">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-neutral-900">
						Land Parcel
					</h1>
					<p className="mt-1 text-sm text-neutral-500">
						{parcel ? `#${parcel.id.slice(0, 8)}` : "—"}
					</p>
				</div>
				<div className="flex gap-2">
					<Link
						href="/super-admin/land-allocation"
						className="rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50">
						← Back to list
					</Link>
					<button
						onClick={handleSave}
						disabled={saving || loading}
						className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70">
						{saving ? "Saving…" : "Save Changes"}
					</button>
				</div>
			</div>

			{/* Loading Overlay */}
			<AnimatePresence>
				{loading && (
					<motion.div
						key="overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-white/70 backdrop-blur-sm">
						<div className="flex h-full items-center justify-center">
							<motion.div
								initial={{ scale: 0.95, opacity: 0.6 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									repeat: Infinity,
									duration: 1.2,
									ease: "easeInOut",
									repeatType: "mirror",
								}}
								className="flex flex-col items-center">
								<div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900" />
								<p className="mt-3 text-sm text-neutral-600">Loading parcel…</p>
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{error && (
				<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			)}

			{/* Card */}
			<motion.div
				initial={{ opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.18 }}
				className="rounded-2xl border border-neutral-200 bg-white p-6">
				{/* Top meta */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<Field label="State">
						<div className="text-sm">
							{parcel?.state ? (
								<>
									<span className="font-medium">{parcel.state.name}</span>{" "}
									<span className="text-neutral-500">
										({parcel.state.code})
									</span>
								</>
							) : (
								<span className="text-neutral-500">—</span>
							)}
						</div>
					</Field>

					<Field label="Created">
						<div className="text-sm">{fmtDate(parcel?.createdAt)}</div>
					</Field>

					<Field label="Updated">
						<div className="text-sm">{fmtDate(parcel?.updatedAt)}</div>
					</Field>
				</div>

				<div className="my-6 h-px bg-neutral-100" />

				{/* Editable form */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Input
						label="Title"
						value={form.title}
						onChange={onChange("title")}
						placeholder="VR Agri Farm - Phase 1"
					/>
					<Input
						label="Survey Number"
						value={form.surveyNumber}
						onChange={onChange("surveyNumber")}
						placeholder="123/AA"
					/>

					<Input
						label="Area (Sq. Yards)"
						value={form.areaSqYards}
						onChange={onChange("areaSqYards")}
						type="number"
						inputMode="numeric"
						placeholder="120000"
					/>

					<Input
						label="Address"
						value={form.addressLine}
						onChange={onChange("addressLine")}
						placeholder="Village / Mandal, District, PIN"
					/>

					<Input
						label="Latitude (°)"
						value={form.latitude}
						onChange={onChange("latitude")}
						inputMode="decimal"
						placeholder="17.385044"
					/>

					<Input
						label="Longitude (°)"
						value={form.longitude}
						onChange={onChange("longitude")}
						inputMode="decimal"
						placeholder="78.486671"
					/>

					<Input
						label="Units (Total)"
						value={form.unitsTotal}
						onChange={onChange("unitsTotal")}
						type="number"
						inputMode="numeric"
						placeholder="1000"
					/>

					<Input
						label="Units (Available)"
						value={form.unitsAvailable}
						onChange={onChange("unitsAvailable")}
						type="number"
						inputMode="numeric"
						placeholder="1000"
					/>
				</div>

				{/* Availability bar */}
				<div className="mt-6">
					<div className="mb-1 flex items-center justify-between text-xs text-neutral-600">
						<span>Availability</span>
						<span>{pct}%</span>
					</div>
					<div className="h-2 w-full rounded-full bg-neutral-100">
						<div
							className="h-2 rounded-full bg-neutral-900"
							style={{ width: `${pct}%` }}
						/>
					</div>
				</div>
			</motion.div>
		</section>
	);
}

function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
				{label}
			</div>
			{children}
		</div>
	);
}

function Input(
	props: React.InputHTMLAttributes<HTMLInputElement> & {
		label: string;
	}
) {
	const { label, ...rest } = props;
	return (
		<label className="block">
			<div className="mb-1 text-sm font-medium text-neutral-700">{label}</div>
			<input
				{...rest}
				className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-400"
			/>
		</label>
	);
}
