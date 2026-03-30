import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { seed } from './seed/seed.js';
import { connectDb } from './config/db.js';
import todoRoutes from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', todoRoutes);

const startServer = async () => {
  try {
    await connectDb();
    await seed();

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
