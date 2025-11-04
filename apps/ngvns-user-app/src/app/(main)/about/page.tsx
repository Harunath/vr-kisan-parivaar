import React from "react";
import AboutBanner from "../../../components/about/AboutBanner";
import WhoWeAre from "../../../components/about/WhoWeAre";
import Vision from "../../../components/about/Vision";
import Mission from "../../../components/about/Mission";
import WhyJoinUs from "../../../components/about/JoinUsSection";

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
