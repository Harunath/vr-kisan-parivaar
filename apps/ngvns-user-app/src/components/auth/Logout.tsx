"use client";
import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

function Logout({
	openLogout,
	set,
}: {
	openLogout: boolean;
	set: (val: boolean) => void;
}) {
	const [loading, setLoading] = useState(false);

	return (
		<>
			<AnimatePresence mode="wait">
				{openLogout && (
					<motion.div
						initial={{ scale: 0.96, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.96, opacity: 0 }}
						transition={{ duration: 0.18, ease: "easeInOut" }}
						// Full viewport overlay, independent of parent
						className="fixed inset-0 w-screen h-screen z-[9999] backdrop-blur-2xl bg-black/45 flex items-center justify-center">
						<div
							className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm"
							onClick={() => set(false)}
						/>
						{/* Modal */}
						<div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-sm">
							<p className="mb-4">Are you sure you want to logout?</p>
							<div className="flex justify-end space-x-4">
								<button
									className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
									onClick={() => set(false)}>
									Cancel
								</button>
								<button
									className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
									onClick={() => {
										setLoading(true);
										signOut({ callbackUrl: "/login" });
									}}>
									{loading ? "Signing out..." : "Logout"}
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default Logout;
