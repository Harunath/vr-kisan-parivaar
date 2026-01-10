"use client";

import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import TextInput from "../fields/TextInput";
import type { OnboardingFormData } from "../../../../../lib/validators/onboarding";

export default function IdentityFields({
	register,
	errors,
}: {
	register: UseFormRegister<OnboardingFormData>;
	errors: FieldErrors<OnboardingFormData>;
}) {
	return (
		<>
			<TextInput label="Phone" error={errors.phone} {...register("phone")} />
			<TextInput
				type="email"
				label="Email"
				error={errors.email}
				{...register("email")}
			/>
			<span className="text-[10px] font-extralight text-gray-500">
				Aadhaar is used for Insurance purpose only
			</span>

			<TextInput
				label="Aadhaar"
				error={errors.aadhaar}
				{...register("aadhaar")}
			/>
		</>
	);
}
