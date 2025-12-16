import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchTopDeals } from '../services/productsService';
import { transformProducts, FrontendProduct } from '../utils/productTransform';
import { ProductCard } from './ProductCard';

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

export function HorizontalScrollSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchTopDeals(6);
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="w-full bg-white py-8 md:py-12 relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <h2 className="text-xl md:text-2xl mb-6 uppercase tracking-tight">New This Week</h2>
        
        {/* Scroll Container */}
        <div className="relative group">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              <div className="flex gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[280px] md:w-[320px] animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[280px] md:w-[320px]">
                  <ProductCard
                    product={product}
                  />
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}