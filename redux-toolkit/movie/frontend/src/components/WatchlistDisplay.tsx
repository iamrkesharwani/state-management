import { useAppDispatch, useAppSelector } from '../misc/hooks';
import { selectFilteredWatchlist } from '../misc/watchlistSelector';
import {
  fetchWatchlist,
  toggleWatched,
  removeFromWatchlist,
} from '../app/watchlistThunk';
import { useEffect } from 'react';

const WatchlistDisplay = () => {
  const dispatch = useAppDispatch();
  const filteredMovies = useAppSelector(selectFilteredWatchlist);
  const { status, error } = useAppSelector((state) => state.watchlist);

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  if (status === 'loading')
    return (
      <p className="text-zinc-400 text-sm text-center py-12">
        Loading your watchlist...
      </p>
    );

  if (status === 'failed')
    return <p className="text-red-400 text-sm text-center py-12">{error}</p>;

  if (!filteredMovies?.length)
    return (
      <p className="text-zinc-500 text-sm text-center py-12">
        No movies found for this filter.
      </p>
    );

  return (
    <ul className="divide-y divide-zinc-800">
      {filteredMovies.map((movie) => (
        <li key={movie.id} className="flex items-center gap-4 py-4">
          <div className="w-10 h-14 bg-zinc-700 rounded overflow-hidden shrink-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zinc-100 text-sm font-medium truncate">
              {movie.title}
            </p>
            <p className="text-zinc-500 text-xs">{movie.year}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() =>
                dispatch(
                  toggleWatched({ id: movie.id, watched: !movie.watched })
                )
              }
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                movie.watched
                  ? 'border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-zinc-900'
                  : 'border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200'
              }`}
            >
              {movie.watched ? 'Watched' : 'Unwatched'}
            </button>
            <button
              onClick={() => dispatch(removeFromWatchlist(movie.id))}
              className="text-xs text-zinc-600 hover:text-red-400 transition-colors px-2 py-1.5"
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default WatchlistDisplay;
