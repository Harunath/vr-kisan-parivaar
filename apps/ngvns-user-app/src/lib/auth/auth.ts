import NextAuth, { NextAuthOptions } from "next-auth";
import { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import prisma from "@ngvns2025/db/client";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
	providers: [
		// Gmail Authentication
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				phone: { label: "Phone", type: "number" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.phone || !credentials?.password) {
					throw new Error("Invalid email or password");
				}

				// Find user in database
				const user = await prisma.user.findFirst({
					where: { phone: credentials.phone },
					select: {
						id: true,
						email: true,
						password: true,
						fullname: true,
						phone: true,
						// userPhoto: true,
						vrKpId: true,
						marketingMember: {
							select: {
								id: true,
							},
						},
						canRefer: true,
					},
				});

				if (user) {
					// Verify password
					const isValidPassword = await bcrypt.compare(
						credentials.password,
						user.password
					);
					if (!isValidPassword) {
						throw new Error("Invalid password");
					}
					return {
						id: user.id,
						email: user.email,
						phone: user.phone,
						fullname: user.fullname,
						// userPhoto: user.userPhoto,
						vrKpId: user.vrKpId,
						canRefer: !!user.canRefer,
						marketingMember: !!user.marketingMember,
					};
				}
				return null;
			},
		}),
	],
	callbacks: {
		async signIn({ user }) {
			// Check if user already exists in the database
			const vr_user = await prisma.user.findUnique({
				where: {
					phone: user.phone!,
				},
			});

			// If user doesn't exist, create a new record
			if (vr_user) {
				return true;
			}
			return "/unauthorized";
		},
		async redirect({ baseUrl }) {
			return baseUrl + "/login";
		},
		async jwt({ token, user }) {
			if (user && user.phone) {
				const vr_user = await prisma.user.findFirst({
					where: { phone: user.phone },
					select: {
						id: true,
						email: true,
						fullname: true,
						phone: true,
						// userPhoto: true,
						vrKpId: true,
						canRefer: true,
						marketingMember: {
							select: {
								id: true,
							},
						},
					},
				});
				if (vr_user) {
					token.id = vr_user.id;
					token.email = vr_user.email;
					token.fullname = vr_user.fullname;
					token.phone = vr_user.phone;
					// token.userPhoto = vr_user.userPhoto;
					token.vrKpId = vr_user.vrKpId;
					token.canRefer = vr_user.canRefer;
					token.marketingMember = !!vr_user.marketingMember;
				}
			}
			return token;
		},

		async session({ session, token }: { session: Session; token: JWT }) {
			if (session.user && token) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
				session.user.fullname = token.fullname as string;
				session.user.phone = token.phone as string;
				// session.user.userPhoto = token.userPhoto as string;
				session.user.vrKpId = token.vrKpId as string;
				session.user.canRefer = token.canRefer as boolean;
				session.user.marketingMember = token.marketingMember as boolean;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET!,
};

export default NextAuth(authOptions);
