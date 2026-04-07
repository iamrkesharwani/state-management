import { connectDb } from '../config/db.js';
import type { Request, Response } from 'express';
import type { WatchlistItem } from '../config/type.js';
import { ObjectId, type OptionalId } from 'mongodb';

export const getWatchList = async (_req: Request, res: Response) => {
  try {
    const db = await connectDb();
    const collection = db.collection<OptionalId<WatchlistItem>>('watchlist');
    const movies = await collection.find({}).toArray();
    const formattedMovies = movies.map(({ _id, ...movie }) => ({
      ...movie,
      id: _id!.toString(),
    }));
    res.status(200).json(formattedMovies);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const postWatchList = async (req: Request, res: Response) => {
  try {
    const { title, year, imdbID, poster } = req.body;

    if (!title || !imdbID) {
      return res.status(400).json({ message: 'Missing required movie data' });
    }

    const db = await connectDb();
    const collection = db.collection<OptionalId<WatchlistItem>>('watchlist');

    const existing = await collection.findOne({ imdbID });
    if (existing) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    const newEntry: OptionalId<WatchlistItem> = {
      title,
      year,
      imdbID,
      poster,
      watched: false,
    };

    const result = await collection.insertOne(newEntry);

    res.status(201).json({
      ...newEntry,
      id: result.insertedId.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateWatchStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { watched } = req.body;

    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }

    if (typeof watched !== 'boolean') {
      return res
        .status(400)
        .json({ message: 'Watched status must be a boolean' });
    }

    const db = await connectDb();
    const collection = db.collection<OptionalId<WatchlistItem>>('watchlist');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { watched } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ id, watched });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteWatchListItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid or missing movie ID' });
    }

    const db = await connectDb();
    const collection = db.collection<OptionalId<WatchlistItem>>('watchlist');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ id });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
