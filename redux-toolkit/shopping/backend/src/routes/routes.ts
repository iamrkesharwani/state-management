import { Router, type Request, type Response } from 'express';
import type { Product } from '../config/type.js';
import pool from '../config/db.js';

const router = Router();

router.get('/products', async (req, res) => {
  try {
    const limit = Math.max(Number(req.query.limit as string) || 10, 0);
    const offset = Math.max(Number(req.query.offset as string) || 0, 0);

    const result = await pool.query<Product>(
      `SELECT 
        product_id AS id,
        name,
        price,
        stock_quantity
      FROM products
      ORDER BY product_id DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, price, stock_quantity } = req.body;

    if (!name || price == null || stock_quantity == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await pool.query<Product>(
      `INSERT INTO products (name, price, stock_quantity)
       VALUES ($1, $2, $3)
       RETURNING 
         product_id AS id,
         name,
         price,
         stock_quantity`,
      [name, price, stock_quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put(
  '/products/:id',
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { name, price, stock_quantity } = req.body;

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      if (!name || price == null || stock_quantity == null) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const result = await pool.query<Product>(
        `UPDATE products
         SET name = $1,
             price = $2,
             stock_quantity = $3
         WHERE product_id = $4
         RETURNING 
           product_id AS id,
           name,
           price,
           stock_quantity`,
        [name, price, stock_quantity, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.delete('/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const result = await pool.query(
      `DELETE FROM products
       WHERE product_id = $1
       RETURNING product_id AS id`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product deleted',
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
