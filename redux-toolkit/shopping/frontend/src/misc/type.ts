export interface IProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  lastUpdated: string;
}

export interface ProductState {
  products: IProduct[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

export type ICreateProduct = Omit<IProduct, '_id' | 'lastUpdated'>;

export type IUpdateProduct = Partial<ICreateProduct> & Pick<IProduct, '_id'>;
