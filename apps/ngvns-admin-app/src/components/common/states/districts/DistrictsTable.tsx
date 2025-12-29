"use client";

import React from "react";
import Link from "next/link";
import type { DistrictRow } from "../../../../lib/districts/types";

export default function DistrictsTable({
	stateid,
	districts,
}: {
	stateid: string;
	districts: DistrictRow[];
}) {
	return (
		<div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
			<div className="flex items-center justify-between px-5 py-4">
				<h3 className="text-base font-bold tracking-tight text-[#0B1220]">
					Districts ({districts.length})
				</h3>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-black/[0.03]">
						<tr className="text-left text-black/70">
							<th className="px-5 py-3 font-semibold">Name</th>
							<th className="px-5 py-3 font-semibold">Code</th>
							<th className="px-5 py-3 font-semibold">Status</th>
							<th className="px-5 py-3 font-semibold text-right">Action</th>
						</tr>
					</thead>

					<tbody>
						{districts.map((d) => (
							<tr key={d.id} className="border-t border-black/5">
								<td className="px-5 py-3 font-medium text-[#0B1220]">
									{d.name}
								</td>
								<td className="px-5 py-3 text-black/70">{d.code}</td>
								<td className="px-5 py-3">
									<span
										className={[
											"inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
											d.isActive
												? "bg-green-50 text-green-700 border border-green-200"
												: "bg-zinc-50 text-zinc-700 border border-zinc-200",
										].join(" ")}>
										{d.isActive ? "Active" : "Inactive"}
									</span>
								</td>
								<td className="px-5 py-3 text-right">
									<Link
										href={`/super-admin/states/${stateid}/districts/${d.id}`}
										className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/5">
										View / Edit
									</Link>
								</td>
							</tr>
						))}

						{districts.length === 0 ? (
							<tr>
								<td
									colSpan={4}
									className="px-5 py-10 text-center text-black/60">
									No districts yet.
								</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>
		</div>
	);
}
