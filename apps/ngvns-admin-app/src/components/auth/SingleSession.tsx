import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth/auth";
import prisma from "@ngvns2025/db/client";
import { redirect } from "next/navigation";

const SingleSession = async () => {
	const session = await getServerSession(authOptions);
	if (!session || !session.user.sessionToken) {
		const admin = await prisma.admin.findFirst({
			where: {
				id: session?.user.id,
			},
		});
		if (session?.user.sessionToken != admin?.activeSessionToken) {
			redirect("/logout");
		}
	} else {
		redirect("/logout");
	}
};

export default SingleSession;
