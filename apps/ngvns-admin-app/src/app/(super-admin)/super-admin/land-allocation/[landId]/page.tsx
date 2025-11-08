import LandAllocationEditor from "./ui-client";

export default async function Page({
	params,
}: {
	params: Promise<{ landId: string }>;
}) {
	const { landId } = await params;
	return <LandAllocationEditor landId={landId} />;
}
