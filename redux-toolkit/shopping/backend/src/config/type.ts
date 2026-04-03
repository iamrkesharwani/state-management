import { ObjectId } from 'mongodb';

export interface IProduct {
  _id?: ObjectId;
  name: string;
  price: number;
  stock: number;
  lastUpdated: Date;
}
