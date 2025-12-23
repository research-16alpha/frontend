import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { fetchProductById } from '../services/productsService';
import { normalizeProduct } from '../utils/productTransform';
import { useApp } from '../../../features/bag/contexts/AppContext';
import { toast } from 'sonner';

interface UseProductDetailProps {
  productId: string | null;
  currentPage: string;
  navigateBack: () => void;
}

export function useProductDetail({ productId, currentPage, navigateBack }: UseProductDetailProps) {
  const { user, addToBag, toggleFavorite, favorites } = useApp();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAddingToBag, setIsAddingToBag] = useState(false);

  // Load product when productId changes
  useEffect(() => {
    if (currentPage !== 'product' || !productId) {
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(productId);
        const normalized = normalizeProduct(data);
        setProduct(normalized);
        setSelectedSize(normalized.available_sizes?.[0] || '');
        setSelectedColor(normalized.product_color?.[0] || '');
      } catch (error) {
        console.error('Failed to load product:', error);
        toast.error('Failed to load product');
        navigateBack();
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, currentPage, navigateBack]);

  const handleAddToBag = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (!user?._id) {
      toast.error('Please log in to add items to your bag');
      return;
    }

    if (!product) return;

    setIsAddingToBag(true);
    try {
      await addToBag({
        id: product.id || '',
        name: product.product_name || 'Product',
        price: product.sale_price || product.original_price || 0,
        image: product.product_image || '',
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

    if (!product) return;

    if (!user?._id) {
      toast.error('Please log in to save favorites');
      return;
    }

    const wasFavorite = favorites.includes(product.id);

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

  return {
    product,
    loading,
    selectedSize,
    selectedColor,
    isAddingToBag,
    isFavorite: product ? favorites.includes(product.id || '') : false,
    setSelectedSize,
    setSelectedColor,
    handleAddToBag,
    handleToggleFavorite,
  };
}

