"use server";

// OR use getServerSession if v4
// import { getServerSession } from "next-auth";
import prisma from "@ngvns2025/db/client"; // adjust path
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth/auth";

export async function getActiveSessionToken() {
	try {
		const session = await getServerSession(authOptions);
		// If v4:
		// const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const user = await prisma.admin.findUnique({
			where: {
				email: session.user.id,
			},
			select: {
				activeSessionToken: true,
			},
		});
		if (user?.activeSessionToken != session.user.sessionToken) return false;
		return true;
	} catch (error) {
		console.error("Error fetching activeSessionToken:", error);
		return null;
	}
}
