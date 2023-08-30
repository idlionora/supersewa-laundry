export type ServicePackageSpec = {
	id: number;
	name: string;
	priceRange: string;
	img: string;
};

export type DataInsertAndMarkPosition<T> = {
	data: T;
	childNum: 'first' | 'last' | number;
};

export type IndexToIdentify = {
	index: number;
};
