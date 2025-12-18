import React, { useState, useEffect, useMemo } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { fetchTopDeals } from '../../features/products/services/productsService';
import {
  transformProducts,
  type FrontendProduct,
} from '../../features/products/utils/productTransform';
import { useNavigation } from '../../shared/contexts/NavigationContext';
import { ProductCard } from '../../features/products/components/ProductCard';
import { CategoryFilter, CategoryGroup } from '../../features/products/components/CategoryFilter';
import { SortBy, SortOption } from '../../features/products/components/SortBy';
import { useIsMobile } from './ui/use-mobile';

export function HeroSection() {
  const { navigateToProduct } = useNavigation();
  const isMobile = useIsMobile();
  const [saleProducts, setSaleProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [desktopFilterOpen, setDesktopFilterOpen] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);
  const topFiltersRef = React.useRef<HTMLDivElement | null>(null);

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

  // Scroll detection for floating buttons (mobile only)
  useEffect(() => {
    if (!isMobile || !topFiltersRef.current) return;

    const handleScroll = () => {
      const topFiltersElement = topFiltersRef.current;
      if (!topFiltersElement) return;

      const rect = topFiltersElement.getBoundingClientRect();
      // Show floating buttons when top filters are scrolled out of view
      setShowFloatingButtons(rect.bottom < 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Category filter data
  const categoryData: CategoryGroup[] = useMemo(() => {
    const categories = Array.from(new Set(saleProducts.map(p => p.category).filter(Boolean))) as string[];
    const sizes = Array.from(new Set(saleProducts.flatMap(p => p.sizes || []))) as string[];
    const brands = Array.from(new Set(saleProducts.map(p => p.brand_name).filter(Boolean))) as string[];
    
    return [
      {
        title: 'CATEGORY',
        options: categories.map((cat: string) => ({
          label: cat,
          value: cat.toLowerCase().replace(/\s+/g, '-'),
          count: saleProducts.filter(p => p.category === cat).length
        })),
        multiSelect: true
      },
      {
        title: 'BRAND',
        options: brands.map((brand: string) => ({
          label: brand,
          value: brand.toLowerCase().replace(/\s+/g, '-'),
          count: saleProducts.filter(p => p.brand_name === brand).length
        })),
        multiSelect: true
      },
      {
        title: 'SIZE',
        options: sizes.slice(0, 10).map((size: string) => ({
          label: size,
          value: size.toLowerCase()
        })),
        multiSelect: true
      },
      {
        title: 'PRICE',
        options: [
          { label: 'Under $200', value: 'under-200' },
          { label: '$200 - $500', value: '200-500' },
          { label: '$500 - $1000', value: '500-1000' },
          { label: 'Over $1000', value: 'over-1000' }
        ],
        multiSelect: false
      }
    ];
  }, [saleProducts]);

  // Sort options
  const sortOptions: SortOption[] = useMemo(() => [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Discount: High to Low', value: 'discount-desc' },
    { label: 'Newest', value: 'newest' },
    { label: 'Name: A to Z', value: 'name-asc' },
    { label: 'Name: Z to A', value: 'name-desc' }
  ], []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...saleProducts];

    // Apply category filter
    if (selectedFilters['CATEGORY'] && selectedFilters['CATEGORY'].length > 0) {
      filtered = filtered.filter(p => {
        const categoryValue = p.category?.toLowerCase().replace(/\s+/g, '-');
        return selectedFilters['CATEGORY'].includes(categoryValue);
      });
    }

    // Apply brand filter
    if (selectedFilters['BRAND'] && selectedFilters['BRAND'].length > 0) {
      filtered = filtered.filter(p => {
        const brandValue = p.brand_name?.toLowerCase().replace(/\s+/g, '-');
        return brandValue && selectedFilters['BRAND'].includes(brandValue);
      });
    }

    // Apply size filter
    if (selectedFilters['SIZE'] && selectedFilters['SIZE'].length > 0) {
      filtered = filtered.filter(p => {
        const productSizes = (p.sizes || []).map(s => s.toLowerCase());
        return selectedFilters['SIZE'].some(size => productSizes.includes(size));
      });
    }

    // Apply price filter
    if (selectedFilters['PRICE'] && selectedFilters['PRICE'].length > 0) {
      const priceFilter = selectedFilters['PRICE'][0];
      filtered = filtered.filter(p => {
        const price = p.discountedPrice || p.price;
        switch (priceFilter) {
          case 'under-200':
            return price < 200;
          case '200-500':
            return price >= 200 && price < 500;
          case '500-1000':
            return price >= 500 && price < 1000;
          case 'over-1000':
            return price >= 1000;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
        break;
      case 'discount-desc':
        filtered.sort((a, b) => {
          const getDiscountPercent = (product: FrontendProduct): number => {
            if (product.originalPrice && product.discountedPrice) {
              return ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100;
            }
            return 0;
          };
          return getDiscountPercent(b) - getDiscountPercent(a);
        });
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      case 'featured':
      default:
        break;
    }

    return filtered;
  }, [saleProducts, selectedFilters, sortBy]);

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setSelectedFilters(filters);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  return (
    <section className="w-full bg-white py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Filters Section - Mobile - Hidden at 768px+ when desktop filters appear */}
        {/* {isMobile && (
          <div ref={topFiltersRef} className="w-full max-w-2xl mx-auto mb-6">
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
                    <CategoryFilter 
                      categories={categoryData}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </>
              )}
            </div>
            <SortBy
              options={sortOptions}
              defaultValue="featured"
              onSortChange={handleSortChange}
              label="Sort"
              variant="black"
            />
          </div>
        </div>
        )} */}

        {/* Filters Section - Desktop */}
        {/* <div className="hidden md:flex lg:flex xl:flex xxl:flex w-full items-center gap-4 mb-6">
          
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
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 p-4 min-w-[200px]">
                  <CategoryFilter 
                    categories={[categoryData[0]]}
                    onFilterChange={handleFilterChange}
                    defaultExpanded={true}
                  />
                </div>
              </>
            )}
          </div>

          
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
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 p-4 min-w-[200px]">
                  <CategoryFilter 
                    categories={[categoryData[1]]}
                    onFilterChange={handleFilterChange}
                    defaultExpanded={true}
                  />
                </div>
              </>
            )}
          </div>

         
          <div className="relative flex-1">
            <button
              onClick={() => setDesktopFilterOpen(desktopFilterOpen === 'SIZE' ? null : 'SIZE')}
              className={`w-full px-4 py-3 filter-button-border bg-white text-sm uppercase tracking-wide h-[42px] flex items-center justify-center cursor-pointer transition-colors ${
                selectedFilters['SIZE'] && selectedFilters['SIZE'].length > 0
                  ? 'bg-gray-100'
                  : ''
              }`}
            >
              Size
              {selectedFilters['SIZE'] && selectedFilters['SIZE'].length > 0 && (
                <span className="ml-2 text-xs">({selectedFilters['SIZE'].length})</span>
              )}
            </button>
            {desktopFilterOpen === 'SIZE' && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setDesktopFilterOpen(null)}
                />
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 p-4 min-w-[200px]">
                  <CategoryFilter 
                    categories={[categoryData[2]]}
                    onFilterChange={handleFilterChange}
                    defaultExpanded={true}
                  />
                </div>
              </>
            )}
          </div>

          
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
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 p-4 min-w-[200px]">
                  <CategoryFilter 
                    categories={[categoryData[3]]}
                    onFilterChange={handleFilterChange}
                    defaultExpanded={true}
                  />
                </div>
              </>
            )}
          </div>

          
          <div className="relative flex-1 w-full">
            <SortBy
              options={sortOptions}
              defaultValue="featured"
              onSortChange={handleSortChange}
              label="Sort"
              className="w-full"
              variant="black"
            />
          </div>
        </div> */}

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
            {filteredAndSortedProducts.map(product => {
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
                <div key={product.id} className="h-full">
                  <ProductCard 
                    product={mappedProduct}
                    onClick={() => navigateToProduct(mappedProduct.id)}
                  />
                </div>
              );
            })}
          </div>
        )}

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
                      <CategoryFilter 
                        categories={categoryData}
                        onFilterChange={handleFilterChange}
                      />
                    </div>
                  </>
                )}
              </div>
              <SortBy
                options={sortOptions}
                defaultValue="featured"
                onSortChange={handleSortChange}
                label="Sort"
                variant="black"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}