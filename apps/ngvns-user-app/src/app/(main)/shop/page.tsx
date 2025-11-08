import React from "react";
import { FaShoppingBag } from "react-icons/fa";

export default function Page() {
	return (
		<section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#f9f9f9] to-[#f3f3f3] text-neutral-900 overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/10 via-white to-[#138808]/10 pointer-events-none" />
			<div className="absolute -top-20 -left-20 w-72 h-72 bg-[#FF9933]/10 rounded-full blur-3xl" />
			<div className="absolute bottom-0 -right-20 w-72 h-72 bg-[#138808]/10 rounded-full blur-3xl" />

			<div className="relative z-10 w-full max-w-3xl px-6 text-center">
				<div className="flex flex-col items-center justify-center mb-6 space-y-3">
					<FaShoppingBag className="text-[#FF9933] text-6xl drop-shadow-sm" />
					<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#000080]">
						VR Mart
					</h1>
				</div>

				<h2 className="mt-2 text-2xl md:text-3xl font-semibold text-neutral-800">
					Coming Soon
				</h2>

				<p className="mx-auto mt-5 max-w-2xl text-neutral-700 md:text-lg leading-relaxed">
					Your one-stop destination for quality essentials, amazing deals, and
					lightning-fast delivery.
					<br />
					We’re getting ready to serve you better — stay tuned!
				</p>

				<div className="mx-auto mt-10 h-1 w-48 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-full" />
			</div>

			<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
		</section>
	);
}
