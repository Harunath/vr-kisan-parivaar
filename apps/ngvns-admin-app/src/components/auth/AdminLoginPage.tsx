"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getActiveSessionToken } from "../../app/actions/user";

export default function AdminLoginPage() {
	const router = useRouter();
	const { data: session } = useSession();

	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	// If already logged in, redirect
	useEffect(() => {
		redirecting();
	}, [session, router]);

	const redirecting = () => {
		if (session?.user?.id) {
			console.log("Already logged in as", session.user);
			const getSession = async () => {
				const authorized = await getActiveSessionToken();
				if (!authorized) signOut({ callbackUrl: "/login" });
			};
			getSession();
			if (session.user.role === "DATA_ENTRY") router.push("/data-entry");
			else if (session.user.role === "FINANCE") router.push("/finance-admin");
			else if (session.user.role === "COMMAND") router.push("/command-admin");
			else if (session.user.role === "SUPER") router.push("/super-admin");
			else if (session.user.role === "ROOT") router.push("/superdev");
			else {
				signOut({ callbackUrl: "/login" }); // logout and redirect to login
			}
		}
	};

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setErr(null);
		if (!phone.trim() || !password) {
			setErr("Please fill in all fields.");
			setLoading(false);
			return;
		}
		if (phone.length != 10) {
			setErr("Password must be at least 8 characters.");
			setLoading(false);
			return;
		}

		const res = await signIn("credentials", {
			phone: phone.trim(),
			password,
			redirect: false, // handle redirect manually
			callbackUrl: "/login", // default redirect
		});

		setLoading(false);

		if (!res) return setErr("Unexpected error. Try again.");
		if (res.error) {
			// Common NextAuth errors are opaque; you can customize in your authorize() return
			return setErr("Invalid email or password.");
		}
		// success
		redirecting();
	}

	return (
		<div className="min-h-screen bg-neutral-50">
			<div className="mx-auto max-w-md px-4 py-16">
				<div className="rounded-2xl border bg-white p-6 shadow-sm">
					<h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
					<p className="mt-1 text-sm text-neutral-600">
						Sign in to your admin dashboard.
					</p>

					<form onSubmit={onSubmit} className="mt-6 space-y-4">
						<div>
							<label className="mb-1 block text-sm font-medium">Phone</label>
							<input
								type="text"
								className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
								placeholder="**********"
								autoComplete="phone"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								required
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium">Password</label>
							<div className="flex items-center gap-2">
								<input
									type={showPass ? "text" : "password"}
									className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
									placeholder="••••••••"
									autoComplete="current-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<button
									type="button"
									onClick={() => setShowPass((s) => !s)}
									className="select-none rounded-lg border px-3 py-2 text-sm">
									{showPass ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						{err && (
							<div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
								{err}
							</div>
						)}

						<button
							disabled={loading}
							className="w-full rounded-xl border bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800 disabled:opacity-60">
							{loading ? "Signing in…" : "Sign in"}
						</button>
					</form>

					<div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
						{/* <a href="/admin/forgot-password" className="hover:underline">
							Forgot password?
						</a> */}
						{/* <a href="/admin/register" className="hover:underline">
							Create admin
						</a> */}
					</div>
				</div>
			</div>
		</div>
	);
}
