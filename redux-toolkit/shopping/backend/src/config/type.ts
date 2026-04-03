import { ObjectId } from 'mongodb';

export interface IProduct {
  _id?: ObjectId;
  name: string;
  price: number;
  stock: number;
  lastUpdated: Date;
}

export interface ICartItem {
  _id: ObjectId;
  productId: ObjectId;
  name: string;
  price: number;
  quantity: number;
  addedAt: Date;
}

export type CreateProductInput = Omit<IProduct, '_id' | 'lastUpdated'>;
export type UpdateProductInput = Partial<CreateProductInput>;

export interface AddToCartInput {
  productId: string;
  quantity?: number;
}
