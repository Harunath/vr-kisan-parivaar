// app/(user)/dashboard/page.tsx
import React from "react";
import { authOptions } from "../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import Referral from "../../../components/user/profile/referral/Referral";
import UserNotifications from "../../../components/user/dashboard/UserNotifications";

// --- Small client component for subtle motion ---
function TricolorBanner() {
	"use client";
	// No heavy JS — just a gentle entrance animation using CSS + Tailwind
	return (
		<div className="relative">
			{/* Flag stripes */}
			<div className="h-1.5 w-full bg-[#FF9933]" />
			<div className="h-1.5 w-full bg-white" />
			<div className="h-1.5 w-full bg-[#138808]" />
		</div>
	);
}

const Page = async () => {
	const session = await getServerSession(authOptions);
	const fullname = session?.user?.fullname ?? "Member";

	return (
		<div className="min-h-[100dvh] bg-neutral-50">
			{/* Top flag banner */}
			<TricolorBanner />

			<div className="px-4 pt-3">
				<UserNotifications userId={session?.user?.id!} />
			</div>
			{/* Page container */}
			<div className="mx-auto max-w-3xl px-4 py-10">
				<header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
					<h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
						{fullname}
						<span className="text-neutral-600 font-normal">’s Dashboard</span>
					</h1>

					{/* Optional ID / quick meta */}
					{session?.user?.vrKpId && (
						<div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm">
							<span className="inline-block h-2 w-2 rounded-full bg-[#000080]" />
							VRKP ID:{" "}
							<span className="font-medium">{session.user.vrKpId}</span>
						</div>
					)}
				</header>

				{/* Welcome card with tricolor gradient frame */}
				<div className="mt-6">
					<div className="rounded-2xl p-[1px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]">
						<div className="rounded-2xl bg-white/90 backdrop-blur-sm p-6 md:p-8 shadow-sm">
							<h2 className="text-center text-xl md:text-2xl font-semibold tracking-tight text-neutral-900">
								Welcome to{" "}
								<span className="underline decoration-[#000080] underline-offset-4">
									VR Kisan Parivaar
								</span>
							</h2>

							<p className="mt-4 leading-7 text-neutral-700">
								We warmly welcome you to our growing family—a vibrant movement
								dedicated to empowering farmers, supporting both rural and urban
								communities, and building a self-reliant India.
							</p>

							<p className="mt-4 leading-7 text-neutral-700">
								Your membership marks a valued step toward transforming
								agriculture, livelihoods, and community well-being into shared
								pride, prosperity, and progress, welcoming contributions from
								every sector and region.
							</p>

							<p className="mt-4 leading-7 text-neutral-700">
								Explore your member benefits here and take full advantage of the
								many opportunities designed for you.
							</p>

							<p className="mt-4 leading-7 text-neutral-700">
								We sincerely appreciate your trust and commitment. Your ideas
								and suggestions are always welcome at{" "}
								<a
									href="mailto:support@vrkisanparivaar.com"
									className="text-[#000080] underline decoration-[#9bb0ff] underline-offset-2 hover:text-[#001070] hover:decoration-[#6f8cff] transition-colors">
									support@vrkisanparivaar.com
								</a>
								. Together, we can create meaningful change in the lives of
								countless families.
							</p>

							<p className="mt-4 leading-7 text-neutral-700">
								Let’s cultivate growth, unity, and a brighter tomorrow—together.
							</p>

							{/* Tricolor divider */}
							<div className="mt-6 grid grid-cols-3 gap-1">
								<div className="h-1 rounded-full bg-[#FF9933]" />
								<div className="h-1 rounded-full bg-[#000080]" />
								<div className="h-1 rounded-full bg-[#138808]" />
							</div>
						</div>
					</div>

					{/* Referral section (optional if you want it below) */}
				</div>

				{/* Not logged in fallback */}
				{!session && (
					<p className="mt-8 text-neutral-700">You are not logged in.</p>
				)}
			</div>
		</div>
	);
};

export default Page;
