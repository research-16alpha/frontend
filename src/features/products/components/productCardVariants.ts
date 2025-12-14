export type ProductCardVariant =
  | 'products'
  | 'featured'
  | 'scroll'
  | 'masonry';

export const PRODUCT_CARD_VARIANTS = {
  products: {
    showBrand: true,
    showDescription: true,
    showCategory: true,
    showSizes: true,
    showColors: true,
    expandable: true,
    imageAspect: 'aspect-[3/4]',
    titleClass: 'text-sm font-medium',
    priceClass: 'text-sm',
  },
  featured: {
    showBrand: false,
    showDescription: false,
    showCategory: false,
    showSizes: false,
    showColors: false,
    expandable: false,
    imageAspect: 'aspect-[3/4]',
    titleClass: 'text-xs uppercase tracking-wide',
    priceClass: 'text-xs',
  },
  scroll: {
    showBrand: false,
    showDescription: false,
    showCategory: false,
    showSizes: false,
    showColors: false,
    expandable: true,
    imageAspect: 'aspect-[3/4]',
    titleClass: 'text-sm',
    priceClass: 'text-sm',
  },
  masonry: {
    showBrand: false,
    showDescription: false,
    showCategory: true,
    showSizes: false,
    showColors: false,
    expandable: true,
    imageAspect: 'aspect-square',
    titleClass: 'text-xs',
    priceClass: 'text-xs',
  },
} as const;
