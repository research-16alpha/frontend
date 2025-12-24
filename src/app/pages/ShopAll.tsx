import React, { useState, useEffect, useRef } from 'react';
import { BaseProductsPage } from './BaseProductsPage';
import { fetchProducts } from '../../features/products/services/productsService';
import { searchProducts } from '../../features/products/services/searchService';

export function ShopAll() {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const lastTimestampRef = useRef<string | null>(null);

  // Check for search query on mount and when component becomes visible
  useEffect(() => {
    const checkSearchQuery = () => {
      if (typeof window !== 'undefined') {
        const query = sessionStorage.getItem('searchQuery');
        const timestamp = sessionStorage.getItem('searchTimestamp');
        
        // Only update if timestamp changed (new search)
        if (query && timestamp && timestamp !== lastTimestampRef.current) {
          setSearchQuery(query);
          lastTimestampRef.current = timestamp;
        } else if (!query) {
          setSearchQuery(null);
          lastTimestampRef.current = null;
        }
      }
    };

    // Check immediately
    checkSearchQuery();

    // Check periodically to catch new searches (when user searches again)
    const interval = setInterval(checkSearchQuery, 200);

    // Also listen for storage events (for cross-tab communication)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'searchQuery' || e.key === 'searchTimestamp') {
        checkSearchQuery();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Use searchProducts if there's a search query, otherwise use fetchProducts
  const fetchProductsFn = React.useMemo(() => {
    if (searchQuery) {
      return async (page: number, limit: number) => {
        const skip = (page - 1) * limit;
        return await searchProducts({
          query: searchQuery,
          page,
          limit
        });
      };
    }
    return fetchProducts;
  }, [searchQuery]);

  const pageTitle = searchQuery ? `Search Results for "${searchQuery}"` : 'Shop All';
  const pageDescription = searchQuery 
    ? `Search results for "${searchQuery}"`
    : 'Discover our curated collection of premium fashion and accessories and get up to 50% Off';

  return (
    <BaseProductsPage
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      fetchProductsFn={fetchProductsFn}
      defaultSort="featured"
    />
  );
}

