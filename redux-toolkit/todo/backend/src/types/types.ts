import type { ObjectId } from 'mongodb';

export interface ITodo {
  _id?: ObjectId;
  title: string;
  completed: boolean;
  createdAt: Date;
}
