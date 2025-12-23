import React, { useState } from 'react';

import { Heart, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
import { useApp } from '../../bag/contexts/AppContext';
import { toast } from 'sonner';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string | undefined | null): string => {
  if (!str) return '';
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
    <div className="relative h-full flex flex-col">
      <div
        className="bg-white border border-gray-300 overflow-hidden transition-all duration-200 shadow-md hover:shadow-lg hover:border-black h-full flex flex-col relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Grayish overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none transition-opacity duration-200" />
        )}
        
        {/* Favorite Button - Top Right Corner of Card */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 z-30 bg-white border border-gray-200 w-9 h-9 flex items-center justify-center transition-all duration-200 hover:[&_svg]:fill-black hover:[&_svg]:text-black"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-200 ${
              isFavorite
                ? 'fill-black text-black'
                : 'text-gray-900'
            }`}
          />
        </button>

        <div
          className={onClick ? "cursor-pointer h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px] xl:h-[560px] flex flex-col" : "h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px] xl:h-[560px] flex flex-col"}
          onClick={handleCardClick}
        >
          {/* Fixed height image container based on viewport */}
          <div className="relative w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px] overflow-hidden bg-white flex-shrink-0 p-3 sm:p-4 md:p-5">
            <ImageWithFallback
              src={product.product_image || ''}
              alt={product.product_name || 'Product'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content section with fixed height based on viewport - aligned to bottom */}
          <div className="h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] bg-white flex-shrink-0 flex flex-col">
            <div className="p-4 flex flex-col items-start h-full justify-between">
              <div className="flex flex-col items-start">
                {product.brand_name && (
                  <div className="text-base font-semibold uppercase tracking-wider mb-1 line-clamp-1">
                    {product.brand_name}
                  </div>
                )}

                {product.product_name && (
                  <div className="text-sm text-gray-700 line-clamp-1 mb-1">
                    {capitalizeWords(product.product_name)}
                  </div>
                )}

                <div className="text-sm text-gray-700 line-clamp-2 mb-1 min-h-[2.5rem]">
                  {capitalizeWords(product.product_description)}
                </div>

                {/* <div className="text-[10px] uppercase text-gray-400 mb-2 line-clamp-1">
                  {product.product_category}
                </div> */}
              </div>

              {/* PRICE */}
              <div className="pt-2 flex flex-col gap-1">
                {product.original_price && product.sale_price && product.original_price > product.sale_price ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-red-600 font-semibold text-base">
                        {product.currency || '$'}{product.sale_price.toFixed(2)}
                      </span>
                      <span className="text-base line-through text-gray-600 font-normal">
                        {product.currency || '$'}{product.original_price.toFixed(2)}
                      </span>
                    </div>
                    {product.discount && (
                      <div className="text-sm text-red-600 font-bold">  
                        {product.discount}% OFF
                      </div>
                    )}
                  </>
                ) : product.sale_price ? (
                  <>
                    <span className="font-medium">{product.currency || '$'}{product.sale_price.toFixed(2)}</span>
                    {product.discount && (
                      <div className="text-sm text-red-600 font-medium">
                        {product.discount}% OFF
                      </div>
                    )}
                  </>
                ) : product.original_price ? (
                  <>
                    <span className="font-medium">{product.currency || '$'}{product.original_price.toFixed(2)}</span>
                    {product.discount && (
                      <div className="text-sm text-red-600 font-medium">
                        {product.discount}% OFF
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Export capitalizeWords for use in other components
export { capitalizeWords };
