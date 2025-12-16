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

  const { addToBag, toggleFavorite, favorites, user } = useApp();
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

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <>
      {/* ================= CARD ================= */}
      {/* <div
        className={`relative ${
          isModalOpen ? 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4' : ''
        }`}
      > */}
      <div className="relative">

        <div
          // className={`bg-white border border-gray-200 overflow-hidden transition-all ${
          //   isModalOpen ? 'shadow-2xl' : 'hover:shadow-lg'
          // }`}
          
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
                  {product.description}
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
      <AnimatePresence>
  {isModalOpen && (
    <motion.div
      className="
        fixed inset-0
        bg-black/40
        flex items-stretch md:items-center justify-center
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onClick={() => setIsModalOpen(false)}
    >
      <motion.div
        className="
          bg-white
    w-full
    md:w-[70vw]
    max-w-[70vw]
    h-[100dvh]
    md:h-[60vh]
    max-h-[60vh]
    overflow-y-auto
    md:rounded-xl
        "
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{
          duration: 0.18,
          ease: [0.4, 0, 0.2, 1],
        }}
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
</AnimatePresence>



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
    <div className="relative p-6 md:p-8">
      <button
        onClick={onClose}
        className="
  absolute
  top-4
  right-4
  md:top-6
  md:right-6
  p-2
  bg-white/90
  backdrop-blur
  rounded-full
  border
  border-gray-200
  hover:bg-white
"

      >
        <X className="w-5 h-5" />
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-50">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>

          <div>
            <div className="mb-2 text-sm">Size</div>
            <div className="flex gap-2">
              {product.sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 border ${
                    selectedSize === s
                      ? 'bg-black text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm">Color</div>
            <div className="flex gap-2">
              {product.colors.map((c: string) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-4 py-2 border ${
                    selectedColor === c
                      ? 'bg-black text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddToBag}
              disabled={isAddingToBag}
              className="flex-1 bg-black text-white py-4 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Bag
            </button>

            <button
              onClick={handleToggleFavorite}
              className="p-4 border"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
