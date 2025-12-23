// Utility to normalize product data from backend
import { Product } from '../types/product';

/**
 * Parse sizes from comma-separated string or array to array
 */
function normalizeSizes(sizes?: string | string[]): string[] {
  if (!sizes) return [];
  
  if (Array.isArray(sizes)) {
    return sizes.map(s => String(s).trim()).filter(s => s.length > 0);
  }
  
  if (typeof sizes === 'string') {
    return sizes.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
  
  return [];
}

/**
 * Normalize product data from backend API
 * Assumes original_price and sale_price are always present (as per backend model)
 * Only normalizes data types (sizes array, etc.)
 */
export function normalizeProduct(product: any): Product {
  return {
    id: product.id ? String(product.id) : undefined,
    product_link: product.product_link,
    product_image: product.product_image,
    brand_name: product.brand_name,
    product_name: product.product_name,
    product_description: product.product_description,
    product_category: product.product_category,
    product_sub_category: product.product_sub_category,
    product_gender: product.product_gender,
    product_color: Array.isArray(product.product_color) 
      ? product.product_color.filter((c: any) => c && String(c).trim().length > 0)
      : undefined,
    product_material: product.product_material,
    product_occasion: product.product_occasion,
    currency: product.currency,
    original_price: typeof product.original_price === 'number' 
      ? product.original_price 
      : (product.original_price ? parseFloat(String(product.original_price)) : undefined),
    sale_price: typeof product.sale_price === 'number' 
      ? product.sale_price 
      : (product.sale_price ? parseFloat(String(product.sale_price)) : undefined),
    discount: product.discount,
    search_tags: product.search_tags,
    available_sizes: normalizeSizes(product.available_sizes),
    scraped_at: product.scraped_at,
  };
}

/**
 * Normalize array of products from backend API
 */
export function normalizeProducts(products: any[]): Product[] {
  return products.map(normalizeProduct);
}

