"use client";

import Link from "next/link";
import Image from "next/image";
import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="bg-[#001f3f] text-white w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
				{/* About */}
				<div>
					<div className="mb-4">
						<Image
							src="https://res.cloudinary.com/diaoy3wzi/image/upload/v1756982391/vrKP-4_no_bg_jndjxt.png"
							alt="VR KP Logo"
							width={180}
							height={50}
							className="h-18 w-auto object-contain"
							priority
						/>
					</div>
					<p className="text-sm text-slate-300 leading-relaxed">
						Empowering rural India through sustainability, innovation, and
						inclusion. Together, we build self-reliant villages for a better
						tomorrow.
					</p>
				</div>

				{/* Quick Links */}
				<div>
					<h3 className="text-md font-semibold text-[#FF9933] mb-3">
						Quick Links
					</h3>
					<ul className="space-y-2 text-sm">
						{(
							[
								["Home", "/"],
								["About Us", "/about"],
								["Contact", "/contact"],
							] as [string, string][]
						).map(([label, href]) => (
							<li key={label}>
								<Link href={href} className="hover:text-[#FF9933]">
									{label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Our Work */}
				<div>
					<h3 className="text-md font-semibold text-[#FF9933] mb-3">
						Our Work
					</h3>
					<ul className="space-y-2 text-sm text-slate-300">
						<li>
							<Link
								href="/our-work/self-sustainable-villages"
								className="hover:text-[#FF9933]">
								Self-Sustainable Villages
							</Link>
						</li>
						<li>
							<Link
								href="/our-work/natural-farming"
								className="hover:text-[#FF9933]">
								Natural Farming
							</Link>
						</li>
						<li>
							<Link
								href="/our-work/women-empowerment"
								className="hover:text-[#FF9933]">
								Women Empowerment
							</Link>
						</li>
						<li>
							<Link
								href="/our-work"
								className="hover:text-[#FF9933] font-medium text-white">
								→ View All Programs
							</Link>
						</li>
						{/* <li>
							<Link
								href="/member"
								className="hover:text-[#FF9933] font-medium text-white">
								✅ Become a Member
							</Link>
						</li> */}
					</ul>
				</div>

				{/* Contact + Social */}
				<div>
					<h3 className="text-md font-semibold text-[#FF9933] mb-3">
						Contact Us
					</h3>
					<p className="text-sm text-slate-300 mb-4 leading-relaxed">
						Email: support@vrkisanparivaar.com
						<br />
						Phone: +91 99086 33412
						<br />
						Address: #101,Rajeswari Towers,Dwarakapuri Colony,
						Panjagutta,Hyderabad - 500082
					</p>
					<a
						href="tel:+919908633412"
						className="inline-block mb-4 px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition">
						📞 Call Support
					</a>
					<div className="flex space-x-4 text-xl">
						{[
							{ href: "#", icon: <FaFacebookF />, color: "#1877F2" },
							{ href: "#", icon: <FaTwitter />, color: "#1DA1F2" },
							{ href: "#", icon: <FaInstagram />, color: "#E1306C" },
							{ href: "#", icon: <FaLinkedin />, color: "#0077B5" },
						].map(({ href, icon, color }, idx) => (
							<a
								key={idx}
								href={href}
								aria-label="Social link"
								className={`text-[${color}] hover:text-[#FF9933] transition-colors duration-300`}>
								{icon}
							</a>
						))}
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-slate-700 py-4 text-center text-xs text-slate-400 px-4 space-y-2">
				<div>
					&copy; {new Date().getFullYear()} VR KISAN PARIVAAR PRIVATE LIMITED.
					All rights reserved.
				</div>
				<div className="flex flex-wrap justify-center space-x-4">
					<Link
						href="/legals/terms-and-conditions"
						className="hover:text-[#FF9933]">
						Terms & Conditions
					</Link>
					<Link href="/legals/privacy-policy" className="hover:text-[#FF9933]">
						Privacy Policy
					</Link>
				</div>
				<div>
					Developed by{" "}
					<a
						href="https://www.vrtechforz.com/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-[#72d275] hover:underline">
						VR Tech Forz
					</a>
				</div>
			</div>
		</footer>
	);
}
