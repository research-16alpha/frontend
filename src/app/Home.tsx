import { HeroSection } from '../shared/components/HeroSection';
import { HorizontalScrollSection } from '../features/products/components/HorizontalScrollSection';
import { FeaturedSection } from '../features/products/components/FeaturedSection';
import { ProductMasonryGrid } from '../features/products/components/ProductMasonryGrid';
import { EditorialSection } from '../shared/components/EditorialSection';

export function Home() {
  return (
    <>
      <HeroSection />
      <HorizontalScrollSection />
      <FeaturedSection />
      <ProductMasonryGrid />
      <EditorialSection />
    </>
  );
}
