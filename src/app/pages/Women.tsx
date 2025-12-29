import * as React from 'react';
import { BaseProductsPage } from './BaseProductsPage';
import { get_products_by_gender } from '../../features/products/services/productsService';

export function Women() {
  return (
    <BaseProductsPage
      pageTitle="Women's Fashion"
      pageDescription="Discover luxury women's fashion from all the world's most celebrated designers—shop online today."
      fetchProductsFn={(page, limit) => get_products_by_gender('women', page, limit)}
      defaultSort="featured"
      gender="women"
    />
  );
}

