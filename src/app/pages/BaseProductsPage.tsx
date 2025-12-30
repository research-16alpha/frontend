import * as React from 'react';
import { AnnouncementBanner } from '../../shared/components/AnnouncementBanner';
import { Navbar } from '../../shared/components/Navbar';
import { AISearchBar } from '../../shared/components/AISearchBar';
import { Footer } from '../../shared/components/Footer';
import { ProductsGrid } from '../../features/products/components/ProductsGrid';
import { ProductFilters } from '../../features/products/components/ProductFilters';
import { Product } from '../../features/products/types/product';
import { normalizeProducts } from '../../features/products/utils/productTransform';
import { useNavigation } from '../../shared/contexts/NavigationContext';
import { useFilterMetadata } from '../../shared/contexts/FilterMetadataContext';
import { fetchFilteredProducts } from '../../features/products/services/productsService';

interface BaseProductsPageProps {
  pageTitle: string;
  pageDescription?: string;
  fetchProductsFn: (page: number, limit: number) => Promise<any>;
  defaultSort?: string;
  gender?: string; // Optional gender filter for pages like Men/Women
}

export function BaseProductsPage({
  pageTitle,
  pageDescription,
  fetchProductsFn,
  defaultSort = 'featured',
  gender,
}: BaseProductsPageProps) {
  const { 
    navigateToHome, 
    navigateToShopAll, 
    navigateToAccount, 
    navigateToAbout, 
    navigateToCurated, 
    navigateToNew,
    navigateToWomen,
    navigateToMen,
    navigateToAccessories,
    navigateToPreOwned,
    navigateToProduct 
  } = useNavigation();
  
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [sortBy, setSortBy] = React.useState<string>(defaultSort);
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>({});
  
  // Get filter metadata from global context (fetched on app load)
  const { categoryData, sortOptions } = useFilterMetadata();

  const handleCategoryClick = (category: string) => {
    if (category === 'men') {
      navigateToMen();
    } else if (category === 'women') {
      navigateToWomen();
    } else if (category === 'accessories') {
      navigateToAccessories();
    } else if (category === 'pre-owned') {
      navigateToPreOwned();
    } else {
      navigateToShopAll();
    }
  };

  // Convert price filter values to min/max
  // Must match backend PRICE_RANGES in filter_constants.py
  const getPriceRange = (priceValue: string): { min?: number; max?: number } => {
    switch (priceValue) {
      case 'under-500':
        return { max: 500 };
      case '500-1000':
        return { min: 500, max: 1000 };
      case '1000-5000':
        return { min: 1000, max: 5000 };
      case '5000-10000':
        return { min: 5000, max: 10000 };
      case 'over-10000':
        return { min: 10000 };
      default:
        return {};
    }
  };

  // Load products with filters
  React.useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        
        // If fetchProductsFn is provided (e.g., for search), use it directly
        // Otherwise, use fetchFilteredProducts with filters
        let data;
        // Use fetchProductsFn if provided and no filters are selected
        // This takes precedence over gender prop since fetchProductsFn is more specific
        if (fetchProductsFn && Object.keys(selectedFilters).length === 0) {
          // Use the provided fetch function (e.g., for search or default product listing)
          // For Curated page: first page loads 50 products, subsequent pages load 20
          // For other pages: consistent limit of 20 per page
          const pageLimit = page === 1 ? 50 : 20;
          data = await fetchProductsFn(page, pageLimit);
        } else {
        // Convert filters to backend format
        const categoryFilters = selectedFilters['CATEGORY'] || [];
        const brandFilters = selectedFilters['BRAND'] || [];
        const occasionFilters = selectedFilters['OCCASION'] || [];
        const priceFilter = selectedFilters['PRICE']?.[0];
        const priceRange = priceFilter ? getPriceRange(priceFilter) : {};
        
          data = await fetchFilteredProducts({
            page,
            limit: 20,
            category: categoryFilters.length > 0 ? categoryFilters : undefined,
            brand: brandFilters.length > 0 ? brandFilters : undefined,
            occasion: occasionFilters.length > 0 ? occasionFilters : undefined,
            price_min: priceRange.min,
            price_max: priceRange.max,
            gender: gender,
            sortBy: sortBy !== 'featured' ? sortBy : undefined,
          });
        }
        
        const backendProducts = Array.isArray(data) ? data : (data.products || []);
        const normalized = normalizeProducts(backendProducts);
        
        if (page === 1) {
          setProducts(normalized);
        } else {
          setProducts(prev => [...prev, ...normalized]);
        }
        
        // Determine if there are more products to load
        // Trust the backend's has_more flag if present, otherwise infer from response
        if (data.has_more !== undefined) {
          // Backend explicitly tells us if there are more
          setHasMore(data.has_more);
        } else {
          // Fallback: if we got a full page of results, assume there are more
          const pageLimit = page === 1 ? 50 : 20;
          setHasMore(normalized.length >= pageLimit);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [page, selectedFilters, sortBy, gender, fetchProductsFn]);

  // Reset to page 1 when fetchProductsFn changes (e.g., new search)
  React.useEffect(() => {
    setPage(1);
    setProducts([]);
  }, [fetchProductsFn]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleProductClick = (product: Product) => {
    navigateToProduct(product.id || '');
  };

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setSelectedFilters(filters);
    setPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1); // Reset to first page when sort changes
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBanner />
      <Navbar 
        onFeaturedClick={() => {}} 
        onProductsClick={navigateToShopAll}
        onLogoClick={navigateToHome}
        onAccountClick={navigateToAccount}
        onAboutClick={navigateToAbout}
        onCategoryClick={handleCategoryClick}
        onPreOwnedClick={navigateToPreOwned}
        onCuratedClick={navigateToCurated}
        onNewArrivalsClick={navigateToNew}
      />
      <AISearchBar />
      
      <main className="flex-1 w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pb-8 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24">
        {/* Page Title */}
        <div className="mb-6">
            <h2 className="mb-2 text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide leading-tight font-headline">
            <span className="text-gray-charcoal-1 font-light">{pageTitle}</span>
          </h2>
          {pageDescription && (
              <p className="text-sm text-gray-600 font-body">
              {pageDescription}
            </p>
          )}
        </div>

        {/* Filters and Sort */}
          <div className="mb-4 sm:mb-5 md:mb-6">
        <ProductFilters
          categoryData={categoryData}
          sortOptions={sortOptions}
          selectedFilters={selectedFilters}
          sortBy={sortBy}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
          </div>


        {/* Product Grid */}
        <ProductsGrid
          products={products}
          loading={loading}
          error={error}
          pageTitle=""
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onProductClick={handleProductClick}
          sortBy={sortBy}
          selectedFilters={selectedFilters}
        />

        <Footer />
      </div>
      </main>
    </div>
  );
}

