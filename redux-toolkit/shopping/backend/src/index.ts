import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb, closeDb } from './config/db.js';

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

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
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
