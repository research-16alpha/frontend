import * as React from 'react';
import { BaseProductsPage } from './BaseProductsPage';
import { get_products_by_gender } from '../../features/products/services/productsService';

export function Men() {
  return (
    <BaseProductsPage
      pageTitle="Men's Fashion"
      pageDescription="Discover luxury men's fashion from all the world's most celebrated designers—shop online today."
      fetchProductsFn={(page, limit) => get_products_by_gender('men', page, limit)}
      defaultSort="featured"
      gender="men"
    />
  );
}

