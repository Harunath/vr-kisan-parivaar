import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../../../../lib/auth/auth";
import { AdminRole } from "@ngvns2025/db/client";
import { redirect } from "next/navigation";
import ExportInsuranceButton from "../ExportInsuranceButton";

const page = async () => {
	const session = await getServerSession(authOptions);
	if (!session || session.user.role !== AdminRole.SUPER) {
		redirect("/logout");
	}
	return (
		<div>
			<ExportInsuranceButton />
		</div>
	);
};

export default page;
