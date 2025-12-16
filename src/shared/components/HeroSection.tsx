import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchTopDeals } from '../../features/products/services/productsService';
import { transformProducts } from '../../features/products/utils/productTransform';

interface SaleProduct {
  name: string;
  price: number;
  discountedPrice?: number;
  originalPrice?: number;
  image: string;
  brand_name?: string;
  description?: string;
  category: string;
}

export function HeroSection() {
  const [saleProducts, setSaleProducts] = useState<SaleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchTopDeals(10);
        const backendProducts = Array.isArray(data) ? data : (data.products || []);
        const transformed = transformProducts(backendProducts);
        setSaleProducts(transformed.map(p => ({
          name: p.name,
          price: p.price,
          discountedPrice: p.discountedPrice,
          originalPrice: p.originalPrice,
          image: p.image,
          brand_name: p.brand_name,
          description: p.description,
          category: p.category,
        })));
      } catch (err) {
        console.error('Error loading products:', err);
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <section className="w-full bg-[#fef5f0] py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Top Banner */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-2xl md:text-3xl uppercase tracking-tight">Designer Sale</h2>
            <div className="text-xs md:text-sm text-gray-700">
              <p>Shop the latest sales</p>
              <p>from independent brands</p>
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
            {saleProducts.map((product, index) => (
            <div key={index} className="group cursor-pointer bg-white border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-[3/4] overflow-hidden bg-gray-50">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-1">
                {product.brand_name && (
                  <div className="text-xs font-semibold uppercase tracking-wider">
                    {product.brand_name}
                  </div>
                )}
                <div className="text-sm text-gray-700 line-clamp-2">
                  {product.description || product.name}
                </div>
                <div className="text-[10px] uppercase text-gray-400">
                  {product.category}
                </div>
                <div className="mt-2">
                  {product.discountedPrice && product.originalPrice ? (
                    <>
                      <span className="text-red-600 font-medium">
                        ${product.discountedPrice}
                      </span>
                      <span className="ml-2 text-xs line-through text-gray-400">
                        ${product.originalPrice}
                      </span>
                    </>
                  ) : (
                    <span className="font-medium">${product.price}</span>
                  )}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}