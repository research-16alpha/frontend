import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, X } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
import { useApp } from '../../bag/contexts/AppContext';
import { toast } from 'sonner';
import { createPortal } from 'react-dom';


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
}

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w+/g, word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
};


export function ProductCard({
  product
}: ProductCardProps) {
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isAddingToBag, setIsAddingToBag] = useState(false);

  const { addToBag, toggleFavorite, favorites, user, setIsAuthModalOpen } = useApp();
  const isFavorite = favorites.includes(product.id);

  React.useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleAddToBag = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (!user?._id) {
      toast.error('Please log in to add items to your bag');
      return;
    }

    setIsAddingToBag(true);
    try {
      await addToBag({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
      });
      toast.success('Added to bag!');
    } catch {
      toast.error('Failed to add to bag');
    } finally {
      setIsAddingToBag(false);
    }
  };

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

  return (
    <>
      {/* ================= CARD ================= */}

      <div className="relative">

        <div
          
  className="bg-white border border-gray-200 overflow-hidden transition-shadow hover:shadow-lg"


          onMouseEnter={() => !isModalOpen && setIsHovered(true)}
          onMouseLeave={() => !isModalOpen && setIsHovered(false)}
        >
          {/* ========== COLLAPSED CARD ========== */}
          {!isModalOpen && (
            <div
              className="cursor-pointer"
              onClick={() => setIsModalOpen(true)}
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
                      <button className="flex-1 bg-white py-2">
                        Quick View
                      </button>
                      <button
                        onClick={handleToggleFavorite}
                        className="bg-white p-2"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isFavorite ? 'fill-red-500 text-red-500' : ''
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
          )}

        </div>
      </div>

      {/* ========== MOBILE MODAL ========== */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 z-[60] bg-gradient-to-b from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="bg-[#fef5f0] bg-gradient-to-br from-[#fef5f0] via-white/95 to-[#fef5f0] w-[80vw] max-w-[80vw] h-[50vh] max-h-[50vh] rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col border border-gray-200/50"
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExpandedContent
                  product={product}
                  onClose={() => setIsModalOpen(false)}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  handleAddToBag={handleAddToBag}


                  handleToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite}
                  isAddingToBag={isAddingToBag}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}


    </>
  );
}

/* ================= EXPANDED CONTENT ================= */

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
}: any) {
  return (
    <div className="relative flex flex-col h-full min-h-0">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 p-2.5 bg-white/95 backdrop-blur-md rounded-full border border-gray-200/80 hover:bg-white hover:border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <X className="w-5 h-5 text-gray-700" />
      </button>

      <div className="sticky top-0 z-10 shrink-0 bg-gradient-to-b from-white via-white/98 to-white/95 backdrop-blur-sm border-b border-gray-200/60 px-8 py-5">
        <div className="pr-6">
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

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-10 py-6">
        <div className="mx-auto max-w-5xl">
          {/* MASTER PRODUCT FRAME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Image */}
            <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden shadow-sm">
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
              <div className="space-y-4 text-gray-600 border-t border-gray-200/60 pt-4">
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
              <p className="text-gray-700 leading-relaxed text-[15px] font-light border-t border-gray-200/60 pt-4 pr-2">
                {capitalizeWords(product.description)}
              </p>

              {/* Size */}
              <div className="border-t border-gray-200/60 pt-5">
                <div className="mb-3 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold">
                  Size
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2.5 text-xs border rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === s
                          ? 'bg-black text-white border-black shadow-md'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="border-t border-gray-200/60 pt-5">
                <div className="mb-3 text-[10px] uppercase tracking-[0.15em] text-gray-500 font-semibold">
                  Color
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2.5 text-xs border rounded-lg font-medium transition-all duration-200 ${
                        selectedColor === c
                          ? 'bg-black text-white border-black shadow-md'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
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
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 border-t border-gray-200/60 pt-4"
                >
                  <span>View original product</span>
                  <span className="text-[10px]">→</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-200/60 bg-gradient-to-b from-white to-gray-50/30 px-8 py-6 flex gap-4">
        <button
          onClick={handleAddToBag}
          disabled={isAddingToBag}
          className="flex-1 bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2.5 font-medium text-sm tracking-wide transition-all duration-200 hover:bg-neutral-900/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Bag
        </button>

        <button
          onClick={handleToggleFavorite}
          className="px-5 border border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
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
