import type {
	DistrictCreateInput,
	DistrictRow,
	DistrictUpdateInput,
} from "./types";

async function handle<T>(res: Response): Promise<T> {
	if (!res.ok) {
		const msg = await res.json().catch(() => ({}));
		throw new Error(msg?.error || `Request failed (${res.status})`);
	}
	return res.json() as Promise<T>;
}

export async function getDistricts(stateid: string): Promise<DistrictRow[]> {
	const res = await fetch(`/api/super-admin/states/${stateid}/districts`, {
		cache: "no-store",
	});
	return handle<DistrictRow[]>(res);
}

export async function createDistrict(
	stateid: string,
	body: DistrictCreateInput
): Promise<DistrictRow> {
	const res = await fetch(`/api/super-admin/states/${stateid}/districts`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	return handle<DistrictRow>(res);
}

export async function getDistrict(
	stateid: string,
	districtid: string
): Promise<DistrictRow> {
	const res = await fetch(
		`/api/super-admin/states/${stateid}/districts/${districtid}`,
		{ cache: "no-store" }
	);
	return handle<DistrictRow>(res);
}

export async function updateDistrict(
	stateid: string,
	districtid: string,
	body: DistrictUpdateInput
): Promise<DistrictRow> {
	const res = await fetch(
		`/api/super-admin/states/${stateid}/districts/${districtid}`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		}
	);
	return handle<DistrictRow>(res);
}
