// lib/validators/onboarding.ts
import { z } from "zod";

export const referralSchema = z.object({
	referralId: z.string().min(1, "Referral ID is required"),
});

export const onboardingSchema = z.object({
	referralId: z.string().min(1, "Referral ID is required"),
	fullname: z.string().min(1, "Full name is required"),
	relationType: z.enum(["", "s/o", "d/o", "w/o"]),
	relationName: z.string().min(1, "Relation name is required"),
	dob: z.string().min(1, "Date of birth is required"),
	address: z.object({
		cityorvillage: z.string().min(1, "city or town or village is required"),
		districtId: z.string().min(1, "District is required"),
		stateId: z.string().min(1, "State is required"),
		pincode: z
			.string()
			.regex(/^\d{6}$/, "Pincode must be 6 digits")
			.min(6, "Pincode is required")
			.max(6, "Invalid pincode"),
	}),
	phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
	email: z.string().email("Invalid email"),
	aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
	gender: z.enum(["None", "Male", "Female", "Others"]),
	// userPhoto: z.string().min(1, "User photo is required"),
	nominieeName: z.string().min(1, "Nominee name is required"),
	nominieeDob: z.string().min(1, "Nominee DOB is required"),
	relationship: z.string().min(1, "Relationship is required"),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export const requestPhoneOtpSchema = z.object({
	onboardingId: z.string().min(1),
	phone: z.string().min(8),
});

export const verifyPhoneOtpSchema = z.object({
	onboardingId: z.string().min(1),
	code: z.string().length(6),
});

export const requestEmailOtpSchema = z.object({
	onboardingId: z.string().min(1),
	email: z.string().email(),
});

export const verifyEmailOtpSchema = z.object({
	onboardingId: z.string().min(1),
	code: z.string().length(6),
});

export const acceptTcSchema = z.object({
	onboardingId: z.string().min(1),
});

export const createOrderSchema = z.object({
	onboardingId: z.string().min(1),
	amount: z.number().int().positive(), // in paise
	currency: z.string().default("INR"),
});

// export const verifyPaymentSchema = z.object({
// 	onboardingId: z.string().min(1),
// 	provider: z.enum(["razorpay", "stripe"]).default("razorpay"),
// 	payload: z.record(z.any()), // provider-specific fields (sig/orderId/etc)
// });
