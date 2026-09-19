import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { TrainApi } from '../../api/booking.api';
import type { TrainResponse } from '../../types/train';

export interface SearchQuery {
  source: string;
  destination: string;
  journeyDate: string; // yyyy-MM-dd
}

export interface SearchContextValue {
  query: SearchQuery | null;
  results: TrainResponse[];
  loading: boolean;
  error: string | null;
  search: (q: SearchQuery) => Promise<void>;
  clear: () => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within a SearchProvider');
  return ctx;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState<SearchQuery | null>(null);
  const [results, setResults] = useState<TrainResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (q: SearchQuery) => {
    setLoading(true);
    setError(null);
    setQuery(q);
    try {
      const trains = await TrainApi.search({ source: q.source, destination: q.destination });
      // The search endpoint returns trains across dates; preserve the user's
      // selected journey date for downstream booking.
      setResults(trains);
    } catch (e) {
      setResults([]);
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setQuery(null);
    setResults([]);
    setError(null);
  }, []);

  const value = useMemo<SearchContextValue>(
    () => ({ query, results, loading, error, search, clear }),
    [query, results, loading, error, search, clear],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}