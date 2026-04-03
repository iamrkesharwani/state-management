import { Router } from 'express';
import { connectDb } from '../config/db.js';
import { ObjectId } from 'mongodb';
import type { Request, Response } from 'express';
import type { ICartItem, IProduct, AddToCartInput } from '../config/type.js';

const router = Router();

// Load cart
router.get('/', async (_req: Request, res: Response) => {
  try {
    const db = await connectDb();
    const items = await db.collection<ICartItem>('cart').find({}).toArray();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add to cart
router.post('/', async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body as AddToCartInput;

    if (typeof productId !== 'string' || !ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid or missing Product ID' });
    }

    const db = await connectDb();
    const productColl = db.collection<IProduct>('products');
    const cartColl = db.collection<ICartItem>('cart');

    const product = await productColl.findOne({ _id: new ObjectId(productId) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const cartUpdate = await cartColl.findOneAndUpdate(
      { productId: new ObjectId(productId) },
      {
        $inc: { quantity: quantity },
        $set: { addedAt: new Date() },
        $setOnInsert: {
          name: product.name,
          price: product.price,
          productId: new ObjectId(productId),
        } as ICartItem,
      },
      { upsert: true, returnDocument: 'after' }
    );

    await productColl.updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { stock: -quantity } }
    );

    res.status(200).json(cartUpdate);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Decrement from cart
router.patch('/:productId/decrement', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (typeof productId !== 'string' || !ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    const db = await connectDb();
    const cartColl = db.collection<ICartItem>('cart');
    const productColl = db.collection<IProduct>('products');

    const cartItem = await cartColl.findOne({
      productId: new ObjectId(productId),
    });
    if (!cartItem) return res.status(404).json({ message: 'Item not in cart' });

    if (cartItem.quantity > 1) {
      await cartColl.updateOne(
        { productId: new ObjectId(productId) },
        { $inc: { quantity: -1 } }
      );
    } else {
      await cartColl.deleteOne({ productId: new ObjectId(productId) });
    }

    await productColl.updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { stock: 1 } }
    );

    res.status(200).json({ message: 'Quantity decremented' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete from cart
router.delete('/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (typeof productId !== 'string' || !ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    const db = await connectDb();
    const cartColl = db.collection<ICartItem>('cart');
    const productColl = db.collection<IProduct>('products');

    const cartItem = await cartColl.findOne({
      productId: new ObjectId(productId),
    });
    if (!cartItem) return res.status(404).json({ message: 'Item not in cart' });

    await cartColl.deleteOne({ productId: new ObjectId(productId) });
    await productColl.updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { stock: cartItem.quantity } }
    );

    res.status(200).json({ message: 'Item removed and stock restored' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
