import * as React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types/product';

interface ProductsGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  pageTitle: string;
  pageDescription?: string;
  hasMore: boolean;
  onLoadMore: () => void;
  onProductClick: (product: Product) => void;
  sortBy?: string;
  selectedFilters?: Record<string, string[]>;
}

export function ProductsGrid({
  products,
  loading,
  error,
  pageTitle,
  pageDescription,
  hasMore,
  onLoadMore,
  onProductClick,
  sortBy = 'featured',
  selectedFilters = {},
}: ProductsGridProps) {

  // Products are filtered by backend, but sorted on frontend
  const sortedProducts = React.useMemo(() => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => (a.sale_price || a.original_price || 0) - (b.sale_price || b.original_price || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.sale_price || b.original_price || 0) - (a.sale_price || a.original_price || 0));
        break;
      case 'discount-desc':
        sorted.sort((a, b) => {
          const getDiscountPercent = (product: Product): number => {
            if (product.original_price && product.sale_price && product.original_price > product.sale_price) {
              return ((product.original_price - product.sale_price) / product.original_price) * 100;
            }
            return 0;
          };
          const discountA = getDiscountPercent(a);
          const discountB = getDiscountPercent(b);
          return discountB - discountA;
        });
        break;
      case 'name-asc':
        sorted.sort((a, b) => (a.product_name || '').localeCompare(b.product_name || ''));
        break;
      case 'name-desc':
        sorted.sort((a, b) => (b.product_name || '').localeCompare(a.product_name || ''));
        break;
      case 'newest':
        // Sort by scraped_at if available, otherwise by id
        sorted.sort((a, b) => {
          if (a.scraped_at && b.scraped_at) {
            return new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime();
          }
          return 0;
        });
        break;
      case 'featured':
      default:
        // Keep original order
        break;
    }
    
    return sorted;
  }, [products, sortBy]);

  const displayProducts = sortedProducts;

  return (
    <>
      {/* Page Title - Only show if pageTitle is provided */}
      {pageTitle && (
        <div className="mb-6">
          <h2 className="mb-2 text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide leading-tight">
            <span className="text-gray-charcoal-1 font-light">{pageTitle}</span>
          </h2>
          {pageDescription && (
            <p className="text-sm text-gray-600">
              {pageDescription}
            </p>
          )}
        </div>
      )}

      {/* Product Grid */}
      <div className="w-full">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {displayProducts.length} {displayProducts.length === 1 ? 'item' : 'items'}
            {selectedFilters && Object.keys(selectedFilters).length > 0 && 
              (Object.values(selectedFilters) as string[][]).some((arr: string[]) => arr.length > 0) && 
              ' (filtered)'
            }
          </p>
        </div>

        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 items-stretch">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse h-full">
                <div className="bg-gray-200 aspect-[3/4] mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-16">{error}</div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-16">No products found</div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 items-stretch">
              {displayProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard
                    product={product}
                    onClick={() => onProductClick(product)}
                  />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-6 sm:pt-8 md:pt-12 lg:pt-18 xl:pt-18">
                <div className="text-center mt-[4vh] sm:mt-[5vh] md:mt-[6vh] lg:mt-[7vh] xl:mt-[8vh] mb-8 sm:mb-12 md:mb-16 lg:mb-20">
                  <button
                    onClick={onLoadMore}
                    disabled={loading}
                    className="px-6 py-3 text-black border border-gray-500 cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

