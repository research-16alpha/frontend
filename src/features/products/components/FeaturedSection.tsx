import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useNavigation } from '../../../shared/contexts/NavigationContext';
import { useProductsByLinks } from '../hooks/useProductsByLinks';
import { LUXURY_CURATED_LINKS } from '../constants/curatedProductLinks';

export function FeaturedSection() {
  const { navigateToProduct, navigateToCurated } = useNavigation();
  const { products: featuredImages, loading } = useProductsByLinks(LUXURY_CURATED_LINKS);
  
  return (
    <section className="w-full bg-[#673E1E] py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-1/3 space-y-4 md:space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl uppercase font-bold tracking-wide leading-tight">
              <span className="text-white font-light">LUXURY,</span>
              <br />
              <span className="text-gray-custom-1">CURATED.</span>
            </h2>
            <p className="text-sm md:text-base text-white font-thin leading-relaxed">
              Discover unique pieces that tell your story.
              <br />
              Curated collections for the modern individual.
            </p>
            <button 
              onClick={() => navigateToCurated()}
              className="flex items-center gap-2 text-white-soft-2 uppercase text-sm tracking-wide hover:gap-4 transition-all mt-4"
            >
              Explore Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Images Grid */}
          <div className="w-full lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {loading ? (
              <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px] xl:h-[560px] animate-pulse bg-gray-300"></div>
                ))}
              </div>
            ) : (
              featuredImages.map((item) => (
                <div key={item.id} className="h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px] xl:h-[560px]">
                  <ProductCard
                    product={item}
                    onClick={() => navigateToProduct(item.id || '')}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}