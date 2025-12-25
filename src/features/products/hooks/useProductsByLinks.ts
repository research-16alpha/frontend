import { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { fetchProductsByLinks } from '../services/productsService';
import { normalizeProducts } from '../utils/productTransform';

/**
 * Custom hook to fetch products by their product_link values.
 * Returns products in the exact order of the provided links.
 */
export function useProductsByLinks(productLinks: string[]) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        
        if (!productLinks || productLinks.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const data = await fetchProductsByLinks(productLinks);
        const backendProducts = Array.isArray(data) ? data : (data.products || []);
        const normalized = normalizeProducts(backendProducts);
        setProducts(normalized);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products by links:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, [productLinks.join(',')]); // Re-run when links change (using join for stable dependency comparison)

  return { products, loading, error };
}

