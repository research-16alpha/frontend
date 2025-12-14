import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCardExpanding } from './ProductCardExpanding';

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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleProductClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="w-full bg-[#f4d58d] py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-1/3 space-y-4 md:space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight leading-tight">
              Culture
              <br />
              for One
            </h2>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed">
              Discover unique pieces that tell your story.
              <br />
              Curated collections for the modern individual.
            </p>
            <button className="flex items-center gap-2 uppercase text-sm tracking-wide hover:gap-4 transition-all mt-4">
              Explore Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Images Grid */}
          <div className="w-full lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {featuredImages.map((item) => (
              <ProductCardExpanding
                key={item.id}
                product={item}
                isExpanded={false}
                onClick={() => handleProductClick(item.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {expandedId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setExpandedId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {featuredImages.find(p => p.id === expandedId) && (
                <ProductCardExpanding
                  product={featuredImages.find(p => p.id === expandedId)!}
                  isExpanded={true}
                  onClick={() => setExpandedId(null)}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
    description: "Curated editorial pieces that blend art and fashion. Each item tells a unique story.",
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