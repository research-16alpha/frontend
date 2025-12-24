import React, { createContext, useContext, ReactNode, useState } from 'react';

export type Page = 'home' | 'products' | 'account' | 'about' | 'product' | 'curated' | 'new' | 'shop-all' | 'women' | 'men' | 'accessories' | 'pre-owned';
export type ProductsMode = 'products' | 'curated' | 'new';

interface NavigationContextType {
  currentPage: Page;
  productsGender: string | null;
  productsMode: ProductsMode | null;
  productId: string | null;
  previousPage: Page | null;
  navigateTo: (page: Page) => void;
  navigateToHome: () => void;
  navigateToProducts: (gender?: string) => void;
  navigateToAccount: () => void;
  navigateToAbout: () => void;
  navigateToCurated: () => void;
  navigateToNew: () => void;
  navigateToShopAll: (searchQuery?: string) => void;
  navigateToWomen: () => void;
  navigateToMen: () => void;
  navigateToAccessories: () => void;
  navigateToPreOwned: () => void;
  navigateToProduct: (productId: string) => void;
  navigateBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({
  children,
  currentPage,
  setCurrentPage,
}: {
  children: ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}) {
  const [productsGender, setProductsGender] = useState<string | null>(null);
  const [productsMode, setProductsMode] = useState<ProductsMode | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<Page | null>(null);

  const navigateTo = (page: Page) => {
    // Store previous page when navigating to product page
    if (page === 'product') {
      setPreviousPage(currentPage);
    }
    setCurrentPage(page);
  };

  const navigateToHome = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    navigateTo('home');
  };
  
  const navigateToProducts = (gender?: string) => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    // Navigate to appropriate page based on gender, or ShopAll if no gender
    if (gender === 'men') {
      setCurrentPage('men');
    } else if (gender === 'women') {
      setCurrentPage('women');
    } else {
      setCurrentPage('shop-all');
    }
  };
  
  const navigateToAccount = () => {
    setProductId(null);
    setPreviousPage(null);
    navigateTo('account');
  };
  
  const navigateToAbout = () => {
    setProductId(null);
    setPreviousPage(null);
    navigateTo('about');
  };

  const navigateToCurated = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    setCurrentPage('curated');
  };

  const navigateToNew = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    setCurrentPage('new');
  };

  const navigateToShopAll = (searchQuery?: string) => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    setCurrentPage('shop-all');
    
    // Update URL with search query if provided
    if (typeof window !== 'undefined') {
      if (searchQuery && searchQuery.trim()) {
        const url = new URL(window.location.href);
        url.searchParams.set('q', searchQuery.trim());
        window.history.pushState({}, '', url.toString());
      } else {
        const url = new URL(window.location.href);
        url.searchParams.delete('q');
        window.history.pushState({}, '', url.toString());
      }
    }
  };

  const navigateToWomen = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    setCurrentPage('women');
  };

  const navigateToMen = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    setCurrentPage('men');
  };

  const navigateToAccessories = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    setCurrentPage('accessories');
  };

  const navigateToPreOwned = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    setCurrentPage('pre-owned');
  };

  const navigateToProduct = (id: string) => {
    setProductId(id);
    setPreviousPage(currentPage);
    navigateTo('product');
  };

  const navigateBack = () => {
    if (previousPage) {
      const pageToGoBackTo = previousPage;
      setPreviousPage(null);
      setProductId(null);
      setCurrentPage(pageToGoBackTo);
    } else {
      // Default to home if no previous page
      navigateToHome();
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        productsGender,
        productsMode,
        productId,
        previousPage,
        navigateTo,
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
        navigateToProduct,
        navigateBack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

