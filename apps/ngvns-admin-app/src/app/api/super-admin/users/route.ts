import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth/auth"; // your existing NextAuth options
import prisma, { AdminRole } from "@ngvns2025/db/client";
import {
	UsersQuerySchema,
	buildUsersWhere,
} from "../../../../lib/types/fullUsersFilter";

function forbid() {
	return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
}

export async function GET(req: NextRequest) {
	try {
		// Authn/Authz
		const session = await getServerSession(authOptions);
		const role = session?.user?.role as string | undefined;
		if (!session?.user?.id || !role || role != AdminRole.SUPER) {
			return forbid();
		}

		// Validate & parse query
		const url = new URL(req.url);
		console.log(
			"Query params:",
			Object.fromEntries(url.searchParams.entries())
		);
		const parsed = UsersQuerySchema.safeParse(
			Object.fromEntries(url.searchParams.entries())
		);
		console.log("Parsed query:", parsed.error?._zod.output || parsed.data);
		if (!parsed.success) {
			return NextResponse.json(
				{ ok: false, error: "invalid_query", issues: parsed.error },
				{ status: 400 }
			);
		}

		const q = parsed.data;
		const where = buildUsersWhere(q);

		// Sorting
		const orderBy: any = [{ [q.sortBy]: q.sortDir }];

		// Cursor pagination
		const take = q.limit;
		const cursor = q.cursor ? { id: q.cursor } : undefined;

		// Fetch + total (total is optional; keep it, since super admins like counts)
		const [items, total] = await Promise.all([
			prisma.user.findMany({
				where,
				orderBy,
				take: take + 1, // over-fetch to know if there's a next page
				cursor,
				skip: cursor ? 1 : 0,
				select: {
					// FULL DETAILS — only super roles hit this endpoint
					id: true,
					fullname: true,
					vrKpId: true,
					email: true,
					phone: true,
					gender: true,
					dob: true,
					relationType: true,
					relationName: true,
					aadhaar: true,
					aadhaarVerified: true,
					emailVerified: true,
					createdAt: true,
					updatedAt: true,
					address: {
						select: {
							addressLine: true,
							addressLine2: true,
							State: true,
							pincode: true,
						},
					},
					joinedBy: {
						select: {
							id: true,
							fullname: true,
							vrKpId: true,
						},
					},
					parentB: {
						select: {
							id: true,
							fullname: true,
							vrKpId: true,
						},
					},
					parentC: {
						select: {
							id: true,
							fullname: true,
							vrKpId: true,
						},
					},
					// add other relations you consider “full details”
					// e.g., referrals, payments, memberships, etc.
				},
			}),
			prisma.user.count({ where }),
		]);

		let nextCursor: string | null = null;
		const hasMore = items.length > take;
		const data = hasMore ? items.slice(0, -1) : items;
		if (hasMore) nextCursor = items[items.length - 1]!.id;

		return NextResponse.json({
			ok: true,
			total,
			nextCursor,
			limit: take,
			sortBy: q.sortBy,
			sortDir: q.sortDir,
			data,
		});
	} catch (error) {
		console.error("Error in GET /super-admin/users:", error);
		return NextResponse.json(
			{ ok: false, error: "internal_server_error" },
			{ status: 500 }
		);
	}
}
