import { BaseProductsPage } from './BaseProductsPage';
import { fetchProductsByGender } from '../../features/products/services/productsService';

export function Men() {
  return (
    <BaseProductsPage
      pageTitle="Men's Fashion"
      pageDescription="Discover luxury men's fashion from all the world's most celebrated designers—shop online today."
      fetchProductsFn={(page, limit) => fetchProductsByGender('men', page, limit)}
      defaultSort="featured"
      gender="men"
    />
  );
}

