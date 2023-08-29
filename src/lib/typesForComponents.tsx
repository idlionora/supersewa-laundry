export type DataInsertAndMarkPosition<T> = {
	data: T;
	childNum: 'first' | 'last' | number;
};

export type IndexToIdentify = {
    index: number
}
