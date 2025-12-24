import { BaseProductsPage } from './BaseProductsPage';
import { searchProducts } from '../../features/products/services/searchService';

export function PreOwned() {
  // Use search query "pre-owned" to fetch pre-owned products
  const fetchProductsFn = async (page: number, limit: number) => {
    return await searchProducts({
      query: 'pre-owned',
      page,
      limit
    });
  };

  return (
    <BaseProductsPage
      pageTitle="Pre-Owned"
      pageDescription="Discover pre-owned luxury items at exceptional prices."
      fetchProductsFn={fetchProductsFn}
      defaultSort="featured"
    />
  );
}

