import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@ngvns2025/db/client";

export async function middleware(req: NextRequest) {
	console.log("in middleware.");

	const { pathname } = req.nextUrl;

	// Protect only admin routes
	if (!pathname.startsWith("/admin")) {
		return NextResponse.next();
	}

	return NextResponse.next();
}
