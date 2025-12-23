import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { register as apiRegister, login as apiLogin, logout as apiLogout, getBag as apiGetBag, syncBag, addToFavorites, removeFromFavorites, getFavorites } from '../../auth/api/auth';
import { BagService } from '../services/bagService';
import { fetchProductById } from '../../products/services/productsService';
import { normalizeProduct } from '../../products/utils/productTransform';
import { Product } from '../../products/types/product';

export interface BagItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface User {
  _id: string; // Required - primary key from backend
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: BagItem[];
}

interface AppContextType {
  bag: BagItem[];
  bagProductIds: string[]; // Product IDs in bag from backend
 favorites: string[];
  user: User | null;
  setUser: (user: User | null) => void;
  isCartOpen: boolean;
  isAuthModalOpen: boolean;
  orders: Order[];
  addToBag: (item: Omit<BagItem, 'quantity'>) => Promise<void>;
  removeFromBag: (id: string, size: string, color: string) => void;
  updateBagQuantity: (id: string, size: string, color: string, quantity: number) => void;
  toggleFavorite: (productId: string) => Promise<void>;
  setIsCartOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  clearBag: () => void;
  loadBagFromBackend: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = useState<BagItem[]>([]);
  const [bagProductIds, setBagProductIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load bag from backend when user is logged in
  const loadBagFromBackend = async (userId?: string) => {
    const targetUserId = userId || user?._id;
    if (!targetUserId) return;
    try {
      const productIds = await BagService.getBag(targetUserId);
      setBagProductIds(productIds);
      
      // Fetch product details for each product ID and populate bag
      if (productIds.length > 0) {
        const bagItems: BagItem[] = [];
        for (const productId of productIds) {
          try {
            const productData = await fetchProductById(productId);
            const product = normalizeProduct(productData);
            
            // Create BagItem from product
            bagItems.push({
              id: product.id || '',
              name: product.product_name || 'Product',
              price: product.sale_price || product.original_price || 0,
              image: product.product_image || '',
              size: product.available_sizes?.[0] || 'One Size',
              color: product.product_color?.[0] || 'Default',
              quantity: 1, // Default quantity
            });
          } catch (error) {
            console.error(`Failed to fetch product ${productId}:`, error);
            // Continue with other products even if one fails
          }
        }
        
        // Set the bag with fetched items
        if (bagItems.length > 0) {
          setBag(bagItems);
        }
      } else {
        // Clear bag if no products
        setBag([]);
      }
    } catch (error) {
      console.error('Failed to load bag from backend:', error);
    }
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBag = localStorage.getItem('bag');
    const savedFavorites = localStorage.getItem('favorites');
    const savedUser = localStorage.getItem('user');
    const savedOrders = localStorage.getItem('orders');

    if (savedBag) setBag(JSON.parse(savedBag));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Load bag from backend if user is logged in
      if (parsedUser?._id) {
        BagService.getBag(parsedUser._id)
          .then((productIds) => setBagProductIds(productIds))
          .catch((error) => console.error('Failed to load bag:', error));
      }
    }
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Load bag and favorites when user logs in
  useEffect(() => {
    if (user?._id) {
      loadBagFromBackend();
      // Load favorites from backend
      getFavorites(user._id)
        .then((favoritesFromBackend) => setFavorites(favoritesFromBackend))
        .catch((error) => console.error('Failed to load favorites:', error));
    } else {
      setBagProductIds([]);
      setFavorites([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Save bag to localStorage
  useEffect(() => {
    localStorage.setItem('bag', JSON.stringify(bag));
  }, [bag]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToBag = async (item: Omit<BagItem, 'quantity'>) => {
    // Update local bag state immediately for better UX
    setBag((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    // Sync with backend if user is logged in
    if (user?._id) {
      try {
        const updatedBag = await BagService.addToBag(user._id, item.id);
        setBagProductIds(updatedBag);
      } catch (error) {
        // Revert local state on error
        setBag((prev) => {
          const existing = prev.find(
            (i) => i.id === item.id && i.size === item.size && i.color === item.color
          );
          if (existing && existing.quantity > 1) {
            return prev.map((i) =>
              i.id === item.id && i.size === item.size && i.color === item.color
                ? { ...i, quantity: i.quantity - 1 }
                : i
            );
          }
          return prev.filter((i) => !(i.id === item.id && i.size === item.size && i.color === item.color));
        });
        throw error;
      }
    }
  };

  const removeFromBag = (id: string, size: string, color: string) => {
    setBag((prev) =>
      prev.filter((i) => !(i.id === id && i.size === size && i.color === color))
    );
    
    // Sync with backend if user is logged in
    if (user?._id) {
      BagService.removeFromBag(user._id, id)
        .then((updatedBag) => setBagProductIds(updatedBag))
        .catch((error) => console.error('Failed to remove from bag:', error));
    }
  };

  const updateBagQuantity = (id: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBag(id, size, color);
      return;
    }
    setBag((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size && i.color === color ? { ...i, quantity } : i
      )
    );
  };

  const toggleFavorite = async (productId: string) => {
    // Update local state immediately for better UX
    const isCurrentlyFavorite = favorites.includes(productId);
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    // Sync with backend if user is logged in
    if (!user?._id) {
      return;
    }

      try {
        if (isCurrentlyFavorite) {
          await removeFromFavorites(user._id, productId);
        } else {
          await addToFavorites(user._id, productId);
        }
        // Refresh favorites from backend to ensure sync
        const updatedFavorites = await getFavorites(user._id);
        setFavorites(updatedFavorites);
      } catch (error) {
        console.error('Failed to sync favorite with backend:', error);
        // Revert local state on error
        setFavorites((prev) =>
          isCurrentlyFavorite
            ? [...prev, productId]
            : prev.filter((id) => id !== productId)
        );
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin({ email, password });
      const apiUser = response.user;
      
      const user: User = {
        _id: apiUser._id,
        name: apiUser.name,
        email: apiUser.email,
        avatar: apiUser.avatar,
      };
      
      setUser(user);
      setIsAuthModalOpen(false);
      
      // Load bag and favorites from backend after login
      if (user._id) {
        await loadBagFromBackend(user._id);
        try {
          const favoritesFromBackend = await getFavorites(user._id);
          setFavorites(favoritesFromBackend);
        } catch (error) {
          console.error('Failed to load favorites after login:', error);
        }
      }
    } catch (error: any) {
      // Error will be handled by AuthModal
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiRegister({ name, email, password });
      const apiUser = response.user;
      
      const user: User = {
        _id: apiUser._id,
        name: apiUser.name,
        email: apiUser.email,
        avatar: apiUser.avatar,
      };
      
      setUser(user);
      setIsAuthModalOpen(false);
      
      // Load bag and favorites from backend after registration (should be empty, but sync any local bag/favorites)
      if (user._id) {
        try {
          const productIds = await BagService.getBag(user._id);
          setBagProductIds(productIds);
          
          // If there are items in local bag, sync them to backend
          if (bag.length > 0) {
            const localProductIds: string[] = Array.from(new Set(bag.map(item => item.id)));
            await syncBag(user._id, localProductIds);
            setBagProductIds(localProductIds);
          }
          
          // Sync local favorites to backend if any
          if (favorites.length > 0) {
            for (const productId of favorites) {
              try {
                await addToFavorites(user._id, productId);
              } catch (error) {
                console.error(`Failed to sync favorite ${productId}:`, error);
              }
            }
          }
          
          // Load favorites from backend
          const favoritesFromBackend = await getFavorites(user._id);
          setFavorites(favoritesFromBackend);
        } catch (error) {
          console.error('Failed to load bag after registration:', error);
        }
      }
    } catch (error: any) {
      // Error will be handled by AuthModal
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Sync bag to backend before logging out (if user is logged in)
      if (user?._id && bag.length > 0) {
        try {
          // Extract unique product IDs from bag items
          const productIds: string[] = Array.from(new Set(bag.map(item => item.id)));
          await syncBag(user._id, productIds);
          console.log('Bag synced to backend before logout');
        } catch (error) {
          console.error('Failed to sync bag to backend on logout:', error);
          // Continue with logout even if sync fails
        }
      }
      
      // Call API logout to clear server-side session
      await apiLogout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error);
    } finally {
      // Clear all state
      setUser(null);
      setBag([]);
      setBagProductIds([]);
      setFavorites([]);
      setOrders([]);
      setIsCartOpen(false);
      setIsAuthModalOpen(false);
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('bag');
      localStorage.removeItem('favorites');
      localStorage.removeItem('orders');
      localStorage.removeItem('token');
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const clearBag = () => {
    setBag([]);
    setBagProductIds([]);
  };

  return (
    <AppContext.Provider
      value={{
        bag,
        bagProductIds,
        favorites,
        user,
        setUser,
        isCartOpen,
        isAuthModalOpen,
        orders,
        addToBag,
        removeFromBag,
        updateBagQuantity,
        toggleFavorite,
        setIsCartOpen,
        setIsAuthModalOpen,
        login,
        register,
        logout,
        updateProfile,
        clearBag,
        loadBagFromBackend,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
