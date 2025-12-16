import React, { useState, useEffect } from 'react';
import { AnnouncementBanner } from '../shared/components/AnnouncementBanner';
import { Navbar } from '../shared/components/Navbar';
import { AISearchBar } from '../shared/components/AISearchBar';
import { HeroSection } from '../shared/components/HeroSection';
import { HorizontalScrollSection } from '../features/products/components/HorizontalScrollSection';
import { FeaturedSection } from '../features/products/components/FeaturedSection';
import { ProductMasonryGrid } from '../features/products/components/ProductMasonryGrid';
import { EditorialSection } from '../shared/components/EditorialSection';
import { Footer } from '../shared/components/Footer';
import { Products } from './Products';
import { Account } from '../features/auth/pages/Account';
import { BagSidebar } from '../features/bag/components/BagSidebar';
import { AuthModal } from '../features/auth/components/AuthModal';
import { AppProvider, useApp } from '../features/bag/contexts/AppContext';
import { NavigationProvider, useNavigation } from '../shared/contexts/NavigationContext';
import { Toaster } from 'sonner';
import { About } from './About';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'products' | 'account' | 'about'>('home');

  return (
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
  );
}

function AppWithNavigation() {
  const { currentPage, navigateToHome, navigateToProducts, navigateToAccount, navigateToAbout } = useNavigation();
  const { user } = useApp();

  // Redirect from account page if user logs out
  useEffect(() => {
    if (currentPage === 'account' && !user) {
      navigateToHome();
    }
  }, [user, currentPage, navigateToHome]);

  const handleCategoryClick = (category: string) => {
    if (category === 'men' || category === 'women' || category === 'pre-owned') {
      navigateToProducts(category);
    } else {
      // For other categories like 'accessories' or 'sale', navigate to products without gender filter
      navigateToProducts();
    }
  };

  // If on products page, render that instead
  if (currentPage === 'products') {
    return <Products />;
  }

  // If on account page, render that instead
  if (currentPage === 'account') {
    return <Account />;
  }

  if (currentPage === 'about') {
    return (
      <About 
        onNavigateHome={navigateToHome}
        onNavigateProducts={navigateToProducts}
        onNavigateAccount={navigateToAccount}
        onNavigateAbout={navigateToAbout}
        onCategoryClick={handleCategoryClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBanner />
      <Navbar 
        onFeaturedClick={() => {}}
        onProductsClick={navigateToProducts}
        onLogoClick={navigateToHome}
        onAccountClick={navigateToAccount}
        onAboutClick={navigateToAbout}
        onCategoryClick={handleCategoryClick}
        onPreOwnedClick={() => {
          // Navigate to products page - can be customized to filter for pre-owned items
          navigateToProducts();
        }}
      />
      <AISearchBar />
      
      <main className="flex-1">
        <HeroSection />
        <HorizontalScrollSection />
        <FeaturedSection />
        <ProductMasonryGrid />
        <EditorialSection />
      </main>

      <Footer />
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