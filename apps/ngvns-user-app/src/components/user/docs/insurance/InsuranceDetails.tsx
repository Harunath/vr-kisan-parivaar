"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaFileAlt, FaLeaf } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";

const InsuranceDetails = ({
	insuranceName,
	activationDate,
	expirationDate,
	status,
	link,
}: {
	insuranceName: string | undefined;
	activationDate: string | undefined;
	expirationDate: string | undefined;
	status: string | undefined;
	link: string | undefined;
}) => {
	const [view, setView] = useState(false);

	return (
		<>
			<article
				key={link}
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
							<FaFileAlt className="text-[#045e5a] text-3xl" />
						</div>
						<div className="flex-1">
							<div className="flex flex-wrap items-center gap-3">
								<h2 className="text-lg font-semibold text-gray-900">
									Insurance Details
								</h2>
							</div>

							{/* Placeholder preview area */}
							<div className="mt-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-4">
								<div
									className={
										`flex items-center gap-y-2 justify-between` +
										(link ? " flex-col" : "")
									}>
									<AnimatePresence initial={false} mode="wait">
										{link &&
											(view ? (
												<motion.div
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													transition={{ duration: 0.3 }}
													exit={{ opacity: 0, scale: 0.8 }}>
													<div className="space-y-2">
														<p>
															<span className="font-medium">
																Insurance Name:
															</span>{" "}
															{insuranceName}
														</p>
														<p>
															<span className="font-medium">
																Activation Date:
															</span>{" "}
															{activationDate}
														</p>
														<p>
															<span className="font-medium">
																Expiration Date:
															</span>{" "}
															{expirationDate}
														</p>
														<p>
															<span className="font-medium">Status:</span>{" "}
															{status}
														</p>
													</div>
												</motion.div>
											) : (
												<>
													<p className="text-sm text-gray-500">
														View your details by clicking on view{" "}
													</p>
												</>
											))}
									</AnimatePresence>
									{!link && (
										<p className="text-sm text-gray-500">
											Your Accidental insurance will be added in the next cycle.
										</p>
									)}
									{link && (
										<div className="flex gap-4 mt-4">
											<button
												onClick={() => setView((prev) => !prev)}
												className="rounded-lg bg-gradient-to-r from-[#FF9933] via-[#0b5ba7] to-[#138808] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
												{view ? "Hide Details" : "View Details"}
											</button>
											<a
												href={link}
												target="_blank"
												rel="noopener noreferrer"
												className="rounded-lg bg-gradient-to-r from-[#FF9933] via-[#0b5ba7] to-[#138808] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
												View Document and Download
											</a>
										</div>
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

export default InsuranceDetails;
