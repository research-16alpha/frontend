import * as React from 'react';
import { ProductCard } from './ProductCard';
import { CategoryFilter, CategoryGroup } from './CategoryFilter';
import { SortBy, SortOption } from './SortBy';
import { Product } from '../types/product';
import { useIsMobile } from '../../../shared/components/ui/use-mobile';
import { useScrollDetection } from '../hooks/useScrollDetection';

interface ProductsGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  pageTitle: string;
  pageDescription?: string;
  hasMore: boolean;
  onLoadMore: () => void;
  onProductClick: (product: Product) => void;
  // Filter and sort props
  categoryData: CategoryGroup[];
  sortOptions: SortOption[];
  selectedFilters: Record<string, string[]>;
  sortBy: string;
  onFilterChange: (filters: Record<string, string[]>) => void;
  onSortChange: (value: string) => void;
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
  categoryData,
  sortOptions,
  selectedFilters,
  sortBy,
  onFilterChange,
  onSortChange,
}: ProductsGridProps) {
  const isMobile = useIsMobile();
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [desktopFilterOpen, setDesktopFilterOpen] = React.useState<string | null>(null);
  const topFiltersRef = React.useRef<HTMLDivElement>(null);
  const showFloatingButtons = useScrollDetection({ elementRef: topFiltersRef, enabled: isMobile });

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24 mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24 flex-1 w-full">
      {/* Page Title */}
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

      <div className="flex flex-col gap-8">
        {/* Filters Section */}
        {isMobile && (
          <div ref={topFiltersRef} className="w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative inline-block w-full">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="px-3 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center w-full cursor-pointer"
                >
                  Filters
                </button>
                {mobileFiltersOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setMobileFiltersOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 p-4">
                      {categoryData && categoryData.length > 0 ? (
                        <CategoryFilter 
                          categories={categoryData}
                          selectedFilters={selectedFilters}
                          onFilterChange={onFilterChange}
                        />
                      ) : (
                        <div className="text-sm text-gray-500 p-2">Loading filters...</div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <SortBy
                options={sortOptions}
                defaultValue={sortBy}
                onSortChange={onSortChange}
                label="Sort"
                variant="black"
              />
            </div>
          </div>
        )}

        {/* Desktop: Separate Filter Buttons + Sort Button */}
        <div className="hidden md:flex lg:flex xl:flex xxl:flex w-full items-center gap-4">
          {/* Category Filter Button */}
          <div className="relative flex-1">
            <button
              onClick={() => setDesktopFilterOpen(desktopFilterOpen === 'CATEGORY' ? null : 'CATEGORY')}
              className={`w-full px-4 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center cursor-pointer transition-colors ${
                selectedFilters['CATEGORY'] && selectedFilters['CATEGORY'].length > 0
                  ? 'bg-gray-100'
                  : ''
              }`}
            >
              Category
              {selectedFilters['CATEGORY'] && selectedFilters['CATEGORY'].length > 0 && (
                <span className="ml-2 text-xs">({selectedFilters['CATEGORY'].length})</span>
              )}
            </button>
            {desktopFilterOpen === 'CATEGORY' && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDesktopFilterOpen(null)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {categoryData && categoryData.length > 0 && categoryData[0] ? (
                      <CategoryFilter 
                        categories={[categoryData[0]]}
                        selectedFilters={selectedFilters}
                        onFilterChange={onFilterChange}
                        defaultExpanded={true}
                      />
                    ) : (
                      <div className="text-sm text-gray-500 p-2">Loading categories...</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Brand Filter Button */}
          <div className="relative flex-1">
            <button
              onClick={() => setDesktopFilterOpen(desktopFilterOpen === 'BRAND' ? null : 'BRAND')}
              className={`w-full px-4 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center cursor-pointer transition-colors ${
                selectedFilters['BRAND'] && selectedFilters['BRAND'].length > 0
                  ? 'bg-gray-100'
                  : ''
              }`}
            >
              Brand
              {selectedFilters['BRAND'] && selectedFilters['BRAND'].length > 0 && (
                <span className="ml-2 text-xs">({selectedFilters['BRAND'].length})</span>
              )}
            </button>
            {desktopFilterOpen === 'BRAND' && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDesktopFilterOpen(null)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {categoryData && categoryData.length > 1 && categoryData[1] ? (
                      <CategoryFilter 
                        categories={[categoryData[1]]}
                        selectedFilters={selectedFilters}
                        onFilterChange={onFilterChange}
                        defaultExpanded={true}
                      />
                    ) : (
                      <div className="text-sm text-gray-500 p-2">Loading brands...</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Occasion Filter Button */}
          <div className="relative flex-1">
            <button
              onClick={() => setDesktopFilterOpen(desktopFilterOpen === 'OCCASION' ? null : 'OCCASION')}
              className={`w-full px-4 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center cursor-pointer transition-colors ${
                selectedFilters['OCCASION'] && selectedFilters['OCCASION'].length > 0
                  ? 'bg-gray-100'
                  : ''
              }`}
            >
              Occasion
              {selectedFilters['OCCASION'] && selectedFilters['OCCASION'].length > 0 && (
                <span className="ml-2 text-xs">({selectedFilters['OCCASION'].length})</span>
              )}
            </button>
            {desktopFilterOpen === 'OCCASION' && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDesktopFilterOpen(null)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {categoryData && categoryData.length > 2 && categoryData[2] ? (
                      <CategoryFilter 
                        categories={[categoryData[2]]}
                        selectedFilters={selectedFilters}
                        onFilterChange={onFilterChange}
                        defaultExpanded={true}
                      />
                    ) : (
                      <div className="text-sm text-gray-500 p-2">Loading occasions...</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Price Filter Button */}
          <div className="relative flex-1">
            <button
              onClick={() => setDesktopFilterOpen(desktopFilterOpen === 'PRICE' ? null : 'PRICE')}
              className={`w-full px-4 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center cursor-pointer transition-colors ${
                selectedFilters['PRICE'] && selectedFilters['PRICE'].length > 0
                  ? 'bg-gray-100'
                  : ''
              }`}
            >
              Price
              {selectedFilters['PRICE'] && selectedFilters['PRICE'].length > 0 && (
                <span className="ml-2 text-xs">({selectedFilters['PRICE'].length})</span>
              )}
            </button>
            {desktopFilterOpen === 'PRICE' && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDesktopFilterOpen(null)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {categoryData && categoryData.length > 3 && categoryData[3] ? (
                      <CategoryFilter 
                        categories={[categoryData[3]]}
                        selectedFilters={selectedFilters}
                        onFilterChange={onFilterChange}
                        defaultExpanded={true}
                      />
                    ) : (
                      <div className="text-sm text-gray-500 p-2">Loading prices...</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sort Button */}
          <div className="relative flex-1 w-full">
            <SortBy
              options={sortOptions}
              defaultValue={sortBy}
              onSortChange={onSortChange}
              label="Sort"
              className="w-full"
              variant="black"
            />
          </div>
        </div>

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
                      className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Filter and Sort Buttons - Mobile Only */}
      {isMobile && showFloatingButtons && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 md:hidden">
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="relative inline-block w-full">
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="px-3 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center w-full cursor-pointer"
              >
                Filters
              </button>
              {mobileFiltersOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10 bg-black/50" 
                    onClick={() => setMobileFiltersOpen(false)}
                  />
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 shadow-lg z-50 p-4 max-h-[60vh] overflow-y-auto">
                    {categoryData && categoryData.length > 0 ? (
                      <CategoryFilter 
                        categories={categoryData}
                        selectedFilters={selectedFilters}
                        onFilterChange={onFilterChange}
                      />
                    ) : (
                      <div className="text-sm text-gray-500 p-2">Loading filters...</div>
                    )}
                  </div>
                </>
              )}
            </div>
            <SortBy
              options={sortOptions}
              defaultValue={sortBy}
              onSortChange={onSortChange}
              label="Sort"
              variant="black"
            />
          </div>
        </div>
      )}
    </main>
  );
}

