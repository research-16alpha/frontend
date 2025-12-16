import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchTopDeals } from '../../features/products/services/productsService';
import {
  transformProducts,
  type FrontendProduct,
} from '../../features/products/utils/productTransform';
import { useNavigation } from '../../shared/contexts/NavigationContext';
import { ProductCard } from '../../features/products/components/ProductCard';

export function HeroSection() {
  const { navigateToProduct } = useNavigation();
  const [saleProducts, setSaleProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchTopDeals(10);
        const backendProducts = Array.isArray(data) ? data : (data.products || []);
        const transformed = transformProducts(backendProducts);
        setSaleProducts(transformed);
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
            {saleProducts.map(product => {
              const images =
                (product.images && product.images.length > 0
                  ? product.images
                  : product.image
                  ? [product.image]
                  : []) as string[];

              const mappedProduct = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    discountedPrice: product.discountedPrice,
                    originalPrice: product.originalPrice,
                    category: product.category,
                    images,
                    description: product.description || product.name,
                    sizes:
                      product.sizes && product.sizes.length > 0
                        ? product.sizes
                        : ['One Size'],
                    colors:
                      product.colors && product.colors.length > 0
                        ? product.colors
                        : ['Default'],
                    product_link: product.product_link,
                    brand_name: product.brand_name,
                    product_gender: product.product_gender,
                  };

              return (
                <div key={product.id}>
                  <ProductCard 
                    product={mappedProduct}
                    onClick={() => navigateToProduct(mappedProduct.id)}
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