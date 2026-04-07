export interface OMDBMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
}

export interface Movie {
  title: string;
  year: string;
  imdbID: string;
  poster: string;
}

export interface WatchlistItem extends Movie {
  id: string;
  watched: boolean;
}

export interface MoviesState {
  items: Movie[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export type FilterType = 'all' | 'watched' | 'unwatched';

export interface WatchlistState {
  items: WatchlistItem[];
  filter: FilterType;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
