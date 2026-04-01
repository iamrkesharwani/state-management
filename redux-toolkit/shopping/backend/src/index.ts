import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pool from './config/db.js';
import todoRoutes from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'OK' });
  } catch {
    res.status(500).json({ status: 'DB_ERROR' });
  }
});

app.use('/api', todoRoutes);

const startServer = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');
    client.release();
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await pool.end();
  process.exit(0);
});
