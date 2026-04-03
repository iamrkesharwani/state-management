import { Router, type Request, type Response } from 'express';
import { connectDb } from '../config/db.js';
import { ObjectId, type OptionalId } from 'mongodb';
import type {
  ICartItem,
  IProduct,
  CreateProductInput,
  UpdateProductInput,
} from '../config/type.js';

const router = Router();

// Get all products
router.get('/', async (_req: Request, res: Response) => {
  try {
    const db = await connectDb();
    const products = await db
      .collection<IProduct>('products')
      .find({})
      .toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create a product
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, price, stock } = req.body as CreateProductInput;
    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const db = await connectDb();
    const newProduct: OptionalId<IProduct> = {
      name: String(name),
      price: Number(price),
      stock: Number(stock),
      lastUpdated: new Date(),
    };
    const result = await db
      .collection<IProduct>('products')
      .insertOne(newProduct as IProduct);
    res.status(201).json({ ...newProduct, _id: result.insertedId });
  } catch (error) {
    console.error('Error posting item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Product ID format' });
    }

    const db = await connectDb();
    const updateData = req.body as UpdateProductInput;

    const result = await db.collection<IProduct>('products').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          lastUpdated: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error posting item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const db = await connectDb();
    const result = await db
      .collection<IProduct>('products')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: `Product deleted successfully` });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
