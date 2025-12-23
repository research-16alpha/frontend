import { BaseProductsPage } from './BaseProductsPage';
import { fetchProductsByCategory } from '../../features/products/services/productsService';

export function Accessories() {
  return (
    <BaseProductsPage
      pageTitle="Accessories"
      pageDescription="Discover luxury accessories from all the world's most celebrated designers—shop online today."
      fetchProductsFn={(page, limit) => fetchProductsByCategory('accessories', page, limit)}
      defaultSort="featured"
    />
  );
}

