import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { fetchTopDeals } from '../../features/products/services/productsService';
import { transformProducts } from '../../features/products/utils/productTransform';

interface SaleProduct {
  name: string;
  price: string;
  discountedPrice?: string;
  originalPrice?: string;
  image: string;
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
          price: `$${p.discountedPrice || p.price}`,
          discountedPrice: p.discountedPrice ? `$${p.discountedPrice}` : undefined,
          originalPrice: p.originalPrice ? `$${p.originalPrice}` : undefined,
          image: p.image,
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
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {saleProducts.map((product, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="aspect-square overflow-hidden bg-white mb-2">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-xs text-gray-600 mb-0.5">{product.name}</p>
              <div className="flex items-center gap-1.5">
                {product.discountedPrice && product.originalPrice ? (
                  <>
                    <p className="text-xs">{product.discountedPrice}</p>
                    <p className="text-xs text-gray-400 line-through">{product.originalPrice}</p>
                  </>
                ) : (
                  <p className="text-xs">{product.price}</p>
                )}
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}