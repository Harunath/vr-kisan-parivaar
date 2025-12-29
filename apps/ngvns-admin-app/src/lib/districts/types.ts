export type DistrictRow = {
	id: string;
	name: string;
	code: string;
	isActive: boolean;
	stateId: string;
	createdAt?: string;
	updatedAt?: string;
};

export type DistrictCreateInput = {
	name: string;
	code: string;
	isActive?: boolean;
};

export type DistrictUpdateInput = Partial<DistrictCreateInput>;
