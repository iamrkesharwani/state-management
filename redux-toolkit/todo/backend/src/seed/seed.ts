import { connectDb } from '../config/db.js';
import { faker } from '@faker-js/faker';
import type { ITodo } from '../types/types.js';

export const seed = async () => {
  try {
    const db = await connectDb();
    const collection = db.collection<ITodo>('todos');

    const count = await collection.countDocuments();
    if (count > 0) {
      console.log('Data already exists. Skipping seed.');
      return;
    }

    const fakeTodo: ITodo[] = Array.from({ length: 10 }).map(() => ({
      title: faker.lorem.sentence(3),
      completed: faker.datatype.boolean(),
      createdAt: new Date(),
    }));

    await collection.insertMany(fakeTodo);
    console.log('Seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
