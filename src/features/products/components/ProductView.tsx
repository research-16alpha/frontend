import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
import { Product } from '../types/product';
import { ProductsGrid } from './ProductsGrid';
import { ProductFilters } from './ProductFilters';
import { CategoryGroup } from './CategoryFilter';
import { SortOption } from './SortBy';
import { fetchFilteredProducts } from '../services/productsService';
import { fetchFilterMetadata } from '../services/metadataService';
import { normalizeProducts } from '../utils/productTransform';
import { useNavigation } from '../../../shared/contexts/NavigationContext';

// Helper function to capitalize first letter of each word
export const capitalizeWords = (str: string | undefined | null): string => {
  if (!str) return '';
  return str.replace(/\b\w+/g, word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
};

// Viewport detection hook
function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= breakpoint);

    check();

    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isDesktop;
}

interface ExpandedContentProps {
  product: Product;
  onClose: () => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  handleAddToBag: (e?: React.MouseEvent) => void;
  handleToggleFavorite: (e: React.MouseEvent) => void;
  isFavorite: boolean;
  isAddingToBag: boolean;
  onProductClick?: (product: Product) => void;
}

export function ExpandedContent({
  product,
  onClose,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  handleAddToBag,
  handleToggleFavorite,
  isFavorite,
  isAddingToBag,
  onProductClick,
}: ExpandedContentProps) {
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const { navigateToProduct } = useNavigation();
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  
  // Track viewport size for height clamping
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);
  
  // State for product grid
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryGroup[]>([]);
  const [sortOptions, setSortOptions] = useState<SortOption[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState<string>('featured');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch related products and filter metadata
  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        // Fetch filter metadata
        const metadata = await fetchFilterMetadata();
        if (metadata) {
          setCategoryData(metadata.categories || []);
          setSortOptions(metadata.sortOptions || []);
        }

        // Build filter parameters based on current product - only filter by brand
        const filters: {
          brand?: string[];
        } = {};

        // Add brand filter if available
        // Backend expects filter values in format: lowercase with spaces/ampersands replaced by dashes
        // Example: "Polo Ralph Lauren" -> "polo-ralph-lauren", "Electronics & Clothing" -> "electronics-clothing"
        if (product.brand_name) {
          const brandFilterValue = product.brand_name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/&/g, '-');
          filters.brand = [brandFilterValue];
        }

        // Fetch filtered products - only by brand (similar products from same brand)
        const limit = 20;
        const response = await fetchFilteredProducts({
          page,
          limit,
          brand: filters.brand,
        });
        
        if (response) {
          // Filter out the current product from results
          const normalized = normalizeProducts(response.products || [])
            .filter(p => p.id !== product.id);
          setRelatedProducts(normalized);
          setHasMore(response.total > page * limit);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProductsError('Failed to load products');
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [page, product.id, product.brand_name]);

  const handleProductClick = (clickedProduct: Product) => {
    if (onProductClick) {
      onProductClick(clickedProduct);
    } else {
      navigateToProduct(clickedProduct.id || '');
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setSelectedFilters(filters);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  return (
    <>
      
        {/* Expanded Content Container */}
        <div className="px-6">
      <div
        className={
          isDesktop
            ? "relative mx-auto my-10 max-w-[900px] bg-white rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col"
            : "relative flex flex-col min-h-0"
        }
        style={
          isDesktop && viewportSize.height > 0
            ? {
                maxHeight: `min(85vh, ${viewportSize.height * 0.85}px)`,
                maxWidth: `min(900px, ${viewportSize.width * 0.9}px)`,
              }
            : isDesktop
            ? { maxHeight: '85vh', maxWidth: 'min(900px, 90vw)' }
            : {}
        }
      >
      <div className="sticky top-0 z-[5] shrink-0 bg-white/95 backdrop-blur-xl shadow-sm px-8 py-5 relative">
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 md:px-10 py-6 pb-8">
        <div className="mx-auto max-w-7xl w-full">
          {/* Single column for mobile, 2 columns from md breakpoint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 md:items-start">
            {/* Image - First Column */}
            <div className="relative w-full max-w-full md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] aspect-[4/5] md:aspect-auto md:h-full md:max-h-[600px] lg:max-h-[650px] xl:max-h-[700px] bg-neutral-100 rounded-xl overflow-hidden shadow-xl md:sticky md:top-10 md:self-start">
              <ImageWithFallback
                src={product.product_image || ''}
                alt={product.product_name || 'Product'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Container - Second Column */}
            <div className="flex flex-col gap-6 w-full">
              {/* Category and Gender - one line with bullet separator */}
              <div className="flex items-center gap-2 text-sm text-gray-600 font-body">
                {product.product_category && <span>{product.product_category}</span>}
                {product.product_category && product.product_gender && (
                  <span className="text-gray-400">•</span>
                )}
                {product.product_gender && (
                  <span className="uppercase">{product.product_gender}</span>
                )}
              </div>

              {/* Brand Name, Product Name, Description, and Price */}
              <div className="flex flex-col gap-1">
                {/* Brand Name */}
                {product.brand_name && (
                  <div className="text-lg font-semibold uppercase tracking-wider text-gray-900 font-body">
                    {product.brand_name}
                  </div>
                )}

                {/* Product Name */}
                {product.product_name && (
                  <div className="text-base text-gray-700 font-medium font-body">
                    {capitalizeWords(product.product_name)}
                  </div>
                )}

                {/* Description */}
                {product.product_description && (
                  <p className="text-lg text-gray-700 leading-relaxed text-base font-light font-body">
                    {capitalizeWords(product.product_description)}
                  </p>
                )}

                {/* Product Details */}
                <div className="flex flex-col gap-2 pt-2">
                  {/* Sub Category */}
                  {product.product_sub_category && (
                    <div className="text-sm text-gray-600 font-body">
                      <span className="font-medium">Sub Category:</span>{' '}
                      <span>{capitalizeWords(product.product_sub_category)}</span>
                    </div>
                  )}

                  {/* Occasion */}
                  {product.product_occasion && (
                    <div className="text-sm text-gray-600 font-body">
                      <span className="font-medium">Occasion:</span>{' '}
                      <span>{capitalizeWords(product.product_occasion)}</span>
                    </div>
                  )}

                  {/* Material */}
                  {product.product_material && (
                    <div className="text-sm text-gray-600 font-body">
                      <span className="font-medium">Material:</span>{' '}
                      <span>{capitalizeWords(product.product_material)}</span>
                    </div>
                  )}

                  {/* Color */}
                  {product.product_color && product.product_color.length > 0 && (
                    <div className="text-sm text-gray-600 font-body">
                      <span className="font-medium">Color:</span>{' '}
                      <span>{product.product_color.map(c => capitalizeWords(c)).join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* PRICE */}
                <div className="flex flex-col gap-1">
                  {product.original_price && product.sale_price && product.original_price > product.sale_price ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg text-red-600 font-semibold text-base font-body">
                          {product.currency || '$'}{product.sale_price.toFixed(2)}
                        </span>
                        <span className="text-lg line-through text-gray-600 font-normal font-body">
                          {product.currency || '$'}{product.original_price.toFixed(2)}
                        </span>
                      </div>
                      {product.discount && (
                        <div className="text-sm text-red-600 font-medium font-body">
                          {product.discount}% OFF
                        </div>
                      )}
                    </>
                  ) : product.sale_price ? (
                    <>
                      <span className="font-medium text-base font-body">{product.currency || '$'}{product.sale_price.toFixed(2)}</span>
                      {product.discount && (
                        <div className="text-sm text-red-600 font-medium font-body">
                          {product.discount}% OFF
                        </div>
                      )}
                    </>
                  ) : product.original_price ? (
                    <>
                      <span className="font-medium text-base font-body">{product.currency || '$'}{product.original_price.toFixed(2)}</span>
                      {product.discount && (
                        <div className="text-sm text-red-600 font-medium font-body">
                          {product.discount}% OFF
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>

              {/* Link to original product */}
              {product.product_link && (
                <a
                  href={product.product_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 pt-2 font-body"
                >
                  <span>View original product</span>
                  <span className="text-[10px]">→</span>
                </a>
              )}

              {/* Select Size Dropdown */}
              <div className="relative pt-2">
                <button
                  onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                  className="w-full border border-black px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span className="text-sm font-body">
                    {selectedSize ? `Size: ${selectedSize}` : 'Select Size'}
                  </span>
                  <span className="text-gray-500">{isSizeDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {isSizeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-black shadow-lg">
                    {product.available_sizes && product.available_sizes.length > 0 ? (
                      product.available_sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setIsSizeDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors font-body ${
                            selectedSize === size ? 'bg-gray-100 font-medium' : ''
                          }`}
                        >
                          {size}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500 font-body">No sizes available</div>
                    )}
                  </div>
                )}
              </div>

              {/* Add to Bag and Add to Favorites buttons - same line */}
              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleAddToBag}
                  disabled={isAddingToBag}
                  className="flex-1 bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2.5 font-medium text-sm tracking-wide transition-all duration-200 hover:bg-gray-800 hover:shadow-[0_30px_80px_rgba(0,0,0,0.35)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_30px_80px_rgba(0,0,0,0.25)] font-body"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Bag
                </button>

                <button
                  onClick={handleToggleFavorite}
                  className="px-5 bg-white/95 backdrop-blur-xl border border-black rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Back Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="mt-4 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer text-sm flex items-center justify-center font-body"
                aria-label="Back"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      {/* Product Grid Below - Separate Section */}
      {/* <div className="relative -mx-6 w-[calc(100%+3rem)] mt-10 md:mt-14 lg:mt-20 xl:mt-26"> */}
      <div className="w-full mt-10 md:mt-14 lg:mt-20 xl:mt-26">
      {/* <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-10 md:mt-14 lg:mt-20 xl:mt-26"> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="mb-2 text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide leading-tight font-headline">
              <span className="text-gray-charcoal-1 font-light">
                {product.brand_name ? `More from ${product.brand_name}` : 'You May Also Like'}
              </span>
            </h2>
            {product.brand_name ? (
              <p className="text-sm text-gray-600 font-body">
                Discover more products from {product.brand_name}
              </p>
            ) : (
              <p className="text-sm text-gray-600 font-body">
                Discover more products you might love
              </p>
            )}
          </div>

          {/* Filters and Sort */}
          {/* <ProductFilters
            categoryData={categoryData}
            sortOptions={sortOptions}
            selectedFilters={selectedFilters}
            sortBy={sortBy}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          /> */}

          {/* Product Grid */}
          <ProductsGrid
            products={relatedProducts}
            loading={productsLoading}
            error={productsError}
            pageTitle=""
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onProductClick={handleProductClick}
            sortBy={sortBy}
            selectedFilters={selectedFilters}
          />
        </div>
      </div>
    </>
  );
}

