import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

const editorialImage = new URL('../assets/halfsy-edit.png', import.meta.url).href;
export function EditorialSection() {
  const { navigateToCurated } = useNavigation();
  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-2">
          <h2 className="text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight">The Halfsy Edit</h2>
          <button
            className="flex items-center gap-2 text-xs md:text-sm uppercase tracking-wide hover:gap-4 transition-all cursor-pointer"
            onClick={navigateToCurated}
          >
            Explore More
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Large Featured Image */}
        <div className="relative group cursor-pointer mb-3 md:mb-4">
          <div className="aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden ">
            <ImageWithFallback
              src={editorialImage}
              alt="Editorial Feature"
              className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          {/* <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white/50 border border-black px-4 py-3 md:px-6 md:py-4 max-w-xs">
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-gray-100 mb-1">
              Featured Collection
            </p>
            <h3 className="text-base md:text-lg lg:text-xl">Luxury, Curated.</h3>
          </div> */}
        </div>

        {/* Description */}
        <div className="max-w-3xl">
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          An intelligent edit of the world's finest luxury brands.
          </p>
        </div>
      </div>
    </section>
  );
}