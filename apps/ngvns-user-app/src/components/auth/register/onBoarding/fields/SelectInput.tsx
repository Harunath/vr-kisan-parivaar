"use client";

import React from "react";
import { FieldError } from "react-hook-form";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
	label: string;
	error?: FieldError;
	children: React.ReactNode;
};

export default function SelectInput({
	label,
	error,
	children,
	className,
	...rest
}: Props) {
	return (
		<div>
			<label className="mb-1 block text-sm font-medium">
				{label}
				<span className="text-red-400">*</span>
			</label>
			<select
				{...rest}
				className={`w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${className ?? ""}`}>
				{children}
			</select>
			{error && (
				<p className="mt-1 text-sm font-medium text-rose-600">
					{error.message}
				</p>
			)}
		</div>
	);
}
