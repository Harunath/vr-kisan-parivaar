"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
	saffron: "#FF9933",
	green: "#138808",
	chakra: "#0A3A82",
	ink: "#0f172a",
};

type Dept =
	| "Leadership"
	| "Marketing"
	| "Operations"
	| "HR"
	| "Finance"
	| "Digital";

type Role = {
	title: string;
	dept: Dept;
	summary: string; // main description
	ideal: string; // "Ideal for..." line
};

const ROLES: Role[] = [
	{
		title: "Business Head",
		dept: "Leadership",
		summary:
			"Join VR Kisan Parivaar’s senior business team to lead sustainable growth and development efforts that support rural India. Guide key projects that make a practical difference for farmers and communities.",
		ideal:
			"Ideal for experienced professionals who can combine leadership, strategy, and social impact.",
	},
	{
		title: "Senior Marketing Manager",
		dept: "Marketing",
		summary:
			"Manage marketing strategies and campaigns that promote VR Kisan Parivaar’s mission. Help increase awareness and engagement with a focus on measurable outcomes.",
		ideal:
			"Ideal for marketers who can translate ideas into effective campaigns that drive real results.",
	},
	{
		title: "Team Leader",
		dept: "Operations",
		summary:
			"Coordinate and support a team focused on delivering clear results. Maintain motivation, ensure smooth operations, and align projects with our rural development goals.",
		ideal:
			"Ideal for individuals who enjoy guiding teams and ensuring projects stay on track.",
	},
	{
		title: "Marketing Executive",
		dept: "Marketing",
		summary:
			"Implement marketing activities that connect with rural audiences and promote agricultural initiatives effectively on the ground.",
		ideal:
			"Ideal for self-motivated professionals eager to contribute to grassroots marketing efforts.",
	},
	{
		title: "Digital Marketing Specialist",
		dept: "Digital",
		summary:
			"Develop and execute digital marketing campaigns that reach and inform rural communities, helping expand VR Kisan Parivaar’s online presence.",
		ideal:
			"Ideal for candidates skilled in digital outreach and passionate about community engagement.",
	},
	{
		title: "Human Resources (HR) Executive",
		dept: "HR",
		summary:
			"Support recruitment and employee engagement to build a committed team focused on rural development and sustainable practices.",
		ideal:
			"Ideal for HR professionals who value teamwork, transparency, and long-term growth.",
	},
	{
		title: "Accountant",
		dept: "Finance",
		summary:
			"Maintain accurate financial records and manage budgets to ensure resources are used responsibly to support VR Kisan Parivaar’s projects.",
		ideal:
			"Ideal for detail-oriented professionals who take pride in financial accuracy and accountability.",
	},
];

function slugify(input: string) {
	return input
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}

export default function CareersSection() {
	const [q, setQ] = useState("");
	const [dept, setDept] = useState<"All" | Dept>("All");

	const departments: ("All" | Dept)[] = [
		"All",
		"Leadership",
		"Marketing",
		"Operations",
		"HR",
		"Finance",
		"Digital",
	];

	const filtered = useMemo(() => {
		const query = q.trim().toLowerCase();
		return ROLES.filter((r) => {
			const matchesQuery =
				!query ||
				r.title.toLowerCase().includes(query) ||
				r.summary.toLowerCase().includes(query) ||
				r.ideal.toLowerCase().includes(query);
			const inDept = dept === "All" || r.dept === dept;
			return matchesQuery && inDept;
		});
	}, [q, dept]);

	return (
		<main className="min-h-screen bg-gradient-to-b from-white via-[#f9fafb] to-[#f1f5f9] pt-10 md:pt-10">
			{/* Top tricolor ribbon */}
			<div
				className="h-1 w-full"
				style={{
					background: `linear-gradient(90deg, ${COLORS.saffron} 0%, #ffffff 50%, ${COLORS.green} 100%)`,
				}}
			/>

			<section className="mx-auto max-w-6xl px-4 py-12">
				{/* Heading */}
				<header className="mb-10 text-center">
					<h1 className="text-4xl font-bold tracking-tight text-slate-900">
						Careers at{" "}
						<span style={{ color: COLORS.green }}>VR Kisan Parivaar</span>
					</h1>
					<p className="mt-3 text-slate-700 max-w-3xl mx-auto">
						At VR Kisan Parivaar, we believe meaningful change begins with
						dedicated people. Our team works to empower rural communities,
						strengthen agricultural livelihoods, and build sustainable systems
						for growth. If you’re looking for a workplace that values
						responsibility, learning, and real-world impact — we’d love to have
						you on board.
					</p>
				</header>

				{/* Filters */}
				<div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<div className="relative w-full sm:w-80">
						<input
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder="Search roles, skills, keywords…"
							className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:ring-2 focus:ring-[rgba(10,58,130,0.2)]"
						/>
						<span className="pointer-events-none absolute right-3 top-2.5 text-xs text-slate-400">
							⌘K
						</span>
					</div>

					<select
						value={dept}
						onChange={(e) => setDept(e.target.value as "All" | Dept)}
						className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:ring-2 focus:ring-[rgba(10,58,130,0.2)]">
						{departments.map((d) => (
							<option key={d} value={d}>
								{d}
							</option>
						))}
					</select>
				</div>

				{/* Role cards */}
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((role, i) => (
						<motion.div
							key={role.title}
							initial={{ opacity: 0, y: 18 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.05 }}>
							<RoleCard role={role} />
						</motion.div>
					))}
				</div>

				{/* Empty state */}
				{filtered.length === 0 && (
					<div className="mt-16 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center backdrop-blur-sm">
						<p className="text-slate-700 font-medium">
							No roles match your filters.
						</p>
						<p className="mt-1 text-sm text-slate-500">
							Try clearing search or choosing a different department.
						</p>
					</div>
				)}
			</section>

			{/* Bottom tricolor ribbon */}
			<div
				className="h-1 w-full"
				style={{
					background: `linear-gradient(90deg, ${COLORS.saffron} 0%, #ffffff 50%, ${COLORS.green} 100%)`,
				}}
			/>
		</main>
	);
}

/* ---------- Role Card Component with Modal ---------- */
function RoleCard({ role }: { role: Role }) {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<motion.article
				whileHover={{ y: -4 }}
				className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
				{/* Top accent bar: saffron → chakra → green */}
				<div
					className="pointer-events-none absolute inset-x-0 top-0 h-1"
					style={{
						background: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.chakra}, ${COLORS.green})`,
					}}
				/>

				{/* Dept chip */}
				<div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-500">
					<span
						className="h-2 w-2 rounded-full"
						style={{
							backgroundColor:
								role.dept === "Leadership"
									? COLORS.saffron
									: role.dept === "Finance"
										? COLORS.green
										: COLORS.chakra,
						}}
					/>
					{role.dept}
				</div>

				<h3
					className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-[var(--chakra)] transition-colors"
					style={{ ["--chakra" as any]: COLORS.chakra }}>
					{role.title}
				</h3>

				<p className="text-sm text-slate-600 leading-relaxed">{role.summary}</p>
				<p className="mt-2 text-sm text-slate-700">
					<span className="font-medium">{role.ideal}</span>
				</p>

				<div className="mt-5 flex items-center justify-between">
					<button
						onClick={() => setShowModal(true)}
						className="inline-flex items-center justify-center rounded-lg bg-[var(--chakra)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
						style={{ ["--chakra" as any]: COLORS.chakra }}
						aria-haspopup="dialog">
						How to Apply →
					</button>
				</div>
			</motion.article>

			<AnimatePresence>
				{showModal && (
					<>
						{/* Backdrop */}
						<motion.button
							type="button"
							aria-label="Close apply dialog"
							className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setShowModal(false)}
						/>

						{/* Modal */}
						<motion.div
							role="dialog"
							aria-modal="true"
							className="fixed inset-0 z-50 flex items-center justify-center p-4"
							initial={{ opacity: 0, scale: 0.96, y: 24 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.96, y: 24 }}
							transition={{ type: "spring", stiffness: 140, damping: 16 }}>
							<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
								<h2 className="text-xl font-semibold text-slate-900 mb-2">
									How to Apply for {role.title}
								</h2>
								<p className="text-sm text-slate-600 leading-relaxed">
									📧 Send your updated resume to{" "}
									<a
										href="mailto:support@vrkisanparivaar.com"
										className="text-[var(--chakra)] font-medium hover:underline"
										style={{ ["--chakra" as any]: COLORS.chakra }}>
										support@vrkisanparivaar.com
									</a>{" "}
									with the subject <b>“Application for {role.title}”</b>.
								</p>
								<ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
									<li>Attach your latest CV (PDF or DOC)</li>
									<li>Include a short cover note or introduction</li>
									<li>Mention your current location and notice period</li>
									<li>Portfolio or LinkedIn profile (if applicable)</li>
								</ul>

								<div className="mt-6 flex justify-end gap-3">
									<button
										onClick={() => setShowModal(false)}
										className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
										Close
									</button>
									<a
										href="mailto:career@vrkisanparivaar.com"
										className="rounded-lg bg-[var(--chakra)] px-4 py-2 text-sm font-medium text-white hover:brightness-110"
										style={{ ["--chakra" as any]: COLORS.chakra }}>
										Email Resume
									</a>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
