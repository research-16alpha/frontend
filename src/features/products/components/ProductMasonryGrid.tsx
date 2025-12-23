import React from 'react';
import { fetchBestDeals } from '../services/productsService';
import { ProductCard } from './ProductCard';
import { useNavigation } from '../../../shared/contexts/NavigationContext';
import { useProducts } from '../hooks/useProducts';

export function ProductMasonryGrid() {
  const { navigateToProduct } = useNavigation();
  const { products, loading, error } = useProducts({ fetchFn: fetchBestDeals, limit: 20 });

  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl mb-6 md:mb-8 uppercase tracking-tight">Best Deals</h2>
        
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