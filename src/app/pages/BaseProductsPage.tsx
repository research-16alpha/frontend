import * as React from 'react';
import { AnnouncementBanner } from '../../shared/components/AnnouncementBanner';
import { Navbar } from '../../shared/components/Navbar';
import { AISearchBar } from '../../shared/components/AISearchBar';
import { Footer } from '../../shared/components/Footer';
import { ProductsGrid } from '../../features/products/components/ProductsGrid';
import { CategoryGroup } from '../../features/products/components/CategoryFilter';
import { SortOption } from '../../features/products/components/SortBy';
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
  const getPriceRange = (priceValue: string): { min?: number; max?: number } => {
    switch (priceValue) {
      case 'under-200':
        return { max: 200 };
      case '200-500':
        return { min: 200, max: 500 };
      case '500-1000':
        return { min: 500, max: 1000 };
      case 'over-1000':
        return { min: 1000 };
      default:
        return {};
    }
  };

  // Load products with filters
  React.useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        
        // Convert filters to backend format
        const categoryFilters = selectedFilters['CATEGORY'] || [];
        const brandFilters = selectedFilters['BRAND'] || [];
        const occasionFilters = selectedFilters['OCCASION'] || [];
        const priceFilter = selectedFilters['PRICE']?.[0];
        const priceRange = priceFilter ? getPriceRange(priceFilter) : {};
        
        const data = await fetchFilteredProducts({
          page,
          limit: 20,
          category: categoryFilters.length > 0 ? categoryFilters : undefined,
          brand: brandFilters.length > 0 ? brandFilters : undefined,
          occasion: occasionFilters.length > 0 ? occasionFilters : undefined,
          price_min: priceRange.min,
          price_max: priceRange.max,
          gender: gender,
        });
        
        const backendProducts = Array.isArray(data) ? data : (data.products || []);
        const normalized = normalizeProducts(backendProducts);
        
        if (page === 1) {
          setProducts(normalized);
        } else {
          setProducts(prev => [...prev, ...normalized]);
        }
        
        setHasMore(data.has_more !== false && normalized.length > 0);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [page, selectedFilters, sortBy, gender]);

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
      
      <ProductsGrid
        products={products}
        loading={loading}
        error={error}
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onProductClick={handleProductClick}
        categoryData={categoryData}
        sortOptions={sortOptions}
        selectedFilters={selectedFilters}
        sortBy={sortBy}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      <div className="mt-6 sm:mt-10 md:mt-14 lg:mt-18 xl:mt-22 pt-6 sm:pt-10 md:pt-14 lg:pt-18 xl:pt-22">
        <Footer />
      </div>
    </div>
  );
}

