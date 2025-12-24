import { BaseProductsPage } from './BaseProductsPage';
import { fetchFilteredProducts } from '../../features/products/services/productsService';

export function Accessories() {
  // Fetch all products filtered by accessories-related categories
  // Categories are sent in frontend format (lowercase-dashes) and backend converts them
  const fetchProductsFn = async (page: number, limit: number) => {
    return await fetchFilteredProducts({
      page,
      limit,
      category: [
        'accessories',
        'other',
        'jewellery-watches',
        'beauty-personal-care'
      ]
    });
  };

  return (
    <BaseProductsPage
      pageTitle="Accessories"
      pageDescription="Discover luxury accessories from all the world's most celebrated designers—shop online today."
      fetchProductsFn={fetchProductsFn}
      defaultSort="featured"
    />
  );
}

