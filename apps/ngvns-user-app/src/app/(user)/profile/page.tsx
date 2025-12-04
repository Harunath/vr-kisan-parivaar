import React from "react";
import dynamic from "next/dynamic";
import { authOptions } from "../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@ngvns2025/db/client";
import Referral from "../../../components/user/profile/referral/Referral";
import BankPage from "../../../components/user/bank/BankPage";

const ProfileClient = dynamic(
	() => import("../../../components/user/profile/ProfileClient")
);

const SAFFRON = "#FF9933";
const GREEN = "#138808";
const CHAKRA = "#0A3A8E";

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) redirect("/logout");

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			address: {
				select: {
					addressLine: true,
					addressLine2: true,
					State: { select: { name: true } },
					pincode: true,
				},
			},
		},
	});

	if (!user) redirect("/logout");

	const addr = user.address;

	return (
		<div className="min-h-screen bg-neutral-100 px-4 py-10">
			<div className="mx-auto w-full max-w-3xl">
				{/* Page header */}
				<header className="text-center">
					<h1 className="text-2xl font-semibold text-gray-900">
						{session.user.fullname}&apos;s Profile
					</h1>
					<div className="mx-auto mt-3 grid max-w-xs grid-cols-3 gap-1">
						<div className="h-1 rounded" style={{ backgroundColor: SAFFRON }} />
						<div className="h-1 rounded" style={{ backgroundColor: CHAKRA }} />
						<div className="h-1 rounded" style={{ backgroundColor: GREEN }} />
					</div>
				</header>

				{/* Top section */}
				<ProfileClient />

				{/* Divider – thin tricolour stripe */}
				<div
					className="mx-auto my-8 h-[3px] w-full rounded"
					style={{
						background: `linear-gradient(90deg, ${SAFFRON}, white, ${GREEN})`,
					}}
				/>

				<section
					className="relative mx-auto w-full rounded-2xl p-[1px]"
					style={{
						background: `linear-gradient(135deg, ${SAFFRON}, white 40%, ${GREEN})`,
					}}>
					<div className="relative rounded-[calc(theme(borderRadius.2xl)-1px)] bg-white">
						{/* Watermark */}
						<svg
							className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 opacity-10"
							viewBox="0 0 100 100"
							aria-hidden>
							<g fill="none" stroke={CHAKRA} strokeWidth="2">
								<circle cx="50" cy="50" r="30" />
								{Array.from({ length: 24 }).map((_, i) => {
									const angle = (i * 15 * Math.PI) / 180;
									const x = 50 + 30 * Math.cos(angle);
									const y = 50 + 30 * Math.sin(angle);
									return <line key={i} x1="50" y1="50" x2={x} y2={y} />;
								})}
							</g>
						</svg>

						<BankPage />
					</div>
				</section>

				{/* Divider – thin tricolour stripe */}
				<div
					className="mx-auto my-8 h-[3px] w-full rounded"
					style={{
						background: `linear-gradient(90deg, ${SAFFRON}, white, ${GREEN})`,
					}}
				/>

				{/* Address – gradient border card + chakra watermark */}
				<section
					className="relative mx-auto w-full rounded-2xl p-[1px]"
					style={{
						background: `linear-gradient(135deg, ${SAFFRON}, white 40%, ${GREEN})`,
					}}>
					<div className="relative rounded-[calc(theme(borderRadius.2xl)-1px)] bg-white">
						{/* Watermark */}
						<svg
							className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 opacity-10"
							viewBox="0 0 100 100"
							aria-hidden>
							<g fill="none" stroke={CHAKRA} strokeWidth="2">
								<circle cx="50" cy="50" r="30" />
								{Array.from({ length: 24 }).map((_, i) => {
									const angle = (i * 15 * Math.PI) / 180;
									const x = 50 + 30 * Math.cos(angle);
									const y = 50 + 30 * Math.sin(angle);
									return <line key={i} x1="50" y1="50" x2={x} y2={y} />;
								})}
							</g>
						</svg>

						<div className="relative p-5 md:p-6">
							<div className="mb-3 flex items-center justify-between">
								<h2 className="text-base font-semibold text-gray-800">
									Your Address
								</h2>

								{/* Small flag chip */}
								<span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium">
									<span
										className="inline-block h-2 w-2 rounded-full"
										style={{ backgroundColor: SAFFRON }}
									/>
									<span className="inline-block h-2 w-2 rounded-full bg-gray-200" />
									<span
										className="inline-block h-2 w-2 rounded-full"
										style={{ backgroundColor: GREEN }}
									/>
								</span>
							</div>
							{/* Address body */}
							{addr ? (
								<div className="rounded-xl border bg-neutral-50/70 p-4">
									<div className="flex items-start gap-3">
										{/* Pin icon framed with tri-gradient ring */}
										<span
											className="grid h-9 w-9 place-items-center rounded-lg p-[1px]"
											style={{
												background: `linear-gradient(180deg, ${SAFFRON}, ${GREEN})`,
											}}>
											<span className="grid h-full w-full place-items-center rounded-md bg-white">
												<svg
													viewBox="0 0 24 24"
													className="h-5 w-5"
													style={{ color: CHAKRA }}
													aria-hidden>
													<path
														fill="currentColor"
														d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"
													/>
												</svg>
											</span>
										</span>

										<div className="min-w-0 flex-1">
											<p className="truncate text-sm text-gray-900">
												{addr.addressLine}
											</p>
											{addr.addressLine2 ? (
												<p className="truncate text-sm text-gray-700">
													{addr.addressLine2}
												</p>
											) : null}
											<div className="mt-2 flex flex-wrap gap-2 text-sm">
												<Badge label="State" value={addr.State?.name ?? "—"} />
												<Badge label="Pincode" value={addr.pincode ?? "—"} />
											</div>
										</div>
									</div>
								</div>
							) : (
								<div
									className="rounded-xl border p-4 text-sm"
									style={{ borderColor: "#e5e7eb", background: "#fafafa" }}>
									Not Provided
								</div>
							)}
						</div>

						{/* Bottom tri-stripe */}
						<div
							className="h-[3px] w-full"
							style={{
								background: `linear-gradient(90deg, ${SAFFRON}, ${CHAKRA}, ${GREEN})`,
							}}
						/>
					</div>
				</section>

				{/* Referral – flag ribbon wrapper */}
				{session.user.canRefer && (
					<section className="mt-8">
						<div className="relative rounded-2xl border bg-white">
							{/* ribbon top */}
							<div
								className="h-1.5 w-full rounded-t-2xl"
								style={{
									background: `linear-gradient(90deg, ${SAFFRON}, white, ${GREEN})`,
								}}
							/>
							<div className="p-4 md:p-5">
								<Referral />
							</div>
						</div>
					</section>
				)}
			</div>
		</div>
	);
}

/* ---------- tiny helper ---------- */
function Badge({ label, value }: { label: string; value: string }) {
	return (
		<span className="inline-flex items-center gap-1 rounded-full border px-3 py-1">
			<span className="text-xs text-gray-600">{label}:</span>
			<span className="text-sm font-medium text-gray-900">{value}</span>
		</span>
	);
}
