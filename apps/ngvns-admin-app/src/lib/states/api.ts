import type { StateCreateInput, StateRow, StateUpdateInput } from "./types";

const BASE = "/api/super-admin/states";

async function handle<T>(res: Response): Promise<T> {
	if (!res.ok) {
		const msg = await res.json().catch(() => ({}));
		throw new Error(msg?.error || `Request failed (${res.status})`);
	}
	return res.json() as Promise<T>;
}

export async function getStates(): Promise<StateRow[]> {
	const res = await fetch(BASE, { cache: "no-store" });
	return handle<StateRow[]>(res);
}

export async function createState(body: StateCreateInput): Promise<StateRow> {
	const res = await fetch(BASE, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	return handle<StateRow>(res);
}

export async function getState(id: string): Promise<StateRow> {
	const res = await fetch(`${BASE}/${id}`, { cache: "no-store" });
	return handle<StateRow>(res);
}

export async function updateState(
	id: string,
	body: StateUpdateInput
): Promise<StateRow> {
	const res = await fetch(`${BASE}/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	return handle<StateRow>(res);
}
