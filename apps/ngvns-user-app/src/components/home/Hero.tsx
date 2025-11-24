"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, easeInOut } from "framer-motion";
import Link from "next/link";
import {
	FaWind,
	FaSeedling,
	FaUsers,
	FaIndustry,
	FaHandsHelping,
} from "react-icons/fa";

export default function Hero() {
	return (
		<section className="relative min-h-[calc(100vh-48px)] md:min-h-[calc(100vh-64px)] w-full bg-linear-to-b/hsl from-orange-300 from-[25%] via-white via-50% to-green-400 to-75% flex items-center">
			<div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 flex flex-col items-center text-center">
				{/* Scrolling line (no background) – responsive & seamless */}
				<div className="w-full overflow-hidden mb-4 sm:mb-6">
					<div className="w-full">
						<div className="inline-flex min-w-[200%] whitespace-nowrap will-change-transform animate-marquee motion-reduce:animate-none">
							<span className="inline-block font-semibold text-xl sm:text-2xl leading-[1.5] pr-12 sm:pr-16 bg-gradient-to-r from-orange-700 via-slate-800 to-green-500 bg-clip-text text-transparent">
								Be part of the journey with VR Kisan Parivaar — towards
								resilient, sustainable rural communities.
							</span>
							<span
								aria-hidden
								className="inline-block font-semibold text-xl sm:text-2xl leading-[1.5] pr-12 sm:pr-16 bg-gradient-to-r from-orange-700 via-slate-800 to-green-500 bg-clip-text text-transparent">
								Be part of the journey with VR Kisan Parivaar — towards
								resilient, sustainable rural communities.
							</span>
						</div>
					</div>

					<style jsx>{`
						@keyframes marquee {
							0% {
								transform: translateX(0);
							}
							100% {
								transform: translateX(-50%);
							}
						}
						.animate-marquee {
							animation: marquee 14s linear infinite;
						}
						@media (prefers-reduced-motion: reduce) {
							.animate-marquee {
								animation: none;
								transform: translateX(0);
							}
						}
					`}</style>
				</div>

				<h1 className="mb-1 sm:mb-2 text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#963132] uppercase tracking-widest">
					VR KISAN PARIVAAR PRIVATE LIMITED
				</h1>

				<h4 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-semibold text-green-800 leading-tight tracking-tight">
					Building Sustainable Futures for Rural India
				</h4>

				<p className="mb-5 sm:mb-6 max-w-2xl text-[15px] sm:text-base md:text-lg text-zinc-700">
					Empowering villages with clean energy, sustainable farming, women-led
					initiatives, and rural employment to build a self-reliant, green, and
					thriving Bharat.
				</p>

				{/* Carousel */}
				<div className="w-full max-w-3xl mb-2 sm:mb-3">
					<SingleCarousel items={CAROUSEL_ITEMS} intervalMs={10000} />
				</div>

				<div className="mb-6 sm:mb-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:gap-4">
					<Link href="/join" className="w-full sm:w-auto">
						<button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition shadow">
							Know More
						</button>
					</Link>
					<Link href="/our-work" className="w-full sm:w-auto">
						<button className="w-full sm:w-auto bg-[#138808] hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition shadow">
							Explore Our Work
						</button>
					</Link>
				</div>
			</div>
		</section>
	);
}

type Item = {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
};

function SingleCarousel({
	items,
	intervalMs = 5000,
}: {
	items: Item[];
	intervalMs?: number;
}) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const id = setInterval(
			() => setIndex((i) => (i + 1) % items.length),
			intervalMs
		);
		return () => clearInterval(id);
	}, [items.length, intervalMs]);

	const current = useMemo(() => items[index], [items, index]);

	const variants = {
		initial: { opacity: 0, x: 10, y: 6, scale: 0.985 },
		animate: {
			opacity: 1,
			x: 0,
			y: 0,
			scale: 1,
			transition: { duration: 0.35, ease: easeInOut },
		},
		exit: {
			opacity: 0,
			x: -10,
			y: -6,
			scale: 0.985,
			transition: { duration: 0.25, ease: easeInOut },
		},
	};

	return (
		<div className="relative">
			{/* Layered animated backgrounds */}
			<div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl sm:rounded-3xl">
				<div
					className="absolute -inset-x-1/2 top-0 h-[160%] rotate-6 opacity-30"
					style={{
						background:
							"linear-gradient(90deg, rgba(255,140,0,0) 0%, rgba(255,140,0,0.18) 40%, rgba(255,140,0,0) 80%)",
						animation: "panLeft 18s linear infinite",
					}}
				/>
				<div
					className="absolute -inset-y-1/2 left-0 w-[180%] opacity-25"
					style={{
						background:
							"radial-gradient(40% 40% at 20% 50%, rgba(19,136,8,0.18), transparent), radial-gradient(35% 35% at 80% 50%, rgba(19,136,8,0.12), transparent)",
						animation: "panRight 22s linear infinite",
					}}
				/>
				<div
					className="absolute inset-0 opacity-[0.15]"
					style={{
						background:
							"repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 12px)",
						animation: "panLeft 40s linear infinite",
					}}
				/>
			</div>

			<div className="rounded-2xl sm:rounded-3xl [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]">
				<AnimatePresence mode="wait" initial={false}>
					{current && (
						<motion.div
							key={current.title}
							variants={variants}
							initial="initial"
							animate="animate"
							exit="exit">
							<div className="rounded-2xl border border-zinc-200 bg-white/90 p-4 sm:p-6 shadow-sm backdrop-blur text-left">
								<div className="mb-2 sm:mb-3 flex items-center gap-3">
									<current.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#138808]" />
									<h3 className="text-base sm:text-lg font-semibold text-zinc-900">
										{current.title}
									</h3>
								</div>
								<p className="text-[13.5px] sm:text-sm md:text-base text-zinc-600">
									{current.description}
								</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

const CAROUSEL_ITEMS: Item[] = [
	{
		icon: FaWind,
		title: "Clean Energy Microgrids",
		description: "Solar + wind hybrids powering farms and small businesses.",
	},
	{
		icon: FaSeedling,
		title: "Sustainable Farming",
		description:
			"Soil health, drip irrigation, and regenerative practices for resilient yields.",
	},
	{
		icon: FaUsers,
		title: "Women-led SHGs",
		description:
			"Micro-entrepreneurship and self-help groups creating local opportunities.",
	},
	{
		icon: FaIndustry,
		title: "Rural Employment",
		description:
			"Skill hubs connecting youth to agri-tech and local industries.",
	},
	{
		icon: FaHandsHelping,
		title: "Community Health",
		description: "Providing quality health care services.",
	},
];
