import * as React from "react";
import { ShoppingBag, User, Menu } from "lucide-react";
import { useApp } from "../../features/bag/contexts/AppContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";

interface NavbarProps {
  onFeaturedClick: () => void;
  onProductsClick?: (gender?: string) => void;
  onLogoClick?: () => void;
  onAccountClick?: () => void;
  onAboutClick?: () => void;
  onNewArrivalsClick?: () => void;
  onCategoryClick?: (category: string) => void;
  onPreOwnedClick?: () => void;
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

  const cartItemCount = bag.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (callback?: () => void) => {
    if (callback) {
      callback();
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button - Visible below lg breakpoint */}
            <button
              onClick={() => {
                setMobileMenuOpen(true);
              }}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-colors flex-shrink-0 z-10"
              aria-label="Open menu"
              type="button"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            {/* Logo */}
            <button 
              onClick={onLogoClick}
              className="text-xl md:text-2xl tracking-tight hover:opacity-70 transition-opacity flex-1 lg:flex-initial text-center lg:text-left"
            >
              halfsy
            </button>
            
            {/* Navigation Items - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <button
                onClick={() => onProductsClick?.()}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide"
              >
                Shop All
              </button>
              <button 
                onClick={onNewArrivalsClick || (() => {})}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide"
              >
                New
              </button>
              <button
                onClick={() => (onCategoryClick ? onCategoryClick('women') : undefined)}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide"
              >
                Women
              </button>
              <button
                onClick={() => (onCategoryClick ? onCategoryClick('men') : undefined)}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide"
              >
                Men
              </button>
              <button
                onClick={() => (onCategoryClick ? onCategoryClick('accessories') : undefined)}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide"
              >
                Accessories
              </button>
              <button
                onClick={onPreOwnedClick || (() => {})}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide"
              >
                Pre-Owned
              </button>
              <button
                onClick={onAboutClick || (() => {})}
                className="text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide"
              >
                About
              </button>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={handleUserClick}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors relative"
                aria-label="Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Modal */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 sm:w-96">
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => handleNavClick(() => onProductsClick?.())}
              className="text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-2 border-b border-gray-100"
            >
              Shop All
            </button>
            <button
              onClick={() => handleNavClick(onNewArrivalsClick || (() => {}))}
              className="text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-2 border-b border-gray-100"
            >
              New
            </button>
            <button
              onClick={() => handleNavClick(() => onCategoryClick?.('women'))}
              className="text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-2 border-b border-gray-100"
            >
              Women
            </button>
            <button
              onClick={() => handleNavClick(() => onCategoryClick?.('men'))}
              className="text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-2 border-b border-gray-100"
            >
              Men
            </button>
            <button
              onClick={() => handleNavClick(() => onCategoryClick?.('accessories'))}
              className="text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-2 border-b border-gray-100"
            >
              Accessories
            </button>
            <button
              onClick={() => handleNavClick(onPreOwnedClick || (() => {}))}
              className="text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-2 border-b border-gray-100"
            >
              Pre-Owned
            </button>
            <button
              onClick={() => handleNavClick(onAboutClick || (() => {}))}
              className="text-left text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wide py-2 border-b border-gray-100"
            >
              About
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}