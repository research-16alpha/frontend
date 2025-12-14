import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShoppingCart, Heart, X } from 'lucide-react';
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
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  product_link?: string;
  brand_name?: string;
  product_gender?: string;
}

interface ProductCardExpandingProps {
  product: Product;
  isExpanded: boolean;
  onClick: () => void;
}

export function ProductCardExpanding({ product, isExpanded, onClick }: ProductCardExpandingProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const { addToBag, toggleFavorite, favorites, user } = useApp();
  const [isAddingToBag, setIsAddingToBag] = useState(false);

  const isFavorite = favorites.includes(product.id);

  const handleAddToBag = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!user?._id) {
      console.log(user);
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
    } catch (error) {
      toast.error('Failed to add to bag. Please try again.');
      console.error('Error adding to bag:', error);
    } finally {
      setIsAddingToBag(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  // Mock reviews data

  return (
    <motion.div
      layout
      className={`relative ${isExpanded ? 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4' : ''}`}
      initial={false}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        layout="position"
        className={`bg-white border border-gray-200 overflow-hidden transition-all duration-300 ${
          isExpanded ? 'shadow-2xl' : 'hover:shadow-lg'
        } ${isHovered && !isExpanded ? 'border-gray-900' : ''}`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => !isExpanded && setIsHovered(false)}
      >
        {/* Collapsed Card View */}
        {!isExpanded && (
          <div className="cursor-pointer" onClick={onClick}>
            {/* Image Container with Hover Transition */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-lg 
  transition-shadow 
  group-hover:shadow-md">
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: isHovered ? 0 : 1 }}
                transition={{ duration: 0.5 }}
              >
                <ImageWithFallback
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <ImageWithFallback
                  src={product.images[1]}
                  alt={`${product.name} alternate view`}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Quick Actions on Hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 right-4 flex gap-2"
                  >
                    <button className="flex-1 bg-white text-black py-2 px-4 hover:bg-gray-100 transition-colors">
                      Quick View
                    </button>
                    <button
                      onClick={handleToggleFavorite}
                      className={`bg-white p-2 hover:bg-gray-100 transition-colors ${
                        isFavorite ? 'text-red-500' : ''
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`}
                      />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col flex-1 gap-1 min-h-[88px]">

            {/* Product Info */}
            <div className="p-4 flex flex-col h-full">
              {/* Brand */}
              {product.brand_name && (
                <span className="
                  text-xs 
                  font-semibold 
                  tracking-wider 
                  uppercase 
                  text-gray-900
                ">
                  {product.brand_name}
                </span>
              )}


              {/* Description */}
              {product.description && (
                <span className="
                  text-sm 
                  text-gray-700 
                  leading-snug 
                  line-clamp-2
                ">
                  {product.description
                    .toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              )}


              {/* Category */}
              {product.category && (
                <span className="
                  text-[10px] 
                  uppercase 
                  tracking-wide 
                  text-gray-400
                ">
                  {product.category
                    .toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())} 
                </span>
              )}


              {/* Price */}
              <div className="flex items-center gap-2 mt-auto">
              {product.discountedPrice ? (
                <>
                  <span className="text-sm font-medium text-red-600">
                    ${product.discountedPrice}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ${product.price}
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-gray-900">
                  ${product.price}
                </span>
              )}
            </div>

            </div>
            </div>
          </div>
        )}

        {/* Expanded Card View */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="relative"
          >
            {/* Close Button */}
            <button
              onClick={onClick}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
              {/* Left: Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-50 overflow-hidden cursor-pointer border-2 border-transparent hover:border-black transition-colors">
                      <ImageWithFallback
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Details */}
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-500 mb-2">{product.category}</div>
                  <h2 className="text-3xl mb-3">{product.name}</h2>
                  {/* block for review ratings */}
                  {/* <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'fill-black' : 'fill-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                  </div> */}
                  <div className="flex items-center gap-3 mb-4">
                    {product.discountedPrice && product.originalPrice ? (
                      <>
                        <div className="text-3xl">${product.discountedPrice}</div>
                        <div className="text-2xl text-gray-400 line-through">${product.originalPrice}</div>
                      </>
                    ) : (
                      <div className="text-3xl">${product.price}</div>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {product.brand_name && <span className="font-medium">{product.brand_name}</span>}
                    {product.brand_name && product.description && <span className="mx-1">•</span>}
                    {product.description && <span>{product.description}</span>}
                  </p>
                  
                  {/* Gender */}
                  <div className="mt-4 space-y-2">
                    {product.product_gender && (
                      <div className="text-sm">
                        <span className="text-gray-500">Gender: </span>
                        <span className="font-medium capitalize">{product.product_gender}</span>
                      </div>
                    )}
                    {product.category && (
                      <div className="text-sm">
                        <span className="text-gray-500">Category: </span>
                        <span className="font-medium capitalize">{product.category}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Link */}
                  {product.product_link && (
                    <div className="mt-4">
                      <a
                        href={product.product_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                      >
                        View on Original Site
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>

                {/* Size Selection */}
                <div>
                  <div className="text-sm mb-3">Size: {selectedSize}</div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border transition-colors ${
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

                {/* Color Selection */}
                <div>
                  <div className="text-sm mb-3">Color: {selectedColor}</div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border transition-colors ${
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

                {/* Add to Bag Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    className="flex-1 bg-black text-white py-4 px-6 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddToBag}
                    disabled={isAddingToBag}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Bag
                  </button>
                  <button
                    className={`border-2 p-4 hover:bg-gray-50 transition-colors ${
                      isFavorite ? 'border-red-500 text-red-500' : 'border-black'
                    }`}
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                  </button>
                </div>

                {/* Product Details Tabs */}
                <div className="border-t pt-6 space-y-4">
                  <div>
                    <h3 className="mb-3">Product Details</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>&bull; Premium quality materials</li>
                      <li>&bull; Carefully crafted construction</li>
                      <li>&bull; Sustainable and ethically sourced</li>
                      <li>&bull; Made to last</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3">Shipping & Returns</h3>
                    <p className="text-gray-600">
                      Free shipping on orders over $100. Easy returns within 30 days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            {/* <div className="border-t px-6 md:px-8 py-8 bg-gray-50">
              <h3 className="mb-6">Customer Reviews</h3>
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <div>{review.author}</div>
                          <div className="text-sm text-gray-500">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-black' : 'fill-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div> */}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}