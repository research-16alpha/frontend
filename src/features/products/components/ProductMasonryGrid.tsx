import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchProducts } from '../services/productsService';
import { transformProducts, FrontendProduct } from '../utils/productTransform';
import { ProductCard } from './ProductCard';
import { useNavigation } from '../../../shared/contexts/NavigationContext';

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  originalPrice?: number;
  category: string;
  images: string[];
  description: string;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  product_link?: string;
  brand_name?: string;
  product_gender?: string;
}

export function ProductMasonryGrid() {
  const { navigateToProduct } = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts(1, 20);
        const backendProducts = Array.isArray(data) ? data : (data.products || []);
        const transformed = transformProducts(backendProducts);
        setProducts(transformed.map(p => ({
          id: String(p.id),
          name: p.name,
          price: p.originalPrice || p.price,
          discountedPrice: p.discountedPrice,
          originalPrice: p.originalPrice,
          category: p.category || 'Uncategorized',
          images: p.images && p.images.length > 0 ? p.images : [p.image],
          description: p.description || '',
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
          sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L'],
          colors: p.colors && p.colors.length > 0 ? p.colors : ['Black', 'White'],
          product_link: p.product_link,
          brand_name: p.brand_name,
          product_gender: p.product_gender,
        })));
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl mb-6 md:mb-8 uppercase tracking-tight">Trending Now</h2>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-auto">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigateToProduct(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}