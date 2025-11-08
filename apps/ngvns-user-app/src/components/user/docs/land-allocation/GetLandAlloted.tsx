"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaLandmark } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";

const GetLandAlloted = ({
	landDetails,
}: {
	landDetails: {
		id: string;
		referenceNo: string;
		status: string;
		unit: {
			unitNumber: number;
			landParcel: {
				title: string;
				surveyNumber: string;
				addressLine: string | null;
			};
		};
	} | null;
}) => {
	const [loading, setLoading] = useState(false);
	const [view, setView] = useState(false);

	const router = useRouter();
	const handleSubmit = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/user/land-allocation", {
				method: "POST",
			});
			if (!response.ok) {
				toast.error("Failed to allocate land");
			}
			const data = await response.json();

			toast.success("Land allocation requested successfully");
			router.refresh();
		} catch (error) {
			console.error("Error allocating land:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<article
				key="land-allocation"
				className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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
							<FaLandmark className="text-[#045e5a] text-3xl" />
						</div>
						<div className="flex-1">
							<div className="flex flex-wrap items-center gap-3">
								<h2 className="text-lg font-semibold text-gray-900">
									VRKP Land Allotment
								</h2>
							</div>

							{/* Placeholder preview area */}
							<div className="mt-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-4">
								<div
									className={
										`flex items-center gap-y-2 justify-between` +
										(landDetails ? " flex-col" : "")
									}>
									<AnimatePresence initial={false} mode="wait">
										{landDetails &&
											(view ? (
												<motion.div
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													transition={{ duration: 0.3 }}
													exit={{ opacity: 0, scale: 0.8 }}>
													<div className="">
														<div className="">
															<h2 className="mb-4 text-2xl font-semibold text-[#045e5a]">
																Land Details
															</h2>
															<p className="mb-2">
																<span className="font-medium">Unit no:</span>{" "}
																{landDetails.unit.unitNumber}
															</p>
															<p className="mb-2">
																<span className="font-medium">Status:</span>{" "}
																{landDetails.status}
															</p>
															<p className="mb-2">
																<span className="font-medium">
																	Survey Number:
																</span>{" "}
																{landDetails.unit.landParcel.surveyNumber}
															</p>
															<p className="mb-2">
																<span className="font-medium">Address:</span>{" "}
																{landDetails.unit.landParcel.addressLine}
															</p>
														</div>
													</div>
												</motion.div>
											) : (
												<>
													<motion.p className="text-sm text-gray-500">
														View your Land Details by clicking on view{" "}
													</motion.p>
												</>
											))}
									</AnimatePresence>
									{!landDetails && (
										<p className="text-sm text-gray-500">
											Get your VRKP Land Allotment here.
										</p>
									)}
									{landDetails ? (
										<div className="flex gap-4 mt-4">
											<button
												onClick={() => setView((prev) => !prev)}
												className="rounded-lg bg-gradient-to-r from-[#FF9933] via-[#0b5ba7] to-[#138808] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
												{view ? "Hide Details" : "View Details"}
											</button>
										</div>
									) : (
										<button
											onClick={handleSubmit}
											className="rounded-lg bg-gradient-to-r from-[#FF9933] via-[#0b5ba7] to-[#138808] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
											{loading
												? "Issuing Land Allotment..."
												: "Get Land Allotment"}
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

export default GetLandAlloted;
