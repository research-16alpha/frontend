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
                      <div className="text-sm text-red-600 font-medium">
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

// Export ExpandedContent and capitalizeWords for use in product detail pages
export { ExpandedContent, capitalizeWords };

/* ================= EXPANDED CONTENT ================= */

// Viewport detection hook
function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= breakpoint);

    check();

    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isDesktop;
}

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
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const isDesktop = useIsDesktop();

  return (
    <div
      className={
        isDesktop
          ? "relative mx-auto my-10 max-w-[900px] max-h-[85vh] bg-white rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col"
          : "relative flex flex-col min-h-0"
      }
    >
      <div className="sticky top-0 z-[5] shrink-0 bg-white/95 backdrop-blur-xl shadow-sm px-8 py-5 relative">
        {/* <div className="flex items-start justify-between gap-4">
          <div className="flex-1 pr-12">
            <h2 className="text-2xl font-light leading-snug text-gray-900 tracking-tight">
              {capitalizeWords(product.product_name)}
            </h2>
          </div>
        </div> */}
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer text-xl leading-none flex items-center justify-center w-6 h-6"
          aria-label="Close"
        >
          ✕
        </button> */}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 md:px-10 py-6 pb-8">
        <div className="mx-auto max-w-5xl lg:max-w-4xl xl:max-w-3xl">
          {/* 1 column for mobile/tablet, 2 columns for desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Image */}
            <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
              <ImageWithFallback
                src={product.product_image || ''}
                alt={product.product_name || 'Product'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Container */}
            <div className="flex flex-col gap-4">
              {/* Category and Gender - one line with bullet separator */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {product.product_category && <span>{product.product_category}</span>}
                {product.product_category && product.product_gender && (
                  <span className="text-gray-400">•</span>
                )}
                {product.product_gender && (
                  <span className="uppercase">{product.product_gender}</span>
                )}
              </div>

              {/* Brand Name, Product Name, Description, and Price */}
              <div className="flex flex-col gap-1">
                {/* Brand Name */}
                {product.brand_name && (
                  <div className="text-lg font-semibold uppercase tracking-wider text-gray-900">
                    {product.brand_name}
                  </div>
                )}

                {/* Product Name */}
                {product.product_name && (
                  <div className="text-base text-gray-700 font-medium">
                    {capitalizeWords(product.product_name)}
                  </div>
                )}

                {/* Description */}
                <p className="text-lg text-gray-700 leading-relaxed text-base font-light">
                  {capitalizeWords(product.product_description)}
                </p>

                {/* PRICE */}
                <div className="flex flex-col gap-1">
                  {product.original_price && product.sale_price && product.original_price > product.sale_price ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg text-red-600 font-semibold text-base">
                          {product.currency || '$'}{product.sale_price.toFixed(2)}
                        </span>
                        <span className="text-lg line-through text-gray-600 font-normal">
                          {product.currency || '$'}{product.original_price.toFixed(2)}
                        </span>
                      </div>
                      {product.discount && (
                        <div className="text-sm text-red-600 font-medium">
                          {product.discount}% OFF
                        </div>
                      )}
                    </>
                  ) : product.sale_price ? (
                    <>
                      <span className="font-medium text-base">{product.currency || '$'}{product.sale_price.toFixed(2)}</span>
                      {product.discount && (
                        <div className="text-sm text-red-600 font-medium">
                          {product.discount}% OFF
                        </div>
                      )}
                    </>
                  ) : product.original_price ? (
                    <>
                      <span className="font-medium text-base">{product.currency || '$'}{product.original_price.toFixed(2)}</span>
                      {product.discount && (
                        <div className="text-sm text-red-600 font-medium">
                          {product.discount}% OFF
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>

              {/* Link to original product */}
              {product.product_link && (
                <a
                  href={product.product_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 pt-2"
                >
                  <span>View original product</span>
                  <span className="text-[10px]">→</span>
                </a>
              )}

              {/* Select Size Dropdown */}
              <div className="relative pt-2">
                <button
                  onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                  className="w-full border border-black px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span className="text-sm">
                    {selectedSize ? `Size: ${selectedSize}` : 'Select Size'}
                  </span>
                  <span className="text-gray-500">{isSizeDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {isSizeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-black shadow-lg">
                    {product.available_sizes && product.available_sizes.length > 0 ? (
                      product.available_sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setIsSizeDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                            selectedSize === size ? 'bg-gray-100 font-medium' : ''
                          }`}
                        >
                          {size}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No sizes available</div>
                    )}
                  </div>
                )}
              </div>

              {/* Add to Bag and Add to Favorites buttons - same line */}
              <div className="flex gap-4 pt-2">
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
                  className="px-5 bg-white/95 backdrop-blur-xl border border-black rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Back Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="mt-4 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer text-sm flex items-center justify-center"
                aria-label="Back"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
