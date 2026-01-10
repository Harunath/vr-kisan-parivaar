"use client";

import React, { useEffect } from "react";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import type { OnboardingFormData } from "../../../../../lib/validators/onboarding";

export default function AddressFields({
	register,
	errors,
	watch,
}: {
	register: UseFormRegister<OnboardingFormData>;
	errors: FieldErrors<OnboardingFormData>;
	watch: UseFormWatch<OnboardingFormData>;
}) {
	const [states, setStates] = React.useState<
		Array<{ id: string; name: string }>
	>([]);
	const [districts, setDistricts] = React.useState<
		Array<{ id: string; name: string }>
	>([]);
	const [LoadingDistricts, setLoadingDistricts] = React.useState(false);
	useEffect(() => {
		if (process.env.NEXT_PUBLIC_NODE_ENV) {
			const result = async () => {
				const res = await fetch("/api/states");
				const data = await res.json();
				console.log("States data:", data);
				setStates(data);
			};
			result();
		} else {
			setStates([
				{
					id: "123",
					name: "telangana",
				},
				{
					id: "124",
					name: "AP",
				},
			]);
		}
	}, []);
	const stateId = watch("address.stateId");

	useEffect(() => {
		console.log("State ID changed:", stateId);
		if (!stateId) {
			setDistricts([]);
			return;
		}
		const fetchDistricts = async () => {
			setLoadingDistricts(true);
			try {
				const res = await fetch(`/api/states/${stateId}/districts`);
				const data = await res.json();
				console.log("Districts data:", data);
				setDistricts(data);
			} catch (err) {
				console.error("Error fetching districts:", err);
			} finally {
				setLoadingDistricts(false);
			}
		};
		fetchDistricts();
	}, [stateId]);

	return (
		<div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div className="md:col-span-2">
				<TextInput
					label="City/Town/Village"
					error={errors.address?.cityorvillage}
					{...register("address.cityorvillage")}
				/>
			</div>

			<SelectInput
				label="State"
				error={errors.address?.stateId}
				{...register("address.stateId")}>
				<option value="">Select State</option>
				{/* map states from API/store later */}
				{states.map((state) => (
					<option key={state.id} value={state.id}>
						{state.name}
					</option>
				))}
			</SelectInput>

			<SelectInput
				label="District"
				error={errors.address?.districtId}
				{...register("address.districtId")}>
				<option value="">Select District</option>
				{/* map states from API/store later */}
				{districts.length === 0 && LoadingDistricts && stateId ? (
					<option value="" disabled>
						Loading districts...
					</option>
				) : (
					<option value="" disabled>
						No districts available
					</option>
				)}
				{districts.length > 0 &&
					districts.map((district) => (
						<option key={district.id} value={district.id}>
							{district.name}
						</option>
					))}
			</SelectInput>

			<TextInput
				inputMode="numeric"
				label="Pincode"
				error={errors.address?.pincode}
				{...register("address.pincode")}
			/>
		</div>
	);
}
