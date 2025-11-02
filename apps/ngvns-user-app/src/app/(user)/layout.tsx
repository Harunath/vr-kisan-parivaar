import { getServerSession } from "next-auth";
import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";
import { authOptions } from "../../lib/auth/auth";
import { redirect } from "next/navigation";
import UserNavbar from "../../components/common/UserNav";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		redirect("/login");
	}
	return (
		<div className="min-h-screen w-screen bg-neutral-100">
			<UserNavbar
				canViewRefs={!!session.user.canRefer && !session.user.marketingMember}
			/>
			<div className="min-h-[80vh]">{children}</div>
			<Footer />
		</div>
	);
}
