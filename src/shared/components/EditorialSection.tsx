import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';

export function EditorialSection() {
  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight">The BG Edit</h2>
          <button className="flex items-center gap-2 text-xs md:text-sm uppercase tracking-wide hover:gap-4 transition-all">
            Explore More
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Large Featured Image */}
        <div className="relative group cursor-pointer mb-6">
          <div className="aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-100">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1588420635201-3a9e2a2a0a07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200"
              alt="Editorial Feature"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/90 px-4 py-3 md:px-6 md:py-4 max-w-xs">
            <p className="text-[10px] md:text-xs uppercase tracking-wider text-gray-600 mb-1">
              Featured Collection
            </p>
            <h3 className="text-base md:text-lg lg:text-xl">Timeless Classics</h3>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-3xl">
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Explore curated pieces that define modern elegance. From vintage cameras to contemporary fashion, 
            discover items that tell a story and stand the test of time.
          </p>
        </div>
      </div>
    </section>
  );
}