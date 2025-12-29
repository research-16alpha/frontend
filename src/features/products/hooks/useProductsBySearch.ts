import { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { searchProducts } from '../services/searchService';
import { normalizeProducts } from '../utils/productTransform';

/**
 * Custom hook to fetch products by search keyword.
 * Returns products matching the search query.
 */
export function useProductsBySearch(keyword: string, limit: number = 20) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        
        if (!keyword || keyword.trim().length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const data = await searchProducts({
          query: keyword.trim(),
          page: 1,
          limit: limit
        });
        
        const backendProducts = Array.isArray(data) ? data : (data.products || []);
        const normalized = normalizeProducts(backendProducts);
        setProducts(normalized);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products by search:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, [keyword, limit]);

  return { products, loading, error };
}

