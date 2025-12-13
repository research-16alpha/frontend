import React, { useState } from 'react';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
import { ArrowRight, X, Star, ShoppingCart, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../bag/contexts/AppContext';
import { toast } from 'sonner';

interface FeaturedProduct {
  id: string;
  title: string;
  image: string;
  images?: string[];
  description?: string;
  brand_name?: string;
  price?: string;
  discountedPrice?: string;
  originalPrice?: string;
  rating?: number;
  reviews?: number;
  sizes?: string[];
  colors?: string[];
  category?: string;
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
            {featuredImages.map((item, index) => (
              <FeaturedProductCard
                key={item.id}
                product={item}
                isExpanded={expandedId === item.id}
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
              <FeaturedProductExpanded
                product={featuredImages.find(p => p.id === expandedId)!}
                onClose={() => setExpandedId(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

interface FeaturedProductCardProps {
  product: FeaturedProduct;
  isExpanded: boolean;
  onClick: () => void;
}

function FeaturedProductCard({ product, isExpanded, onClick }: FeaturedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="aspect-[3/4] overflow-hidden bg-white mb-2 relative">
        <ImageWithFallback
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Quick View on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-2 left-2 right-2"
            >
              <button className="w-full bg-white text-black py-1.5 px-3 text-xs hover:bg-gray-100 transition-colors">
                Quick View
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="text-xs md:text-sm">{product.title}</p>
    </div>
  );
}

interface FeaturedProductExpandedProps {
  product: FeaturedProduct;
  onClose: () => void;
}

function FeaturedProductExpanded({ product, onClose }: FeaturedProductExpandedProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Black');
  const { addToBag, toggleFavorite, favorites, user } = useApp();
  const [isAddingToBag, setIsAddingToBag] = useState(false);

  const isFavorite = favorites.includes(product.id);

  const handleAddToBag = async () => {
    if (!user?._id) {
      toast.error('Please log in to add items to your bag');
      return;
    }

    setIsAddingToBag(true);
    try {
      await addToBag({
        id: product.id,
        name: product.title,
        price: parseFloat(product.discountedPrice?.replace('$', '') || product.price?.replace('$', '') || '0'),
        image: product.image,
        size: selectedSize,
        color: selectedColor,
      });
      toast.success('Added to bag!');
    } catch (error) {
      toast.error('Failed to add to bag. Please try again.');
      console.error('Error adding to bag:', error);
    } finally {
      setIsAddingToBag(false);
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <div className="relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Left: Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-gray-50 overflow-hidden">
            <ImageWithFallback
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-50 overflow-hidden cursor-pointer border-2 border-transparent hover:border-black transition-colors">
                  <ImageWithFallback
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="space-y-4">
          <div>
            {product.category && <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.category}</div>}
            <h2 className="text-2xl mb-2">{product.title}</h2>
            {product.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!) ? 'fill-black' : 'fill-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm">{product.rating}</span>
                {product.reviews && <span className="text-sm text-gray-500">({product.reviews} reviews)</span>}
              </div>
            )}
            {product.price && (
              <div className="flex items-center gap-2 mb-3">
                {product.discountedPrice ? (
                  <>
                    <div className="text-2xl">{product.discountedPrice}</div>
                    <div className="text-xl text-gray-400 line-through">{product.originalPrice}</div>
                  </>
                ) : (
                  <div className="text-2xl">{product.price}</div>
                )}
              </div>
            )}
            {(product.description || product.brand_name) && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.brand_name && <span className="font-medium">{product.brand_name}</span>}
                {product.brand_name && product.description && <span className="mx-1">•</span>}
                {product.description && <span>{product.description}</span>}
              </p>
            )}
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="text-sm mb-2">Size: {selectedSize}</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 border text-sm transition-colors ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="text-sm mb-2">Color: {selectedColor}</div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 border text-sm transition-colors ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-900'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Buttons */}
          {product.price && (
            <div className="flex gap-3 pt-3">
              <button
                className="flex-1 bg-black text-white py-3 px-4 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    onClick={handleAddToBag}
                    disabled={isAddingToBag}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Bag
              </button>
              <button
                className={`border-2 p-3 hover:bg-gray-50 transition-colors ${
                  isFavorite ? 'border-red-500 text-red-500' : 'border-black'
                }`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const featuredImages: FeaturedProduct[] = [
  {
    id: '301',
    title: "Editorial Collection",
    image: "https://images.unsplash.com/photo-1700150662401-9b96a5fedfbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    images: [
      "https://images.unsplash.com/photo-1700150662401-9b96a5fedfbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1633821879282-0c4e91f96232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
    ],
    category: "Art & Fashion",
    description: "Curated editorial pieces that blend art and fashion. Each item tells a unique story.",
    price: "$280",
    discountedPrice: "$224",
    originalPrice: "$280",
    rating: 4.7,
    reviews: 89,
    sizes: ['One Size'],
    colors: ['Original']
  },
  {
    id: '302',
    title: "Minimal Essentials",
    image: "https://images.unsplash.com/photo-1633821879282-0c4e91f96232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    images: [
      "https://images.unsplash.com/photo-1633821879282-0c4e91f96232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1610209740880-6ecc4b20ea78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    ],
    category: "Clothing",
    description: "Essential pieces designed with minimalist aesthetics. Timeless and versatile.",
    price: "$320",
    discountedPrice: "$256",
    originalPrice: "$320",
    rating: 4.8,
    reviews: 156,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Black', 'White']
  },
  {
    id: '303',
    title: "Modern Classics",
    image: "https://images.unsplash.com/photo-1610209740880-6ecc4b20ea78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    images: [
      "https://images.unsplash.com/photo-1610209740880-6ecc4b20ea78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      "https://images.unsplash.com/photo-1633821879282-0c4e91f96232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
    ],
    category: "Clothing",
    description: "Contemporary takes on classic designs. Sophisticated and refined.",
    price: "$380",
    discountedPrice: "$304",
    originalPrice: "$380",
    rating: 4.9,
    reviews: 203,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Navy', 'Charcoal']
  }
];