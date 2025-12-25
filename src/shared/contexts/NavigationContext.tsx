import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { pageToPath, getPageFromUrl } from '../utils/urlRouting';

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
  const isUpdatingUrlRef = React.useRef(false);
  const isInitialMountRef = React.useRef(true);

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
    
    if (typeof window !== 'undefined') {
      isUpdatingUrlRef.current = true;
      const path = pageToPath('home');
      window.history.pushState({}, '', path);
      setTimeout(() => { isUpdatingUrlRef.current = false; }, 0);
    }
    
    setCurrentPage('home');
  };
  
  const navigateToProducts = (gender?: string) => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    
    // Navigate to appropriate page based on gender, or ShopAll if no gender
    let targetPage: Page = 'shop-all';
    if (gender === 'men') {
      targetPage = 'men';
    } else if (gender === 'women') {
      targetPage = 'women';
    }
    
    if (typeof window !== 'undefined') {
      isUpdatingUrlRef.current = true;
      const path = pageToPath(targetPage);
      window.history.pushState({}, '', path);
      setTimeout(() => { isUpdatingUrlRef.current = false; }, 0);
    }
    
    setCurrentPage(targetPage);
  };
  
  const navigateToAccount = () => {
    setProductId(null);
    setPreviousPage(null);
    
    if (typeof window !== 'undefined') {
      isUpdatingUrlRef.current = true;
      const path = pageToPath('account');
      window.history.pushState({}, '', path);
      setTimeout(() => { isUpdatingUrlRef.current = false; }, 0);
    }
    
    setCurrentPage('account');
  };
  
  const navigateToAbout = () => {
    setProductId(null);
    setPreviousPage(null);
    
    if (typeof window !== 'undefined') {
      isUpdatingUrlRef.current = true;
      const path = pageToPath('about');
      window.history.pushState({}, '', path);
      setTimeout(() => { isUpdatingUrlRef.current = false; }, 0);
    }
    
    setCurrentPage('about');
  };

  const navigateToCurated = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    
    if (typeof window !== 'undefined') {
      isUpdatingUrlRef.current = true;
      const path = pageToPath('curated');
      window.history.pushState({}, '', path);
      setTimeout(() => { isUpdatingUrlRef.current = false; }, 0);
    }
    
    setCurrentPage('curated');
  };

  const navigateToNew = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    
    if (typeof window !== 'undefined') {
      isUpdatingUrlRef.current = true;
      const path = pageToPath('new');
      window.history.pushState({}, '', path);
      setTimeout(() => { isUpdatingUrlRef.current = false; }, 0);
    }
    
    setCurrentPage('new');
  };

  const navigateToShopAll = (searchQuery?: string) => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    
    if (typeof window !== 'undefined') {
      isUpdatingUrlRef.current = true;
      let path = pageToPath('shop-all');
      
      // Update URL with search query if provided
      if (searchQuery && searchQuery.trim()) {
        const url = new URL(path, window.location.origin);
        url.searchParams.set('q', searchQuery.trim());
        path = url.pathname + url.search;
      }
      
      window.history.pushState({}, '', path);
      setTimeout(() => { isUpdatingUrlRef.current = false; }, 0);
    }
    
    setCurrentPage('shop-all');
  };

  const navigateToWomen = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    
    if (typeof window !== 'undefined') {
      isUpdatingUrlRef.current = true;
      const path = pageToPath('women');
      window.history.pushState({}, '', path);
      setTimeout(() => { isUpdatingUrlRef.current = false; }, 0);
    }
    
    setCurrentPage('women');
  };

  const navigateToMen = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    
    if (typeof window !== 'undefined') {
      isUpdatingUrlRef.current = true;
      const path = pageToPath('men');
      window.history.pushState({}, '', path);
      setTimeout(() => { isUpdatingUrlRef.current = false; }, 0);
    }
    
    setCurrentPage('men');
  };

  const navigateToAccessories = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    
    if (typeof window !== 'undefined') {
      isUpdatingUrlRef.current = true;
      const path = pageToPath('accessories');
      window.history.pushState({}, '', path);
      setTimeout(() => { isUpdatingUrlRef.current = false; }, 0);
    }
    
    setCurrentPage('accessories');
  };

  const navigateToPreOwned = () => {
    setProductsGender(null);
    setProductsMode(null);
    setProductId(null);
    setPreviousPage(null);
    
    if (typeof window !== 'undefined') {
      isUpdatingUrlRef.current = true;
      const path = pageToPath('pre-owned');
      window.history.pushState({}, '', path);
      setTimeout(() => { isUpdatingUrlRef.current = false; }, 0);
    }
    
    setCurrentPage('pre-owned');
  };

  const navigateToProduct = (id: string) => {
    setProductId(id);
    setPreviousPage(currentPage);
    
    // Update URL with product ID - keep current pathname and add product query param
    if (typeof window !== 'undefined') {
      isUpdatingUrlRef.current = true;
      const currentPath = window.location.pathname;
      const path = pageToPath('product', id, currentPath);
      window.history.pushState({}, '', path);
      setTimeout(() => { isUpdatingUrlRef.current = false; }, 0);
    }
    
    setCurrentPage('product');
  };

  const navigateBack = () => {
    // Use browser back button for proper history navigation
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  // Read page and product ID from URL on mount and when URL changes (popstate events)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncStateFromUrl = () => {
      // Skip if we're currently updating the URL programmatically (except on initial mount)
      if (isUpdatingUrlRef.current && !isInitialMountRef.current) return;

      const { page, productId: urlProductId } = getPageFromUrl();
      
      // Update product ID
      if (urlProductId) {
        setProductId(urlProductId);
      } else {
        setProductId(null);
      }
      
      // Update current page
      setCurrentPage(page);
      
      // Mark that initial mount is complete
      if (isInitialMountRef.current) {
        isInitialMountRef.current = false;
      }
    };

    // Check on mount - handle direct URL entry
    syncStateFromUrl();

    // Listen for popstate events (back/forward button)
    window.addEventListener('popstate', syncStateFromUrl);

    return () => {
      window.removeEventListener('popstate', syncStateFromUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount, rely on popstate for URL changes

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

