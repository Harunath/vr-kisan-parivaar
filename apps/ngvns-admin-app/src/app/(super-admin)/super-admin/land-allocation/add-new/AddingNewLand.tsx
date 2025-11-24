"use client";
import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

interface StateType {
	id: string;
	name: string;
	code: string | null;
}

const landParcelSchema = z.object({
	stateId: z.string().min(1, "Select a state"),
	title: z.string().min(3, "Title must be at least 3 chars"),
	surveyNumber: z.string().min(1, "Survey Number is required"),
	areaSqYards: z
		.string()
		.refine(
			(v) => /^\d+$/.test(v) && Number(v) > 0,
			"Enter a positive integer"
		),
	addressLine: z.string().optional(),
	latitude: z
		.string()
		.optional()
		.refine(
			(v) => !v || /^-?\d{1,3}(\.\d{1,6})?$/.test(v),
			"Max 6 decimals (e.g., 17.385044)"
		),
	longitude: z
		.string()
		.optional()
		.refine(
			(v) => !v || /^-?\d{1,3}(\.\d{1,6})?$/.test(v),
			"Max 6 decimals (e.g., 78.486671)"
		),
	unitsTotal: z
		.string()
		.refine(
			(v) => /^\d+$/.test(v) && Number(v) > 0,
			"Enter a positive integer"
		),
	unitsAvailable: z
		.string()
		.refine(
			(v) => /^\d+$/.test(v) && Number(v) >= 0,
			"Enter a non-negative integer"
		),
});

type LandParcelForm = z.infer<typeof landParcelSchema>;

export default function LandParcelCreateForm({
	states,
	onCreated,
}: {
	states: StateType[];
	onCreated?: (id: string) => void;
}) {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<LandParcelForm>({
		resolver: zodResolver(landParcelSchema),
		defaultValues: {
			stateId: "",
			title: "",
			surveyNumber: "",
			areaSqYards: "",
			addressLine: "",
			latitude: "",
			longitude: "",
			unitsTotal: "",
			unitsAvailable: "",
		},
	});

	// Auto-set unitsAvailable when unitsTotal changes (only if unitsAvailable empty)
	const unitsTotal = watch("unitsTotal");
	React.useEffect(() => {
		const ua = watch("unitsAvailable");
		if (!ua && unitsTotal) setValue("unitsAvailable", unitsTotal);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [unitsTotal]);

	const onLocate = () => {
		if (!navigator.geolocation) return;
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setValue("latitude", pos.coords.latitude.toFixed(6));
				setValue("longitude", pos.coords.longitude.toFixed(6));
			},
			(err) => {
				console.error("Geolocation error:", err);
				// Keep UI minimal — show inline error via console or add a small note if you prefer
			},
			{ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
		);
	};

	const onSubmit = async (data: LandParcelForm) => {
		const payload = {
			stateId: data.stateId,
			title: data.title.trim(),
			surveyNumber: data.surveyNumber.trim(),
			areaSqYards: Number(data.areaSqYards),
			addressLine: data.addressLine?.trim() || null,
			latitude: data.latitude ? Number(data.latitude) : null, // Prisma Decimal(9,6) compatible
			longitude: data.longitude ? Number(data.longitude) : null,
			unitsTotal: Number(data.unitsTotal),
			unitsAvailable: Number(data.unitsAvailable),
		};

		try {
			const res = await fetch("/api/super-admin/land-allocation", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				toast.error("Failed to create land parcel");
				const err = await res.json().catch(() => null);

				throw new Error(err?.message || "Failed to create land parcel");
			}
			const json = await res.json();
			toast.success("Land parcel created successfully");
			onCreated?.(json?.id);
			reset();
		} catch (e: any) {
			console.error(e);
		}
	};

	return (
		<motion.section
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			className="w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
			<header className="mb-6">
				<h2 className="text-2xl font-bold tracking-tight text-neutral-900">
					Add New Land Parcel
				</h2>
				<p className="mt-1 text-sm text-neutral-500">
					Fill the parcel details and submit to create a new record.
				</p>
			</header>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* State + Title */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label
							htmlFor="stateId"
							className="block text-sm font-medium text-neutral-700">
							State
						</label>
						<select
							id="stateId"
							{...register("stateId")}
							className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-neutral-400">
							<option value="">Select a state</option>
							{states.map((s) => (
								<option key={s.id} value={s.id}>
									{s.name} ({s.code})
								</option>
							))}
						</select>
						{errors.stateId && (
							<p className="mt-1 text-xs text-red-600">
								{errors.stateId.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-neutral-700">
							Title
						</label>
						<input
							id="title"
							type="text"
							placeholder="e.g., VR Agri Farm - Phase 1"
							{...register("title")}
							className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-400"
						/>
						{errors.title && (
							<p className="mt-1 text-xs text-red-600">
								{errors.title.message}
							</p>
						)}
					</div>
				</div>

				{/* Survey + Area */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label
							htmlFor="surveyNumber"
							className="block text-sm font-medium text-neutral-700">
							Survey Number
						</label>
						<input
							id="surveyNumber"
							type="text"
							placeholder="e.g., 123/AA"
							{...register("surveyNumber")}
							className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-400"
						/>
						{errors.surveyNumber && (
							<p className="mt-1 text-xs text-red-600">
								{errors.surveyNumber.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="areaSqYards"
							className="block text-sm font-medium text-neutral-700">
							Area (Sq. Yards)
						</label>
						<input
							id="areaSqYards"
							type="number"
							inputMode="numeric"
							placeholder="e.g., 120000"
							{...register("areaSqYards")}
							className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-400"
						/>
						{errors.areaSqYards && (
							<p className="mt-1 text-xs text-red-600">
								{errors.areaSqYards.message}
							</p>
						)}
					</div>
				</div>

				{/* Address */}
				<div>
					<label
						htmlFor="addressLine"
						className="block text-sm font-medium text-neutral-700">
						Address (optional)
					</label>
					<textarea
						id="addressLine"
						rows={3}
						placeholder="Village / Mandal, District, PIN"
						{...register("addressLine")}
						className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-400"
					/>
					{errors.addressLine && (
						<p className="mt-1 text-xs text-red-600">
							{errors.addressLine.message}
						</p>
					)}
				</div>

				{/* Lat / Lng */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<label
							htmlFor="latitude"
							className="block text-sm font-medium text-neutral-700">
							Latitude (°)
						</label>
						<input
							id="latitude"
							type="text"
							inputMode="decimal"
							placeholder="17.385044"
							{...register("latitude")}
							className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-400"
						/>
						{errors.latitude && (
							<p className="mt-1 text-xs text-red-600">
								{errors.latitude.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="longitude"
							className="block text-sm font-medium text-neutral-700">
							Longitude (°)
						</label>
						<input
							id="longitude"
							type="text"
							inputMode="decimal"
							placeholder="78.486671"
							{...register("longitude")}
							className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-400"
						/>
						{errors.longitude && (
							<p className="mt-1 text-xs text-red-600">
								{errors.longitude.message}
							</p>
						)}
					</div>

					<div className="flex items-end">
						<button
							type="button"
							onClick={onLocate}
							className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm font-medium hover:bg-neutral-100 active:scale-[0.99]">
							Use Current Location
						</button>
					</div>
				</div>

				{/* Units */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label
							htmlFor="unitsTotal"
							className="block text-sm font-medium text-neutral-700">
							Units (Total)
						</label>
						<input
							id="unitsTotal"
							type="number"
							inputMode="numeric"
							placeholder="e.g., 1000"
							{...register("unitsTotal")}
							className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-400"
						/>
						{errors.unitsTotal && (
							<p className="mt-1 text-xs text-red-600">
								{errors.unitsTotal.message}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor="unitsAvailable"
							className="block text-sm font-medium text-neutral-700">
							Units (Available)
						</label>
						<input
							id="unitsAvailable"
							type="number"
							inputMode="numeric"
							placeholder="e.g., 1000"
							{...register("unitsAvailable")}
							className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-400"
						/>
						{errors.unitsAvailable && (
							<p className="mt-1 text-xs text-red-600">
								{errors.unitsAvailable.message}
							</p>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-end gap-3">
					<button
						type="button"
						onClick={() => reset()}
						className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50 active:scale-[0.99]">
						Reset
					</button>
					<motion.button
						whileTap={{ scale: 0.98 }}
						disabled={isSubmitting}
						type="submit"
						className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70">
						{isSubmitting ? (
							<svg
								className="mr-2 h-4 w-4 animate-spin"
								viewBox="0 0 24 24"
								fill="none">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
								/>
							</svg>
						) : null}
						{isSubmitting ? "Creating..." : "Create Parcel"}
					</motion.button>
				</div>
			</form>
		</motion.section>
	);
}
