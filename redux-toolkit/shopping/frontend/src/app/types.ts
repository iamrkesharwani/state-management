export type Product = {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
};

export type CreateProductInput = {
  name: string;
  price: number;
  stock_quantity: number;
};

export type UpdateProductInput = {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
};

export type DeleteProductInput = {
  id: number;
};

export interface ProductState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
