"use client";
import React from "react";

const SendInsuranceMail = ({ id }: { id: string }) => {
	const [sending, setSending] = React.useState(false);
	const sendMail = async () => {
		try {
			setSending(true);
			const res = await fetch("/api/super-admin/users/insurance", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: id,
				}),
			});
			if (res.ok) {
				alert("Email sent successfully");
			}
		} catch (err) {
			console.error("Error sending insurance mail:", err);
			alert("Failed to send email");
		} finally {
			setSending(false);
		}
	};
	return (
		<div className="text-green-600 font-semibold mb-2">
			<button onClick={sendMail} className="">
				{sending ? "Sending..." : "Send Mail"}
			</button>{" "}
		</div>
	);
};

export default SendInsuranceMail;
