import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './movieSlice.js';
import watchlistReducer from './watchlistSlice.js';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    watchlist: watchlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
