import { useAppDispatch, useAppSelector } from '../misc/hooks';
import { setFilter } from '../app/watchlistSlice';

const FilterBar = () => {
  const dispatch = useAppDispatch();
  const currentFilter = useAppSelector((state) => state.watchlist.filter);
  const filters = ['all', 'watched', 'unwatched'] as const;

  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => dispatch(setFilter(f))}
          className={`capitalize text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors ${
            currentFilter === f
              ? 'bg-amber-500 border-amber-500 text-zinc-900'
              : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
