import React from "react";
import ContactMain from "../../../components/contact/ContactMain";
import FAQSection from "../../../components/contact/Faq";

// app/services/web-development/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact VR Kisan Parivaar",
	description:
		"Have questions or want to know more about VR Kisan Parivaar? We’re here to help. Reach out anytime—our team will respond promptly.",
	keywords: [
		"contact VR Kisan Parivaar",
		"@vrkisanparivaar.com",
		"#101, Rajeswari Towers, Dwarakapuri Colony, Panjagutta, Hyderabad - 500082",
		"Hyderabad",
	],
};

function page() {
	return (
		<>
			<ContactMain />
			<FAQSection />
		</>
	);
}

export default page;
