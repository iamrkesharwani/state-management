import { searchMovies } from '../app/movieThunk';
import { useAppDispatch } from '../misc/hooks';
import { useState } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (query.trim()) dispatch(searchMovies(query));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 w-full max-w-2xl mx-auto"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a movie..."
        className="flex-1 bg-zinc-800 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
      />
      <button
        type="submit"
        className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
