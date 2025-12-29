import React from "react";
import DistrictsPage from "../../../../../../components/common/states/districts/DistrictsPage";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: Promise<{ stateid: string }> }) => {
	const { stateid } = await params;
	if (!stateid) {
		redirect("/super-admin/states");
	}
	return (
		<div>
			<DistrictsPage stateid={stateid} />
		</div>
	);
};

export default page;
