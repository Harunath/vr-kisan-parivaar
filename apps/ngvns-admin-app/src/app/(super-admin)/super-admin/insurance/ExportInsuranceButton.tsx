"use client";
import { useState } from "react";

export default function ExportInsuranceButton() {
	const [loading, setLoading] = useState(false);

	const handleDownload = async () => {
		try {
			setLoading(true);
			const res = await fetch("/api/super-admin/insurance/v1", {
				method: "GET",
				credentials: "include", // send cookies for auth-protected route
			});
			if (!res.ok) throw new Error("Failed to export");

			const blob = await res.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download =
				res.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ??
				"insurance-records.xlsx";
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={handleDownload}
			disabled={loading}
			className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-60"
			aria-busy={loading}>
			{loading ? "Preparing…" : "Export Insurance XLSX"}
		</button>
	);
}
