import React, { createContext, useContext, ReactNode, useState } from 'react';

export type Page = 'home' | 'products' | 'account' | 'about' | 'product';

interface NavigationContextType {
  currentPage: Page;
  productsGender: string | null;
  productId: string | null;
  previousPage: Page | null;
  navigateTo: (page: Page) => void;
  navigateToHome: () => void;
  navigateToProducts: (gender?: string) => void;
  navigateToAccount: () => void;
  navigateToAbout: () => void;
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
    setProductId(null);
    setPreviousPage(null);
    navigateTo('home');
  };
  
  const navigateToProducts = (gender?: string) => {
    setProductsGender(gender || null);
    setProductId(null);
    setPreviousPage(null);
    // Always navigate to products page, even if already there, to trigger refresh
    setCurrentPage('products');
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
        productId,
        previousPage,
        navigateTo,
        navigateToHome,
        navigateToProducts,
        navigateToAccount,
        navigateToAbout,
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

