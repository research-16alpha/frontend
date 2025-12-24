/**
 * Utility functions for managing URL parameters
 */

/**
 * Get a URL parameter value
 */
export function getUrlParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/**
 * Set a URL parameter and update the browser URL
 */
export function setUrlParam(key: string, value: string | null): void {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  if (value === null || value === '') {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  
  // Update URL without page reload
  window.history.pushState({}, '', url.toString());
}

/**
 * Get all URL parameters as an object
 */
export function getAllUrlParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * Remove a URL parameter
 */
export function removeUrlParam(key: string): void {
  setUrlParam(key, null);
}

/**
 * Clear all URL parameters
 */
export function clearUrlParams(): void {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', window.location.pathname);
}

