import { createAsyncThunk } from '@reduxjs/toolkit';
import { omdbApi } from '../api/axios';
import type { Movie, OMDBMovie } from '../types/movie';

export const searchMovies = createAsyncThunk(
  'movie/searchMovies',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await omdbApi.get('', {
        params: { s: query },
      });

      if (response.data.Response === 'False') {
        return rejectWithValue(response.data.Error);
      }

      const mappedMovies: Movie[] = response.data.Search.map(
        (m: OMDBMovie) => ({
          title: m.Title,
          year: m.Year,
          imdbID: m.imdbID,
          poster: m.Poster,
        })
      );

      return mappedMovies;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);
