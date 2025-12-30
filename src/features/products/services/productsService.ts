import { API_BASE } from "../../../config/api";
import { shuffleArray } from "../utils/shuffleArray";

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

export async function fetchProductById(id: string | number) {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to load product");
  return res.json();
}

export async function fetchTopDeals(page: number = 1, limit: number = 20) {
  // For Curated page: first page loads 50, subsequent pages load 20
  // Calculate skip based on page number and variable page sizes
  const skip = page === 1 ? 0 : 50 + (page - 2) * 20;
  const res = await fetch(`${API_BASE}/api/products/top-deals?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to load top deals");
  return res.json();
}

export async function fetchLatestProducts(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  const res = await fetch(`${API_BASE}/api/products/latest?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to load latest products - couldn't fetch products");
  const data = await res.json();
  console.log("Latest products response:", data);
  return data;
}

/**
 * Fetch products filtered by gender
 * Uses the dedicated gender endpoint which applies get_products logic with gender filtering
 */
export async function get_products_by_gender(gender: string, page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  const res = await fetch(`${API_BASE}/api/products/gender/${encodeURIComponent(gender)}?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error("Failed to load products by gender");
  return res.json();
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
  sortBy?: string;
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
  if (filters.sortBy) {
    params.append('sort_by', filters.sortBy);
  }
  
  const res = await fetch(`${API_BASE}/api/products/filter/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load filtered products");
  return res.json();
}

/**
 * Fetch products by their product_link values.
 * Returns products in the exact order of the provided links.
 * The links are shuffled before being sent to provide varied ordering.
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
  
  // Shuffle the links to mix the order
  const shuffledLinks = shuffleArray(productLinks);
  
  const res = await fetch(`${API_BASE}/api/products/by-links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product_links: shuffledLinks }),
  });
  
  if (!res.ok) {
    throw new Error("Failed to load products by links");
  }
  
  return res.json();
}

/**
 * Fetch curated products based on brand_name and keyword pairs.
 * For each tuple [brand_name, keyword], finds products that:
 * - Have the specified brand_name
 * - Have the keyword in product_name OR product_description
 * Returns the union of all products from all tuples.
 * 
 * @example
 * fetchCurated([
 *   { brand_name: "Gucci", keyword: "handbag" },
 *   { brand_name: "Prada", keyword: "shoes" }
 * ])
 */
export async function fetchCurated(brandKeywordPairs: Array<{ brand_name: string; keyword: string }>) {
  if (!brandKeywordPairs || brandKeywordPairs.length === 0) {
    return { products: [], total: 0 };
  }
  
  const res = await fetch(`${API_BASE}/api/products/curated`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      brand_keyword_pairs: brandKeywordPairs 
    }),
  });
  
  if (!res.ok) {
    throw new Error("Failed to load curated products");
  }
  
  return res.json();
}