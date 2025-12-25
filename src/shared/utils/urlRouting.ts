import { Page } from '../contexts/NavigationContext';

/**
 * URL routing utilities for navigation
 */

// Map page types to URL paths
export const pageToPath = (page: Page, productId?: string | null, currentPath?: string): string => {
  const basePaths: Record<Page, string> = {
    'home': '/',
    'shop-all': '/shop-all',
    'curated': '/curated',
    'new': '/new',
    'women': '/women',
    'men': '/men',
    'accessories': '/accessories',
    'pre-owned': '/pre-owned',
    'account': '/account',
    'about': '/about',
    'product': currentPath || '/', // Products use query params on current or home path
    'products': '/shop-all', // Legacy redirect
  };

  const basePath = basePaths[page] || '/';

  // For product page, add product ID as query parameter
  if (page === 'product' && productId) {
    // Use current pathname if available, otherwise use base path
    const pathToUse = currentPath || basePath;
    const url = new URL(pathToUse, window.location.origin);
    url.searchParams.set('product', productId);
    return url.pathname + url.search;
  }

  return basePath;
};

// Map URL path to page type
export const pathToPage = (pathname: string, searchParams: URLSearchParams): Page => {
  // Check for product query parameter first
  if (searchParams.has('product')) {
    return 'product';
  }

  // Map paths to pages
  const pathMap: Record<string, Page> = {
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
    '/products': 'shop-all', // Legacy redirect
  };

  return pathMap[pathname] || 'home';
};

/**
 * Get the current page from URL
 */
export const getPageFromUrl = (): { page: Page; productId: string | null } => {
  if (typeof window === 'undefined') {
    return { page: 'home', productId: null };
  }

  const url = new URL(window.location.href);
  const page = pathToPage(url.pathname, url.searchParams);
  const productId = url.searchParams.get('product');

  return { page, productId };
};

/**
 * Navigate to a URL path (unused, kept for potential future use)
 */
export const navigateToPath = (path: string, replace = false) => {
  if (typeof window === 'undefined') return;

  if (replace) {
    window.history.replaceState({}, '', path);
  } else {
    window.history.pushState({}, '', path);
  }

  // Dispatch popstate event to trigger URL change handlers
  window.dispatchEvent(new PopStateEvent('popstate'));
};

