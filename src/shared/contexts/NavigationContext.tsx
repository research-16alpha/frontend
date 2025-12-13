import React, { createContext, useContext, ReactNode, useState } from 'react';

export type Page = 'home' | 'products' | 'account' | 'about';

interface NavigationContextType {
  currentPage: Page;
  productsGender: string | null;
  navigateTo: (page: Page) => void;
  navigateToHome: () => void;
  navigateToProducts: (gender?: string) => void;
  navigateToAccount: () => void;
  navigateToAbout: () => void;
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

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const navigateToHome = () => {
    setProductsGender(null);
    navigateTo('home');
  };
  
  const navigateToProducts = (gender?: string) => {
    setProductsGender(gender || null);
    // Always navigate to products page, even if already there, to trigger refresh
    setCurrentPage('products');
  };
  
  const navigateToAccount = () => navigateTo('account');
  const navigateToAbout = () => navigateTo('about');

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        productsGender,
        navigateTo,
        navigateToHome,
        navigateToProducts,
        navigateToAccount,
        navigateToAbout,
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

