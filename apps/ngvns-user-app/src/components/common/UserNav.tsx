"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import Logout from "../auth/Logout";
import { AnimatePresence, motion } from "motion/react";

export default function UserNavbar({ canViewRefs }: { canViewRefs: boolean }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);
	const navRef = useRef<HTMLDivElement>(null);
	const ref = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);
	const [openLogout, setOpenLogout] = useState(false);
	// calculate dropdown height for motion animation
	useEffect(() => {
		if (ref.current) setHeight(ref.current.scrollHeight);
	}, [isDropdownOpen]);

	// handle outside click close
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as Node;
			if (
				(dropdownRef.current && dropdownRef.current.contains(target)) ||
				(navRef.current && navRef.current.contains(target))
			)
				return;

			setIsDropdownOpen(false);
			setIsOpen(false);
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// handle link click (closes everything)
	const handleLinkClick = () => {
		setIsOpen(false);
		setIsDropdownOpen(false);
	};

	return (
		<header className="bg-transparent text-black sticky top-0 z-50 backdrop-blur-md backdrop-saturate-150 shadow-lg">
			<div className="w-full px-5 md:px-10 h-16 md:h-20 flex items-center justify-between">
				{/* Logo */}
				{openLogout && <Logout openLogout={openLogout} set={setOpenLogout} />}
				<Link
					href="/"
					className="flex items-center transition-transform hover:scale-[1.02]"
					onClick={handleLinkClick}>
					<Image
						src="https://res.cloudinary.com/dwsm6i6z9/image/upload/v1770361958/VR_KP_Logo_zgv7j5.png"
						alt="VR KP Logo"
						width={240}
						height={96}
						className="h-14 w-auto object-contain"
						priority
					/>
				</Link>

				{/* Hamburger */}
				<div className="md:hidden">
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="p-2 rounded-md hover:bg-gray-100 transition">
						{isOpen ? (
							<FaTimes className="text-black text-2xl" />
						) : (
							<FaBars className="text-black text-2xl" />
						)}
					</button>
				</div>

				{/* Nav Links */}
				<nav
					ref={navRef}
					className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent transition-all duration-300 ease-in-out ${
						isOpen
							? "opacity-100 translate-y-0 visible shadow-md"
							: "opacity-0 -translate-y-3 invisible md:visible md:opacity-100 md:translate-y-0 md:shadow-none"
					}`}>
					<div className="flex flex-col md:flex-row md:items-center gap-5 px-6 md:px-0 py-5 md:py-0 text-[16px] font-semibold text-gray-800">
						<Link
							href="/"
							onClick={handleLinkClick}
							className="hover:text-orange-500 transition-colors">
							Home
						</Link>
						{canViewRefs && (
							<>
								<Link
									href="/my-teams"
									onClick={handleLinkClick}
									className="hover:text-orange-500 transition-colors">
									My Community
								</Link>
								<Link
									href="/my-earnings"
									onClick={handleLinkClick}
									className="hover:text-orange-500 transition-colors">
									My Earnings
								</Link>
							</>
						)}
						<Link
							href="/profile"
							onClick={handleLinkClick}
							className="hover:text-orange-500 transition-colors">
							My Profile
						</Link>

						{/* User Dropdown */}
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="mt-3 md:mt-0 flex items-center justify-center bg-[#138808] hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors duration-300">
								<FiUser className="text-lg" />
							</button>

							<AnimatePresence initial={false} mode="wait">
								{isDropdownOpen && (
									<motion.div
										initial={{ height: 0, opacity: 0, y: -10 }}
										animate={{ height, opacity: 1, y: 0 }}
										exit={{ height: 0, opacity: 0, y: -10 }}
										transition={{ duration: 0.25, ease: "easeInOut" }}
										className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
										<div ref={ref}>
											<Link
												href="/dashboard"
												onClick={handleLinkClick}
												className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
												Dashboard
											</Link>
											<Link
												href="/my-docs"
												onClick={handleLinkClick}
												className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
												My Documents
											</Link>
											<Link
												href="/settings/password"
												onClick={handleLinkClick}
												className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
												Change Password
											</Link>
											<button
												className="mx-auto w-full px-2 py-1 text-neutral-100 bg-red-600 hover:text-neutral-800 hover:bg-red-200 rounded"
												onClick={() => setOpenLogout(true)}>
												Logout
											</button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
				</nav>
			</div>
		</header>
	);
}
