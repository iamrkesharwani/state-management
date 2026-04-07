import { createAsyncThunk } from '@reduxjs/toolkit';
import { backendApi } from '../api/axios';
import type { Movie } from '../types/movie';

export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetchWatchlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await backendApi.get('/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch watchlist'
      );
    }
  }
);

export const addToWatchList = createAsyncThunk(
  'watchlist/addToWatchList',
  async (movie: Movie, { rejectWithValue }) => {
    try {
      const response = await backendApi.post('/', movie);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add movie'
      );
    }
  }
);

export const toggleWatched = createAsyncThunk(
  'watchlist/toggleWatched',
  async (
    { id, watched }: { id: string; watched: boolean },
    { rejectWithValue }
  ) => {
    try {
      const result = await backendApi.patch(`/${id}`, { watched });
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update status'
      );
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'watchlist/removeFromWatchlist',
  async (id: string, { rejectWithValue }) => {
    try {
      await backendApi.delete(`/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove movie'
      );
    }
  }
);
