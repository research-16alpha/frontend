import React from 'react';
<<<<<<< HEAD
import { fetchProductsWithCustomSort } from '../services/productsService';
=======
>>>>>>> develop
import { useNavigation } from '../../../shared/contexts/NavigationContext';
import { ProductCard } from './ProductCard';
import { useProductsByLinks } from '../hooks/useProductsByLinks';
import { DESIGNER_SALE_LINKS } from '../constants/curatedProductLinks';

export function HeroSection() {
  const { navigateToProduct } = useNavigation();
<<<<<<< HEAD
  const { products: saleProducts, loading } = useProducts({ fetchFn: fetchProductsWithCustomSort, limit: 10 });
=======
  const { products: saleProducts, loading } = useProductsByLinks(DESIGNER_SALE_LINKS);
>>>>>>> develop

  return (
    <section className="w-full bg-white py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">

        {/* Top Banner */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl lg:text-6xl uppercase font-medium tracking-wide leading-tight">
              <span className="text-gray-charcoal-1 font-light">Designer Sale</span>
            </h2>
            
            <div className="text-sm md:text-base  leading-relaxed">
              <p className="font-extralight">Smarter buying starts here.</p>
              <p className="font-extralight">We track prices across the internet so you don't have to.</p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-200 overflow-hidden">
                <div className="aspect-[3/4] bg-gray-200"></div>
                <div className="p-4 space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {saleProducts.map(product => {
              return (
                <div key={product.id} className="h-full">
                  <ProductCard 
                    product={product}
                    onClick={() => navigateToProduct(product.id || '')}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

