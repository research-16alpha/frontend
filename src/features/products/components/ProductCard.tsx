import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../bag/contexts/AppContext';

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  image: string;
  category: string;
  description?: string;
  brand_name?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToBag, setIsAddingToBag] = useState(false);
  const { addToBag, user } = useApp();

  const handleAddToBag = async () => {
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
        price: product.discountedPrice ?? product.price,
        image: product.image,
        size: 'One Size',
        color: 'Default',
      });
      toast.success('Added to bag!');
    } catch (error) {
      toast.error('Failed to add to bag. Please try again.');
      console.error('Error adding to bag:', error);
    } finally {
      setIsAddingToBag(false);
    }
  };

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square mb-4 overflow-hidden bg-gray-50 rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Add to Cart Button */}
        <button
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-white rounded-full flex items-center gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={handleAddToBag}
          disabled={isAddingToBag}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-sm">{isAddingToBag ? 'Adding...' : 'Add to Bag'}</span>
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-gray-500">{product.category}</p>
        <h3 className="text-sm">{product.name}</h3>
        {(product.description || product.brand_name) && (
          <div className="text-xs text-gray-600">
            {product.brand_name && <span className="font-medium">{product.brand_name}</span>}
            {product.brand_name && product.description && <span className="mx-1">•</span>}
            {product.description && <span>{product.description}</span>}
          </div>
        )}
        <div className="flex items-center gap-2">
          {product.discountedPrice ? (
            <>
              <p className="text-sm">${product.discountedPrice}</p>
              <p className="text-sm text-gray-400 line-through">${product.price}</p>
            </>
          ) : (
            <p className="text-sm">${product.price}</p>
          )}
        </div>
      </div>
    </div>
  );
}