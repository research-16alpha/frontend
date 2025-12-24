import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchProducts, getSearchSuggestions } from '../../features/products/services/searchService';
import { useNavigation } from '../contexts/NavigationContext';

export function AISearchBar() {
  const { navigateToShopAll } = useNavigation();
  const [isHovered, setIsHovered] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isExpanded = isHovered || isFixed;

  // Load search query from sessionStorage on mount and listen for changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQuery = sessionStorage.getItem('searchQuery');
      if (savedQuery) {
        setSearchQuery(savedQuery);
        setIsFixed(true);
      }
      
      // Listen for storage events to update when search query changes from other tabs/components
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'searchQuery') {
          if (e.newValue) {
            setSearchQuery(e.newValue);
            setIsFixed(true);
          } else {
            // Search query was cleared
            setSearchQuery('');
            setIsFixed(false);
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
    setIsFixed(true);
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
      console.error('Search error:', error);
    } finally {
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
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <motion.div
          className="w-full py-4 md:py-6"
          onMouseEnter={() => !isFixed && setIsHovered(true)}
          onMouseLeave={() => !isFixed && setIsHovered(false)}
          animate={{
            paddingTop: isExpanded ? '2rem' : '1rem',
            paddingBottom: isExpanded ? '2rem' : '1rem',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <motion.div 
                  className="text-center mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-2xl md:text-3xl mb-2 tracking-tight">Discover Your Style</h2>
                  <p className="text-gray-600">Search our vast collection to grab the Best deals</p>
                </motion.div>

                <div className="relative w-full">
                  <div className="relative flex items-center gap-3 px-5 md:px-6 py-3 md:py-4 bg-gray-50 rounded-full border border-gray-200 hover:border-gray-300 transition-colors">
                    <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
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
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div 
                  onClick={handleSearchClick}
                  className="relative flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-full border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className={`flex-1 ${searchQuery ? 'text-gray-900' : 'text-gray-400'}`}>
                    {searchQuery || 'Search our collection...'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
