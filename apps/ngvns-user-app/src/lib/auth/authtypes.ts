import "next-auth";
declare module "next-auth" {
	interface User {
		id: string;
		phone: string;
		email: string;
		fullname: string;
		// userPhoto: string;
		vrKpId: string;
		canRefer?: boolean;
		marketingMember?: boolean;
	}

	interface Session {
		user: User; // Link the extended User type here
	}
}
