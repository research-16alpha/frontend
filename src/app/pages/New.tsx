import { BaseProductsPage } from './BaseProductsPage';
import { fetchLatestProducts } from '../../features/products/services/productsService';

export function New() {
  return (
    <BaseProductsPage
      pageTitle="New Arrivals"
      pageDescription="Explore the newest arrivals, sorted by latest first."
      fetchProductsFn={fetchLatestProducts}
      defaultSort="newest"
    />
  );
}

