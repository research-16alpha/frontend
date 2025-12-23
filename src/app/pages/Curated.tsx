import { BaseProductsPage } from './BaseProductsPage';
import { fetchTopDeals } from '../../features/products/services/productsService';

export function Curated() {
  return (
    <BaseProductsPage
      pageTitle="Curated Collection"
      pageDescription="Discover our curated collection of premium fashion and accessories."
      fetchProductsFn={(page, limit) => fetchTopDeals(limit, (page - 1) * limit)}
      defaultSort="featured"
    />
  );
}

