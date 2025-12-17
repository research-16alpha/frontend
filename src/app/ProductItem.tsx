import React, { useState, useEffect } from 'react';
import { AnnouncementBanner } from '../shared/components/AnnouncementBanner';
import { Navbar } from '../shared/components/Navbar';
import { AISearchBar } from '../shared/components/AISearchBar';
import { Footer } from '../shared/components/Footer';
import { useNavigation } from '../shared/contexts/NavigationContext';
import { useApp } from '../features/bag/contexts/AppContext';
import { fetchProductById } from '../features/products/services/productsService';
import { transformProduct, FrontendProduct } from '../features/products/utils/productTransform';
import { ExpandedContent } from '../features/products/components/ProductCard';
import { toast } from 'sonner';

export function ProductItem() {
  const { productId, navigateBack, navigateToHome, navigateToProducts, navigateToAccount, navigateToAbout, navigateToCurated } = useNavigation();
  const { addToBag, toggleFavorite, favorites, user } = useApp();
  
  const [product, setProduct] = useState<FrontendProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAddingToBag, setIsAddingToBag] = useState(false);

  useEffect(() => {
    if (!productId) {
      navigateBack();
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(productId);
        const transformed = transformProduct(data);
        setProduct(transformed);
        setSelectedSize(transformed.sizes?.[0] || '');
        setSelectedColor(transformed.colors?.[0] || '');
      } catch (error) {
        console.error('Failed to load product:', error);
        toast.error('Failed to load product');
        navigateBack();
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, navigateBack]);

  const handleCategoryClick = (category: string) => {
    if (category === 'men' || category === 'women' || category === 'pre-owned') {
      navigateToProducts(category);
    } else {
      navigateToProducts();
    }
  };

  // Handle add to bag from page
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
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
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

  // Handle toggle favorite from page
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AnnouncementBanner />
        <Navbar 
          onFeaturedClick={() => {}} 
          onProductsClick={navigateToProducts}
          onLogoClick={navigateToHome}
          onAccountClick={navigateToAccount}
          onAboutClick={navigateToAbout}
          onCategoryClick={handleCategoryClick}
          onPreOwnedClick={() => navigateToProducts()}
          onCuratedClick={navigateToCurated}
        />
        <AISearchBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AnnouncementBanner />
      <Navbar 
        onFeaturedClick={() => {}} 
        onProductsClick={navigateToProducts}
        onLogoClick={navigateToHome}
        onAccountClick={navigateToAccount}
        onAboutClick={navigateToAbout}
        onCategoryClick={handleCategoryClick}
        onPreOwnedClick={() => navigateToProducts()}
        onCuratedClick={navigateToCurated}
      />
      <AISearchBar />

      <main className="flex-1 w-full relative">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden min-h-[600px]">
            <ExpandedContent
              product={{
                ...product,
                images: product.images || [product.image],
              }}
              onClose={navigateBack}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              handleAddToBag={handleAddToBag}
              handleToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.includes(product.id)}
              isAddingToBag={isAddingToBag}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

