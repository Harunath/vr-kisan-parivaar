"use client";

import { useEffect, useMemo, useState } from "react";

type ProfileDTO = {
	user: {
		id: string;
		fullname: string;
		phone: string;
		email: string;
		vrKpId: string;
		relationType: string;
		relationName: string;
		gender: string;
		// userPhoto: string; // remote URL in DB
		healthCard: boolean;
		createdAt: string;
		updatedAt: string;
	};
	version: number; // updatedAt.getTime()
};

const LS_KEY = "vrkp:profile";
const PHOTO_CACHE_NAME = "vrkp-profile-cache";
const PHOTO_CACHE_KEY = "/local/profile-photo";
const PHOTO_VERSION_KEY = "vrkp:profile-photo-version";

// 🇮🇳 Flag palette
const SAFFRON = "#FF9933";
const GREEN = "#138808";
const CHAKRA = "#0A3A8E";

export default function ProfileClient() {
	const [data, setData] = useState<ProfileDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const [blobUrl, setBlobUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			const cached = localStorage.getItem(LS_KEY);
			if (cached) setData(JSON.parse(cached));
		} catch {}
		setLoading(false);
	}, []);

	useEffect(() => {
		if (data) return;
		(async () => {
			try {
				const res = await fetch("/api/user/me", { cache: "no-store" });
				if (!res.ok) throw new Error(await res.text());
				const fresh: ProfileDTO = await res.json();
				localStorage.setItem(LS_KEY, JSON.stringify(fresh));
				setData(fresh);
			} catch (e: any) {
				setError(e?.message || "Failed to load.");
			}
		})();
	}, [data]);

	// useEffect(() => {
	// 	let revoke: string | null = null;
	// 	(async () => {
	// 		if (!data?.user?.userPhoto) return;
	// 		const wantVersion = String(data.version);
	// 		const haveVersion = localStorage.getItem(PHOTO_VERSION_KEY);
	// 		const hasCacheAPI = typeof window !== "undefined" && "caches" in window;
	// 		if (!hasCacheAPI) {
	// 			setBlobUrl(`${data.user.userPhoto}?v=${data.version}`);
	// 			return;
	// 		}
	// 		const cache = await caches.open(PHOTO_CACHE_NAME);
	// 		if (haveVersion === wantVersion) {
	// 			const match = await cache.match(PHOTO_CACHE_KEY);
	// 			if (match) {
	// 				const blob = await match.blob();
	// 				const url = URL.createObjectURL(blob);
	// 				setBlobUrl(url);
	// 				revoke = url;
	// 				return;
	// 			}
	// 		}
	// 		try {
	// 			const imgRes = await fetch(`${data.user.userPhoto}?v=${data.version}`, {
	// 				cache: "no-store",
	// 			});
	// 			if (!imgRes.ok) throw new Error("Image fetch failed");
	// 			const imgBlob = await imgRes.blob();
	// 			const storedRes = new Response(imgBlob, {
	// 				headers: { "Content-Type": imgBlob.type || "image/*" },
	// 			});
	// 			await cache.put(PHOTO_CACHE_KEY, storedRes);
	// 			localStorage.setItem(PHOTO_VERSION_KEY, wantVersion);
	// 			const url = URL.createObjectURL(imgBlob);
	// 			setBlobUrl(url);
	// 			revoke = url;
	// 		} catch {
	// 			setBlobUrl(`${data.user.userPhoto}?v=${data.version}`);
	// 		}
	// 	})();
	// 	return () => {
	// 		if (revoke) URL.revokeObjectURL(revoke);
	// 	};
	// }, [data?.user?.userPhoto, data?.version]);

	const user = data?.user;
	const since = useMemo(
		() => (user ? new Date(user.createdAt).toLocaleDateString() : ""),
		[user]
	);

	if (!user && loading) {
		return (
			<div className="mx-auto max-w-5xl p-4">
				<div className="animate-pulse space-y-4">
					<div className="h-28 rounded-2xl bg-gray-100" />
					<div className="grid gap-4 md:grid-cols-3">
						<div className="h-32 rounded-2xl bg-gray-100" />
						<div className="h-32 rounded-2xl bg-gray-100" />
						<div className="h-32 rounded-2xl bg-gray-100" />
					</div>
				</div>
			</div>
		);
	}

	if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
	if (!user) return null;

	return (
		<div className="mx-auto max-w-5xl p-4 md:p-8">
			{/* Header with tricolour border + Chakra watermark */}
			<section
				className="relative rounded-3xl p-[1px]"
				style={{
					background: `linear-gradient(135deg, ${SAFFRON}, white 35%, ${GREEN})`,
				}}>
				<div className="relative overflow-hidden rounded-[calc(theme(borderRadius.3xl)-1px)] bg-white">
					{/* watermark */}
					<svg
						className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-10"
						viewBox="0 0 100 100"
						aria-hidden>
						<g fill="none" stroke={CHAKRA} strokeWidth="2">
							<circle cx="50" cy="50" r="30" />
							{[...Array(24)].map((_, i) => {
								const angle = (i * 15 * Math.PI) / 180;
								const x = 50 + 30 * Math.cos(angle);
								const y = 50 + 30 * Math.sin(angle);
								return <line key={i} x1="50" y1="50" x2={x} y2={y} />;
							})}
						</g>
					</svg>

					<div className="relative flex flex-col items-center gap-6 p-6 md:flex-row md:items-center md:gap-8 md:p-8">
						{/* <div
							className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-white p-[2px]"
							style={{
								background: `linear-gradient(180deg, ${SAFFRON}, ${GREEN})`,
							}}>
							<div className="h-full w-full overflow-hidden rounded-xl bg-gray-100">
								{blobUrl ? (
									<img
										src={blobUrl}
										alt={user.fullname}
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="h-full w-full animate-pulse bg-gray-200" />
								)}
							</div>
						</div> */}

						<div className="min-w-0 flex-1">
							<h1
								className="truncate text-2xl font-semibold tracking-tight"
								style={{ color: "#111827" }}>
								{user.fullname}
							</h1>

							<p className="mt-1 text-sm">
								<span
									className="rounded-md px-2 py-0.5 font-medium"
									style={{ backgroundColor: "#FFF5EC", color: "#7A3E00" }}>
									{user.relationType}
								</span>{" "}
								•{" "}
								<span
									className="rounded-md px-2 py-0.5 font-medium"
									style={{ backgroundColor: "#ECF9EF", color: "#0B5E2B" }}>
									{user.relationName}
								</span>
							</p>

							<div className="mt-3 flex flex-wrap gap-2 text-sm">
								<FlagPill label="Gender" value={user.gender} />
								<FlagPill label="Phone" value={user.phone} />
								<FlagPill label="VRKP ID" value={user.vrKpId} />
								<FlagPill label="Member Since" value={since} />
							</div>
						</div>
					</div>

					{/* thin tricolour divider */}
					<div
						className="h-[3px] w-full"
						style={{
							background: `linear-gradient(90deg, ${SAFFRON}, white, ${GREEN})`,
						}}
					/>
				</div>
			</section>

			{/* Quick details cards with gradient top bars */}
			<section className="mt-6 grid gap-4 md:grid-cols-3">
				<TriCard title="Email" value={user.email} />
				<TriCard title="Phone" value={user.phone} />
				<TriCard
					title="Health Care Services"
					value={user.healthCard ? "Active" : "Inactive"}
					strong
				/>
			</section>
		</div>
	);
}

/* ---------- Small UI helpers (no libs) ---------- */

function FlagPill({
	label,
	value,
	color,
}: {
	label: string;
	value: string;
	color?: string;
}) {
	const SAFFRON = "#FF9933";
	const GREEN = "#138808";
	const base = "inline-flex items-center gap-1 rounded-full border px-3 py-1";
	return (
		<span
			className={base}
			style={{
				borderColor: color ?? "#E5E7EB",
				background: color
					? `linear-gradient(180deg, ${color}1A, white)`
					: "linear-gradient(180deg, #F9FAFB, white)",
			}}>
			<span className="text-xs text-gray-600">{label}:</span>
			<span
				className="text-sm font-medium"
				style={{ color: color ?? "#111827" }}>
				{value}
			</span>
			{/* tiny tri-dot accent */}
			<span className="ml-1 inline-flex">
				<i
					className="mr-[2px] inline-block h-1 w-1 rounded-full"
					style={{ backgroundColor: SAFFRON }}
				/>
				<i className="mr-[2px] inline-block h-1 w-1 rounded-full bg-white" />
				<i
					className="inline-block h-1 w-1 rounded-full"
					style={{ backgroundColor: GREEN }}
				/>
			</span>
		</span>
	);
}

function TriCard({
	title,
	value,
	strong = false,
}: {
	title: string;
	value: string;
	strong?: boolean;
}) {
	const SAFFRON = "#FF9933";
	const GREEN = "#138808";
	const CHAKRA = "#0A3A8E";

	return (
		<div className="rounded-2xl border bg-white">
			<div
				className="h-1.5 w-full rounded-t-2xl"
				style={{
					background: `linear-gradient(90deg, ${SAFFRON}, ${CHAKRA}, ${GREEN})`,
				}}
			/>
			<div className="p-5">
				<div className="text-xs uppercase tracking-wide text-gray-500">
					{title}
				</div>
				<div
					className={`truncate ${strong ? "text-lg font-semibold" : "text-base font-medium"}`}
					style={{ color: "#0f172a" }}>
					{value}
				</div>
			</div>
		</div>
	);
}
