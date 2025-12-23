import { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { normalizeProducts } from '../utils/productTransform';

interface UseProductsOptions {
  fetchFn: (limit: number) => Promise<any>;
  limit: number;
}

export function useProducts({ fetchFn, limit }: UseProductsOptions) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFn(limit);
        const backendProducts = Array.isArray(data) ? data : (data.products || []);
        const normalized = normalizeProducts(backendProducts);
        setProducts(normalized);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
        setProducts([]); // Reset products on error
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [fetchFn, limit]);

  return { products, loading, error };
}

