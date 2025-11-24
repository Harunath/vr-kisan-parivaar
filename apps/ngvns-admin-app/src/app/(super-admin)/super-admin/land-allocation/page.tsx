import prisma from "@ngvns2025/db/client";
import React, { Suspense } from "react";
import LandParcelsPage from "../../../../components/common/lands/LandPacelPage";

const page = async () => {
	const lands = await prisma.landParcel.findMany({
		where: { state: { code: { in: ["TG", "AP", "KA"] } } },
		take: 10,
	});
	return (
		<div className="p-4">
			<Suspense fallback={<div>Loading Land Parcels...</div>}>
				<LandParcelsPage />
			</Suspense>
		</div>
	);
};

export default page;
