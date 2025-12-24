import { API_BASE } from "../../../config/api";

/**
 * Search options for product queries
 */
export interface SearchOptions {
  query: string;
  page?: number;
  limit?: number;
  filters?: {
    category?: string | string[];
    brand?: string | string[];
    gender?: string | string[];
    price_min?: number;
    price_max?: number;
  };
}

/**
 * Search products by query string
 * This will be used by the AI Search Bar component
 * 
 * @example
 * // Basic search
 * searchProducts({ query: 'nike shoes' })
 * 
 * @example
 * // Search with filters
 * searchProducts({ 
 *   query: 'running shoes',
 *   filters: { 
 *     brand: ['nike', 'adidas'],
 *     price_min: 100,
 *     price_max: 500
 *   },
 *   page: 1,
 *   limit: 20
 * })
 */
export async function searchProducts(options: SearchOptions) {
  const { query, page = 1, limit = 20, filters = {} } = options;
  const skip = (page - 1) * limit;

  const params = new URLSearchParams();
  params.append('q', query);
  params.append('limit', String(limit));
  params.append('skip', String(skip));

  // Add filters if provided
  if (filters.category) {
    const categories = Array.isArray(filters.category) 
      ? filters.category 
      : [filters.category];
    categories.forEach(cat => params.append('category', cat));
  }
  if (filters.brand) {
    const brands = Array.isArray(filters.brand) 
      ? filters.brand 
      : [filters.brand];
    brands.forEach(b => params.append('brand', b));
  }
  if (filters.gender) {
    params.append('gender', filters.gender);
  }
  if (filters.price_min !== undefined) {
    params.append('price_min', String(filters.price_min));
  }
  if (filters.price_max !== undefined) {
    params.append('price_max', String(filters.price_max));
  }

  const url = `${API_BASE}/api/products/search?${params.toString()}`;
  console.log("searchProducts API called:", url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to search products: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Get search suggestions/autocomplete based on partial query
 * This can be used for search autocomplete functionality
 * 
 * @example
 * getSearchSuggestions('nik')
 * // Returns suggestions like ['nike', 'nike shoes', 'nike air max']
 */
export async function getSearchSuggestions(query: string, limit: number = 10) {
  const params = new URLSearchParams();
  params.append('q', query);
  params.append('limit', String(limit));

  const url = `${API_BASE}/api/products/search/suggestions?${params.toString()}`;
  console.log("getSearchSuggestions API called:", url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to get search suggestions: ${res.statusText}`);
  }
  const data = await res.json();
  // Backend returns {suggestions: [...], query: "..."}, extract suggestions array
  return Array.isArray(data) ? data : (data.suggestions || []);
}

