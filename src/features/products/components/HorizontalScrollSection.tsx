import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchTopDeals } from '../services/productsService';
import { ProductCard } from './ProductCard';
import { useNavigation } from '../../../shared/contexts/NavigationContext';
import { useProducts } from '../hooks/useProducts';

export function HorizontalScrollSection() {
  const { navigateToProduct } = useNavigation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products, loading, error } = useProducts({ fetchFn: fetchTopDeals, limit: 20 });

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
    <section className="w-full bg-[#FBEFD9] py-8 md:py-12 relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-6xl font-light mb-6 uppercase tracking-tight">New This Week</h2>
        
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
                    onClick={() => navigateToProduct(product.id)}
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