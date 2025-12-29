// stores/useOnboardingStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AddressType = {
	cityorvillage: string;
	districtId: string;
	stateId: string;
	pincode: string;
};

type FormData = {
	referralId: string;
	fullname: string;
	relationType: "" | "s/o" | "d/o" | "w/o";
	relationName: string;
	dob: string;
	address: AddressType;
	phone: string;
	email: string;
	aadhaar: string;
	gender: "None" | "Male" | "Female" | "Others";
	// userPhoto: string;
	nominieeName: string;
	nominieeDob: string;
	relationship: string;
};

// ---- Store types ----
type ReferralState = {
	id: string;
	valid: boolean;
	checkedOnce: boolean;
};

type UIState = {
	step: 1 | 2; // 1: referral, 2: details
	isSubmitting: boolean;
};

type OnboardingState = {
	data: Partial<FormData>;
	referral: ReferralState;
	ui: UIState;
};

type OnboardingActions = {
	// full replace (when form submitted or loaded)
	setData: (data: Partial<FormData>) => void;

	// granular updates
	setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
	setMany: (patch: Partial<FormData>) => void;

	// referral helpers
	setReferralId: (id: string) => void;
	setReferralValidity: (valid: boolean, checkedOnce?: boolean) => void;
	resetReferral: () => void;

	// ui/step helpers
	nextStep: () => void;
	prevStep: () => void;
	setSubmitting: (v: boolean) => void;

	// clearing
	clearData: () => void;
	resetAll: () => void;
};

type OnboardingStore = OnboardingState & OnboardingActions;

// ---- Config ----
const PERSIST = false; // flip to true when you want localStorage persistence

const initialState: OnboardingState = {
	data: {},
	referral: { id: "", valid: false, checkedOnce: false },
	ui: { step: 1, isSubmitting: false },
};

const createStore = (set: any, get: any): OnboardingStore => ({
	...initialState,

	setData: (data) =>
		set((s: OnboardingState) => ({ data: { ...s.data, ...data } })),

	setField: (key, value) =>
		set((s: OnboardingState) => ({ data: { ...s.data, [key]: value } })),

	setMany: (patch) =>
		set((s: OnboardingState) => ({ data: { ...s.data, ...patch } })),

	setReferralId: (id) =>
		set((s: OnboardingState) => ({
			referral: { ...s.referral, id, valid: false, checkedOnce: false },
			// also mirror into form data so RHF defaults can read it
			data: { ...s.data, referralId: id },
		})),

	setReferralValidity: (valid, checkedOnce = true) =>
		set((s: OnboardingState) => ({
			referral: { ...s.referral, valid, checkedOnce },
			ui: { ...s.ui, step: valid ? 2 : 1 },
		})),

	resetReferral: () =>
		set((s: OnboardingState) => ({
			referral: { id: "", valid: false, checkedOnce: false },
			data: { ...s.data, referralId: "" },
			ui: { ...s.ui, step: 1 },
		})),

	nextStep: () =>
		set((s: OnboardingState) => ({
			ui: { ...s.ui, step: Math.min(2, s.ui.step + 1) },
		})),

	prevStep: () =>
		set((s: OnboardingState) => ({
			ui: { ...s.ui, step: Math.max(1, s.ui.step - 1) },
		})),

	setSubmitting: (v) =>
		set((s: OnboardingState) => ({ ui: { ...s.ui, isSubmitting: v } })),

	clearData: () => set((s: OnboardingState) => ({ data: {} })),

	resetAll: () => set({ ...initialState }),
});

// ---- Export hook ----
export const useOnboardingStore = PERSIST
	? create<OnboardingStore>()(
			persist(createStore, {
				name: "onboarding:v1",
				storage: createJSONStorage(() => localStorage),
				// (optional) migrate if you change shapes later
				// migrate: (persisted, version) => persisted,
				// version: 1,
				partialize: (state) => ({
					data: state.data,
					referral: state.referral,
					ui: state.ui,
				}),
			})
		)
	: create<OnboardingStore>()(createStore);
