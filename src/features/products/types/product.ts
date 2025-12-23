/**
 * Unified Product interface matching the backend model exactly
 * @see halfsy-backend/backend/products/models.py
 */
export interface Product {
  id?: string;
  product_link?: string;
  product_image?: string;
  brand_name?: string;
  product_name?: string;
  product_description?: string;
  product_category?: string;
  product_sub_category?: string;
  product_gender?: string;
  product_color?: string[];
  product_material?: string;
  product_occasion?: string;
  currency?: string;
  original_price?: number;
  sale_price?: number;
  discount?: number;
  search_tags?: string;
  available_sizes?: string[];
  scraped_at?: string;
}

