import { API_BASE } from "../../../config/api";

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

export async function fetchTopDeals(limit: number = 6) {
  const res = await fetch(`${API_BASE}/api/products/top-deals?limit=${limit}`);
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

export async function fetchProductsByBrand(brand: string, page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  const res = await fetch(
    `${API_BASE}/api/products/brand/${encodeURIComponent(brand)}?limit=${limit}&skip=${skip}`
  );
  if (!res.ok) throw new Error("Failed to load products by brand");
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