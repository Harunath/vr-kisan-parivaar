"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function AuthNavbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<header className="bg-transparent text-black sticky top-0 z-50 backdrop-blur-md backdrop-saturate-150 shadow-lg">
			<div className="w-full px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
				{/* Logo */}
				<div className="flex items-center ml-4 md:ml-8">
					<Link href="/" className="flex items-center">
						<Image
							src="https://res.cloudinary.com/diaoy3wzi/image/upload/v1756982391/vrKP-4_no_bg_jndjxt.png"
							alt="VR KP Logo"
							width={180}
							height={60}
							className="h-12 md:h-16 w-auto object-contain"
							priority
						/>
					</Link>
				</div>

				{/* Hamburger for mobile */}
				<div className="md:hidden">
					<button onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? (
							<FaTimes className="text-black text-xl" />
						) : (
							<FaBars className="text-black text-xl" />
						)}
					</button>
				</div>

				{/* Nav Links */}
				<nav
					className={`absolute md:static top-16 left-0 w-full md:w-auto px-6 md:px-0 py-4 md:py-0 md:flex items-center gap-6 text-md  font-semibold ${
						isOpen ? "block bg-white text-black" : "hidden md:block"
					}`}></nav>
			</div>
		</header>
	);
}
