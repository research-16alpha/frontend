import { BaseProductsPage } from './BaseProductsPage';
import { fetchProductsByCategory } from '../../features/products/services/productsService';

export function PreOwned() {
  return (
    <BaseProductsPage
      pageTitle="Pre-Owned"
      pageDescription="Discover pre-owned luxury items at exceptional prices."
      fetchProductsFn={(page, limit) => fetchProductsByCategory('pre-owned', page, limit)}
      defaultSort="featured"
    />
  );
}

