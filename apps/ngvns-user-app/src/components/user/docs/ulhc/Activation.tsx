import prisma from "@ngvns2025/db/client";
import React from "react";
import { authOptions } from "../../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import ULCHProgram from "./ULHCProgram";

const Activation = async () => {
	const session = await getServerSession(authOptions);
	if (!session || !session.user.vrKpId) return null;
	const vrkpId = session.user.vrKpId;
	const ulhc = await prisma.user.findUnique({
		where: { vrKpId: vrkpId },
		select: {
			healthCard: true,
		},
	});

	return (
		<div>
			<ULCHProgram vrkpId={vrkpId} program={ulhc?.healthCard ? true : false} />
		</div>
	);
};

export default Activation;
