"use client";

import React from "react";
import { toast } from "react-toastify";

const MakeBatch = () => {
	const handleClick = async () => {
		try {
			const res = await fetch("/api/super-admin/insurance/generate-batch", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (res.ok) {
				toast.success("Batch created successfully!");
			} else {
				toast.error("Failed to create batch.");
			}
			const data = await res.json();
			console.log(data);
		} catch (err) {
			console.error("Error creating batch:", err);
		}
	};
	return (
		<button
			onClick={handleClick}
			className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
			Make the batch
		</button>
	);
};

export default MakeBatch;
