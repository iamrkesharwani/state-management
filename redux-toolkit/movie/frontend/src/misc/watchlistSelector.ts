import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

const setWatchlistItems = (state: RootState) => state.watchlist.items;
const setCurrentFilter = (state: RootState) => state.watchlist.filter;

export const selectFilteredWatchlist = createSelector(
  [setWatchlistItems, setCurrentFilter],
  (items, filter) => {
    switch (filter) {
      case 'watched':
        return items.filter((movie) => movie.watched);
      case 'unwatched':
        return items.filter((movie) => !movie.watched);
      default:
        return items;
    }
  }
);
