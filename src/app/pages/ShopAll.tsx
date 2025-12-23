import { BaseProductsPage } from './BaseProductsPage';
import { fetchProductsWithCustomSort } from '../../features/products/services/productsService';

export function ShopAll() {
  return (
    <BaseProductsPage
      pageTitle="Shop All"
      pageDescription="Discover our curated collection of premium fashion and accessories and get up to 50% Off"
      fetchProductsFn={fetchProductsWithCustomSort}
      defaultSort="featured"
    />
  );
}

