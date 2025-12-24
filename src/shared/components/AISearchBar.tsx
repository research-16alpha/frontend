import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useSearch } from '../../features/products/hooks/useSearch';
import { useNavigation } from '../contexts/NavigationContext';
import { getUrlParam } from '../utils/urlParams';

export function AISearchBar() {
  const { navigateToShopAll } = useNavigation();
  const [isHovered, setIsHovered] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize search hook with URL parameter
  const initialQuery = typeof window !== 'undefined' ? getUrlParam('q') || '' : '';
  const {
    query,
    suggestions,
    isSearching,
    setQuery,
    handleSearch: handleSearchInternal,
    handleSuggestionClick,
    clearSearch,
  } = useSearch({
    initialQuery,
    onSearch: (searchQuery) => {
      navigateToShopAll(searchQuery);
    },
  });

  // Sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const urlQuery = getUrlParam('q') || '';
      if (urlQuery !== query) {
        setQuery(urlQuery);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [query, setQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    if (query.trim()) {
      handleSearchInternal();
    } else {
      // Clear search and navigate to shop-all without query
      clearSearch();
      navigateToShopAll(''); // Pass empty string to clear URL param
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    
    // Show suggestions if there are any
    if (suggestions.length > 0 && value.trim().length > 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchInternal();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClickWrapper = (suggestion: string) => {
    setShowSuggestions(false);
    handleSuggestionClick(suggestion);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="w-full bg-white ">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="w-full py-4 md:py-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative w-full">
              <div 
                className={`relative flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-full border transition-colors cursor-pointer ${
                  isHovered ? 'border-black' : 'border-gray-200'
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => inputRef.current?.focus()}
              >
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search our collection..."
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                  className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={handleSearchClick}
                  disabled={isSearching}
                  className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClickWrapper(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
