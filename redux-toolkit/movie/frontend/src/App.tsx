import FilterBar from './components/FilterBar';
import MovieResults from './components/MovieResults';
import SearchBar from './components/SearchBar';
import WatchlistDisplay from './components/WatchlistDisplay';

const App = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Watchlist
        </h1>
        <SearchBar />
        <MovieResults />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
              My List
            </h2>
            <FilterBar />
          </div>
          <WatchlistDisplay />
        </div>
      </div>
    </div>
  );
};

export default App;
