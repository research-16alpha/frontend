import { API_BASE } from "../../../config/api";

/**
 * Fetch filter metadata (categories, brands, occasions) with counts from backend
 * Also includes sort options
 */
export async function fetchFilterMetadata() {
  const res = await fetch(`${API_BASE}/api/products/filter/metadata`);
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Failed to load filter metadata:", res.status, errorText);
    throw new Error("Failed to load filter metadata");
  }
  const data = await res.json();
  console.log("Filter metadata response:", data);
  return data;
}

