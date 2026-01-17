// import React, { useState } from 'react';

// import { Heart, ShoppingCart } from 'lucide-react';
// import { FaLink } from 'react-icons/fa';
// import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
// import { useApp } from '../../bag/contexts/AppContext';
// import { toast } from 'sonner';
// import { Product } from '../types/product';
// import { extractBrandFromLink } from '../utils/extractBrandFromLink';

// interface ProductCardProps {
//   product: Product;
//   onClick?: () => void;
// }

// // Helper function to capitalize first letter of each word
// const capitalizeWords = (str: string | undefined | null): string => {
//   if (!str) return '';
//   return str.replace(/\b\w+/g, word =>
//     word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//   );
// };

// export function ProductCard({
//   product,
//   onClick
// }: ProductCardProps) {
//   const [isHovered, setIsHovered] = useState(false);

//   const { toggleFavorite, favorites, user, setIsAuthModalOpen } = useApp();
//   const isFavorite = favorites.includes(product.id);

//   const handleToggleFavorite = async (e: React.MouseEvent) => {
//     e.stopPropagation();

//     if (!user?._id) {
//       toast.error('Please log in to save favorites');
//       setIsAuthModalOpen(true);
//       return;
//     }

//     const wasFavorite = isFavorite;

//     try {
//       await toggleFavorite(product.id);
//       if (wasFavorite) {
//         toast.success('Removed from favorites');
//       } else {
//         toast.success('Added to favorites');
//       }
//     } catch (error) {
//       toast.error('Failed to update favorites');
//       console.error('toggleFavorite error', error);
//     }
//   };

//   const handleCardClick = () => {
//     if (onClick) {
//       onClick();
//     }
//   };

//   return (
//     <div className="relative h-full flex flex-col">
//       <div
//         className="bg-white border border-gray-300 cursor-pointer overflow-hidden transition-all duration-200 shadow-md hover:shadow-lg hover:border-black h-full flex flex-col relative"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Grayish overlay on hover */}
//         {isHovered && (
//           <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none transition-opacity duration-200" />
//         )}
        
//         {/* Favorite Button - Top Right Corner of Card */}
//         <button
//           onClick={handleToggleFavorite}
//           className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 z-30 bg-white border border-gray-200 w-9 h-9 flex items-center justify-center transition-all duration-200 hover:[&_svg]:fill-black hover:[&_svg]:text-black"
//         >
//           <Heart
//             className={`w-5 h-5 transition-colors duration-200 ${
//               isFavorite
//                 ? 'fill-black text-black'
//                 : 'text-gray-900'
//             }`}
//           />
//         </button>

//         <div
//           className={onClick ? "cursor-pointer h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px] xl:h-[560px] flex flex-col" : "h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px] xl:h-[560px] flex flex-col"}
//           onClick={handleCardClick}
//         >
//           {/* Fixed height image container based on viewport */}
//           <div className="relative w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[360px] overflow-hidden bg-white flex-shrink-0 p-3 sm:p-4 md:p-5">
//             <div className="w-full h-full relative overflow-hidden">
//               <ImageWithFallback
//                 src={product.product_image || ''}
//                 alt={product.product_name || 'Product'}
//                 className="w-full h-full"
//                 style={{ objectFit: 'cover' }}
//               />
//             </div>
//           </div>

//           {/* Content section with fixed height based on viewport - aligned to bottom */}
//           <div className="h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] bg-white flex-shrink-0 flex flex-col">
//             <div className="p-4 flex flex-col items-start h-full justify-between">
//               <div className="flex flex-col items-start">
//                 {product.brand_name && (
//                   <div className="text-base font-semibold uppercase tracking-wider mb-1 line-clamp-1 font-body">
//                     {product.brand_name}
//                   </div>
//                 )}

//                 {product.product_name && (
//                   <div className="text-sm text-gray-700 line-clamp-1 mb-1 font-body">
//                     {capitalizeWords(product.product_name)}
//                   </div>
//                 )}

//                 <div className="text-sm text-gray-700 line-clamp-2 mb-1 min-h-[2.5rem] font-body">
//                   {capitalizeWords(product.product_description)}
//                 </div>

//                 {/* View on Brand Link */}
//                 {product.product_link && (() => {
//                   const brandName = extractBrandFromLink(product.product_link) || 'original site';
//                   const capitalizedBrand = capitalizeWords(brandName);
//                   return (
//                     <a
//                       href={product.product_link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       onClick={(e) => e.stopPropagation()}
//                       className="text-xs text-gray-600 hover:text-black underline flex items-center gap-1 mt-1 mb-1 font-body transition-colors"
//                     >
//                       <FaLink className="w-3 h-3" />
//                       <span>view on <span className="font-bold">{capitalizedBrand}</span></span>
//                     </a>
//                   );
//                 })()}

//                 {/* <div className="text-[10px] uppercase text-gray-400 mb-2 line-clamp-1">
//                   {product.product_category}
//                 </div> */}
//               </div>

//               {/* PRICE */}
//               <div className="pt-2 flex flex-col gap-1">
//                 {product.original_price && product.sale_price && product.original_price > product.sale_price ? (
//                   <>
//                     <div className="flex items-baseline gap-2">
//                       <span className="text-red-600 font-semibold text-base font-body">
//                         {product.currency || '$'}{product.sale_price.toFixed(2)}
//                       </span>
//                       <span className="text-base line-through text-gray-600 font-normal font-body">
//                         {product.currency || '$'}{product.original_price.toFixed(2)}
//                       </span>
//                     </div>
//                     {product.discount && (
//                       <div className="text-sm text-red-600 font-bold font-body">  
//                         {product.discount}% OFF
//                       </div>
//                     )}
//                   </>
//                 ) : product.sale_price ? (
//                   <>
//                     <span className="font-medium font-body">{product.currency || '$'}{product.sale_price.toFixed(2)}</span>
//                     {product.discount && (
//                       <div className="text-sm text-red-600 font-medium font-body">
//                         {product.discount}% OFF
//                       </div>
//                     )}
//                   </>
//                 ) : product.original_price ? (
//                   <>
//                     <span className="font-medium font-body">{product.currency || '$'}{product.original_price.toFixed(2)}</span>
//                     {product.discount && (
//                       <div className="text-sm text-red-600 font-medium font-body">
//                         {product.discount}% OFF
//                       </div>
//                     )}
//                   </>
//                 ) : null}
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// // Export capitalizeWords for use in other components
// export { capitalizeWords };


// import React, { useState } from 'react';

// import { Heart } from 'lucide-react';
// import { FaLink } from 'react-icons/fa';
// import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
// import { useApp } from '../../bag/contexts/AppContext';
// import { toast } from 'sonner';
// import { Product } from '../types/product';
// import { extractBrandFromLink } from '../utils/extractBrandFromLink';

// interface ProductCardProps {
//   product: Product;
//   onClick?: () => void;
// }

// // Helper function to capitalize first letter of each word
// const capitalizeWords = (str: string | undefined | null): string => {
//   if (!str) return '';
//   return str.replace(/\b\w+/g, word =>
//     word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//   );
// };

// export function ProductCard({
//   product,
//   onClick
// }: ProductCardProps) {
//   const [isHovered, setIsHovered] = useState(false);

//   const { toggleFavorite, favorites, user, setIsAuthModalOpen } = useApp();
//   const isFavorite = favorites.includes(product.id);

//   const handleToggleFavorite = async (e: React.MouseEvent) => {
//     e.stopPropagation();

//     if (!user?._id) {
//       toast.error('Please log in to save favorites');
//       setIsAuthModalOpen(true);
//       return;
//     }

//     const wasFavorite = isFavorite;

//     try {
//       await toggleFavorite(product.id);
//       if (wasFavorite) {
//         toast.success('Removed from favorites');
//       } else {
//         toast.success('Added to favorites');
//       }
//     } catch (error) {
//       toast.error('Failed to update favorites');
//       console.error('toggleFavorite error', error);
//     }
//   };

//   const handleCardClick = () => {
//     if (onClick) {
//       onClick();
//     }
//   };

//   return (
//     <div className="relative h-full flex flex-col">
//       <div
//         className="bg-white border border-gray-300 cursor-pointer overflow-hidden transition-all duration-200 shadow-md hover:shadow-lg hover:border-black h-full flex flex-col relative"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Grayish overlay on hover */}
//         {isHovered && (
//           <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none transition-opacity duration-200" />
//         )}
        
//         {/* Favorite Button - Top Right Corner of Card */}
//         <button
//           onClick={handleToggleFavorite}
//           className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 bg-white border border-gray-200 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-200 hover:[&_svg]:fill-black hover:[&_svg]:text-black"
//         >
//           <Heart
//             className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
//               isFavorite
//                 ? 'fill-black text-black'
//                 : 'text-gray-900'
//             }`}
//           />
//         </button>

//         <div
//           className={onClick ? "cursor-pointer flex flex-col h-full" : "flex flex-col h-full"}
//           onClick={handleCardClick}
//         >
//           {/* 
//             Image container with fixed 4:5 aspect ratio.
//             This ensures all image containers have identical dimensions.
//             Images are cropped (object-cover) to fill the container.
//           */}
//           <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50 flex-shrink-0">
//             <ImageWithFallback
//               src={product.product_image || ''}
//               alt={product.product_name || 'Product'}
//               className="absolute inset-0 w-full h-full object-cover"
//             />
//           </div>

//           {/* Content section - flexible height with min-height for consistency */}
//           <div className="flex-1 bg-white flex flex-col min-h-[120px] sm:min-h-[130px] md:min-h-[140px]">
//             <div className="p-3 sm:p-4 flex flex-col items-start h-full justify-between">
//               <div className="flex flex-col items-start w-full">
//                 {product.brand_name && (
//                   <div className="text-sm sm:text-base font-semibold uppercase tracking-wider mb-0.5 sm:mb-1 line-clamp-1 font-body">
//                     {product.brand_name}
//                   </div>
//                 )}

//                 {product.product_name && (
//                   <div className="text-xs sm:text-sm text-gray-700 line-clamp-1 mb-0.5 sm:mb-1 font-body">
//                     {capitalizeWords(product.product_name)}
//                   </div>
//                 )}

//                 <div className="text-xs sm:text-sm text-gray-700 line-clamp-2 mb-0.5 sm:mb-1 font-body">
//                   {capitalizeWords(product.product_description)}
//                 </div>

//                 {/* View on Brand Link */}
//                 {product.product_link && (() => {
//                   const brandName = extractBrandFromLink(product.product_link) || 'original site';
//                   const capitalizedBrand = capitalizeWords(brandName);
//                   return (
//                     <a
//                       href={product.product_link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       onClick={(e) => e.stopPropagation()}
//                       className="text-[10px] sm:text-xs text-gray-600 hover:text-black underline flex items-center gap-1 mt-0.5 sm:mt-1 font-body transition-colors"
//                     >
//                       <FaLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                       <span>view on <span className="font-bold">{capitalizedBrand}</span></span>
//                     </a>
//                   );
//                 })()}
//               </div>

//               {/* PRICE */}
//               <div className="pt-1 sm:pt-2 flex flex-col gap-0.5 sm:gap-1">
//                 {product.original_price && product.sale_price && product.original_price > product.sale_price ? (
//                   <>
//                     <div className="flex items-baseline gap-1 sm:gap-2">
//                       <span className="text-red-600 font-semibold text-sm sm:text-base font-body">
//                         {product.currency || '$'}{product.sale_price.toFixed(2)}
//                       </span>
//                       <span className="text-xs sm:text-sm line-through text-gray-600 font-normal font-body">
//                         {product.currency || '$'}{product.original_price.toFixed(2)}
//                       </span>
//                     </div>
//                     {product.discount && (
//                       <div className="text-xs sm:text-sm text-red-600 font-bold font-body">  
//                         {product.discount}% OFF
//                       </div>
//                     )}
//                   </>
//                 ) : product.sale_price ? (
//                   <>
//                     <span className="font-medium text-sm sm:text-base font-body">{product.currency || '$'}{product.sale_price.toFixed(2)}</span>
//                     {product.discount && (
//                       <div className="text-xs sm:text-sm text-red-600 font-medium font-body">
//                         {product.discount}% OFF
//                       </div>
//                     )}
//                   </>
//                 ) : product.original_price ? (
//                   <>
//                     <span className="font-medium text-sm sm:text-base font-body">{product.currency || '$'}{product.original_price.toFixed(2)}</span>
//                     {product.discount && (
//                       <div className="text-xs sm:text-sm text-red-600 font-medium font-body">
//                         {product.discount}% OFF
//                       </div>
//                     )}
//                   </>
//                 ) : null}
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// // Export capitalizeWords for use in other components
// export { capitalizeWords };



import React, { useState } from 'react';

import { Heart } from 'lucide-react';
import { FaLink } from 'react-icons/fa';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
import { useApp } from '../../bag/contexts/AppContext';
import { toast } from 'sonner';
import { Product } from '../types/product';
import { extractBrandFromLink } from '../utils/extractBrandFromLink';

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
        className="bg-white border border-gray-300 cursor-pointer overflow-hidden transition-all duration-200 shadow-md hover:shadow-lg hover:border-black h-full flex flex-col relative"
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
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 bg-white border border-gray-200 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-200 hover:[&_svg]:fill-black hover:[&_svg]:text-black"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
              isFavorite
                ? 'fill-black text-black'
                : 'text-gray-900'
            }`}
          />
        </button>

        <div
          className={onClick ? "cursor-pointer flex flex-col h-full" : "flex flex-col h-full"}
          onClick={handleCardClick}
        >
          {/* 
            Image container with fixed 4:5 aspect ratio.
            This ensures all image containers have identical dimensions.
            Images are cropped (object-cover) to fill the container.
            Padding matches the content section (p-3 sm:p-4) for alignment.
          */}
          <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50 flex-shrink-0 p-3 sm:p-4">
            <div className="relative w-full h-full overflow-hidden">
              <ImageWithFallback
                src={product.product_image || ''}
                alt={product.product_name || 'Product'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content section - flexible height with min-height for consistency */}
          <div className="flex-1 bg-white flex flex-col min-h-[120px] sm:min-h-[130px] md:min-h-[140px]">
            <div className="p-3 sm:p-4 flex flex-col items-start h-full justify-between">
              <div className="flex flex-col items-start w-full">
                {product.brand_name && (
                  <div className="text-sm sm:text-base font-semibold uppercase tracking-wider mb-0.5 sm:mb-1 line-clamp-1 font-body">
                    {product.brand_name}
                  </div>
                )}

                {product.product_name && (
                  <div className="text-xs sm:text-sm text-gray-700 line-clamp-1 mb-0.5 sm:mb-1 font-body">
                    {capitalizeWords(product.product_name)}
                  </div>
                )}

                <div className="text-xs sm:text-sm text-gray-700 line-clamp-2 mb-0.5 sm:mb-1 font-body">
                  {capitalizeWords(product.product_description)}
                </div>

                {/* View on Brand Link */}
                {product.product_link && (() => {
                  const brandName = extractBrandFromLink(product.product_link) || 'original site';
                  const capitalizedBrand = capitalizeWords(brandName);
                  return (
                    <a
                      href={product.product_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs sm:text-sm text-gray-600 hover:text-black underline flex items-center gap-1 mt-0.5 sm:mt-1 font-body transition-colors"
                    >
                      {/* @ts-ignore - react-icons accepts className but types may be outdated */}
                      <FaLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>view on <span className="font-bold">{capitalizedBrand}</span></span>
                    </a>
                  );
                })()}
              </div>

              {/* PRICE */}
              <div className="pt-1 sm:pt-2 flex flex-col gap-0.5 sm:gap-1">
                {product.original_price && product.sale_price && product.original_price > product.sale_price ? (
                  <>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-red-600 font-semibold text-sm sm:text-base font-body">
                        {product.currency || '$'}{product.sale_price.toFixed(2)}
                      </span>
                      <span className="text-sm sm:text-base line-through text-gray-600 font-normal font-body">
                        {product.currency || '$'}{product.original_price.toFixed(2)}
                      </span>
                    </div>
                    {product.discount && (
                      <div className="text-xs sm:text-sm text-red-600 font-bold font-body">  
                        {product.discount}% OFF
                      </div>
                    )}
                  </>
                ) : product.sale_price ? (
                  <>
                    <span className="font-medium text-sm sm:text-base font-body">{product.currency || '$'}{product.sale_price.toFixed(2)}</span>
                    {product.discount && (
                      <div className="text-xs sm:text-sm text-red-600 font-medium font-body">
                        {product.discount}% OFF
                      </div>
                    )}
                  </>
                ) : product.original_price ? (
                  <>
                    <span className="font-medium text-sm sm:text-base font-body">{product.currency || '$'}{product.original_price.toFixed(2)}</span>
                    {product.discount && (
                      <div className="text-xs sm:text-sm text-red-600 font-medium font-body">
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