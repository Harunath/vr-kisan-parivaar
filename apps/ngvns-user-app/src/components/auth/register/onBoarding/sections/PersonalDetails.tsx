"use client";

import React from "react";
import {
	UseFormRegister,
	FieldErrors,
	UseFormWatch,
	UseFormSetValue,
} from "react-hook-form";
import type { OnboardingFormData } from "../../../../../lib/validators/onboarding";
import TextInput from "../fields/TextInput";
import RadioGroup from "../fields/RadioGroup";
import SelectInput from "../fields/SelectInput";
// import SingleImageUpload from "../fields/ImageUpload";

export default function PersonalDetails({
	register,
	errors,
	watch,
	setUploading,
	setValue,
}: {
	register: UseFormRegister<OnboardingFormData>;
	errors: FieldErrors<OnboardingFormData>;
	watch: UseFormWatch<OnboardingFormData>;
	setUploading: (uploading: boolean) => void;
	setValue: UseFormSetValue<OnboardingFormData>;
}) {
	const relType = watch("relationType");

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div className="col-span-1 md:col-span-2">
				<TextInput
					label="Full Name"
					error={errors.fullname}
					{...register("fullname")}
				/>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium"></label>
				<RadioGroup
					name="relationType"
					register={register}
					options={[
						{ label: "S/O", value: "s/o" },
						{ label: "D/O", value: "d/o" },
						{ label: "W/O", value: "w/o" },
					]}
				/>
			</div>
			<TextInput
				label={`Father/Husband Name`}
				error={errors.relationName}
				{...register("relationName")}
			/>

			<TextInput
				type="date"
				label="Date of Birth"
				error={errors.dob}
				{...register("dob")}
			/>

			<SelectInput label="Gender" error={errors.gender} {...register("gender")}>
				<option value="None">Select Gender</option>
				<option value="Male">Male</option>
				<option value="Female">Female</option>
				<option value="Others">Others</option>
			</SelectInput>

			<div className="md:col-span-2">
				{/* <TextInput
					label="User Photo URL *"
					error={errors.userPhoto}
					{...register("userPhoto")}
				/> */}
				{/* <SingleImageUpload
					label="Profile Photo"
					hint="Upload a clear photo. You can also capture from camera."
					name="userPhoto"
					setValue={setValue}
					error={errors.userPhoto}
					onUploadingChange={setUploading}
				/> */}
			</div>
		</div>
	);
}
