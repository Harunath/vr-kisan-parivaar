export type UserAddress = {
	addressLine?: string | null;
	addressLine2?: string | null;
	State?: {
		name: string;
		code?: string;
	} | null;
	pincode?: string | null;
};

export type UserItem = {
	id: string;
	fullname: string;
	vrKpId?: string | null;
	email: string;
	phone: string;
	gender?: string | null;
	dob?: string | null;
	relationType?: string | null;
	relationName?: string | null;
	aadhaar?: string | null;
	aadhaarVerified?: boolean | null;
	emailVerified?: boolean | null;
	createdAt: string;
	updatedAt: string;
	address?: UserAddress | null;
	joinedBy?: {
		id: "";
		vrKpId: "";
		fullname: "";
	};
	parentB?: {
		id: "";
		vrKpId: "";
		fullname: "";
	};
	parentC?: {
		id: "";
		vrKpId: "";
		fullname: "";
	};
};

export type CAUserItem = {
	id: string;
	fullname: string;
	vrKpId?: string | null;
	gender?: string | null;
	dob?: string | null;
	relationType?: string | null;
	relationName?: string | null;
	aadhaar?: string | null;
	aadhaarVerified?: boolean | null;
	emailVerified?: boolean | null;
	createdAt: string;
	updatedAt: string;
	address?: UserAddress | null;
};

export type UsersApiResponse = {
	ok: true;
	total: number;
	nextCursor: string | null;
	limit: number;
	sortBy: "createdAt" | "fullname";
	sortDir: "asc" | "desc";
	data: UserItem[];
};
