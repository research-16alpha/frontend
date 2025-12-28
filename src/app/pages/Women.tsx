import * as React from 'react';
import { BaseProductsPage } from './BaseProductsPage';
import { fetchFilteredProducts } from '../../features/products/services/productsService';

export function Women() {
  return (
    <BaseProductsPage
      pageTitle="Women's Fashion"
      pageDescription="Discover luxury women's fashion from all the world's most celebrated designers—shop online today."
      fetchProductsFn={(page, limit) => fetchFilteredProducts({ page, limit, gender: 'women' })}
      defaultSort="featured"
      gender="women"
    />
  );
}

