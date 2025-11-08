"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type ParcelItem = {
	id: string;
	title: string;
	surveyNumber: string;
	areaSqYards: number;
	unitsTotal: number;
	unitsAvailable: number;
	createdAt: string;
	state: { id: string; name: string; code: string };
};

type ListResponse = {
	page: number;
	limit: number;
	total: number;
	items: ParcelItem[];
};

function fmtDateIST(date: string) {
	const d = new Date(date);
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

function percent(a: number, b: number) {
	if (b <= 0) return 0;
	return Math.max(0, Math.min(100, Math.round((a / b) * 100)));
}

function buildBaseUrl() {
	// Works on client; falls back to relative if origin unavailable
	if (typeof window !== "undefined") return window.location.origin;
	return process.env.NEXT_PUBLIC_BASE_URL ?? "";
}

async function fetchParcels(page: number, limit: number, signal?: AbortSignal) {
	const base = buildBaseUrl();
	const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
	const res = await fetch(
		`${base}/api/super-admin/land-allocation?${qs.toString()}`,
		{
			cache: "no-store",
			signal,
		}
	);
	if (!res.ok) throw new Error(`Failed to load parcels (${res.status})`);
	return (await res.json()) as ListResponse;
}

export default function LandParcelsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const page = Math.max(1, Number(searchParams.get("page") || 1));
	const limit = Math.min(
		100,
		Math.max(1, Number(searchParams.get("limit") || 20))
	);

	const [data, setData] = React.useState<ListResponse | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	// Fetch on mount & when page/limit changes
	React.useEffect(() => {
		const ac = new AbortController();
		setLoading(true);
		setError(null);

		fetchParcels(page, limit, ac.signal)
			.then((json) => setData(json))
			.catch((e) => {
				if (e.name !== "AbortError") setError(e.message || "Failed to fetch");
			})
			.finally(() => setLoading(false));

		return () => ac.abort();
	}, [page, limit]);

	const totalPages = React.useMemo(
		() => Math.max(1, Math.ceil((data?.total || 0) / (data?.limit || limit))),
		[data, limit]
	);

	const goTo = (nextPage: number, nextLimit = limit) => {
		const qs = new URLSearchParams(searchParams.toString());
		qs.set("page", String(Math.max(1, nextPage)));
		qs.set("limit", String(nextLimit));
		router.push(`/super-admin/land-allocation?${qs.toString()}`);
	};

	return (
		<section className="relative mx-auto w-full max-w-6xl px-4 py-6">
			{/* Top header */}
			<div className="mb-6 flex flex-wrap items-end justify-between gap-3">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-neutral-900">
						Land Parcels
					</h1>
					<p className="mt-1 text-sm text-neutral-500">
						{loading
							? "Loading..."
							: data
								? `Showing ${data.items.length} of ${data.total} result${data.total === 1 ? "" : "s"}`
								: "—"}
					</p>
				</div>

				<div className="flex items-center gap-2">
					{/* Page size select */}
					<label className="sr-only" htmlFor="limit">
						Page size
					</label>
					<select
						id="limit"
						value={limit}
						onChange={(e) => goTo(1, Number(e.target.value))}
						className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm">
						{[10, 20, 50, 100].map((n) => (
							<option key={n} value={n}>
								{n} / page
							</option>
						))}
					</select>

					<Link
						href="/super-admin/land-allocation/add-new"
						className="inline-flex items-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800">
						+ Add Land Parcel
					</Link>
				</div>
			</div>

			{/* Loading overlay for initial fetch */}
			<AnimatePresence>
				{loading && !data && (
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
								<p className="mt-3 text-sm text-neutral-600">
									Loading parcels…
								</p>
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Error */}
			{error && (
				<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			)}

			{/* Skeleton while reloading between pages (keep layout stable) */}
			<AnimatePresence mode="popLayout">
				{loading && data && (
					<motion.div
						key="skeleton"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}>
						<SkeletonTable />
						<div className="mt-3 md:hidden">
							<SkeletonCards />
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Content */}
			{!loading && data && (
				<motion.div
					key="content"
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.18 }}>
					{/* Table (desktop) */}
					<div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white md:block">
						<table className="w-full text-left text-sm">
							<thead className="bg-neutral-50 text-neutral-700">
								<tr className="border-b border-neutral-200">
									<th className="px-4 py-3 font-semibold">Title</th>
									<th className="px-4 py-3 font-semibold">State</th>
									<th className="px-4 py-3 font-semibold">Survey No.</th>
									<th className="px-4 py-3 font-semibold">Area (SqYds)</th>
									<th className="px-4 py-3 font-semibold">Units</th>
									<th className="px-4 py-3 font-semibold">Created</th>
									<th className="px-4 py-3"></th>
								</tr>
							</thead>
							<tbody>
								{data.items.length === 0 ? (
									<tr>
										<td
											colSpan={7}
											className="px-4 py-10 text-center text-neutral-500">
											No land parcels found.
										</td>
									</tr>
								) : (
									data.items.map((p) => {
										const pct = percent(p.unitsAvailable, p.unitsTotal);
										return (
											<tr key={p.id} className="border-b border-neutral-100">
												<td className="px-4 py-3">
													<div className="font-medium text-neutral-900">
														{p.title}
													</div>
													<div className="text-xs text-neutral-500">
														#{p.id.slice(0, 8)}
													</div>
												</td>
												<td className="px-4 py-3">
													<div className="font-medium">{p.state.name}</div>
													<div className="text-xs text-neutral-500">
														{p.state.code}
													</div>
												</td>
												<td className="px-4 py-3">{p.surveyNumber}</td>
												<td className="px-4 py-3">
													{p.areaSqYards.toLocaleString()}
												</td>
												<td className="px-4 py-3">
													<div className="flex items-center justify-between text-xs text-neutral-600">
														<span>Avail: {p.unitsAvailable}</span>
														<span>Total: {p.unitsTotal}</span>
													</div>
													<div className="mt-1 h-2 w-full rounded-full bg-neutral-100">
														<div
															className="h-2 rounded-full bg-neutral-900"
															style={{ width: `${pct}%` }}
															title={`${pct}%`}
														/>
													</div>
												</td>
												<td className="px-4 py-3">{fmtDateIST(p.createdAt)}</td>
												<td className="px-4 py-3">
													<div className="flex justify-end">
														<Link
															href={`/super-admin/land-allocation/${p.id}`}
															className="inline-flex items-center rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50">
															View
														</Link>
													</div>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>

					{/* Cards (mobile) */}
					<div className="grid gap-3 md:hidden">
						{data.items.length === 0 ? (
							<div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500">
								No land parcels found.
							</div>
						) : (
							data.items.map((p) => {
								const pct = percent(p.unitsAvailable, p.unitsTotal);
								return (
									<motion.div
										key={p.id}
										initial={{ opacity: 0, y: 6 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.2 }}
										className="rounded-2xl border border-neutral-200 bg-white p-4">
										<div className="flex items-start justify-between gap-3">
											<div>
												<div className="text-base font-semibold text-neutral-900">
													{p.title}
												</div>
												<div className="mt-0.5 text-xs text-neutral-500">
													{p.state.name} • {p.state.code}
												</div>
											</div>
											<Link
												href={`/super-admin/land-allocation/${p.id}`}
												className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50">
												View
											</Link>
										</div>

										<div className="mt-3 grid grid-cols-2 gap-3 text-sm">
											<div>
												<div className="text-neutral-500">Survey</div>
												<div className="font-medium">{p.surveyNumber}</div>
											</div>
											<div>
												<div className="text-neutral-500">Area (SqYds)</div>
												<div className="font-medium">
													{p.areaSqYards.toLocaleString()}
												</div>
											</div>
										</div>

										<div className="mt-3">
											<div className="flex items-center justify-between text-xs text-neutral-600">
												<span>Avail: {p.unitsAvailable}</span>
												<span>Total: {p.unitsTotal}</span>
											</div>
											<div className="mt-1 h-2 w-full rounded-full bg-neutral-100">
												<div
													className="h-2 rounded-full bg-neutral-900"
													style={{ width: `${pct}%` }}
												/>
											</div>
										</div>

										<div className="mt-3 text-xs text-neutral-500">
											Created: {fmtDateIST(p.createdAt)}
										</div>
									</motion.div>
								);
							})
						)}
					</div>

					{/* Pagination */}
					<div className="mt-6 flex items-center justify-between">
						<div className="text-sm text-neutral-500">
							Page{" "}
							<span className="font-medium text-neutral-800">{data.page}</span>{" "}
							of{" "}
							<span className="font-medium text-neutral-800">{totalPages}</span>
						</div>
						<div className="flex items-center gap-2">
							<PageLink onClick={() => goTo(1, limit)} disabled={page === 1}>
								« First
							</PageLink>
							<PageLink
								onClick={() => goTo(page - 1, limit)}
								disabled={page <= 1}>
								‹ Prev
							</PageLink>
							<PageLink
								onClick={() => goTo(page + 1, limit)}
								disabled={page >= totalPages}>
								Next ›
							</PageLink>
							<PageLink
								onClick={() => goTo(totalPages, limit)}
								disabled={page >= totalPages}>
								Last »
							</PageLink>
						</div>
					</div>
				</motion.div>
			)}
		</section>
	);
}

function PageLink({
	onClick,
	disabled,
	children,
}: {
	onClick: () => void;
	disabled?: boolean;
	children: React.ReactNode;
}) {
	if (disabled) {
		return (
			<span className="select-none rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-400">
				{children}
			</span>
		);
	}
	return (
		<button
			onClick={onClick}
			className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50">
			{children}
		</button>
	);
}

/** ---------- Skeletons ---------- */

function SkeletonTable() {
	return (
		<div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white md:block">
			<div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3">
				<div className="h-5 w-48 animate-pulse rounded bg-neutral-200" />
			</div>
			<div className="divide-y divide-neutral-100">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="grid grid-cols-7 gap-4 px-4 py-4">
						<div className="col-span-2 h-4 animate-pulse rounded bg-neutral-200" />
						<div className="h-4 animate-pulse rounded bg-neutral-200" />
						<div className="h-4 animate-pulse rounded bg-neutral-200" />
						<div className="h-4 animate-pulse rounded bg-neutral-200" />
						<div className="h-4 animate-pulse rounded bg-neutral-200" />
						<div className="h-8 animate-pulse rounded bg-neutral-200" />
					</div>
				))}
			</div>
		</div>
	);
}

function SkeletonCards() {
	return (
		<div className="grid gap-3">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="rounded-2xl border border-neutral-200 bg-white p-4">
					<div className="mb-2 h-4 w-40 animate-pulse rounded bg-neutral-200" />
					<div className="mb-2 h-3 w-28 animate-pulse rounded bg-neutral-200" />
					<div className="grid grid-cols-2 gap-3">
						<div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
						<div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
					</div>
					<div className="mt-3 h-2 w-full animate-pulse rounded bg-neutral-200" />
				</div>
			))}
		</div>
	);
}
