export type StateRow = {
	id: string;
	name: string;
	code: string;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type StateCreateInput = {
	name: string;
	code: string;
	isActive?: boolean;
};

export type StateUpdateInput = Partial<StateCreateInput>;
