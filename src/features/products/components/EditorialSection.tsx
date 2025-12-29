import React from 'react';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';
import { useNavigation } from '../../../shared/contexts/NavigationContext';

const editorialImage = new URL('../../../shared/assets/editorial.avif', import.meta.url).href;
export function EditorialSection() {
  const { navigateToCurated } = useNavigation();
  return (
    <section className="w-full bg-white py-8 sm:py-8 md:py-10 lg:py-12 xl:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-4 md:mb-6 lg:mb-8 gap-2">
          <h2 className="text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight font-headline">The Halfsy Edit</h2>
          <button
            className="flex items-center gap-2 text-xs md:text-sm uppercase tracking-wide hover:gap-4 transition-all cursor-pointer font-body"
            onClick={navigateToCurated}
          >
            Explore More
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Large Featured Image */}
        <div className="relative group cursor-pointer mb-2 sm:mb-3 md:mb-4 lg:mb-6 xl:mb-8">
          <div className="aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden ">
            <ImageWithFallback
              src={editorialImage}
              alt="Editorial Feature"
              className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="max-w-3xl">
          <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed font-body">
          An intelligent edit of the world's finest luxury brands.
          </p>
        </div>
      </div>
    </section>
  );
}

