import React, { useState } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
import { useApp } from '../../bag/contexts/AppContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  originalPrice?: number;
  category: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  product_link?: string;
  brand_name?: string;
  product_gender?: string;
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w+/g, word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
};

export function ProductCard({
  product,
  onClick
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const { toggleFavorite, favorites, user, setIsAuthModalOpen } = useApp();
  const isFavorite = favorites.includes(product.id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user?._id) {
      toast.error('Please log in to save favorites');
      setIsAuthModalOpen(true);
      return;
    }

    const wasFavorite = isFavorite;

    try {
      await toggleFavorite(product.id);
      if (wasFavorite) {
        toast.success('Removed from favorites');
      } else {
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
      console.error('toggleFavorite error', error);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="relative">
      <div
        className="bg-white overflow-hidden transition-shadow hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)] rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={onClick ? "cursor-pointer" : ""}
          onClick={handleCardClick}
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-4 right-4 flex gap-2"
                >

                  <button
                    className="
                      flex-1
                      py-2
                      rounded-md

                      bg-black
                      text-white

                      shadow-[0_0_0_1px_rgba(255,255,255,0.35),0_12px_30px_rgba(0,0,0,0.45)]

                      transition-all duration-200 ease-out
                      hover:bg-neutral-900
                      hover:shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_18px_40px_rgba(0,0,0,0.55)]
                    "
                  >
                    Quick View
                  </button>

                  <button
                    onClick={handleToggleFavorite}
                    className="
                      p-2
                      rounded-md

                      bg-black

                      shadow-[0_0_0_1px_rgba(255,255,255,0.35),0_12px_30px_rgba(0,0,0,0.45)]

                      transition-all duration-200 ease-out
                      hover:bg-neutral-900
                      hover:shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_18px_40px_rgba(0,0,0,0.55)]
                    "
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isFavorite
                          ? 'fill-red-500 text-red-500'
                          : 'text-white'
                      }`}
                    />
                  </button>


                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 space-y-1">
            {product.brand_name && (
              <div className="text-xs font-semibold uppercase tracking-wider">
                {product.brand_name}
              </div>
            )}
            <div className="text-sm text-gray-700 line-clamp-2">
              {capitalizeWords(product.description)}
            </div>
            <div className="text-[10px] uppercase text-gray-400">
              {product.category}
            </div>

            <div className="mt-2">
              {product.discountedPrice ? (
                <>
                  <span className="text-red-600 font-medium">
                    ${product.discountedPrice}
                  </span>
                  <span className="ml-2 text-xs line-through text-gray-400">
                    ${product.price}
                  </span>
                </>
              ) : (
                <span className="font-medium">${product.price}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export ExpandedContent and capitalizeWords for use in Products.tsx
export { ExpandedContent, capitalizeWords };

/* ================= EXPANDED CONTENT ================= */

interface ExpandedContentProps {
  product: Product;
  onClose: () => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  handleAddToBag: (e?: React.MouseEvent) => void;
  handleToggleFavorite: (e: React.MouseEvent) => void;
  isFavorite: boolean;
  isAddingToBag: boolean;
}

function ExpandedContent({
  product,
  onClose,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  handleAddToBag,
  handleToggleFavorite,
  isFavorite,
  isAddingToBag,
}: ExpandedContentProps) {
  return (
    <div className="relative flex flex-col min-h-0">
      <div className="sticky top-0 z-[5] shrink-0 bg-white/95 backdrop-blur-xl shadow-sm px-8 py-5 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 pr-12">
            {product.brand_name && (
              <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-1.5">
                {product.brand_name}
              </div>
            )}
            <h2 className="text-2xl font-light leading-snug text-gray-900 tracking-tight">
              {capitalizeWords(product.name)}
            </h2>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer text-xl leading-none flex items-center justify-center w-6 h-6"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-10 py-6 pb-8">
        <div className="mx-auto max-w-5xl">
          {/* MASTER PRODUCT FRAME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Image */}
            <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
              <ImageWithFallback
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between h-full space-y-6">
              {/* Price */}
              <div className="flex items-baseline gap-4 pt-2">
                {product.discountedPrice ? (
                  <>
                    <span className="text-3xl font-light text-gray-900 tracking-tight">
                      ${product.discountedPrice}
                    </span>
                    <span className="text-lg text-gray-400 line-through font-light">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-light text-gray-900 tracking-tight">
                    ${product.price}
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="space-y-4 text-gray-600 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Category</span>
                  <span className="text-sm font-light">{product.category}</span>
                </div>
                {product.product_gender && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Gender</span>
                    <span className="text-sm font-light">{product.product_gender}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed text-[15px] font-light pt-4 pr-2">
                {capitalizeWords(product.description)}
              </p>

              {/* Size */}
              <div className="pt-5">
                <div className="mb-3 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold">
                  Size
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2.5 text-xs rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === s
                          ? 'bg-black text-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]'
                          : 'bg-white/95 backdrop-blur-xl text-gray-700 hover:bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="pt-5">
                <div className="mb-3 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold">
                  Color
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2.5 text-xs rounded-lg font-medium transition-all duration-200 ${
                        selectedColor === c
                          ? 'bg-black text-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]'
                          : 'bg-white/95 backdrop-blur-xl text-gray-700 hover:bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* External link */}
              {product.product_link && (
                <a
                  href={product.product_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 pt-4"
                >
                  <span>View original product</span>
                  <span className="text-[10px]">→</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 bg-white/95 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] px-8 py-6 flex gap-4">
        <button
          onClick={handleAddToBag}
          disabled={isAddingToBag}
          className="flex-1 bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2.5 font-medium text-sm tracking-wide transition-all duration-200 hover:bg-gray-800 hover:shadow-[0_30px_80px_rgba(0,0,0,0.35)] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Bag
        </button>

        <button
          onClick={handleToggleFavorite}
          className="px-5 bg-white/95 backdrop-blur-xl rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-200 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
