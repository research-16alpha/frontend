import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types/product';
import { useNavigation } from '../../../shared/contexts/NavigationContext';

export function FeaturedSection() {
  const { navigateToProduct, navigateToCurated } = useNavigation();
  
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
            {featuredImages.map((item) => (
              <div key={item.id} className="h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px] xl:h-[560px]">
                <ProductCard
                  product={item}
                  onClick={() => navigateToProduct(item.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const featuredImages: Product[] = [
  {
    id: '301',
    product_name: "Editorial Collection",
    product_image: "https://images.unsplash.com/photo-1700150662401-9b96a5fedfbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    product_category: "Art & Fashion",
    product_description: "Curated editorial pieces blending art and fashion. Each item tells a unique story.",
    original_price: 280,
    sale_price: 224,
    currency: '$',
    available_sizes: ['One Size'],
    product_color: ['Original']
  },
  {
    id: '302',
    product_name: "Minimal Essentials",
    product_image: "https://images.unsplash.com/photo-1633821879282-0c4e91f96232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    product_category: "Clothing",
    product_description: "Essential pieces designed with minimalist aesthetics. Timeless and versatile.",
    original_price: 320,
    sale_price: 256,
    currency: '$',
    available_sizes: ['XS', 'S', 'M', 'L', 'XL'],
    product_color: ['Beige', 'Black', 'White']
  },
  {
    id: '303',
    product_name: "Modern Classics",
    product_image: "https://images.unsplash.com/photo-1610209740880-6ecc4b20ea78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    product_category: "Clothing",
    product_description: "Contemporary takes on classic designs. Sophisticated and refined.",
    original_price: 380,
    sale_price: 304,
    currency: '$',
    available_sizes: ['XS', 'S', 'M', 'L'],
    product_color: ['Black', 'Navy', 'Charcoal']
  }
];