import pool from '../config/db.js';
import { faker } from '@faker-js/faker';

const seed = async () => {
  try {
    console.log('Cleaning old data...');
    await pool.query('DELETE FROM products');

    console.log('Generating 50 products...');

    for (let i = 0; i < 50; i++) {
      const name = faker.commerce.productName();
      const price = parseFloat(faker.commerce.price({ min: 10, max: 1000 }));
      const stock = faker.number.int({ min: 1, max: 100 });
      const queryText =
        'INSERT INTO products (name, price, stock_quantity) VALUES ($1, $2, $3)';
      await pool.query(queryText, [name, price, stock]);
    }

    console.log('Success! 50 items added to your database.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seed();
