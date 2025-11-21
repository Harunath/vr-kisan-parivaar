"use client";
import React from "react";
import {
	FaEnvelope,
	FaGlobe,
	FaMapMarkerAlt,
	FaPaperPlane,
	FaPhone,
} from "react-icons/fa";

const ContactMain = () => {
	return (
		<section className="relative bg-white text-slate-900">
			{/* background texture */}
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(70rem_70rem_at_120%_-10%,#fff7ed_10%,transparent_60%),radial-gradient(40rem_40rem_at_-10%_110%,#ecfdf5_10%,transparent_60%)]" />

			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
				{/* header */}
				<header className="text-center mb-14">
					<span className="inline-block rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold tracking-widest text-orange-700">
						CONTACT
					</span>
					<h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
						Let’s Start a Conversation
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-slate-600">
						Have questions or want to know more about our initiatives? We’re
						here to help. Reach out anytime—our team will respond promptly.
					</p>
				</header>

				<div className="grid gap-8 md:grid-cols-2">
					{/* left: contact info */}
					<div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
						<div className="mb-6">
							<h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-2 border-b border-neutral-200 pb-2">
								Connect with Us
							</h2>
							<div className="h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 to-emerald-500" />
						</div>

						<div className="space-y-6">
							{/* Section Title */}
							{/* Address */}
							<div className="flex items-start gap-4">
								<div className="rounded-lg bg-purple-100 p-3 text-purple-700">
									<FaMapMarkerAlt className="text-xl" />
								</div>
								<div>
									<h3 className="text-sm font-semibold text-slate-900">
										Address
									</h3>
									<p className="text-slate-700">
										#101, Rajeswari Towers, Dwarakapuri Colony,
										<br />
										Panjagutta, Hyderabad - 500082
									</p>
								</div>
							</div>
							{/* Phone */}
							<div className="flex items-start gap-4">
								<div className="rounded-lg bg-blue-100 p-3 text-blue-700">
									<FaPhone className="text-xl" />
								</div>
								<div>
									<h3 className="text-sm font-semibold text-slate-900">
										Phone
									</h3>
									<a
										href="tel:+919908633412"
										className="text-slate-700 hover:text-slate-900 hover:underline">
										+91 99086 33412
									</a>
								</div>
							</div>

							{/* Email */}
							<div className="flex items-start gap-4">
								<div className="rounded-lg bg-orange-100 p-3 text-orange-600">
									<FaEnvelope className="text-xl" />
								</div>
								<div>
									<h3 className="text-sm font-semibold text-slate-900">
										Email
									</h3>
									<a
										href="mailto:support@vrkisanparivaar.com"
										className="text-slate-700 hover:text-slate-900 hover:underline">
										support@vrkisanparivaar.com
									</a>
								</div>
							</div>

							{/* Website */}
							<div className="flex items-start gap-4">
								<div className="rounded-lg bg-emerald-100 p-3 text-emerald-700">
									<FaGlobe className="text-xl" />
								</div>
								<div>
									<h3 className="text-sm font-semibold text-slate-900">
										Website
									</h3>
									<a
										href="https://www.vrkisanparivaar.com/"
										target="_blank"
										rel="noreferrer"
										className="text-blue-700 hover:underline break-all">
										www.vrkisanparivaar.com
									</a>
								</div>
							</div>
						</div>

						<p className="mt-10 text-sm text-slate-500">
							We typically reply within 1–2 business days.
						</p>
					</div>

					{/* right: form */}
					<div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
						<form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div>
									<label
										htmlFor="name"
										className="mb-1 block text-sm font-semibold text-slate-800">
										Name <span className="text-orange-600">*</span>
									</label>
									<input
										id="name"
										name="name"
										type="text"
										placeholder="Your Name"
										required
										className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
									/>
								</div>

								<div>
									<label
										htmlFor="email"
										className="mb-1 block text-sm font-semibold text-slate-800">
										Email <span className="text-orange-600">*</span>
									</label>
									<input
										id="email"
										name="email"
										type="email"
										placeholder="you@example.com"
										required
										className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
									/>
								</div>

								<div>
									<label
										htmlFor="mobile"
										className="mb-1 block text-sm font-semibold text-slate-800">
										Mobile Number <span className="text-orange-600">*</span>
									</label>
									<input
										id="mobile"
										name="mobile"
										type="tel"
										placeholder="10-digit mobile"
										pattern="[0-9]{10}"
										maxLength={10}
										inputMode="numeric"
										required
										className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
									/>
								</div>

								<div>
									<label
										htmlFor="subject"
										className="mb-1 block text-sm font-semibold text-slate-800">
										Subject
									</label>
									<input
										id="subject"
										name="subject"
										type="text"
										placeholder="How can we help?"
										className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="message"
									className="mb-1 block text-sm font-semibold text-slate-800">
									Message
								</label>
								<textarea
									id="message"
									name="message"
									rows={6}
									placeholder="Your Message"
									className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
								/>
							</div>

							<div className="flex flex-wrap items-center gap-3 mt-4">
								<button
									type="submit"
									className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-orange-300">
									<FaPaperPlane className="text-xs transition group-hover:translate-x-0.5" />
									Send
								</button>
								<p className="text-xs text-slate-500">
									By submitting, you agree to be contacted regarding your
									inquiry.
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ContactMain;
