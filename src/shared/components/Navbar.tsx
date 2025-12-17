import * as React from "react";
import { ShoppingBag, User, Menu, Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../../features/bag/contexts/AppContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const logoImage = new URL("../assets/logo.jpeg", import.meta.url).href;

interface NavbarProps {
  onFeaturedClick: () => void;
  onProductsClick?: (gender?: string) => void;
  onLogoClick?: () => void;
  onAccountClick?: () => void;
  onAboutClick?: () => void;
  onNewArrivalsClick?: () => void;
  onCategoryClick?: (category: string) => void;
  onPreOwnedClick?: () => void;
  onCuratedClick?: () => void;
}

export function Navbar({ 
  onFeaturedClick, 
  onProductsClick, 
  onLogoClick, 
  onAccountClick, 
  onAboutClick,
  onNewArrivalsClick,
  onCategoryClick,
  onPreOwnedClick,
  onCuratedClick,
}: NavbarProps) {
  const { bag, user, setIsCartOpen, setIsAuthModalOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleUserClick = () => {
    if (user) {
      // User is logged in, navigate to account page
      if (onAccountClick) {
        onAccountClick();
      }
    } else {
      // User is not logged in, show auth modal
      setIsAuthModalOpen(true);
    }
  };

  const handleFavoritesClick = () => {
    if (user) {
      // Remember to open Favorites tab when landing on Account
      try {
        localStorage.setItem('accountInitialTab', 'favorites');
      } catch {
        // Ignore storage errors
      }
      if (onAccountClick) {
        onAccountClick();
      }
    } else {
      // User is not logged in, show auth modal
      setIsAuthModalOpen(true);
    }
  };

  const cartItemCount = bag.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (callback?: () => void) => {
    if (callback) {
      callback();
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`border-b border-gray-200 bg-white sticky top-0 shadow-sm z-50 ${mobileMenuOpen ? 'hidden lg:block' : 'block'}`}>
        <div className="max-w-[1400px] mx-auto md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            

            <div className="flex items-center gap-0">
              {/* Mobile Menu Button - Visible below lg breakpoint */}
              <button
                onClick={() => {
                  setMobileMenuOpen(true);
                }}
                className="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-colors flex-shrink-0 relative z-[65] cursor-pointer flex items-center justify-center"
                aria-label="Open menu"
                type="button"
              >
                <Menu className="w-8 h-8 text-gray-700" />
              </button>

              {/* Logo */}
              <button
                onClick={onLogoClick}
                className="flex items-center gap-2 text-xl md:text-2xl tracking-tight hover:opacity-70 transition-opacity cursor-pointer"
              >
                <ImageWithFallback
                  src={logoImage}
                  alt="Halfsy logo"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-lg text-gray-700 hover:text-black transition-colors tracking-wide cursor-pointer">halfsy</span>
              </button>
            </div>
            {/* Navigation Items - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <button
                onClick={onLogoClick}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide cursor-pointer flex items-center"
              >
                Home
              </button>
              <button
                onClick={() => onProductsClick?.()}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide cursor-pointer flex items-center"
              >
                Shop All
              </button>
              <button
                onClick={() => onCuratedClick?.()}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide cursor-pointer flex items-center"
              >
                Curated
              </button>
              <button 
                onClick={onNewArrivalsClick || (() => {})}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide cursor-pointer flex items-center"
              >
                New
              </button>
              <button
                onClick={() => (onCategoryClick ? onCategoryClick('women') : undefined)}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide cursor-pointer flex items-center"
              >
                Women
              </button>
              <button
                onClick={() => (onCategoryClick ? onCategoryClick('men') : undefined)}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide cursor-pointer flex items-center"
              >
                Men
              </button>
              <button
                onClick={() => (onCategoryClick ? onCategoryClick('accessories') : undefined)}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide cursor-pointer flex items-center"
              >
                Accessories
              </button>
              <button
                onClick={onPreOwnedClick || (() => {})}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide cursor-pointer flex items-center"
              >
                Pre-Owned
              </button>
              <button
                onClick={onAboutClick || (() => {})}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide cursor-pointer flex items-center"
              >
                About
              </button>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={handleUserClick}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={handleFavoritesClick}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors relative cursor-pointer flex items-center justify-center"
                aria-label="Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center cursor-pointer">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Modal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center p-6 border-b relative">
                <h2 className="flex-1 text-center text-sm text-gray-700 uppercase tracking-wide">
                  Menu
                </h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute right-6"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col mt-8 px-6 flex-1 overflow-y-auto pb-6">
                <button
                  onClick={() => handleNavClick(onLogoClick || (() => {}))}
                  className="w-full text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-4 border-b border-gray-100"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick(() => onProductsClick?.())}
                  className="w-full text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-4 border-b border-gray-100"
                >
                  Shop All
                </button>
                <button
                  onClick={() => handleNavClick(() => onCuratedClick?.())}
                  className="w-full text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-4 border-b border-gray-100"
                >
                  Curated
                </button>
                <button
                  onClick={() => handleNavClick(onNewArrivalsClick || (() => {}))}
                  className="w-full text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-4 border-b border-gray-100"
                >
                  New
                </button>
                <button
                  onClick={() => handleNavClick(() => onCategoryClick?.('women'))}
                  className="w-full text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-4 border-b border-gray-100"
                >
                  Women
                </button>
                <button
                  onClick={() => handleNavClick(() => onCategoryClick?.('men'))}
                  className="w-full text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-4 border-b border-gray-100"
                >
                  Men
                </button>
                <button
                  onClick={() => handleNavClick(() => onCategoryClick?.('accessories'))}
                  className="w-full text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-4 border-b border-gray-100"
                >
                  Accessories
                </button>
                <button
                  onClick={() => handleNavClick(onPreOwnedClick || (() => {}))}
                  className="w-full text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-4 border-b border-gray-100"
                >
                  Pre-Owned
                </button>
                <button
                  onClick={() => handleNavClick(onAboutClick || (() => {}))}
                  className="w-full text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-4 border-b border-gray-100"
                >
                  About
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}