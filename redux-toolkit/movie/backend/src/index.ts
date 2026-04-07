import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb, closeDb } from './config/db.js';
import movieRoutes from './routes/route.js';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/', movieRoutes);

const startServer = async () => {
  try {
    await connectDb();
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    const shutdown = async () => {
      console.log('\nStopping server...');
      server.close(async () => {
        await closeDb();
        console.log();
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
