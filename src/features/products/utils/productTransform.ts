// Utility to transform backend product format to frontend format

export interface BackendProduct {
  id: string;
  product_link?: string;
  product_image?: string;
  brand_name?: string;
  product_description?: string;
  price_original?: string;
  price_final?: string;
  available_sizes?: string | string[]; // Can be string or array from backend
  wishlist_state?: string;
  disc_pct?: string;
  discount?: number;
  original_price?: string;
  product_category?: string;
  product_gender?: string;
  product_name?: string;
  product_sub_category?: string;
  sale_price?: string;
  scraped_at?: string;
  // Legacy fields for backward compatibility
  title?: string;
  price?: string;
  image?: string;
  description?: string;
  category?: string;
  [key: string]: any; // Allow additional fields
}

export interface FrontendProduct {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
  rating?: number;
  reviews?: number;
  sizes?: string[];
  colors?: string[];
  product_link?: string;
  brand_name?: string;
  product_gender?: string;
}

/**
 * Parse price string to number, handling currency symbols and commas
 */
function parsePrice(priceStr?: string): number {
  if (!priceStr) return 0;
  // Remove currency symbols, commas, and whitespace
  const cleaned = priceStr.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculate discounted price from original price and discount percentage
 */
function calculateDiscountedPrice(originalPrice: number, discPct?: string): number | undefined {
  if (!discPct) return undefined;
  const discount = parseFloat(discPct.replace('%', ''));
  if (isNaN(discount) || discount <= 0) return undefined;
  return originalPrice * (1 - discount / 100);
}

/**
 * Parse sizes from comma-separated string or array to array
 */
function parseSizes(sizes?: string | string[]): string[] {
  if (!sizes) return [];
  
  // If it's already an array, return it (ensuring it's a proper string array)
  if (Array.isArray(sizes)) {
    return sizes.map(s => String(s).trim()).filter(s => s.length > 0);
  }
  
  // If it's a string, split by comma
  if (typeof sizes === 'string') {
    return sizes.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
  
  return [];
}

/**
 * Transform backend product to frontend format
 */
export function transformProduct(backendProduct: BackendProduct): FrontendProduct {
  // Parse prices - prefer sale_price/original_price, fallback to price_final/price_original
  const salePrice = parsePrice(backendProduct.sale_price || backendProduct.price_final);
  const originalPrice = parsePrice(backendProduct.original_price || backendProduct.price_original || backendProduct.price);
  
  // Determine if we have both prices available
  const hasSalePrice = salePrice > 0;
  const hasOriginalPrice = originalPrice > 0;
  const hasBothPrices = hasSalePrice && hasOriginalPrice;
  
  // Use sale_price if available, otherwise use original_price as the main price
  const mainPrice = hasSalePrice ? salePrice : originalPrice;

  // Determine image URL - prefer product_image, then product_link
  const imageUrl = backendProduct.product_image || backendProduct.image || backendProduct.product_link || '';

  // Determine name - prefer product_name, then title
  const name = backendProduct.product_name || backendProduct.title || 'Untitled Product';

  // Determine description
  const description = backendProduct.product_description || backendProduct.description || '';

  // Determine category - prefer product_category, then category
  const category = backendProduct.product_category || backendProduct.category || 'Uncategorized';

  // Parse available sizes
  const sizes = parseSizes(backendProduct.available_sizes);

  // Keep id as string
  const id = String(backendProduct.id);

  return {
    id,
    name,
    price: mainPrice,
    // Always show sale_price as discountedPrice when both prices are available
    discountedPrice: hasBothPrices ? salePrice : (hasSalePrice ? salePrice : undefined),
    // Always show original_price when both prices are available, or when only original_price exists
    originalPrice: hasBothPrices ? originalPrice : (hasOriginalPrice && !hasSalePrice ? originalPrice : undefined),
    image: imageUrl,
    images: imageUrl ? [imageUrl] : [],
    category,
    description,
    rating: 4.5, // Default rating
    reviews: 0, // Default reviews
    sizes: sizes.length > 0 ? sizes : [],
    colors: [], // Default empty colors
    product_link: backendProduct.product_link,
    brand_name: backendProduct.brand_name,
    product_gender: backendProduct.product_gender,
  };
}

/**
 * Transform array of backend products to frontend format
 */
export function transformProducts(backendProducts: BackendProduct[]): FrontendProduct[] {
  return backendProducts.map(transformProduct);
}

