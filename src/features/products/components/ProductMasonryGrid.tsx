import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShoppingCart, Heart, X } from 'lucide-react';
import { fetchProducts } from '../services/productsService';
import { transformProducts, FrontendProduct } from '../utils/productTransform';
import { useApp } from '../../bag/contexts/AppContext';
import { toast } from 'sonner';

interface MasonryProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  discountedPrice?: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  span?: 'wide' | 'tall';
  description?: string;
  brand_name?: string;
  rating?: number;
  reviews?: number;
  sizes?: string[];
  colors?: string[];
}

export function ProductMasonryGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [products, setProducts] = useState<MasonryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toggleFavorite, favorites } = useApp();

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts(1, 20);
        const backendProducts = Array.isArray(data) ? data : (data.products || []);
        const transformed = transformProducts(backendProducts);
        setProducts(transformed.map(p => ({
          id: String(p.id),
          name: p.name,
          category: p.category,
          price: `$${p.originalPrice || p.price}`,
          discountedPrice: p.discountedPrice ? `$${p.discountedPrice}` : undefined,
          originalPrice: p.originalPrice ? `$${p.originalPrice}` : undefined,
          image: p.image,
          images: p.images || [p.image],
          span: undefined,
          description: p.description,
          brand_name: p.brand_name,
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
          sizes: p.sizes || ['S', 'M', 'L'],
          colors: p.colors || ['Black', 'White'],
        })));
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleProductClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl mb-6 md:mb-8 uppercase tracking-tight">Trending Now</h2>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-auto">
            {products.map((product, index) => (
            <MasonryProductCard
              key={product.id}
              product={product}
              isExpanded={expandedId === product.id}
              onClick={() => handleProductClick(product.id)}
            />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface MasonryProductCardProps {
  product: MasonryProduct;
  isExpanded: boolean;
  onClick: () => void;
}

function MasonryProductCard({ product, isExpanded, onClick }: MasonryProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Black');
  const [isAddingToBag, setIsAddingToBag] = useState(false);
  const { addToBag, toggleFavorite, favorites, user } = useApp();

  const isFavorite = favorites.includes(product.id);

  const handleAddToBag = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!user?._id) {
      toast.error('Please log in to add items to your bag');
      return;
    }

    setIsAddingToBag(true);
    try {
      await addToBag({
        id: product.id,
        name: product.name,
        price: parseFloat(product.discountedPrice?.replace('$', '') || product.price.replace('$', '')),
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

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <motion.div
      layout
      className={`relative ${isExpanded ? 'col-span-2 md:col-span-3 lg:col-span-4 row-span-1' : ''} ${
        product.span === 'wide' ? 'md:col-span-2' : ''
      } ${product.span === 'tall' && !isExpanded ? 'row-span-2' : ''}`}
      initial={false}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        layout="position"
        className={`bg-white overflow-hidden transition-all duration-300 ${
          isExpanded ? 'shadow-2xl border border-gray-200' : ''
        }`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => !isExpanded && setIsHovered(false)}
      >
        {/* Collapsed Card View */}
        {!isExpanded && (
          <div className="group cursor-pointer" onClick={onClick}>
            <div 
              className={`overflow-hidden bg-gray-50 mb-2 relative ${
                product.span === 'tall' ? 'aspect-[3/5]' : 'aspect-square'
              } ${product.span === 'wide' ? 'aspect-[2/1]' : ''}`}
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Quick Actions on Hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-2 left-2 right-2 flex gap-2"
                  >
                    <button className="flex-1 bg-white text-black py-1.5 px-3 text-xs hover:bg-gray-100 transition-colors">
                      Quick View
                    </button>
                    <button
                      onClick={handleToggleFavorite}
                      className={`bg-white p-1.5 hover:bg-gray-100 transition-colors ${
                        isFavorite ? 'text-red-500' : ''
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 mb-1">
                {product.category}
              </p>
              <p className="text-xs md:text-sm mb-0.5">{product.name}</p>
              <div className="flex items-center gap-1.5 md:gap-2">
                {product.discountedPrice ? (
                  <>
                    <p className="text-xs md:text-sm">{product.discountedPrice}</p>
                    <p className="text-xs md:text-sm text-gray-400 line-through">{product.originalPrice}</p>
                  </>
                ) : (
                  <p className="text-xs md:text-sm">{product.price}</p>
                )}
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

            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Left: Images */}
              <div className="space-y-3">
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images && product.images.length > 1 && (
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
                )}
              </div>

              {/* Right: Details */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.category}</div>
                  <h2 className="text-2xl mb-2">{product.name}</h2>
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
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}