"use client";

import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import TextInput from "../fields/TextInput";
import type { OnboardingFormData } from "../../../../../lib/validators/onboarding";

export default function NomineeFields({
	register,
	errors,
}: {
	register: UseFormRegister<OnboardingFormData>;
	errors: FieldErrors<OnboardingFormData>;
}) {
	return (
		<>
			<TextInput
				label="Nominee Name"
				error={errors.nominieeName}
				{...register("nominieeName")}
			/>

			<TextInput
				type="date"
				label="Nominee DOB"
				error={errors.nominieeDob}
				{...register("nominieeDob")}
			/>

			<div className="md:col-span-2">
				<TextInput
					label="Nominee Relationship"
					error={errors.relationship}
					{...register("relationship")}
				/>
			</div>
		</>
	);
}
