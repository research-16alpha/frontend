import * as React from 'react';
import { BaseProductsPage } from './BaseProductsPage';
import { fetchProductsWithFilters } from '../../features/products/services/productsService';

export function Men() {
  return (
    <BaseProductsPage
      pageTitle="Men's Fashion"
      pageDescription="Discover luxury men's fashion from all the world's most celebrated designers—shop online today."
      fetchProductsFn={(page, limit) => fetchProductsWithFilters({ page, limit, filters: { gender: 'men' } })}
      defaultSort="featured"
      gender="men"
    />
  );
}

