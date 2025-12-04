// app/super-admin/marketing-teams/[marketing_team_id]/page.tsx
import prisma, { MarketingRole } from "@ngvns2025/db/client";
import Link from "next/link";

// Revalidate once a day (~24h)
export const revalidate = 86400;

type PageProps = {
	params: Promise<{ marketing_team_id: string }>;
};

export default async function MarketingTeamPage({ params }: PageProps) {
	const marketingTeamId = (await params).marketing_team_id;

	if (!marketingTeamId) {
		return (
			<div className="min-h-screen bg-neutral-50 px-6 py-10">
				<div className="mx-auto max-w-5xl">
					<h1 className="text-xl font-semibold text-red-600">
						Invalid Marketing Team ID
					</h1>
					<Link
						href="/super-admin/marketing-teams"
						className="mt-4 inline-block text-blue-600 hover:underline">
						← Back to Teams
					</Link>
				</div>
			</div>
		);
	}

	const marketingTeam = await prisma.marketingTeam.findUnique({
		where: { id: marketingTeamId },
		include: {
			members: {
				select: {
					id: true,
					role: true,
					userId: true,
					user: { select: { id: true, fullname: true, email: true } },
				},
			},
			_count: { select: { members: true, users: true } },
		},
	});

	return (
		<div className="min-h-screen bg-neutral-50 px-6 py-10">
			<div className="mx-auto max-w-6xl">
				{/* Header */}
				<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="text-sm text-gray-500">
							<Link
								href="/super-admin/marketing-teams"
								className="hover:underline">
								Marketing Teams
							</Link>{" "}
							/ <span className="text-gray-700">Details</span>
						</div>
						<h1 className="mt-1 text-2xl font-bold text-gray-900">
							{marketingTeam
								? (marketingTeam.name ?? "Marketing Team")
								: "Marketing Team"}
						</h1>
						{marketingTeam?.description && (
							<p className="mt-1 text-sm text-gray-600">
								{marketingTeam.description}
							</p>
						)}
					</div>

					<div className="flex flex-wrap gap-3">
						{marketingTeam &&
							!marketingTeam.members.some(
								(m) => m.role !== MarketingRole.GENERAL_MANAGER
							) && (
								<Link
									href={`/super-admin/marketing-teams/${marketingTeamId}/add-general-manager`}
									className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
									+ Add General Manager
								</Link>
							)}

						<Link
							href="/super-admin/marketing-teams"
							className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
							← Back
						</Link>
					</div>
				</div>

				{!marketingTeam ? (
					<div className="rounded-xl border border-red-100 bg-white p-6 shadow-sm">
						<h2 className="text-lg font-semibold text-red-600">
							Marketing Team not found
						</h2>
						<p className="mt-1 text-sm text-gray-600">
							The team you&apos;re looking for doesn&apos;t exist or was
							removed.
						</p>
					</div>
				) : (
					<>
						{/* Meta / ID */}
						<div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
							<div className="grid gap-4 sm:grid-cols-3">
								<div>
									<p className="text-xs uppercase tracking-wide text-gray-500">
										Team ID
									</p>
									<p className="mt-1 break-all font-medium text-gray-900">
										{marketingTeam.id}
									</p>
								</div>
								<div>
									<p className="text-xs uppercase tracking-wide text-gray-500">
										General Manager
									</p>
								</div>
								<div>
									<p className="text-xs uppercase tracking-wide text-gray-500">
										Status
									</p>
									<span className="mt-1 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
										Active
									</span>
								</div>
								<div>
									<p className="text-xs uppercase tracking-wide text-gray-500">
										Total Marketing Members
									</p>
									<span className="mt-1 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
										{marketingTeam._count.members}
									</span>
								</div>
								<div>
									<p className="text-xs uppercase tracking-wide text-gray-500">
										Total Members Added
									</p>
									<span className="mt-1 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
										{marketingTeam._count.users}
									</span>
								</div>
							</div>
						</div>

						{/* Managers List */}
						<div className="rounded-xl border bg-white p-5 shadow-sm">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-gray-900">
									Marketing Team
								</h2>
							</div>

							{marketingTeam.members.length === 0 ? (
								<div className="mt-4 rounded-lg border border-dashed p-6 text-center text-sm text-gray-600">
									No managers found. Click{" "}
									<span className="font-medium">“+ Add Manager”</span> to assign
									one.
								</div>
							) : (
								<ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
									{marketingTeam.members.map((member) => (
										<li
											key={member.id}
											className="group rounded-lg border bg-white p-4 transition hover:shadow-sm">
											<div className="flex items-start justify-between gap-3">
												<div>
													<p className="text-base font-semibold text-gray-900">
														{member.user.fullname || "Unnamed User"}
													</p>
													<p className="mt-0.5 text-sm text-gray-600">
														Role:{" "}
														<span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-blue-700">
															{member.role}
														</span>
													</p>
													<p className="mt-1 text-sm text-gray-600">
														User ID:{" "}
														<span className="break-all">{member.userId}</span>
													</p>
													{member.user.email && (
														<p className="mt-1 text-sm text-gray-700">
															Email:{" "}
															<a
																href={`mailto:${member.user.email}`}
																className="text-blue-600 underline underline-offset-2 hover:text-blue-700">
																{member.user.email}
															</a>
														</p>
													)}
												</div>
												<Link
													href={`/super-admin/users/${member.user.id}`}
													className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50">
													View User
												</Link>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
