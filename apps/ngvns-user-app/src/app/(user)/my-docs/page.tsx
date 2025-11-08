import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth/auth";
import { FaFileAlt, FaLandmark } from "react-icons/fa";
import VrKpCard from "../../../components/user/docs/vrkp-card/VrKpCard";
import Activation from "../../../components/user/docs/ulhc/Activation";
import LandAllocationPage from "../../../components/user/docs/land-allocation/LandAllocationPage";

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session || !session.user.vrKpId) redirect("/logout");

	const documents = [
		// {
		// 	title: "VR Kisan Parivaar Community Card",
		// 	desc: "Your personalized community membership card will be available here soon.",
		// 	icon: <FaLeaf className="text-[#045e5a] text-3xl" />,
		// 	active: true,
		// },
		// {
		// 	title: "ULHC Health Service Program Document",
		// 	desc: "Details of your health care benefits and partner services will be uploaded soon.",
		// 	icon: <FaHeartbeat className="text-[#045e5a] text-3xl" />,
		// 	active: true,
		// },
		{
			title: "Insurance Policy Document",
			desc: "Insurance coverage details and policy certificate will be shared soon.",
			icon: <FaFileAlt className="text-[#045e5a] text-3xl" />,
			active: true,
		},
		// {
		// 	title: "Land Document",
		// 	desc: "Your allotted land details and ownership documents will appear here once ready.",
		// 	icon: <FaLandmark className="text-[#045e5a] text-3xl" />,
		// 	active: true,
		// },
	];

	return (
		<div className="min-h-screen bg-white px-6 py-10">
			<div className="mx-auto max-w-3xl">
				<h1 className="mb-8 text-3xl font-bold text-[#045e5a]">
					{session.user.fullname}&apos;s Documents
				</h1>
				<VrKpCard userId={session.user.id} />
				<Activation />
				<LandAllocationPage />
				<div className="space-y-6">
					{documents.map((doc, i) => (
						<article
							key={doc.title}
							className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
							{/* Flag rail */}
							<div className="absolute inset-y-0 left-0 w-2">
								<div className="h-1/3 bg-[#FF9933]" />
								<div className="h-1/3 bg-white" />
								<div className="h-1/3 bg-[#138808]" />
							</div>

							{/* Faint Ashoka Chakra watermark */}
							<svg
								viewBox="0 0 100 100"
								className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 opacity-10"
								aria-hidden="true">
								<circle
									cx="50"
									cy="50"
									r="34"
									fill="none"
									stroke="#0b5ba7"
									strokeWidth="3"
								/>
								{Array.from({ length: 24 }).map((_, k) => {
									const a = (k * Math.PI) / 12;
									const x1 = 50 + 4 * Math.cos(a);
									const y1 = 50 + 4 * Math.sin(a);
									const x2 = 50 + 32 * Math.cos(a);
									const y2 = 50 + 32 * Math.sin(a);
									return (
										<line
											key={k}
											x1={x1}
											y1={y1}
											x2={x2}
											y2={y2}
											stroke="#0b5ba7"
											strokeWidth="2"
										/>
									);
								})}
								<circle cx="50" cy="50" r="3" fill="#0b5ba7" />
							</svg>

							<div className="pl-4 md:pl-5">
								<div className="flex items-start gap-4 p-6">
									<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0faf9] ring-1 ring-[#045e5a]/20">
										{doc.icon}
									</div>
									<div className="flex-1">
										<div className="flex flex-wrap items-center gap-3">
											<h2 className="text-lg font-semibold text-gray-900">
												{doc.title}
											</h2>
											{/* <span className="rounded-full border border-[#0b5ba7]/30 bg-[#0b5ba7]/5 px-3 py-1 text-xs font-medium text-[#0b5ba7]">
												Coming Soon
											</span> */}
										</div>
										<p className="mt-2 text-sm text-gray-600">{doc.desc}</p>

										{/* Placeholder preview area */}
										<div className="mt-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-4">
											<div className="flex items-center justify-between">
												<div>
													<p className="text-sm font-medium text-gray-700">
														Placeholder
													</p>
													<p className="text-xs text-gray-500">
														This section will display your document preview and
														download action.
													</p>
												</div>
												<button
													type="button"
													className="rounded-lg bg-gradient-to-r from-[#FF9933] via-[#0b5ba7] to-[#138808] px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
													disabled
													aria-disabled
													title="Coming Soon">
													View / Download
												</button>
											</div>
										</div>
									</div>
								</div>

								{/* Flag underline accent */}
								<div className="grid grid-cols-3">
									<div className="h-1 bg-[#FF9933]" />
									<div className="h-1 bg-[#0b5ba7]" />
									<div className="h-1 bg-[#138808]" />
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</div>
	);
}
