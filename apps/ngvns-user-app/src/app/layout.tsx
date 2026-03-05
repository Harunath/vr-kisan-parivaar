import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://vrkisanparivaar.com"),

	title: {
		default: "VR Kisan Parivaar",
		template: "%s | VR Kisan Parivaar",
	},

	description:
		"VR Kisan Parivaar is dedicated to transforming rural India through sustainable agriculture, community development, and farmer empowerment.",

	keywords: [
		"VR Kisan Parivaar",
		"VR Kisan Parivaar Pvt Ltd",
		"farmer community india",
		"agriculture development",
		"farmer support india",
		"rural india development",
		"sustainable farming",
		"agriculture investment",
		"farmland projects",
		"farm land investment india",
		"organic farming india",
		"kisan welfare",
		"kisan parivaar",
		"kisan parivar",
		"agriculture projects",
	],

	authors: [
		{
			name: "VR Kisan Parivaar",
			url: "https://vrkisanparivaar.com",
		},
	],

	creator: "VR Kisan Parivaar",
	publisher: "VR Kisan Parivaar",

	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},

	openGraph: {
		type: "website",
		url: "https://vrkisanparivaar.com",
		title: "VR Kisan Parivaar",
		description:
			"Transforming Rural India through agriculture, farmer empowerment and sustainable development.",
		siteName: "VR Kisan Parivaar",

		images: [
			{
				url: "/og/vr-kisan-parivaar.png",
				width: 1200,
				height: 630,
				alt: "VR Kisan Parivaar",
			},
		],
	},

	twitter: {
		card: "summary_large_image",
		title: "VR Kisan Parivaar",
		description:
			"Transforming Rural India through sustainable agriculture and farmer empowerment.",
		images: ["/og/vr-kisan-parivaar.png"],
		creator: "@vrkisanparivaar",
	},

	category: "Agriculture",
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/apple-icon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "VR Kisan Parivaar",
							url: "https://vrkisanparivaar.com",
							logo: "https://vrkisanparivaar.com/logo.png",
							sameAs: [
								"https://x.com/vrkisanparivaar",
								"https://www.instagram.com/vrkisanparivaar",
								"https://www.youtube.com/@vrkisanparivaar",
								"https://www.facebook.com/vrkisanparivaar",
							],
						}),
					}}
				/>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
