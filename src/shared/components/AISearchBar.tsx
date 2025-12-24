import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchProducts, getSearchSuggestions } from '../../features/products/services/searchService';
import { useNavigation } from '../contexts/NavigationContext';

export function AISearchBar() {
  const { navigateToShopAll } = useNavigation();
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load search query from sessionStorage on mount and listen for changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQuery = sessionStorage.getItem('searchQuery');
      if (savedQuery) {
        setSearchQuery(savedQuery);
      }
      
      // Listen for storage events to update when search query changes from other tabs/components
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'searchQuery') {
          if (e.newValue) {
            setSearchQuery(e.newValue);
          } else {
            // Search query was cleared
            setSearchQuery('');
          }
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

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

  const handleSearchClick = async () => {
    if (searchQuery.trim()) {
      await handleSearch();
    }
  };

  const handleSearch = async (query?: string) => {
    const queryToSearch = query || searchQuery;
    
    // If search is cleared (empty), clear sessionStorage and navigate to reset to default fetch
    if (!queryToSearch.trim()) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('searchQuery');
        sessionStorage.removeItem('searchTimestamp');
        // Trigger storage event so ShopAll can detect the change
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'searchQuery',
          newValue: null,
          storageArea: sessionStorage
        }));
      }
      setSearchQuery('');
      setShowSuggestions(false);
      // Navigate to shop-all to trigger re-fetch with default function
      navigateToShopAll();
      return;
    }
    
    try {
      setIsSearching(true);
      setShowSuggestions(false);
      const trimmedQuery = queryToSearch.trim();
      
      // Update state immediately
      setSearchQuery(trimmedQuery);
      
      // Store search query in sessionStorage with timestamp to ensure it's treated as new search
      sessionStorage.setItem('searchQuery', trimmedQuery);
      sessionStorage.setItem('searchTimestamp', Date.now().toString());
      
      // Navigate to shop-all page which will handle displaying search results
      // Force navigation even if already on shop-all page
      navigateToShopAll();
      
      // Small delay to ensure navigation happens
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.log("search error, ")
      console.error('Search error:', error);
    } finally {
      console.log("final stage")
      console.log("isSearching", isSearching)
      setIsSearching(false);
    }
  };

  const handleInputChange = async (value: string) => {
    setSearchQuery(value);
    
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // If search bar is cleared, remove search query from sessionStorage
    // This will cause ShopAll to use default fetchProducts instead of searchProducts
    if (!value.trim()) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('searchQuery');
        sessionStorage.removeItem('searchTimestamp');
        // Trigger storage event so ShopAll can detect the change
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'searchQuery',
          newValue: null,
          storageArea: sessionStorage
        }));
      }
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // Get suggestions as user types (debounced)
    if (value.trim().length > 2) {
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const suggestionsData = await getSearchSuggestions(value, 5);
          // Handle both array response and object with suggestions property
          const suggestionsList = Array.isArray(suggestionsData) 
            ? suggestionsData 
            : (suggestionsData?.suggestions || []);
          setSuggestions(suggestionsList.slice(0, 5)); // Ensure max 5
          setShowSuggestions(suggestionsList.length > 0);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300); // 300ms debounce
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
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
                  value={searchQuery}
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
                      onClick={() => handleSuggestionClick(suggestion)}
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
