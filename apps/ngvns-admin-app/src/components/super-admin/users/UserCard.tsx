"use client";

import { UserItem } from "../../../lib/types/users";
import { format } from "date-fns";

export default function UserCard({ user }: { user: UserItem }) {
	const addr = user.address;
	return (
		<article className="group rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<h3 className="truncate text-base font-semibold text-neutral-900">
						{user.fullname}
					</h3>
					<p className="mt-0.5 text-xs text-neutral-500">
						{user.vrKpId ? `VRKP: ${user.vrKpId} · ` : ""}
						{user.email} · {user.phone}
					</p>
					{addr?.State || addr?.pincode ? (
						<p className="mt-1 truncate text-xs text-neutral-500">
							{addr?.State?.name ? `${addr.State.name} ` : ""}
							{addr?.pincode ? `· ${addr.pincode}` : ""}
						</p>
					) : null}
				</div>

				<div className="text-right">
					<p className="text-xs text-neutral-500">Created</p>
					<p className="text-sm font-medium text-neutral-800">
						{format(new Date(user.createdAt), "dd MMM yyyy")}
					</p>
				</div>
			</div>

			<div className="mt-3 flex items-center justify-between">
				<div className="flex gap-2 text-xs">
					{user.emailVerified ? (
						<span className="rounded-full border px-2 py-0.5 text-neutral-700">
							Email ✓
						</span>
					) : (
						<span className="rounded-full border px-2 py-0.5 text-neutral-500">
							Email ✗
						</span>
					)}
					{user.aadhaarVerified ? (
						<span className="rounded-full border px-2 py-0.5 text-neutral-700">
							Aadhaar ✓
						</span>
					) : (
						<span className="rounded-full border px-2 py-0.5 text-neutral-500">
							Aadhaar ✗
						</span>
					)}
					{user.joinedBy ? (
						<span className="rounded-full border px-2 py-0.5 text-neutral-700">
							Joined by {user.joinedBy.fullname}
						</span>
					) : null}
					{user.parentB ? (
						<span className="rounded-full border px-2 py-0.5 text-neutral-700">
							Parent B: {user.parentB.fullname}
						</span>
					) : null}
					{user.parentC ? (
						<span className="rounded-full border px-2 py-0.5 text-neutral-700">
							Parent C: {user.parentC.fullname}
						</span>
					) : null}
				</div>

				<span className="text-xs text-neutral-400 group-hover:text-neutral-600">
					View details →
				</span>
			</div>
		</article>
	);
}
