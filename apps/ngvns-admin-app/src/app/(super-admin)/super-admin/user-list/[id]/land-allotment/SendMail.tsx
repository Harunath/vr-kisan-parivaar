"use client";
import React from "react";
import { toast } from "react-toastify";

const SendMail = ({ userId }: { userId: string }) => {
	const handleSendMail = async () => {
		try {
			const response = await fetch(`/api/super-admin/users/land-allotment`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId,
				}),
			});
			if (!response.ok) {
				toast.error("Failed to send land allotment email");
				throw new Error("Failed to send land allotment email");
			}
			toast.success("Land allotment email sent successfully");
		} catch (error) {
			console.error("Error sending land allotment email:", error);
		}
	};
	return (
		<button
			className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
			onClick={handleSendMail}>
			Send Land Allotment Mail
		</button>
	);
};

export default SendMail;
