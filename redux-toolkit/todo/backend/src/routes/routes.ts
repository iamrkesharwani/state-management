import { Router } from 'express';
import { connectDb } from '../config/db.js';
import { ObjectId } from 'mongodb';
import type { ITodo } from '../types/types.js';

const router = Router();

router.get('/todos', async (_, res) => {
  const db = await connectDb();
  const todos = await db.collection<ITodo>('todos').find().toArray();
  res.json(todos);
});

router.post('/todos', async (req, res) => {
  const { title } = req.body;
  const db = await connectDb();
  const newTodo: ITodo = {
    title,
    completed: false,
    createdAt: new Date(),
  };
  const result = await db.collection<ITodo>('todos').insertOne(newTodo);
  res.status(201).json({ ...newTodo, _id: result.insertedId });
});

router.patch('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const db = await connectDb();
  const newTitle = await db
    .collection<ITodo>('todos')
    .updateOne({ _id: new ObjectId(id) }, { $set: { title } });
  res.json(newTitle);
});

router.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const db = await connectDb();
  await db
    .collection<ITodo>('todos')
    .updateOne({ _id: new ObjectId(id) }, { $set: { completed } });
  res.json({ message: 'Todo status updated!' });
});

router.delete('/todos/completed', async (req, res) => {
  const db = await connectDb();
  const result = await db
    .collection<ITodo>('todos')
    .deleteMany({ completed: true });
  res.json({ message: `${result.deletedCount} todos deleted` });
});

router.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const db = await connectDb();
  await db.collection<ITodo>('todos').deleteOne({ _id: new ObjectId(id) });
  res.json({ message: 'Todo deleted' });
});

export default router;
