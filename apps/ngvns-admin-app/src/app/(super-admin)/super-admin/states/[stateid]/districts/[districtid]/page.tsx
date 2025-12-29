import React from "react";
import DistrictDetailPage from "../../../../../../../components/common/states/districts/DistrictDetailPage";
import { redirect } from "next/navigation";

const page = async ({
	params,
}: {
	params: Promise<{ stateid: string; districtid: string }>;
}) => {
	const { stateid, districtid } = await params;
	if (!stateid || !districtid) {
		redirect("/super-admin/states");
	}
	return (
		<div>
			<DistrictDetailPage stateid={stateid} districtid={districtid} />
		</div>
	);
};

export default page;
