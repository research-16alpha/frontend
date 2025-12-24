import { useState, useEffect, useCallback } from 'react';
import { getSearchSuggestions } from '../services/searchService';

export interface UseSearchOptions {
  initialQuery?: string;
  onSearch?: (query: string) => void;
}

export interface UseSearchReturn {
  query: string;
  suggestions: string[];
  isSearching: boolean;
  setQuery: (query: string) => void;
  handleSearch: (query?: string) => void;
  handleSuggestionClick: (suggestion: string) => void;
  clearSearch: () => void;
}

/**
 * Hook for managing search functionality
 * Handles search query state, suggestions, and search execution
 */
export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { initialQuery = '', onSearch } = options;
  const [query, setQuery] = useState<string>(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch suggestions as user types (debounced)
  useEffect(() => {
    if (query.trim().length > 2) {
      const timer = setTimeout(async () => {
        try {
          const suggestionsData = await getSearchSuggestions(query, 5);
          const suggestionsList = Array.isArray(suggestionsData) 
            ? suggestionsData 
            : (suggestionsData?.suggestions || []);
          setSuggestions(suggestionsList.slice(0, 5));
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      }, 300);
      
      return () => {
        clearTimeout(timer);
      };
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = useCallback((searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    const trimmedQuery = queryToSearch.trim();
    
    if (!trimmedQuery) {
      return;
    }

    setIsSearching(true);
    setQuery(trimmedQuery);
    
    if (onSearch) {
      onSearch(trimmedQuery);
    }
    
    setIsSearching(false);
  }, [query, onSearch]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  }, [handleSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setSuggestions([]);
  }, []);

  return {
    query,
    suggestions,
    isSearching,
    setQuery,
    handleSearch,
    handleSuggestionClick,
    clearSearch,
  };
}

