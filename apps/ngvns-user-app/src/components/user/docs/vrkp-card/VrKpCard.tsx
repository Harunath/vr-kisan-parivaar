import React from "react";
import prisma from "@ngvns2025/db/client";
import GetVrKpCard from "./GetVrKpCard";

const VrKpCard = async ({ userId }: { userId: string }) => {
	if (!userId) {
		return <div>Please log in to view your VRKP Card.</div>;
	}
	const VrKpCard = await prisma.vRKP_Card.findUnique({
		where: { userId },
	});
	// async function handleDownload() {
	// 	if (!VrKpCard?.cardUrl) return;
	// 	const res = await fetch(VrKpCard?.cardUrl);
	// 	const blob = await res.blob();
	// 	const url = URL.createObjectURL(blob);
	// 	const a = document.createElement("a");
	// 	a.href = url;
	// 	a.download = "VRKP-Card.webp";
	// 	a.click();
	// 	URL.revokeObjectURL(url);
	// }

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			vrKpId: true,
			fullname: true,
			dob: true,
			createdAt: true,
			// userPhoto: true,
		},
	});
	if (!user) {
		return <div>User not found.</div>;
	}
	return (
		<div>
			{" "}
			<GetVrKpCard
				vrkpcard={VrKpCard?.cardUrl ? VrKpCard?.cardUrl : null}
			/>{" "}
		</div>
	);
};

export default VrKpCard;
