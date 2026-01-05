import type { Metadata } from "next";
import Link from "next/link";

const COLORS = {
	saffron: "#FF671F",
	green: "#046A38",
	navy: "#0A1F44", // not pure black to avoid gray→black issues on some browsers
};

export const metadata: Metadata = {
	title: "Membership Benefits | VRKP",
	description:
		"See what you get with VRKP membership: land allotment, health coverage, personal accident insurance, and savings on essentials.",
};

const BENEFITS = [
	{
		title: "Health Care Services for 5 Years",
		desc: "General care, specialty treatments, Ayurveda, Homeopathy,Dental, Eye, and Skin care Up to 40% discount at VR Kisan  Parivaar–empanelled hospitals.",
		accent: "health",
	},

	{
		title: "₹5 Lakhs Personal Accidental Insurance (5 Years)",
		desc: "Comprehensive protection up to ₹5,00,000 against accidents, disabilities, and animal or snake bites.",
		accent: "insurance",
	},
	{
		title: "Discounted Provisions & Cashback Offers",
		desc: "Enjoy special discounts and exclusive offers on daily essentials at VR 1 Mart stores, plus empanelled pharmacies, labs, and diagnostic centers.",
		accent: "savings",
	},
	{
		title: "1 Free Health Check up",
		desc: "Each beneficiary will receive one free health check-up as part of our beneficiary program, equivalent to the registration amount.",
		accent: "health",
	},
] as const;

function AccentIcon({ kind }: { kind: (typeof BENEFITS)[number]["accent"] }) {
	// simple inline SVGs (no libraries)
	const common = "h-5 w-5";
	switch (kind) {
		// case "land":
		// 	return (
		// 		<svg viewBox="0 0 24 24" className={common} aria-hidden>
		// 			<path
		// 				fill="currentColor"
		// 				d="M3 5h18v4H3zM3 11h18v8H3zM7 13h2v4H7zM11 13h2v4h-2zM15 13h2v4h-2z"
		// 			/>
		// 		</svg>
		// 	);
		case "health":
			return (
				<svg viewBox="0 0 24 24" className={common} aria-hidden>
					<path
						fill="currentColor"
						d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10s-2-.99-4-2.5"
					/>
					<path fill="currentColor" d="M11 8h2v2h2v2h-2v2h-2v-2H9v-2h2z" />
				</svg>
			);
		case "insurance":
			return (
				<svg viewBox="0 0 24 24" className={common} aria-hidden>
					<path
						fill="currentColor"
						d="M12 2l7 3v6c0 5-3.8 9.7-7 11-3.2-1.3-7-6-7-11V5l7-3z"
					/>
					<path fill="#fff" d="M11 7h2v3h3v2h-3v3h-2v-3H8v-2h3z" />
				</svg>
			);
		case "savings":
			return (
				<svg viewBox="0 0 24 24" className={common} aria-hidden>
					<path
						fill="currentColor"
						d="M20 7H4a2 2 0 0 0-2 2v6h2a4 4 0 0 0 8 0h2a4 4 0 0 0 8 0h2V9a2 2 0 0 0-2-2zM8 17a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm10 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM6 9h12V7H6z"
					/>
				</svg>
			);
	}
}

export default async function BenefitsPage() {
	return (
		<div className="bg-white">
			{/* tricolor hairline */}
			<div
				className="h-1 w-full"
				style={{
					background: `linear-gradient(90deg, ${COLORS.saffron}, white 50%, ${COLORS.green})`,
				}}
			/>

			<main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
				{/* Breadcrumb */}
				<nav aria-label="Breadcrumb" className="mb-6">
					<ol className="flex items-center gap-2 text-sm text-neutral-600">
						<li>
							<Link
								href="/"
								className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-300 rounded">
								Home
							</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li>
							<Link
								href="/join"
								className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-300 rounded">
								Join
							</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li className="text-neutral-700">Membership Benefits</li>
					</ol>
				</nav>

				<header className="mb-8">
					<h1
						className="text-3xl sm:text-4xl font-semibold tracking-tight"
						style={{ color: COLORS.navy }}>
						Membership Benefits
					</h1>
					<div
						className="mt-3 h-1 w-28 rounded"
						style={{
							background: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.saffron} 33%, #E5E7EB 33%, #E5E7EB 66%, ${COLORS.green} 66%)`,
						}}
						aria-hidden
					/>
					<p className="mt-4 max-w-2xl text-neutral-700">
						Your membership includes long-term value across land, health,
						insurance, and daily savings. Review the benefits below, then
						continue to registration.
					</p>
				</header>

				{/* Benefits Grid */}
				<section aria-labelledby="benefits" className="mb-10">
					<h2 id="benefits" className="sr-only">
						Benefits list
					</h2>
					<ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
						{BENEFITS.map((b, idx) => (
							<li
								key={b.title}
								className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition">
								<div className="flex items-start gap-3">
									<span
										className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white shrink-0"
										style={{
											background: idx % 2 === 0 ? COLORS.saffron : COLORS.green,
										}}
										aria-hidden>
										<AccentIcon kind={b.accent} />
									</span>
									<div>
										<h3 className="text-lg font-semibold text-neutral-900">
											{b.title}
										</h3>
										<p className="mt-1 text-sm leading-6 text-neutral-700">
											{b.desc}
										</p>
										{idx == 0 && (
											<div className="mt-2 text-xs text-neutral-500">
												Tieup with{" "}
												<Link
													href="/healthcare-tieup"
													className="font-medium text-blue-600 hover:underline">
													Unity Life Health Care
												</Link>{" "}
												for health services and insurance.
											</div>
										)}
									</div>
								</div>
							</li>
						))}
					</ul>
				</section>

				{/* Notes / disclaimers (optional) */}

				{/* CTA */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
					{/* <Link
						href="/"
						className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-300">
						Back to home
					</Link> */}
					<Link
						href="/register"
						className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
						style={{
							background: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.green})`,
						}}>
						Continue to Registration
					</Link>
				</div>
				<section aria-label="Notes" className="mt-12">
					<div className="rounded-xl border border-neutral-200 bg-white p-4">
						<p className="text-sm text-neutral-700">
							<strong>Note:</strong> Benefits are provided as per applicable
							program policies and eligibility. Detailed terms, verification,
							and onboarding steps will be shown during registration.
						</p>
					</div>
				</section>
			</main>

			{/* bottom tricolor hairline */}
			<div
				className="h-1 w-full mt-10"
				style={{
					background: `linear-gradient(90deg, ${COLORS.green}, white 50%, ${COLORS.saffron})`,
				}}
			/>
		</div>
	);
}
