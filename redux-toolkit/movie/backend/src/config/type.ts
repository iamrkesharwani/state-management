import type { ObjectId } from 'mongodb';

export interface Movie {
  title: string;
  year: string;
  imdbID: string;
  poster: string;
}

export interface WatchlistItem extends Movie {
  _id: ObjectId;
  watched: boolean;
}

export interface WatchlistStateItem extends Movie {
  id: string;
  watched: boolean;
}
