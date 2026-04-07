import { addToWatchList } from '../app/watchlistThunk';
import { useAppDispatch, useAppSelector } from '../misc/hooks';

const MovieResults = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.movies);

  if (status === 'loading')
    return (
      <p className="text-zinc-400 text-sm text-center py-8">
        Searching movies...
      </p>
    );

  if (status === 'failed')
    return (
      <p className="text-red-400 text-sm text-center py-8">Error: {error}</p>
    );

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((movie) => (
        <div
          key={movie.imdbID}
          className="group bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden hover:border-zinc-500 transition-colors"
        >
          <div className="aspect-[2/3] overflow-hidden bg-zinc-700">
            <img
              src={movie.poster !== 'N/A' ? movie.poster : '/placeholder.png'}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3">
            <p className="text-zinc-100 text-sm font-medium leading-snug line-clamp-2">
              {movie.title}
            </p>
            <p className="text-zinc-500 text-xs mt-1">{movie.year}</p>
            <button
              onClick={() =>
                dispatch(
                  addToWatchList({
                    title: movie.title,
                    year: movie.year,
                    imdbID: movie.imdbID,
                    poster: movie.poster,
                  })
                )
              }
              className="mt-3 w-full text-xs font-semibold py-1.5 rounded-lg bg-zinc-700 hover:bg-amber-500 hover:text-zinc-900 text-zinc-300 transition-colors"
            >
              + Watchlist
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieResults;
