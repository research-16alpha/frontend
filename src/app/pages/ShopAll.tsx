import React, { useState, useEffect } from 'react';
import { BaseProductsPage } from './BaseProductsPage';
import { fetchProducts } from '../../features/products/services/productsService';
import { searchProducts } from '../../features/products/services/searchService';
import { getUrlParam } from '../../shared/utils/urlParams';
import { shuffleArray } from '../../features/products/utils/shuffleArray';

export function ShopAll() {
  // Initialize searchQuery from URL immediately (synchronously)
  // This prevents race condition where BaseProductsPage fetches before URL is read
  const [searchQuery, setSearchQuery] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return getUrlParam('q');
    }
    return null;
  });

  // Read search query from URL parameter (for updates after initial render)
  useEffect(() => {
    const updateSearchQuery = () => {
      const query = getUrlParam('q');
      setSearchQuery(query);
    };

    // Listen for URL changes (browser back/forward, programmatic navigation)
    const handlePopState = () => {
      updateSearchQuery();
    };

    // Also check periodically for programmatic URL changes
    const interval = setInterval(updateSearchQuery, 100);

    window.addEventListener('popstate', handlePopState);

    return () => {
      clearInterval(interval);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Use searchProducts if there's a search query, otherwise use fetchProducts with shuffling
  const fetchProductsFn = React.useMemo(() => {
    if (searchQuery && searchQuery.trim()) {
      return async (page: number, limit: number) => {
        return await searchProducts({
          query: searchQuery.trim(),
          page,
          limit
        });
      };
    }
    // Wrap fetchProducts to shuffle the products array
    return async (page: number, limit: number) => {
      const data = await fetchProducts(page, limit);
      
      // Handle different response formats: array or object with products property
      if (Array.isArray(data)) {
        // If response is directly an array, shuffle it
        return shuffleArray(data);
      } else if (data.products && Array.isArray(data.products)) {
        // If response has a products property, shuffle the products array
        return {
          ...data,
          products: shuffleArray(data.products)
        };
      } else if (data.items && Array.isArray(data.items)) {
        // If response has an items property, shuffle the items array
        return {
          ...data,
          items: shuffleArray(data.items)
        };
      }
      
      // Fallback: return data as-is if structure is unexpected
      return data;
    };
  }, [searchQuery]);

  const pageTitle = searchQuery ? `Search Results for "${searchQuery}"` : 'Shop All';
  const pageDescription = searchQuery 
    ? `Search results for "${searchQuery}"`
    : 'Discover our curated collection of premium fashion and accessories from the best brands in the world.';

  return (
    <BaseProductsPage
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      fetchProductsFn={fetchProductsFn}
      defaultSort="featured"
    />
  );
}

