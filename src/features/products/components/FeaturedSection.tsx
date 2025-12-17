import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useNavigation } from '../../../shared/contexts/NavigationContext';

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  originalPrice?: number;
  category: string;
  images: string[];
  description: string;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  product_link?: string;
  brand_name?: string;
  product_gender?: string;
}

export function FeaturedSection() {
  const { navigateToProduct, navigateToCurated } = useNavigation();
  
  return (
    <section className="w-full bg-[#f4d58d] py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-1/3 space-y-4 md:space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl uppercase font-bold tracking-wide leading-tight">
              <span className="text-red-400">LUXURY,</span>
              <br />
              <span className="text-gray-600">CURATED.</span>
            </h2>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed">
              Discover unique pieces that tell your story.
              <br />
              Curated collections for the modern individual.
            </p>
            <button 
              onClick={() => navigateToCurated()}
              className="flex items-center gap-2 uppercase text-sm tracking-wide hover:gap-4 transition-all mt-4"
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
    name: "Editorial Collection",
    images: [
      "https://images.unsplash.com/photo-1700150662401-9b96a5fedfbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1633821879282-0c4e91f96232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
    ],
    category: "Art & Fashion",
    description: "Curated editorial pieces blending art and fashion. Each item tells a unique story.",
    price: 280,
    discountedPrice: 224,
    originalPrice: 280,
    rating: 4.7,
    reviews: 89,
    sizes: ['One Size'],
    colors: ['Original']
  },
  {
    id: '302',
    name: "Minimal Essentials",
    images: [
      "https://images.unsplash.com/photo-1633821879282-0c4e91f96232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1610209740880-6ecc4b20ea78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    ],
    category: "Clothing",
    description: "Essential pieces designed with minimalist aesthetics. Timeless and versatile.",
    price: 320,
    discountedPrice: 256,
    originalPrice: 320,
    rating: 4.8,
    reviews: 156,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Black', 'White']
  },
  {
    id: '303',
    name: "Modern Classics",
    images: [
      "https://images.unsplash.com/photo-1610209740880-6ecc4b20ea78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1633821879282-0c4e91f96232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    ],
    category: "Clothing",
    description: "Contemporary takes on classic designs. Sophisticated and refined.",
    price: 380,
    discountedPrice: 304,
    originalPrice: 380,
    rating: 4.9,
    reviews: 203,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Navy', 'Charcoal']
  }
];