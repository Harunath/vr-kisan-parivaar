"use client";
import React from "react";
import { motion } from "framer-motion";
import {
	FaHandsHelping,
	FaLeaf,
	FaUsers,
	FaRegBell,
	FaTractor,
	FaStore,
	FaHandshake,
} from "react-icons/fa";
import Link from "next/link";

export default function JoinUsSection() {
	return (
		<section className="relative mx-auto mt-12 max-w-6xl overflow-hidden">
			<div className="relative p-8 sm:p-12">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-10">
					<h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
						<span className="text-[#FF9933]">🌾 </span>Join{" "}
						<span className="text-orange-600">VR Kisan Parivaar</span>
					</h2>
					<p className="mt-3 text-gray-700 max-w-2xl mx-auto leading-relaxed">
						Be a part of India’s rural empowerment movement — collaborate,
						learn, and make a lasting impact on the community.
					</p>
				</motion.div>

				{/* Two-column layout */}
				<div className="grid gap-10 lg:grid-cols-2">
					{/* WHY JOIN US */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm hover:shadow-md transition-all">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-[#FF9933] to-[#138808] p-[2px]">
								<div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white">
									<FaHandsHelping className="h-5 w-5 text-[#0b5ba7]" />
								</div>
							</div>
							<h3 className="text-xl font-semibold">Why Join Us</h3>
						</div>

						<p className="text-gray-700 mb-5 leading-relaxed">
							Joining{" "}
							<span className="font-semibold text-[#0b5ba7]">
								VR Kisan Parivaar
							</span>{" "}
							means becoming part of a{" "}
							<span className="font-semibold text-[#FF9933]">
								growing movement
							</span>{" "}
							dedicated to empowering rural India. As a member, you can:
						</p>

						<ul className="space-y-3 text-gray-700">
							<ListItem
								icon={<FaRegBell className="text-[#FF9933]" />}
								text="Receive updates, training invites, and access to events"
							/>
							<ListItem
								icon={<FaUsers className="text-[#138808]" />}
								text="Share your skills, knowledge, and ideas"
							/>
							<ListItem
								icon={<FaLeaf className="text-[#138808]" />}
								text={
									<>
										Contribute to building{" "}
										<span className="font-semibold text-[#0b5ba7]">
											self-sustaining, green villages
										</span>
									</>
								}
							/>
							<ListItem
								icon={<FaHandsHelping className="text-[#8B4513]" />}
								text={
									<>
										Make a{" "}
										<span className="font-semibold text-[#FF9933]">
											real impact
										</span>{" "}
										on rural communities
									</>
								}
							/>
						</ul>
					</motion.div>

					{/* WHO CAN JOIN */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm hover:shadow-md transition-all">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-[#FF9933] to-[#138808] p-[2px]">
								<div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white">
									<FaUsers className="h-5 w-5 text-[#0b5ba7]" />
								</div>
							</div>
							<h3 className="text-xl font-semibold">Who Can Join</h3>
						</div>

						<p className="text-gray-700 leading-relaxed mb-5">
							Anyone who is an{" "}
							<span className="font-semibold">Indian citizen</span> and
							passionate about{" "}
							<span className="font-semibold">rural development</span> is
							welcome to join. Our members include:
						</p>

						<div className="grid gap-3 sm:grid-cols-2">
							<Pill
								icon={<FaTractor />}
								label="Farmers"
								color="from-[#FF9933]"
							/>
							<Pill
								icon={<FaUsers />}
								label="Women’s Groups"
								color="from-[#138808]"
							/>
							<Pill
								icon={<FaLeaf />}
								label="Rural Youth & Communities"
								color="from-[#138808]"
							/>
							<Pill
								icon={<FaStore />}
								label="Local Entrepreneurs"
								color="from-[#FF9933]"
							/>
							<Pill
								icon={<FaHandshake />}
								label="Rural Development Supporters"
								color="from-[#0b5ba7]"
							/>
						</div>

						<div className="my-6 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

						<p className="text-gray-700 leading-relaxed">
							Whether you belong to one of these groups or simply want to
							contribute to rural progress, there’s a place for you in{" "}
							<span className="font-semibold text-[#0b5ba7]">
								VR Kisan Parivaar
							</span>
							.
						</p>

						<div className="mt-6">
							<Link
								href="/login"
								className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF9933] via-[#0b5ba7] to-[#138808] p-[2px] transition-transform hover:scale-[1.02] focus:outline-none"
								aria-label="Join VR Kisan Parivaar">
								<span className="rounded-[10px] bg-white px-4 py-2 text-sm font-semibold text-gray-900">
									<span className="mr-1">👉</span> Join Us Today!
								</span>
							</Link>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

/* ------------ Subcomponents ------------ */
function ListItem({
	icon,
	text,
}: {
	icon: React.ReactNode;
	text: React.ReactNode;
}) {
	return (
		<li className="flex items-start gap-3">
			<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
				{icon}
			</div>
			<span>{text}</span>
		</li>
	);
}

function Pill({
	icon,
	label,
	color = "from-[#FF9933]",
}: {
	icon: React.ReactNode;
	label: string;
	color?: string;
}) {
	return (
		<div className="flex items-center gap-3 rounded-xl border border-black/5 bg-gray-50 px-3 py-2.5 hover:bg-white transition-all">
			<div
				className={`rounded-lg bg-gradient-to-br ${color} to-transparent p-[1px]`}>
				<div className="flex items-center justify-center rounded-[10px] bg-white px-2 py-1">
					{icon}
				</div>
			</div>
			<span className="text-sm font-medium text-gray-800">{label}</span>
		</div>
	);
}
