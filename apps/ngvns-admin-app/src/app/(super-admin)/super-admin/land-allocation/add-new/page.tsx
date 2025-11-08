import prisma from "@ngvns2025/db/client";
import React from "react";
import LandParcelCreateForm from "./AddingNewLand";

async function page() {
	const states = await prisma.states.findMany({
		select: {
			id: true,
			name: true,
			code: true,
		},
	});
	if (!states) {
		return <div>No States Found</div>;
	}
	return (
		<div>
			<LandParcelCreateForm states={states} />
		</div>
	);
}

export default page;
