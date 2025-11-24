"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const COLORS = {
	saffron: "#FF9933",
	green: "#138808",
	chakra: "#0A3A82",
};

const faqs = [
	{
		question: "What programs support rural sustainability?",
		answer:
			"We offer initiatives in natural farming, renewable energy, women's empowerment, and rural employment to promote sustainable development.",
	},
	{
		question: "How can I contribute or volunteer?",
		answer:
			"You can support us by donating, volunteering, or partnering with us. Please visit our Become a Member page for more information.",
	},
	{
		question: "Are your initiatives eco-friendly?",
		answer:
			"Yes, all our programs are designed to be environmentally sustainable, focusing on organic farming, renewable energy, and waste management.",
	},
];

export default function RuralImpactFaq() {
	return (
		<section className="relative overflow-hidden bg-white text-slate-900">
			{/* Top tricolor line */}
			<div
				className="h-1 w-full"
				style={{
					background: `linear-gradient(90deg, ${COLORS.saffron} 0%, #ffffff 50%, ${COLORS.green} 100%)`,
				}}
			/>

			{/* Subtle background */}
			<div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_60rem_at_120%_-10%,#fff7ed_10%,transparent_60%),radial-gradient(40rem_40rem_at_-10%_110%,#ecfdf5_10%,transparent_60%)]" />

			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
				<div className="grid gap-10 lg:gap-16 md:grid-cols-2 md:items-center">
					{/* LEFT SIDE */}
					<motion.div
						initial={{ opacity: 0, x: -24 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.5 }}
						className="flex flex-col gap-6">
						<div className="relative w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-200">
							<Image
								src="https://res.cloudinary.com/dip2khkyo/image/upload/v1739210128/contact-us-img_xfcru4.webp"
								alt="Rural India Initiative"
								width={1200}
								height={800}
								className="h-56 xs:h-64 sm:h-72 md:h-80 lg:h-96 w-full object-cover"
								priority
							/>
							<div
								className="absolute bottom-0 left-0 right-0 h-1"
								style={{
									background: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.chakra}, ${COLORS.green})`,
								}}
							/>
						</div>

						<div className="space-y-2 sm:space-y-3">
							<p className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 sm:text-sm">
								Support & FAQs
							</p>
							<h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
								Still Have Questions?
							</h3>
							<p className="text-sm sm:text-base text-slate-600 leading-relaxed">
								We&apos;re here to support you with sustainable development,
								innovative rural solutions, and community-driven initiatives —
								empowering villages to thrive.
							</p>
						</div>
					</motion.div>

					{/* RIGHT SIDE: FAQ Static List */}
					<motion.div
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.5 }}
						className="flex flex-col">
						<div className="space-y-2 sm:space-y-3">
							<h2 className="text-xl sm:text-3xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
								FAQs on Rural Development
							</h2>
							<p className="text-sm sm:text-base text-slate-600 max-w-xl">
								Have questions about our work in rural India? Explore the most
								common queries below.
							</p>
						</div>

						<div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
							<ul className="divide-y divide-slate-200">
								{faqs.map((faq) => (
									<li
										key={faq.question}
										className="px-4 sm:px-5 py-4 sm:py-5 hover:bg-slate-50 transition-colors">
										<p className="text-sm sm:text-base font-semibold text-slate-900">
											{faq.question}
										</p>
										<p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
											{faq.answer}
										</p>
									</li>
								))}
							</ul>
						</div>

						{/* Small footer note for mobile clarity */}
						<p className="mt-4 text-xs text-slate-500 sm:hidden">
							Scroll to view more questions if the list extends beyond your
							screen.
						</p>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
