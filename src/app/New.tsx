import * as React from 'react';
import { AnnouncementBanner } from '../shared/components/AnnouncementBanner';
import { Navbar } from '../shared/components/Navbar';
import { AISearchBar } from '../shared/components/AISearchBar';
import { Footer } from '../shared/components/Footer';
import { ProductCard } from '../features/products/components/ProductCard';
import { CategoryFilter, CategoryGroup } from '../features/products/components/CategoryFilter';
import { SortBy, SortOption } from '../features/products/components/SortBy';
import { fetchLatestProducts } from '../features/products/services/productsService';
import { transformProducts, FrontendProduct } from '../features/products/utils/productTransform';
import { useNavigation } from '../shared/contexts/NavigationContext';

export function New() {
  const { navigateToHome, navigateToProducts, navigateToAccount, navigateToAbout, navigateToCurated, navigateToNew, navigateToProduct } = useNavigation();

  const handleCategoryClick = (category: string) => {
    if (category === 'men' || category === 'women') {
      navigateToProducts(category);
    } else {
      navigateToProducts();
    }
  };

  const [products, setProducts] = React.useState<FrontendProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<FrontendProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<string>('newest');
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string[]>>({});

  const categoryData: CategoryGroup[] = React.useMemo(() => {
    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];
    const sizes = Array.from(new Set(products.flatMap(p => p.sizes || []))) as string[];

    return [
      {
        title: 'CATEGORY',
        options: categories.map((cat: string) => ({
          label: cat,
          value: cat.toLowerCase().replace(/\s+/g, '-'),
          count: products.filter(p => p.category === cat).length
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
  }, [products]);

  const sortOptions: SortOption[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A-Z', value: 'name-asc' },
    { label: 'Name: Z-A', value: 'name-desc' },
    { label: 'Featured', value: 'featured' }
  ];

  React.useEffect(() => {
    let filtered = [...products];

    if (selectedFilters['CATEGORY'] && selectedFilters['CATEGORY'].length > 0) {
      filtered = filtered.filter(p => {
        const categoryValue = p.category?.toLowerCase().replace(/\s+/g, '-');
        return selectedFilters['CATEGORY'].includes(categoryValue);
      });
    }

    if (selectedFilters['SIZE'] && selectedFilters['SIZE'].length > 0) {
      filtered = filtered.filter(p => {
        const productSizes = (p.sizes || []).map(s => s.toLowerCase());
        return selectedFilters['SIZE'].some(size => productSizes.includes(size));
      });
    }

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

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        // keep API order (newest first)
        break;
      case 'featured':
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedFilters, sortBy]);

  React.useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchLatestProducts(page, 20);
        const backendProducts = Array.isArray(data) ? data : (data.products || []);
        const transformed = transformProducts(backendProducts);

        if (page === 1) {
          setProducts(transformed);
        } else {
          setProducts(prev => [...prev, ...transformed]);
        }

        setHasMore(data.has_more !== false && transformed.length > 0);
        setError(null);
      } catch (err) {
        setError('Failed to load new arrivals');
        console.error('Error loading latest products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [page]);

  const handleFilterChange = (filters: Record<string, string[]>) => {
    setSelectedFilters(filters);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleProductClick = (product: FrontendProduct) => {
    navigateToProduct(product.id);
  };

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;
  const pageTitle = 'New Arrivals';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBanner />
      <Navbar 
        onFeaturedClick={() => {}} 
        onProductsClick={navigateToProducts}
        onLogoClick={navigateToHome}
        onAccountClick={navigateToAccount}
        onAboutClick={navigateToAbout}
        onCuratedClick={navigateToCurated}
        onNewArrivalsClick={navigateToNew}
        onCategoryClick={handleCategoryClick}
        onPreOwnedClick={() => {
          navigateToProducts();
        }}
      />
      <AISearchBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <div className="text-xs text-gray-600">
          <button onClick={navigateToHome} className="hover:underline">Home</button>
          <span className="mx-2">/</span>
          <span>{pageTitle}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl md:text-3xl">{pageTitle}</h2>
          <p className="text-sm text-gray-600">
            Explore the newest arrivals, sorted by latest first.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <CategoryFilter 
              categories={categoryData}
              onFilterChange={handleFilterChange}
            />
          </aside>

          <div className="lg:hidden">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="w-full px-3 py-3 border border-gray-300 bg-white text-sm uppercase tracking-wide mb-4 min-w-[140px]"
            >
              {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            {mobileFiltersOpen && (
              <div className="mb-6 border border-gray-200 bg-white p-4">
                <CategoryFilter 
                  categories={categoryData}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <p className="text-sm text-gray-600">
                {displayProducts.length} {displayProducts.length === 1 ? 'item' : 'items'}
                {selectedFilters && Object.keys(selectedFilters).length > 0 && 
                  (Object.values(selectedFilters) as string[][]).some((arr: string[]) => arr.length > 0) && 
                  ` (filtered from ${products.length})`
                }
              </p>
              <div className="sm:ml-auto flex justify-end w-full sm:w-auto">
                <SortBy 
                  options={sortOptions}
                  defaultValue="newest"
                  onSortChange={handleSortChange}
                />
              </div>
            </div>

            {loading && page === 1 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
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
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                  {displayProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        ...product,
                        images: product.images || [product.image],
                        originalPrice: product.originalPrice,
                      }}
                      onClick={() => handleProductClick(product)}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-12">
                    <button
                      onClick={() => setPage(prev => prev + 1)}
                      disabled={loading}
                      className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

