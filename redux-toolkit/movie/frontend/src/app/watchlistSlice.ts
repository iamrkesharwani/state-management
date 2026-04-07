import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FilterType, WatchlistState } from '../types/movie';
import {
  fetchWatchlist,
  addToWatchList,
  toggleWatched,
  removeFromWatchlist,
} from './watchlistThunk';

const initialState: WatchlistState = {
  items: [],
  status: 'idle',
  filter: 'all',
  error: null,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addToWatchList.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addToWatchList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(toggleWatched.fulfilled, (state, action) => {
        const item = state.items.find((i) => i.id === action.payload.id);
        if (item) {
          item.watched = action.payload.watched;
        }
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export const { setFilter } = watchlistSlice.actions;
export default watchlistSlice.reducer;
