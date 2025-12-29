import React from "react";
import StateDetailPage from "../../../../../components/common/states/StateDetailPage";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: Promise<{ stateid: string }> }) => {
	const { stateid } = await params;
	if (!stateid) {
		redirect("/super-admin/states");
	}
	return (
		<div>
			<StateDetailPage stateid={stateid} />
		</div>
	);
};

export default page;
