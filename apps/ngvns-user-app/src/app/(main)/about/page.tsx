import React from "react";
import AboutBanner from "../../../components/about/AboutBanner";
import WhoWeAre from "../../../components/about/WhoWeAre";
import Vision from "../../../components/about/Vision";
import Mission from "../../../components/about/Mission";
import WhyJoinUs from "../../../components/about/JoinUsSection";

// app/services/web-development/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "About VR KISAN PARIVAAR",
	description:
		"Committed to rural transformation through natural farming, clean energy, and self-sustainable villages.",
	keywords: [
		"empowers farmers",
		"rural transformation",
		"natural farming",
		"clean energy",
		"self-sustainable villages",
		"eco-friendly",
	],
};

function page() {
	return (
		<div className="bg-white">
			<AboutBanner />
			<WhoWeAre />
			<Vision />
			<Mission />
			<WhyJoinUs />
			{/* <JoinCTA /> */}
		</div>
	);
}

export default page;
