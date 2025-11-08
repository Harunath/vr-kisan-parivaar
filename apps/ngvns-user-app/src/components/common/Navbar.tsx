"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import AuthButton from "../auth/login/AuthButton";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const navRef = useRef<HTMLDivElement>(null);

	// Close dropdown or mobile nav on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
			if (navRef.current && !navRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Smooth close when a link is clicked
	const handleLinkClick = () => {
		setIsOpen(false);
		setIsDropdownOpen(false);
	};

	return (
		<header className="bg-white/70 text-black sticky top-0 z-50 backdrop-blur-lg shadow-md">
			<div className="w-full px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
				{/* Logo */}
				<Link href="/" className="flex items-center">
					<Image
						src="https://res.cloudinary.com/diaoy3wzi/image/upload/v1756982391/vrKP-4_no_bg_jndjxt.png"
						alt="VR KP Logo"
						width={160}
						height={60}
						className="h-12 md:h-16 w-auto object-contain"
						priority
					/>
				</Link>

				{/* Mobile Menu Button */}
				<button
					className="md:hidden text-2xl text-black focus:outline-none"
					onClick={() => setIsOpen((prev) => !prev)}>
					{isOpen ? <FaTimes /> : <FaBars />}
				</button>

				{/* Navigation */}
				<nav
					ref={navRef}
					className={`fixed md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent transition-all duration-300 ease-in-out shadow-md md:shadow-none ${
						isOpen
							? "opacity-100 translate-y-0 visible"
							: "opacity-0 -translate-y-2 invisible md:visible md:opacity-100 md:translate-y-0"
					}`}>
					<ul className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 px-6 py-4 md:py-0 text-sm md:text-base font-medium">
						<li>
							<Link
								href="/"
								onClick={handleLinkClick}
								className="block py-2 hover:text-orange-600 transition-colors">
								Home
							</Link>
						</li>
						<li>
							<Link
								href="/about"
								onClick={handleLinkClick}
								className="block py-2 hover:text-orange-600 transition-colors">
								About Us
							</Link>
						</li>

						{/* Our Work Dropdown */}
						<li className="relative">
							<div ref={dropdownRef}>
								<button
									onClick={() => setIsDropdownOpen((prev) => !prev)}
									className="flex items-center gap-1 py-2 hover:text-orange-600 transition-colors focus:outline-none">
									Our Work ▾
								</button>

								{isDropdownOpen && (
									<div className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg w-64 border border-gray-100 z-50">
										<ul className="py-2">
											{(
												[
													[
														"Self-Sustainable Villages",
														"/our-work/self-sustainable-villages",
													],
													["Natural Farming", "/our-work/natural-farming"],
													["Green Energy", "/our-work/green-energy"],
													["Rural Employment", "/our-work/rural-employment"],
													["Women Empowerment", "/our-work/women-empowerment"],
													["Agri-Waste Management", "/our-work/agri-waste"],
													["Livestock Management", "/our-work/livestock"],
												] as [string, string][]
											).map(([label, href]) => (
												<li key={label}>
													<Link
														href={href}
														onClick={handleLinkClick}
														className="block px-4 py-2 text-sm hover:bg-orange-600 hover:text-white rounded transition-colors">
														{label}
													</Link>
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</li>
						<li>
							<Link
								href="/shop"
								onClick={handleLinkClick}
								className="block py-2 hover:text-orange-600 transition-colors">
								Shop
							</Link>
						</li>

						<li>
							<Link
								href="/careers"
								onClick={handleLinkClick}
								className="block py-2 hover:text-orange-600 transition-colors">
								Careers
							</Link>
						</li>
						<li>
							<Link
								href="/contact"
								onClick={handleLinkClick}
								className="block py-2 hover:text-orange-600 transition-colors">
								Contact
							</Link>
						</li>

						{/* Auth Button */}
						<li className="pt-2 md:pt-0">
							<AuthButton />
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
}
