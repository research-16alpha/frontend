import { useState, useEffect, useRef } from 'react';
import { Product } from '../types/product';
import { searchProducts } from '../services/searchService';
import { normalizeProducts } from '../utils/productTransform';

type FetchFunction = (page: number, limit: number) => Promise<any>;

/**
 * Custom hook to fetch products either by search keyword or custom fetch function.
 * Returns products, loading state, and error.
 * 
 * Note: When passing fetchFunction, use stable function references from productsService.ts
 * (e.g., fetchTopDeals, fetchLatestProducts) rather than inline arrow functions to avoid
 * unnecessary re-renders.
 */
export function useProductsFlexible(
  searchKeyword?: string,
  fetchFunction?: FetchFunction,
  limit: number = 20
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to store fetchFunction to avoid re-renders when function reference changes
  const fetchFunctionRef = useRef(fetchFunction);
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  }, [fetchFunction]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        
        // Use custom fetch function if provided (prioritize function over keyword)
        if (fetchFunctionRef.current) {
          data = await fetchFunctionRef.current(1, limit);
        } 
        // Otherwise use search keyword
        else if (searchKeyword && searchKeyword.trim().length > 0) {
          data = await searchProducts({
            query: searchKeyword.trim(),
            page: 1,
            limit: limit
          });
        } 
        // If neither is provided, return empty
        else {
          setProducts([]);
          setLoading(false);
          return;
        }
        
        const backendProducts = Array.isArray(data) ? data : (data.products || []);
        const normalized = normalizeProducts(backendProducts);
        setProducts(normalized);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, [searchKeyword, limit]); // Removed fetchFunction from dependencies, using ref instead

  return { products, loading, error };
}

