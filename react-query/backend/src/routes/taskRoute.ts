import { Router } from 'express';
import prisma from '../config/db.js';
import { Status } from '@prisma/client';

const router = Router();

router.get('/', async (req, res) => {
  const { status } = req.query;

  try {
    const whereCondition = {
      ...(status ? { status: status as Status } : {}),
    };
    const tasks = await prisma.task.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: 'Title is required' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(404).json({ error: 'Task not found or update failed' });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status:
          task.status === Status.PENDING ? Status.COMPLETED : Status.PENDING,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle task' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id },
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
