import { API_BASE } from "../../../config/api";

/**
 * Filter options for product queries
 */
export interface ProductFilters {
  category?: string | string[];
  brand?: string | string[];
  gender?: string | string[];
  price_min?: number;
  price_max?: number;
  [key: string]: string | string[] | number | undefined;
}

/**
 * Options for fetching products with filters
 */
export interface FetchProductsOptions {
  page?: number;
  limit?: number;
  filters?: ProductFilters;
  sort?: string;
}

/**
 * Build query string from filter object
 * Supports multiple values per filter (comma-separated or array format)
 */
function buildQueryString(filters: ProductFilters): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      // Multiple values: use array format or comma-separated
      if (value.length > 0) {
        // Option 1: Comma-separated values (e.g., ?category=electronics,clothing)
        params.append(key, value.join('%'));
        // Option 2: Array format (e.g., ?category[]=electronics&category[]=clothing)
        // Uncomment below if backend expects array format:
        // value.forEach(v => params.append(`${key}[]`, String(v)));
      }
    } else {
      params.append(key, String(value));
    }
  });

  return params.toString();
}

/**
 * Fetch products with flexible filtering using query parameters
 * Supports multiple filters and multiple values per filter
 * 
 * @example
 * // Single filter
 * fetchProductsWithFilters({ filters: { category: 'electronics' } })
 * 
 * @example
 * // Multiple values in one filter
 * fetchProductsWithFilters({ filters: { category: ['electronics', 'clothing'] } })
 * 
 * @example
 * // Multiple filters
 * fetchProductsWithFilters({ 
 *   filters: { 
 *     category: 'electronics',
 *     brand: ['nike', 'adidas'],
 *     price_min: 100,
 *     price_max: 500
 *   },
 *   page: 1,
 *   limit: 20
 * })
 */
export async function fetchProductsWithFilters(options: FetchProductsOptions = {}) {
  const { page = 1, limit = 40, filters = {}, sort } = options;
  const skip = (page - 1) * limit;

  // Build query string
  const queryParams = new URLSearchParams();
  
  // Add pagination
  queryParams.append('limit', String(limit));
  queryParams.append('skip', String(skip));

  // Add sorting if provided
  if (sort) {
    queryParams.append('sort', sort);
  }

  // Add filters
  const filterQuery = buildQueryString(filters);
  if (filterQuery) {
    // Merge filter params with existing params
    const filterParams = new URLSearchParams(filterQuery);
    filterParams.forEach((value, key) => {
      queryParams.append(key, value);
    });
  }

  const url = `${API_BASE}/api/products?${queryParams.toString()}`;
  console.log("fetchProductsWithFilters API called:", url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load products: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchProducts(page: number = 1, limit: number = 20) {
  console.log("fetchProducts API called");
  const skip = (page - 1) * limit;

  const res = await fetch(
    `${API_BASE}/api/products?limit=${limit}&skip=${skip}`
  );
  console.log("res", res);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function fetchProductsWithCustomSort(pageOrLimit: number = 1, limit?: number) {
  // Support two signatures:
  // 1. (limit: number) - for useProducts hook compatibility
  // 2. (page: number, limit: number) - for pagination
  let actualLimit: number;
  let skip: number;
  
  if (limit !== undefined) {
    // Called with (page, limit)
    actualLimit = limit;
    skip = (pageOrLimit - 1) * limit;
  } else {
    // Called with (limit) only
    actualLimit = pageOrLimit;
    skip = 0;
  }
  
  console.log("fetchProductsWithCustomSort API called", { limit: actualLimit, skip });

  const res = await fetch(
    `${API_BASE}/api/products/custom-sort?limit=${actualLimit}&skip=${skip}`
  );
  if (!res.ok) throw new Error("Failed to load products with custom sort");
  return res.json();
}

export async function fetchProductById(id: string | number) {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to load product");
  return res.json();
}

export async function fetchProductsByCategory(
  category: string,
  page: number = 1,
  limit: number = 20
) {
  const skip = (page - 1) * limit;

  const res = await fetch(
    `${API_BASE}/api/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
  );

  if (!res.ok) throw new Error("Failed to load products by category");
  return res.json();
}

export async function fetchTopDeals(limit: number = 4, skip: number = 0) {
  const res = await fetch(`${API_BASE}/api/products/top-deals?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to load top deals");
  return res.json();
}

export async function fetchBestDeals(limit: number = 20) {
  const res = await fetch(`${API_BASE}/api/products/best-deals?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load best deals");
  return res.json();
}

export async function fetchProductsByGender(
  gender: string,
  page: number = 1,
  limit: number = 20
) {
  const skip = (page - 1) * limit;

  const res = await fetch(
    `${API_BASE}/api/products/gender/${encodeURIComponent(gender)}?limit=${limit}&skip=${skip}`
  );

  if (!res.ok) throw new Error("Failed to load products by gender");
  return res.json();
}

// Note: Brand filtering endpoint not available in backend router
// Use fetchProductsWithFilters with brand filter instead
// export async function fetchProductsByBrand(brand: string, page: number = 1, limit: number = 20) {
//   const skip = (page - 1) * limit;
//   const res = await fetch(
//     `${API_BASE}/api/products/brand/${encodeURIComponent(brand)}?limit=${limit}&skip=${skip}`
//   );
//   if (!res.ok) throw new Error("Failed to load products by brand");
//   return res.json();
// }

export async function fetchLatestProducts(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  const res = await fetch(`${API_BASE}/api/products/latest?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to load latest products - couldn't fetch products");
  const data = await res.json();
  console.log("Latest products response:", data);
  return data;
}

/**
 * Fetch filtered products from backend
 */
export async function fetchFilteredProducts(options: {
  page?: number;
  limit?: number;
  category?: string[];
  brand?: string[];
  occasion?: string[];
  price_min?: number;
  price_max?: number;
  gender?: string;
}) {
  const { page = 1, limit = 40, ...filters } = options;
  const skip = (page - 1) * limit;
  
  const params = new URLSearchParams();
  params.append('limit', String(limit));
  params.append('skip', String(skip));
  
  if (filters.category && filters.category.length > 0) {
    filters.category.forEach(cat => params.append('category', cat));
  }
  if (filters.brand && filters.brand.length > 0) {
    filters.brand.forEach(b => params.append('brand', b));
  }
  if (filters.occasion && filters.occasion.length > 0) {
    filters.occasion.forEach(occ => params.append('occasion', occ));
  }
  if (filters.price_min !== undefined) {
    params.append('price_min', String(filters.price_min));
  }
  if (filters.price_max !== undefined) {
    params.append('price_max', String(filters.price_max));
  }
  if (filters.gender) {
    params.append('gender', filters.gender);
  }
  
  const res = await fetch(`${API_BASE}/api/products/filter/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load filtered products");
  return res.json();
}

/**
 * Fetch products by their product_link values.
 * Returns products in the exact order of the provided links.
 * 
 * @example
 * fetchProductsByLinks([
 *   "https://example.com/product1",
 *   "https://example.com/product2"
 * ])
 */
export async function fetchProductsByLinks(productLinks: string[]) {
  if (!productLinks || productLinks.length === 0) {
    return { products: [], total: 0 };
  }
  
  const res = await fetch(`${API_BASE}/api/products/by-links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product_links: productLinks }),
  });
  
  if (!res.ok) {
    throw new Error("Failed to load products by links");
  }
  
  return res.json();
}