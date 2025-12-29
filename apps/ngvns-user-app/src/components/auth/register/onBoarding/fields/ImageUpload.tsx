// "use client";

// import React, { useState, useRef } from "react";
// import type { ChangeEvent } from "react";
// import { FiUpload, FiX, FiCamera } from "react-icons/fi";
// import type { UseFormSetValue, FieldError } from "react-hook-form";
// import type { OnboardingFormData } from "../../../../../lib/validators/onboarding";

// type Props = {
// 	name?: "userPhoto";
// 	label?: string;
// 	hint?: string;
// 	maxSizeMB?: number;
// 	accept?: string;
// 	initialUrl?: string;
// 	setValue: UseFormSetValue<OnboardingFormData>;
// 	error?: FieldError;
// 	onUploadingChange?: (uploading: boolean) => void;
// };

// export default function SingleImageUpload({
// 	name = "userPhoto",
// 	label = "Profile Photo",
// 	hint = "Upload a clear photo. You can also capture from camera.",
// 	maxSizeMB = 5,
// 	accept = "image/*",
// 	initialUrl,
// 	setValue,
// 	error,
// 	onUploadingChange,
// }: Props) {
// 	const inputRef = useRef<HTMLInputElement | null>(null);
// 	const [previewUrl, setPreviewUrl] = useState<string | null>(
// 		initialUrl ?? null
// 	);
// 	const [uploading, setUploading] = useState(false);
// 	const [progress, setProgress] = useState<number>(0);
// 	const [localError, setLocalError] = useState<string | null>(null);

// 	async function uploadUserPhoto(file: File): Promise<string> {
// 		setUploading(true);
// 		const fd = new FormData();
// 		fd.append("file", file, file.name);
// 		let res;
// 		if (process.env.NEXT_PUBLIC_UPLOAD_OPTION == "r2") {
// 			res = await fetch(
// 				`${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads/user-photo/cloudflare`,
// 				{
// 					method: "POST",
// 					body: fd,
// 				}
// 			);
// 		} else {
// 			res = await fetch(
// 				`${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads/user-photo/cloudnery`,
// 				{
// 					method: "POST",
// 					body: fd,
// 				}
// 			);
// 		}
// 		setUploading(false);
// 		setProgress(100);
// 		if (!res.ok) {
// 			throw new Error(await res.text());
// 		}

// 		const { publicUrl } = await res.json();
// 		return publicUrl;
// 	}

// 	// Let parent control submit button state
// 	const setUploadingState = (v: boolean) => {
// 		setUploading(v);
// 		onUploadingChange?.(v);
// 	};

// 	const validateFile = (file: File) => {
// 		if (!file.type.startsWith("image/")) {
// 			return "Only image files are allowed.";
// 		}
// 		const sizeMB = file.size / (1024 * 1024);
// 		if (sizeMB > maxSizeMB) {
// 			return `File too large. Max ${maxSizeMB}MB.`;
// 		}
// 		return null;
// 	};

// 	const handlePick = () => inputRef.current?.click();

// 	const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
// 		const file = e.target.files?.[0];
// 		if (!file) return;

// 		const v = validateFile(file);
// 		if (v) {
// 			setLocalError(v);
// 			return;
// 		}
// 		setLocalError(null);

// 		// show a quick local preview
// 		const objUrl = URL.createObjectURL(file);
// 		setPreviewUrl(objUrl);

// 		try {
// 			setUploadingState(true);
// 			setProgress(0);
// 			const uploadedUrl = await uploadUserPhoto(file);
// 			setValue("userPhoto", uploadedUrl, {
// 				shouldValidate: true,
// 				shouldDirty: true,
// 			});
// 		} catch (err: any) {
// 			setLocalError(err?.message ?? "Upload failed. Please try again.");
// 			setPreviewUrl(initialUrl ?? null);
// 		} finally {
// 			setUploadingState(false);
// 		}
// 	};

// 	const handleRemove = () => {
// 		setPreviewUrl(null);
// 		setValue(name, null as any, { shouldValidate: true, shouldDirty: true });
// 		if (inputRef.current) inputRef.current.value = "";
// 	};

// 	return (
// 		<div className="w-full">
// 			<div className="flex items-center justify-between">
// 				<label className="block text-sm font-medium text-gray-700">
// 					{label}
// 				</label>
// 				{previewUrl && (
// 					<button
// 						type="button"
// 						onClick={handleRemove}
// 						className="text-xs text-red-600 hover:underline inline-flex items-center gap-1"
// 						aria-label="Remove image">
// 						<FiX className="inline-block" /> Remove
// 					</button>
// 				)}
// 			</div>

// 			<div className="mt-2">
// 				{!previewUrl ? (
// 					<div className="flex items-center gap-3">
// 						<button
// 							type="button"
// 							onClick={handlePick}
// 							className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
// 							disabled={uploading}>
// 							<FiUpload /> Choose Image
// 						</button>
// 						<label className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer disabled:opacity-60">
// 							<FiCamera />
// 							<span>Capture</span>
// 							{/* Hidden input for camera capture */}
// 							<input
// 								type="file"
// 								accept={accept}
// 								capture="environment"
// 								className="hidden"
// 								onChange={handleChange}
// 								disabled={uploading}
// 							/>
// 						</label>

// 						<input
// 							ref={inputRef}
// 							type="file"
// 							accept={accept}
// 							multiple={false}
// 							onChange={handleChange}
// 							className="hidden"
// 							disabled={uploading}
// 						/>
// 					</div>
// 				) : (
// 					<div className="relative mt-2">
// 						<img
// 							src={previewUrl}
// 							alt="Selected profile"
// 							className="h-40 w-40 rounded-lg object-cover border"
// 						/>
// 						<div className="mt-2 flex items-center gap-2">
// 							<button
// 								type="button"
// 								onClick={handlePick}
// 								className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
// 								disabled={uploading}>
// 								<FiUpload /> Replace
// 							</button>
// 							<button
// 								type="button"
// 								onClick={handleRemove}
// 								className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
// 								disabled={uploading}>
// 								<FiX /> Remove
// 							</button>
// 						</div>
// 					</div>
// 				)}
// 			</div>

// 			{hint && <p className="mt-2 text-xs text-gray-500">{hint}</p>}

// 			{!uploading ? (
// 				(localError || error) && (
// 					<p className="mt-1 text-sm text-red-600">
// 						{localError && "localError: "}
// 						{error && "error: "}
// 						{localError ?? error?.message}
// 					</p>
// 				)
// 			) : (
// 				<div className="mt-2">
// 					<div className="h-2 w-full rounded bg-gray-200">
// 						<div
// 							className="h-2 rounded bg-gray-800 transition-all"
// 							style={{ width: `${progress}%` }}
// 						/>
// 					</div>
// 					<p className="mt-1 text-xs text-gray-600">Uploading… {progress}%</p>
// 				</div>
// 			)}
// 		</div>
// 	);
// }
