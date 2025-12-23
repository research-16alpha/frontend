import { BaseProductsPage } from './BaseProductsPage';
import { fetchProductsByGender } from '../../features/products/services/productsService';

export function Women() {
  return (
    <BaseProductsPage
      pageTitle="Women's Fashion"
      pageDescription="Discover luxury women's fashion from all the world's most celebrated designers—shop online today."
      fetchProductsFn={(page, limit) => fetchProductsByGender('women', page, limit)}
      defaultSort="featured"
      gender="women"
    />
  );
}

