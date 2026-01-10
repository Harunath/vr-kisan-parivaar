"use client";

import { useEffect, useState } from "react";
import { FaRegBell, FaTimes, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

function TricolorLoader() {
	return (
		<div className="flex justify-center py-3">
			<div className="h-10 w-10 animate-spin rounded-full border-4 border-transparent border-t-[#FF9933] border-r-white border-b-[#138808]" />
		</div>
	);
}

export default function UserNotifications({ userId }: { userId: string }) {
	const router = useRouter();
	const [notifications, setNotifications] = useState<
		{ message: string; actionNeeded: boolean }[]
	>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!userId) return;

		async function fetchUser() {
			try {
				const res = await fetch(`/api/user/${userId}/benefits-check`);
				const json = await res.json();

				if (!json.success) {
					setLoading(false);
					return;
				}

				const data = json.data;
				const notes: { message: string; actionNeeded: boolean }[] = [];

				// Health Card Check
				if (!data.healthCard || data.healthCard === false) {
					notes.push({
						message: "Your Health Card is not activated.",
						actionNeeded: true,
					});
				}

				// Land Allotments Check
				// if (!data.landAllotments || data.landAllotments.length === 0) {
				// 	notes.push({
				// 		message: "No Land Allotment found.",
				// 		actionNeeded: true,
				// 	});
				// }

				// VRKP Card Check (correct property name)
				if (!data.VRKP_Card || !data.VRKP_Card.cardNumber) {
					notes.push({
						message: "Your VRKP Card is not activated.",
						actionNeeded: true,
					});
				}

				setNotifications(notes);
			} catch (err) {
				console.error("NOTIFICATION_ERROR:", err);
			} finally {
				setLoading(false);
			}
		}

		fetchUser();
	}, [userId]);

	// Dismiss Notification
	function handleDismiss(index: number) {
		setNotifications((prev) => prev.filter((_, i) => i !== index));
	}

	// Loader UI
	if (loading)
		return (
			<div className="mt-8 rounded-xl border border-neutral-200 bg-white/70 p-4 shadow-sm">
				<div className="flex items-center justify-between gap-3">
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700">
							Pending Actions
						</h3>
						<p className="text-xs text-neutral-500">
							Checking your VRKP membership benefits…
						</p>
					</div>
					<div className="hidden h-1 w-24 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] md:block" />
				</div>
				<TricolorLoader />
			</div>
		);

	// If no pending notifications → nothing to show
	if (notifications.length === 0) return null;

	// Notifications Box
	return (
		<div className="mt-8 rounded-xl border border-neutral-200 bg-white/80 p-5 shadow-sm">
			<div className="mb-4 flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
						<FaRegBell className="text-sm text-orange-500" />
					</span>
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-800">
							Pending Actions
						</h3>
						<p className="text-xs text-neutral-500">
							Complete these to unlock full benefits of your membership.
						</p>
					</div>
				</div>

				<div className="hidden h-1 w-28 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] md:block" />
			</div>

			{/* Notification List */}
			<div className="space-y-3">
				{notifications.map((note, i) => (
					<div
						key={i}
						className="group flex items-start gap-3 rounded-lg border border-orange-100 bg-orange-50/80 p-3.5 transition-all duration-200 hover:border-orange-200 hover:bg-orange-50 hover:shadow-sm">
						{/* Left Bar */}
						<div className="mt-0.5 h-8 w-1 rounded-full bg-gradient-to-b from-[#FF9933] to-[#138808]" />

						{/* Body */}
						<div className="flex-1">
							<p className="text-sm font-medium text-orange-900 leading-relaxed">
								{note.message}
							</p>
							<p className="mt-1 text-xs text-orange-700/80">
								Action required from your side.
							</p>

							<button
								onClick={() => router.push("/my-docs")}
								className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-[#000080] hover:text-[#0000c0] transition-colors">
								Complete Now <FaArrowRight className="text-[10px]" />
							</button>
						</div>

						{/* Close Button */}
						<button
							type="button"
							onClick={() => handleDismiss(i)}
							className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-xs text-orange-400 transition-all duration-150 hover:border-orange-200 hover:bg-white hover:text-orange-600">
							<FaTimes />
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
