import React, { useState, useEffect } from 'react';
import { AnnouncementBanner } from '../shared/components/AnnouncementBanner';
import { Navbar } from '../shared/components/Navbar';
import { AISearchBar } from '../shared/components/AISearchBar';
import { HeroSection } from '../features/products/components/HeroSection';
import { HorizontalScrollSection } from '../features/products/components/HorizontalScrollSection';
import { FeaturedSection } from '../features/products/components/FeaturedSection';
import { ProductMasonryGrid } from '../features/products/components/ProductMasonryGrid';
import { EditorialSection } from '../features/products/components/EditorialSection';
import { Footer } from '../shared/components/Footer';
import { Account } from '../features/auth/pages/Account';
import { ExpandedContent } from '../features/products/components/ProductView';
import { useProductDetail } from '../features/products/hooks/useProductDetail';
import { BagSidebar } from '../features/bag/components/BagSidebar';
import { AuthModal } from '../features/auth/components/AuthModal';
import { AppProvider, useApp } from '../features/bag/contexts/AppContext';
import { NavigationProvider, useNavigation } from '../shared/contexts/NavigationContext';
import { FilterMetadataProvider } from '../shared/contexts/FilterMetadataContext';
import { Toaster } from 'sonner';
import { About } from './About';
import { ShopAll } from './pages/ShopAll';
import { Curated } from './pages/Curated';
import { New } from './pages/New';
import { Women } from './pages/Women';
import { Men } from './pages/Men';
import { Accessories } from './pages/Accessories';
import { PreOwned } from './pages/PreOwned';

function AppContent() {
  // Initialize currentPage from URL
  const getInitialPage = (): 'home' | 'products' | 'account' | 'about' | 'product' | 'curated' | 'new' | 'shop-all' | 'women' | 'men' | 'accessories' | 'pre-owned' => {
    if (typeof window === 'undefined') return 'home';
    const url = new URL(window.location.href);
    const pathname = url.pathname;
    
    // Check for product query parameter first
    if (url.searchParams.has('product')) {
      return 'product';
    }
    
    // Map paths to pages
    const pathMap: Record<string, 'home' | 'products' | 'account' | 'about' | 'product' | 'curated' | 'new' | 'shop-all' | 'women' | 'men' | 'accessories' | 'pre-owned'> = {
      '/': 'home',
      '/home': 'home',
      '/shop-all': 'shop-all',
      '/curated': 'curated',
      '/new': 'new',
      '/women': 'women',
      '/men': 'men',
      '/accessories': 'accessories',
      '/pre-owned': 'pre-owned',
      '/account': 'account',
      '/about': 'about',
      '/products': 'shop-all',
    };
    
    return pathMap[pathname] || 'home';
  };
  
  const [currentPage, setCurrentPage] = useState<'home' | 'products' | 'account' | 'about' | 'product' | 'curated' | 'new' | 'shop-all' | 'women' | 'men' | 'accessories' | 'pre-owned'>(getInitialPage());

  return (
    <FilterMetadataProvider>
      <NavigationProvider 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
      >
        <>
          <AppWithNavigation />
          <BagSidebar />
          <AuthModal />
        </>
      </NavigationProvider>
    </FilterMetadataProvider>
  );
}

function AppWithNavigation() {
  const { 
    currentPage, 
    productId,
    navigateBack,
    navigateToHome, 
    navigateToProducts, 
    navigateToAccount, 
    navigateToAbout, 
    navigateToCurated, 
    navigateToNew,
    navigateToShopAll,
    navigateToWomen,
    navigateToMen,
    navigateToAccessories,
    navigateToPreOwned,
  } = useNavigation();
  const { user } = useApp();
  
  // Product detail page hook
  const {
    product,
    loading,
    selectedSize,
    selectedColor,
    isAddingToBag,
    isFavorite,
    setSelectedSize,
    setSelectedColor,
    handleAddToBag,
    handleToggleFavorite,
  } = useProductDetail({
    productId,
    currentPage,
    navigateBack,
  });

  // Redirect from account page if user logs out
  useEffect(() => {
    if (currentPage === 'account' && !user) {
      navigateToHome();
    }
  }, [user, currentPage, navigateToHome]);

  // Redirect legacy products page to ShopAll
  useEffect(() => {
    if (currentPage === 'products') {
      navigateToShopAll();
    }
  }, [currentPage, navigateToShopAll]);

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
      navigateToProducts();
    }
  };

  // If on product item page, render that instead
  if (currentPage === 'product') {
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

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
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
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product...</p>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    if (!product) {
      return null;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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

        <main className="flex-1 w-full relative">
          <div className="max-w-7xl mx-auto py-12">
            <div className="bg-white rounded-lg shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden min-h-[600px]">
              <ExpandedContent
                product={product}
                onClose={navigateBack}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                handleAddToBag={handleAddToBag}
                handleToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
                isAddingToBag={isAddingToBag}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If on account page, render that instead
  if (currentPage === 'account') {
    return <Account />;
  }

  if (currentPage === 'about') {
    return <About />;
  }

  // Render dedicated pages
  if (currentPage === 'shop-all') {
    return <ShopAll />;
  }

  if (currentPage === 'curated') {
    return <Curated />;
  }

  if (currentPage === 'new') {
    return <New />;
  }

  if (currentPage === 'women') {
    return <Women />;
  }

  if (currentPage === 'men') {
    return <Men />;
  }

  if (currentPage === 'accessories') {
    return <Accessories />;
  }

  if (currentPage === 'pre-owned') {
    return <PreOwned />;
  }

  // Legacy products page - redirect handled by useEffect above
  if (currentPage === 'products') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBanner />
      <Navbar 
        onFeaturedClick={() => {}}
        onProductsClick={navigateToShopAll}
        onLogoClick={navigateToHome}
        onAccountClick={navigateToAccount}
        onAboutClick={navigateToAbout}
        onNewArrivalsClick={navigateToNew}
        onCategoryClick={handleCategoryClick}
        onPreOwnedClick={navigateToPreOwned}
        onCuratedClick={navigateToCurated}
      />
      <AISearchBar />
      
      <main className="flex-1">
        <HeroSection />
        <HorizontalScrollSection />
        <FeaturedSection />
        <ProductMasonryGrid />
        <EditorialSection />
        <Footer />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <>
        <AppContent />
        <Toaster position="top-center" />
      </>
    </AppProvider>
  );
}