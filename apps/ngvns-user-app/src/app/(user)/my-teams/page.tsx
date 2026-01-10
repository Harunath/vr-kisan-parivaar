import React from "react";
import prisma from "@ngvns2025/db/client";
import { authOptions } from "../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";
import Highlighting from "./Highlighting";

// helpers
function leftToFill(count: number, by: number) {
	const r = count % by;
	return r === 0 ? 0 : by - r;
}

const getUserTree = async (userId: string) => {
	const run = unstable_cache(
		async () => {
			const me = await prisma.user.findUnique({
				where: { id: userId },
				select: { vrKpId: true },
			});

			const [l1, l2, l3] = await Promise.all([
				me?.vrKpId
					? prisma.user.count({
							where: { parentReferralId: me.vrKpId, deleted: false },
						})
					: Promise.resolve(0),
				prisma.user.count({ where: { parentBId: userId, deleted: false } }),
				prisma.user.count({ where: { parentCId: userId, deleted: false } }),
			]);

			return { l1, l2, l3 };
		},
		["user-tree", userId], // cache key includes user
		{ revalidate: 60 * 60 } // 1h
	);
	return run();
};

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id)
		return <div>Please sign in to access your board.</div>;

	const { l1, l2, l3 } = await getUserTree(session.user.id);

	// rates
	const level1 = 600;
	const level2 = 200;
	const level3 = 180;
	const level1until5 = 300;

	return (
		<div className="min-h-screen bg-neutral-100 px-4 py-10">
			<div className="mx-auto w-full max-w-3xl">
				<header className="text-center">
					<h1 className="text-2xl font-semibold text-gray-900">
						{session.user.fullname}&apos;s Community
					</h1>
					<div className="mx-auto mt-3 grid max-w-xs grid-cols-3 gap-1">
						<div className="h-1 rounded bg-[#FF9933]" />
						<div className="h-1 rounded bg-[#0b5ba7]" />
						<div className="h-1 rounded bg-[#138808]" />
					</div>
				</header>

				{/* Circle 1 */}
				<section className="my-8 w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
					{/* Flag rail left */}
					<div className="relative">
						<div className="absolute inset-y-0 left-0 w-2">
							<div className="h-1/3 bg-[#FF9933]" />
							<div className="h-1/3 bg-white" />
							<div className="h-1/3 bg-[#138808]" />
						</div>

						<div className="p-6 pl-6">
							<h2 className="text-lg font-semibold text-gray-900">
								Circle&nbsp;1 ({l1})
							</h2>

							<Chart count={l1} by={5} />
							<span className="mt-2 inline-block text-sm italic text-[#0b5ba7]">
								{leftToFill(l1, 5)} left to fill the bar.
							</span>

							<p className="mt-2 text-sm font-semibold">
								{l1} × {level1} = ₹ {l1 * level1}/-
							</p>

							<div className="mt-4 grid grid-cols-3">
								<div className="h-1 bg-[#FF9933]" />
								<div className="h-1 bg-[#0b5ba7]" />
								<div className="h-1 bg-[#138808]" />
							</div>
						</div>
					</div>
				</section>

				{/* Circle 2 */}
				<section className="my-8 w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 w-2">
							<div className="h-1/3 bg-[#FF9933]" />
							<div className="h-1/3 bg-white" />
							<div className="h-1/3 bg-[#138808]" />
						</div>

						<div className="p-6 pl-6">
							<h2 className="text-lg font-semibold text-gray-900">
								Circle&nbsp;2 ({l2})
							</h2>

							<Chart count={l2} by={25} />
							<span className="mt-2 inline-block text-sm italic text-[#0b5ba7]">
								{leftToFill(l2, 25)} left to fill the bar.
							</span>

							<p className="mt-2 text-sm font-semibold">
								{l2} × {level2} = ₹ {l2 * level2}/-
							</p>

							<div className="mt-4 grid grid-cols-3">
								<div className="h-1 bg-[#FF9933]" />
								<div className="h-1 bg-[#0b5ba7]" />
								<div className="h-1 bg-[#138808]" />
							</div>
						</div>
					</div>
				</section>

				{/* Circle 3 */}
				<section className="my-8 w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 w-2">
							<div className="h-1/3 bg-[#FF9933]" />
							<div className="h-1/3 bg-white" />
							<div className="h-1/3 bg-[#138808]" />
						</div>

						<div className="p-6 pl-6">
							<h2 className="text-lg font-semibold text-gray-900">
								Circle&nbsp;3 ({l3})
							</h2>

							<Chart count={l3} by={125} />
							<span className="mt-2 inline-block text-sm italic text-[#0b5ba7]">
								{leftToFill(l3, 125)} left to fill the bar.
							</span>

							<p className="mt-2 text-sm font-semibold">
								{l3} × {level3} = ₹ {l3 * level3}/-
							</p>

							<div className="mt-4 grid grid-cols-3">
								<div className="h-1 bg-[#FF9933]" />
								<div className="h-1 bg-[#0b5ba7]" />
								<div className="h-1 bg-[#138808]" />
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

function Chart({ count, by }: { count: number; by: number }) {
	const percentage = Math.min(100, ((count % by) / by) * 100);

	return (
		<div className="relative mt-3 w-full overflow-hidden rounded-full border-2 border-[#0b5ba7]/40 bg-neutral-100">
			<div
				className="h-3 rounded-full transition-all"
				style={{
					width: `${percentage}%`,
					background:
						"linear-gradient(90deg, #FF9933 0%, #0b5ba7 50%, #138808 100%)",
				}}
			/>
		</div>
	);
}
