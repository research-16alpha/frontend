import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { fetchProducts } from '../services/productsService';
import { transformProducts, FrontendProduct } from '../utils/productTransform';
import { ProductCardExpanding } from './ProductCardExpanding';

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
          originalPrice: p.originalPrice,
          category: p.category || 'Uncategorized',
          images: p.images && p.images.length > 0 ? p.images : [p.image],
          description: p.description || '',
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
          sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L'],
          colors: p.colors && p.colors.length > 0 ? p.colors : ['Black', 'White'],
          product_link: p.product_link,
          brand_name: p.brand_name,
          product_gender: p.product_gender,
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
            <motion.div
              key={product.id}
              className={`relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${expandedId === product.id ? 'col-span-1 md:col-span-2 lg:col-span-4' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ProductCardExpanding
                product={product}
                isExpanded={expandedId === product.id}
                onClick={() => handleProductClick(product.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}