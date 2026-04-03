import { Router } from 'express';
import { connectDb } from '../config/db.js';
import { ObjectId } from 'mongodb';
import type { IProduct } from '../config/type.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const db = await connectDb();
    const collection = db.collection<IProduct>('products');
    const products = await collection.find({}).toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown Error',
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    if (!name || price === undefined || stock === undefined) {
      return res
        .status(400)
        .json({ message: 'Missing required fields: name, price, or stock' });
    }
    const db = await connectDb();
    const newProduct: IProduct = {
      name: String(name),
      price: Number(price),
      stock: Number(stock),
      lastUpdated: new Date(),
    };
    const result = await db
      .collection<IProduct>('products')
      .insertOne(newProduct);
    res.status(201).json({ ...newProduct, _id: result.insertedId });
  } catch (error) {
    console.error('Error posting item:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown Error',
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, stock } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Product ID format' });
    }

    const db = await connectDb();

    const updateData: Partial<IProduct> = {
      lastUpdated: new Date(),
    };
    if (name !== undefined) updateData.name = String(name);
    if (price !== undefined) updateData.price = Number(price);
    if (stock !== undefined) updateData.stock = Number(stock);

    const result = await db
      .collection<IProduct>('products')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: `Product ID: ${id} updated successfully`,
      updatedFields: updateData,
    });
  } catch (error) {
    console.error('Error posting item:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown Error',
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Product ID format' });
    }

    const db = await connectDb();

    const result = await db
      .collection<IProduct>('products')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(204).json({ message: `Product ID: ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown Error',
    });
  }
});

export default router;
