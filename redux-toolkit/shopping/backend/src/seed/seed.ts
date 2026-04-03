import { closeDb, connectDb } from '../config/db.js';
import { faker } from '@faker-js/faker';
import type { IProduct } from '../config/type.js';

export const seed = async () => {
  try {
    const db = await connectDb();
    const collection = db.collection<IProduct>('products');
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log('Data already exists. Skipping seed.');
      return;
    }

    const items: IProduct[] = Array.from({ length: 50 }).map(() => ({
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      stock: faker.number.int({ min: 0, max: 100 }),
      lastUpdated: new Date(),
    }));

    await collection.insertMany(items);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await closeDb()
  }
};

seed()