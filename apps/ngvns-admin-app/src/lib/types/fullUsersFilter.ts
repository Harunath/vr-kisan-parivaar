import { z } from "zod";

export const UsersQuerySchema = z.object({
	// precise filters (any combination)
	pincode: z.string().length(6).optional(),
	phone: z.string().min(3).optional(),
	email: z.string().email().optional(),
	vrKpId: z.string().min(2).optional(),

	// name / generic search
	name: z.string().min(2).optional(),
	q: z.string().min(2).optional(),

	// date filters (inclusive range)
	createdFrom: z.string().optional(),
	createdTo: z.string().optional(),

	// pagination & sort
	limit: z.coerce.number().int().min(1).max(100).default(20),
	cursor: z.string().uuid().optional(), // user.id
	sortBy: z.enum(["createdAt", "fullname"]).default("createdAt"),
	sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export type UsersQuery = z.infer<typeof UsersQuerySchema>;

export function buildUsersWhere(q: UsersQuery) {
	const and: any[] = [];

	if (q.pincode)
		and.push({ address: { is: { pincode: { equals: q.pincode } } } });
	if (q.phone) and.push({ phone: { contains: q.phone, mode: "insensitive" } });
	if (q.email) and.push({ email: { contains: q.email, mode: "insensitive" } });
	if (q.vrKpId) {
		// allow both vrkpId and vrkpid schema variants (defensive)
		and.push({
			OR: [
				{ vrKpId: { contains: q.vrKpId, mode: "insensitive" } },
				{ vrKpId: { contains: q.vrKpId, mode: "insensitive" } },
			],
		});
	}
	if (q.name) and.push({ fullname: { contains: q.name, mode: "insensitive" } });
	if (q.q) {
		and.push({
			OR: [
				{ fullname: { contains: q.q, mode: "insensitive" } },
				{ email: { contains: q.q, mode: "insensitive" } },
				{ phone: { contains: q.q, mode: "insensitive" } },
				{ id: q.q.length === 36 ? q.q : undefined },
				{ vrKpId: { contains: q.q, mode: "insensitive" } },
				{ vrKpId: { contains: q.q, mode: "insensitive" } },
			].filter(Boolean),
		});
	}

	if (q.createdFrom || q.createdTo) {
		and.push({
			createdAt: {
				gte: q.createdFrom ? new Date(q.createdFrom) : undefined,
				lte: q.createdTo ? new Date(q.createdTo) : undefined,
			},
		});
	}

	if (and.length === 0) return {};
	return { AND: and };
}
