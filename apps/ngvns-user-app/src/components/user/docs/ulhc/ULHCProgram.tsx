"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaHeartbeat } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";

const ULCHProgram = ({
	vrkpId,
	program,
}: {
	vrkpId: string;
	program: boolean;
}) => {
	const [loading, setLoading] = useState(false);
	const [activated, setActivated] = useState(program);

	const onActivate = async () => {
		if (!vrkpId) return;
		const res = await fetch("/api/user/integrations/ulhc/initiate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ vrkpId }),
		});
		const data = await res.json();
		if (!data?.ok) {
			toast.error("Failed to initiate ULHC activation. Please try again.");
			return;
		}

		toast.success("Redirecting to ULHC registration...");
		if (data.activated) {
			setActivated(true);
			toast.info("Your Unity Life Healthcare account is already activated.");
			return;
		}
		if (data?.registerUrl) window.location.href = data.registerUrl;
	};

	return (
		<>
			<article className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
				{/* Flag rail */}
				<div className="absolute inset-y-0 left-0 w-2">
					<div className="h-1/3 bg-[#FF9933]" />
					<div className="h-1/3 bg-white" />
					<div className="h-1/3 bg-[#138808]" />
				</div>

				{/* Faint Ashoka Chakra watermark */}

				<div className="pl-4 md:pl-5">
					<div className="flex items-start gap-4 p-6">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0faf9] ring-1 ring-[#045e5a]/20">
							<FaHeartbeat className="text-[#045e5a] text-3xl" />
						</div>
						<div className="flex-1">
							<div className="flex flex-wrap items-center gap-3">
								<h2 className="text-lg font-semibold text-gray-900">
									Unity Life Healthcare Program
								</h2>
							</div>

							{/* Placeholder preview area */}
							<div className="mt-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-4">
								<div
									className={
										`flex items-center gap-y-2 justify-between` +
										(program ? " flex-col" : "")
									}>
									<AnimatePresence initial={false} mode="wait">
										{activated && (
											<motion.div
												key="ulhc-activated"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												className="flex flex-col items-center gap-2">
												<p className="text-sm text-green-600 font-medium">
													Your Unity Life Healthcare account is activated!
												</p>
											</motion.div>
										)}
									</AnimatePresence>
									{!activated && (
										<p className="text-sm text-gray-500">
											Activate your Health Care Program.
										</p>
									)}
									{!activated && (
										<button
											onClick={onActivate}
											className="rounded-lg bg-gradient-to-r from-[#FF9933] via-[#0b5ba7] to-[#138808] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
											{loading
												? "Activating Health Program..."
												: "Activate Health Program"}
										</button>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Flag underline accent */}
					<div className="grid grid-cols-3">
						<div className="h-1 bg-[#FF9933]" />
						<div className="h-1 bg-[#0b5ba7]" />
						<div className="h-1 bg-[#138808]" />
					</div>
				</div>
			</article>
		</>
	);
};

export default ULCHProgram;
