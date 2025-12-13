import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShoppingCart, Heart, X } from 'lucide-react';
import { fetchProducts } from '../services/productsService';
import { transformProducts, FrontendProduct } from '../utils/productTransform';
import { useApp } from '../../bag/contexts/AppContext';
import { toast } from 'sonner';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
  brand_name?: string;
  rating?: number;
  reviews?: number;
  sizes?: string[];
  colors?: string[];
}

interface ProductGridProps {
  searchQuery: string;
}

export function ProductGrid({ searchQuery }: ProductGridProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          price: p.originalPrice || p.price,
          discountedPrice: p.discountedPrice,
          image: p.image,
          images: p.images || [p.image],
          category: p.category,
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

  if (loading) {
    return (
      <div ref={gridRef} className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-3xl mb-2 tracking-tight">Featured Products</h2>
          <p className="text-gray-600">Discover our curated selection</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={gridRef} className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Classic White Sneakers',
      price: 129,
      discountedPrice: 103,
      image: 'https://images.unsplash.com/photo-1543652711-77eeb35ae548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbmVha2VycyUyMHdoaXRlfGVufDF8fHx8MTc2NTEyNDA0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      images: [
        'https://images.unsplash.com/photo-1543652711-77eeb35ae548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbmVha2VycyUyMHdoaXRlfGVufDF8fHx8MTc2NTEyNDA0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1631482665588-d3a6f88e65f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
      ],
      category: 'Footwear',
      description: 'Premium white sneakers with modern design and superior comfort.',
      rating: 4.5,
      reviews: 128,
      sizes: ['7', '8', '9', '10', '11', '12'],
      colors: ['White', 'Black', 'Gray']
    },
    {
      id: '2',
      name: 'Minimalist Watch',
      price: 249,
      image: 'https://images.unsplash.com/photo-1561634370-e284d2c11cf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMG1pbmltYWx8ZW58MXx8fHwxNzY1MTc5NzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Accessories',
      description: 'Elegant minimalist timepiece with Swiss movement.',
      rating: 4.8,
      reviews: 95,
      sizes: ['One Size'],
      colors: ['Silver', 'Gold', 'Black']
    },
    {
      id: '3',
      name: 'Leather Backpack',
      price: 189,
      image: 'https://images.unsplash.com/photo-1749842622314-75a5c344ceab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYWNrcGFjayUyMGxlYXRoZXJ8ZW58MXx8fHwxNzY1MTc5NzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Accessories',
      description: 'Durable leather backpack with laptop compartment.',
      rating: 4.6,
      reviews: 203,
      sizes: ['One Size'],
      colors: ['Brown', 'Black', 'Tan']
    },
    {
      id: '4',
      name: 'Designer Sunglasses',
      price: 159,
      image: 'https://images.unsplash.com/photo-1577909698488-3c3705c9c265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwc3VuZ2xhc3Nlc3xlbnwxfHx8fDE3NjUxMDg5NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Accessories',
      description: 'Premium UV protection with sophisticated style.',
      rating: 4.4,
      reviews: 156,
      sizes: ['One Size'],
      colors: ['Black', 'Tortoise', 'Clear']
    },
    {
      id: '5',
      name: 'Minimal Jacket',
      price: 299,
      image: 'https://images.unsplash.com/photo-1617033298185-ab4b65511779?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwamFja2V0fGVufDF8fHx8MTc2NTExMDc2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Clothing',
      description: 'Sleek minimalist jacket for modern style.',
      rating: 4.7,
      reviews: 89,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Gray']
    },
    {
      id: '6',
      name: 'Premium T-Shirt',
      price: 49,
      image: 'https://images.unsplash.com/photo-1485920784995-d65789b1c3af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMG1pbmltYWx8ZW58MXx8fHwxNzY1MTMxMjA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Clothing',
      description: '100% organic cotton essential tee.',
      rating: 4.3,
      reviews: 312,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Black', 'Gray', 'Navy']
    },
    {
      id: '7',
      name: 'Wireless Headphones',
      price: 199,
      image: 'https://images.unsplash.com/photo-1713618651165-a3cf7f85506c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc2NTA4NzcyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Electronics',
      description: 'Premium sound quality with active noise cancellation.',
      rating: 4.9,
      reviews: 267,
      sizes: ['One Size'],
      colors: ['Black', 'White', 'Silver']
    },
    {
      id: '8',
      name: 'Minimalist Clothing',
      price: 179,
      image: 'https://images.unsplash.com/photo-1531347058246-6dfef49b7b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMGNsb3RoaW5nfGVufDF8fHx8MTc2NTEyNzk5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Clothing',
      description: 'Clean lines and timeless design.',
      rating: 4.5,
      reviews: 145,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Beige']
    },
  ];

  const filteredProducts = searchQuery
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div ref={gridRef} className="max-w-7xl mx-auto px-6 py-16">
      <div className={`mb-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h2 className="text-3xl mb-2 tracking-tight">Featured Products</h2>
        <p className="text-gray-600">Discover our curated selection</p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No products found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <GridProductCard
              key={product.id}
              product={product}
              index={index}
              isVisible={isVisible}
              isExpanded={expandedId === product.id}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface GridProductCardProps {
  product: Product;
  index: number;
  isVisible: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

function GridProductCard({ product, index, isVisible, isExpanded, onClick }: GridProductCardProps) {
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

    // Check if user is logged in
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
        price: product.discountedPrice || product.price,
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
      className={`relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${isExpanded ? 'col-span-1 md:col-span-2 lg:col-span-4' : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
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
            <div className="relative aspect-square mb-4 overflow-hidden bg-gray-50 rounded-lg">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
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
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">{product.category}</p>
              <h3 className="text-sm">{product.name}</h3>
              <div className="flex items-center gap-2">
                {product.discountedPrice && product.originalPrice ? (
                  <>
                    <p className="text-sm">${product.discountedPrice}</p>
                    <p className="text-sm text-gray-400 line-through">${product.originalPrice}</p>
                  </>
                ) : (
                  <p className="text-sm">${product.price}</p>
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
                <div className="aspect-square bg-gray-50 overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, idx) => (
                      <div key={idx} className="aspect-square bg-gray-50 overflow-hidden cursor-pointer border-2 border-transparent hover:border-black transition-colors rounded">
                        <ImageWithFallback
                          src={image}
                          alt={`${product.name} view ${idx + 1}`}
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
                    {product.discountedPrice && product.originalPrice ? (
                      <>
                        <div className="text-2xl">${product.discountedPrice}</div>
                        <div className="text-xl text-gray-400 line-through">${product.originalPrice}</div>
                      </>
                    ) : (
                      <div className="text-2xl">${product.price}</div>
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

                {/* Add to Bag Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    className="flex-1 bg-black text-white py-3 px-4 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddToBag}
                    disabled={isAddingToBag}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isAddingToBag ? 'Adding...' : 'Add to Bag'}
                  </button>
                  <button
                    className={`border-2 p-3 hover:bg-gray-50 transition-colors rounded ${
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