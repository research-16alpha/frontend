import * as React from 'react';
import { AnnouncementBanner } from '../../shared/components/AnnouncementBanner';
import { Navbar } from '../../shared/components/Navbar';
import { AISearchBar } from '../../shared/components/AISearchBar';
import { Footer } from '../../shared/components/Footer';
import { HorizontalScrollSection } from '../../features/products/components/HorizontalScrollSection';
import { useNavigation } from '../../shared/contexts/NavigationContext';
import { fetchCurated } from '../../features/products/services/productsService';

export function Curated() {
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
  } = useNavigation();

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
        {/* Page Title */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24 pb-6">
          <div className="mb-6">
            <h2 className="mb-2 text-4xl md:text-5xl lg:text-6xl font-medium tracking-wide leading-tight font-headline">
              <span className="text-gray-charcoal-1 font-light">Curated Collection</span>
            </h2>
            <p className="text-sm text-gray-600 font-body">
              Discover our curated collection of premium fashion and accessories.
            </p>
          </div>
        </div>

        {/* Multiple Horizontal Scroll Sections with different keywords */}
        <HorizontalScrollSection 
          title="Designer Handbags" 
          searchKeyword="handbag" 
          limit={20}
          backgroundColor="#FFFFFF"
          verticalPadding="py-4 md:py-6"
        />
        <HorizontalScrollSection 
          title="Luxury Shoes" 
          searchKeyword="sneakers shoes" 
          limit={20}
          backgroundColor="#FFFFFF"
          verticalPadding="py-4 md:py-6"
        />
        <HorizontalScrollSection 
          title="Premium Accessories" 
          searchKeyword="accessories Versace" 
          limit={20}
          backgroundColor="#FFFFFF"
          verticalPadding="py-4 md:py-6"
        />
        <HorizontalScrollSection 
          title="Eyewears" 
          fetchFunction={async (page: number, limit: number) => {
            const data = await fetchCurated([
              { brand_name: "loewe", keyword: "glasses" }
            ]);
            // Limit the results to the requested limit
            if (data.products && Array.isArray(data.products)) {
              return {
                ...data,
                products: data.products.slice(0, limit)
              };
            }
            return data;
          }}
          limit={20}
          backgroundColor="#FFFFFF"
          verticalPadding="py-4 md:py-6"
        />
        <HorizontalScrollSection 
          title="Designer Dresses" 
          searchKeyword="zimmermann" 
          limit={20}
          backgroundColor="#FFFFFF"
          verticalPadding="py-4 md:py-6"
        />
        <HorizontalScrollSection 
          title="Luxury Watches" 
          searchKeyword="watch" 
          limit={20}
          backgroundColor="#FFFFFF"
          verticalPadding="py-4 md:py-6"
        />

        <Footer />
      </main>
    </div>
  );
}

