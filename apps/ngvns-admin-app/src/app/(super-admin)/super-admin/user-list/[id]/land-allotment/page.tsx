import React from "react";
import prisma from "@ngvns2025/db/client";
import SendMail from "./SendMail";

function formatDateTime(date?: Date | null) {
	if (!date) return "-";
	return new Intl.DateTimeFormat("en-IN", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

function getStatusClasses(status: string) {
	const base =
		"inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border";
	switch (status) {
		case "ALLOCATED":
		case "CONFIRMED":
			return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
		case "PENDING":
			return `${base} bg-amber-50 text-amber-700 border-amber-200`;
		case "CANCELLED":
		case "REVOKED":
			return `${base} bg-rose-50 text-rose-700 border-rose-200`;
		default:
			return `${base} bg-slate-50 text-slate-700 border-slate-200`;
	}
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;

	if (!id) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
				<div className="rounded-xl border border-rose-100 bg-white px-6 py-4 text-sm text-rose-700 shadow-sm">
					User ID is required.
				</div>
			</div>
		);
	}

	const landAllotment = await prisma.landAllocation.findFirst({
		where: { userId: id },
		include: {
			landParcel: {
				include: {
					state: true,
				},
			},
			unit: true,
			user: {
				select: {
					id: true,
					fullname: true,
					email: true,
					phone: true,
					vrKpId: true,
				},
			},
		},
	});

	if (!landAllotment) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
				<div className="rounded-xl border border-amber-100 bg-white px-6 py-4 text-sm text-amber-800 shadow-sm">
					No land allotment found for this user.
				</div>
			</div>
		);
	}

	const { user, landParcel, unit, status, createdAt, updatedAt } =
		landAllotment;

	return (
		<div className="min-h-screen bg-slate-50 py-8">
			<div className="mx-auto max-w-5xl px-4">
				{/* Header */}
				<header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
							Land Allotment Details
						</h1>
						<p className="mt-1 text-sm text-slate-600">
							Admin view for VR Kisan Parivaar land allotment and mail actions.
						</p>
					</div>
					<div className="flex flex-col items-start gap-2 text-sm sm:items-end">
						{status && (
							<span className={getStatusClasses(status)}>
								Status: {status.replaceAll("_", " ")}
							</span>
						)}
						<span className="text-xs text-slate-500">
							Last updated: {formatDateTime(updatedAt)}
						</span>
					</div>
				</header>

				<div className="grid gap-6 lg:grid-cols-3">
					{/* Member Card */}
					<section className="lg:col-span-1">
						<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
							<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
								Member Details
							</h2>
							<div className="mt-4 space-y-2 text-sm">
								<div>
									<p className="text-xs font-medium text-slate-500">Name</p>
									<p className="text-sm font-medium text-slate-900">
										{user?.fullname ?? "-"}
									</p>
								</div>
								<div className="grid grid-cols-1 gap-3 text-xs text-slate-600">
									<div>
										<p className="font-medium text-slate-500">VRKP ID</p>
										<p className="font-mono text-slate-800">
											{user?.vrKpId ?? "-"}
										</p>
									</div>
									<div>
										<p className="font-medium text-slate-500">Email</p>
										<p>{user?.email ?? "-"}</p>
									</div>
									<div>
										<p className="font-medium text-slate-500">Phone</p>
										<p>{user?.phone ?? "-"}</p>
									</div>
								</div>
							</div>
							<div className="mt-4 border-t border-dashed border-slate-200 pt-3 text-xs text-slate-500">
								Allocated on: {formatDateTime(createdAt)}
							</div>
						</div>
					</section>

					{/* Land & Unit Card */}
					<section className="lg:col-span-2 space-y-6">
						<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
							<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
								Land & Unit Information
							</h2>

							<div className="mt-4 grid gap-4 md:grid-cols-2 text-sm">
								<div className="space-y-2">
									<div>
										<p className="text-xs font-medium text-slate-500">
											Land Parcel Title
										</p>
										<p className="text-sm font-medium text-slate-900">
											{landParcel?.title ?? "-"}
										</p>
									</div>
									<div>
										<p className="text-xs font-medium text-slate-500">
											Survey Number
										</p>
										<p className="font-mono text-slate-800">
											{landParcel?.surveyNumber ?? "-"}
										</p>
									</div>
									<div>
										<p className="text-xs font-medium text-slate-500">State</p>
										<p className="text-slate-800">
											{landParcel?.state?.name ?? "-"}
										</p>
									</div>
									<div>
										<p className="text-xs font-medium text-slate-500">
											Address
										</p>
										<p className="text-slate-800">
											{landParcel?.addressLine ?? "-"}
										</p>
									</div>
								</div>

								<div className="space-y-2">
									<div>
										<p className="text-xs font-medium text-slate-500">
											Unit Number
										</p>
										<p className="text-lg font-semibold text-slate-900">
											{unit?.unitNumber != null ? (
												<span>
													Unit{" "}
													<span className="inline-flex h-7 min-w-[2.5rem] items-center justify-center rounded-full bg-slate-900 px-2 text-sm font-semibold text-white">
														{unit.unitNumber}
													</span>
												</span>
											) : (
												"-"
											)}
										</p>
									</div>
									<div>
										<p className="text-xs font-medium text-slate-500">
											Unit Status
										</p>
										<p className="text-slate-800">{unit?.status ?? "N/A"}</p>
									</div>
									<div>
										<p className="text-xs font-medium text-slate-500">
											Area (Sq. Yards)
										</p>
										<p className="text-slate-800">
											{landParcel?.areaSqYards ?? "-"}
										</p>
									</div>
									<div>
										<p className="text-xs font-medium text-slate-500">
											Land Parcel ID
										</p>
										<p className="font-mono text-[11px] text-slate-700 break-all">
											{landParcel?.id ?? "-"}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Mail Actions */}
						<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
							<div className="flex items-center justify-between gap-3">
								<div>
									<h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
										Land Allotment Mail
									</h2>
									<p className="mt-1 text-xs text-slate-600">
										Trigger or re-send the official Land Allotment letter to the
										member&apos;s registered email address.
									</p>
								</div>
							</div>

							<div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
								<p>
									<b>To:</b> {user?.fullname} ({user?.email ?? "no email"})
								</p>
								<p>
									<b>Unit:</b>{" "}
									{unit?.unitNumber != null ? `Unit ${unit.unitNumber}` : "-"}{" "}
									in Survey No. {landParcel?.surveyNumber ?? "-"}
								</p>
							</div>

							<div className="mt-4">
								<SendMail userId={id} />
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default page;
