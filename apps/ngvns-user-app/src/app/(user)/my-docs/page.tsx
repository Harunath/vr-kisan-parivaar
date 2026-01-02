import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth/auth";
import { FaFileAlt, FaLandmark } from "react-icons/fa";
import VrKpCard from "../../../components/user/docs/vrkp-card/VrKpCard";
import Activation from "../../../components/user/docs/ulhc/Activation";
import LandAllocationPage from "../../../components/user/docs/land-allocation/LandAllocationPage";
import ViewInsurance from "../../../components/user/docs/insurance/ViewInsurance";

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
		// {
		// 	title: "Insurance Policy Document",
		// 	desc: "Insurance coverage details and policy certificate will be shared soon.",
		// 	icon: <FaFileAlt className="text-[#045e5a] text-3xl" />,
		// 	active: true,
		// },
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
				{/* <LandAllocationPage /> */}
				<ViewInsurance />
			</div>
		</div>
	);
}
