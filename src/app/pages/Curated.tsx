import * as React from 'react';
import { BaseProductsPage } from './BaseProductsPage';
import { fetchTopDeals } from '../../features/products/services/productsService';

export function Curated() {
  return (
    <BaseProductsPage
      pageTitle="Curated Collection"
      pageDescription="Discover our curated collection of premium fashion and accessories."
      fetchProductsFn={fetchTopDeals}
      defaultSort="featured"
    />
  );
}

