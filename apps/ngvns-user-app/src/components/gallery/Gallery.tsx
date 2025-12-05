"use client";
import Image from "next/image";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

type GalleryItem = {
	src: string;
	alt: string;
	type?: "image" | "video";
};

const items: GalleryItem[] = [
	{
		src: "https://res.cloudinary.com/diaoy3wzi/image/upload/v1754924335/WhatsApp_Image_2025-07-29_at_2.25.19_PM_e05psb.jpg",
		alt: "Sample 1",
	},
	{
		src: "https://res.cloudinary.com/dwsm6i6z9/video/upload/v1764833525/WhatsApp_Video_2025-12-04_at_13.01.19_953f8eb4_minojk.mp4",
		type: "video",
		alt: "VRKP Video",
	},
	{
		src: "https://res.cloudinary.com/dwsm6i6z9/image/upload/v1764833268/WhatsApp_Image_2025-12-04_at_12.53.54_f12e6b0a_ch37i7.jpg",
		alt: "Sample 9",
	},
	{
		src: "https://res.cloudinary.com/diaoy3wzi/image/upload/v1754924335/WhatsApp_Image_2025-07-29_at_2.25.23_PM_gcglid.jpg",
		alt: "Sample 2",
	},

	{
		src: "https://res.cloudinary.com/dwsm6i6z9/image/upload/v1764833269/WhatsApp_Image_2025-12-04_at_12.55.22_253e2754_ermn8n.jpg",
		alt: "Sample 8",
	},
	{
		src: "https://res.cloudinary.com/diaoy3wzi/image/upload/v1754924334/WhatsApp_Image_2025-07-29_at_2.25.19_PM_2_cbu57y.jpg",
		alt: "Sample 5",
	},
	{
		src: "https://res.cloudinary.com/diaoy3wzi/image/upload/v1754924335/WhatsApp_Image_2025-07-29_at_2.25.19_PM_3_jbgdgn.jpg",
		alt: "Sample 6",
	},
	{
		src: "https://res.cloudinary.com/diaoy3wzi/image/upload/v1754924334/WhatsApp_Image_2025-07-29_at_2.25.18_PM_yv3qah.jpg",
		alt: "Sample 7",
	},
];

export default function GalleryMain() {
	const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

	return (
		<main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				{/* Header */}
				<header className="mb-8">
					<h1 className="text-3xl font-semibold text-slate-900">
						Project Gallery
					</h1>
					<p className="text-sm text-slate-600">
						A curated glimpse of our recent work.
					</p>
				</header>

				{/* Masonry */}
				<div className="columns-1 gap-6 sm:columns-2 md:columns-3 lg:columns-4">
					{items.map((item, index) => (
						<div
							key={index}
							onClick={() => setSelectedItem(item)}
							className="group mb-6 break-inside-avoid rounded-xl bg-white shadow hover:shadow-xl cursor-pointer overflow-hidden">
							{/* Fix Size Here */}
							<div
								className={
									item.type === "video" ? "aspect-video" : "aspect-[4/5]"
								}>
								{item.type === "video" ? (
									<video
										src={item.src}
										autoPlay
										muted
										loop
										playsInline
										className="h-full w-full object-cover"
									/>
								) : (
									<Image
										src={item.src}
										alt={item.alt}
										width={600}
										height={600}
										className="h-full w-full object-cover"
									/>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Lightbox */}
			<AnimatePresence>
				{selectedItem && (
					<motion.div
						className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setSelectedItem(null)}>
						{/* Close */}
						<button
							className="absolute top-6 right-6 bg-white p-2 rounded-full shadow"
							onClick={(e) => {
								e.stopPropagation();
								setSelectedItem(null);
							}}>
							<IoClose size={22} />
						</button>

						<motion.div
							className="max-w-5xl max-h-[90vh] p-4"
							onClick={(e) => e.stopPropagation()}>
							{/* Lightbox Media */}
							<div className="rounded-xl overflow-hidden max-h-[85vh]">
								{selectedItem.type === "video" ? (
									<video
										src={selectedItem.src}
										controls
										autoPlay
										muted
										loop
										className="max-h-[85vh] w-full object-contain"
									/>
								) : (
									<Image
										src={selectedItem.src}
										alt={selectedItem.alt}
										width={1200}
										height={1200}
										className="max-h-[85vh] w-full object-contain"
										unoptimized
									/>
								)}
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</main>
	);
}
