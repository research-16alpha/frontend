import React, { useEffect, useState } from 'react';
import { Navbar } from '../../../shared/components/Navbar';
import { Footer } from '../../../shared/components/Footer';
import { useApp } from '../../bag/contexts/AppContext';
import { useNavigation } from '../../../shared/contexts/NavigationContext';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';
import { fetchProductById } from '../../products/services/productsService';
import { normalizeProduct } from '../../products/utils/productTransform';
import { Product } from '../../products/types/product';

type Tab = 'orders' | 'favorites' | 'profile' | 'addresses' | 'payment' | 'settings';

export function Account() {
  const { user, logout, orders, favorites, updateProfile, toggleFavorite } = useApp();
  const { navigateToHome, navigateToProducts, navigateToAccount, navigateToAbout, navigateToCurated } = useNavigation();
  
  const handleCategoryClick = (category: string) => {
    if (category === 'men' || category === 'women' || category === 'pre-owned') {
      navigateToProducts(category);
    } else {
      // For other categories like 'accessories' or 'sale', navigate to products without gender filter
      navigateToProducts();
    }
  };
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(user);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  if (!user) {
    return null;
  }

  // Check if navigation requested opening the Favorites tab specifically
  useEffect(() => {
    try {
      const initialTab = localStorage.getItem('accountInitialTab');
      if (initialTab === 'favorites') {
        setActiveTab('favorites');
        localStorage.removeItem('accountInitialTab');
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadFavoriteProducts = async () => {
      if (!favorites || favorites.length === 0) {
        setFavoriteProducts([]);
        setIsLoadingFavorites(false);
        return;
      }

      setIsLoadingFavorites(true);
      const products: Product[] = [];

      for (const id of favorites) {
        try {
          const data = await fetchProductById(id);
          const normalized = normalizeProduct(data);
          products.push(normalized);
        } catch (error) {
          console.error(`Failed to load favorite product ${id}:`, error);
        }
      }

      if (!cancelled) {
        setFavoriteProducts(products);
        setIsLoadingFavorites(false);
      }
    };

    loadFavoriteProducts();

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  const handleSaveProfile = () => {
    if (editedProfile) {
      updateProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const tabs = [
    { id: 'orders' as Tab, label: 'My Orders', icon: Package },
    { id: 'favorites' as Tab, label: 'Favorites', icon: Heart },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'addresses' as Tab, label: 'Addresses', icon: MapPin },
    { id: 'payment' as Tab, label: 'Payment', icon: CreditCard },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        onFeaturedClick={() => {}} 
        onProductsClick={navigateToProducts}
        onLogoClick={navigateToHome}
        onAccountClick={navigateToAccount}
        onAboutClick={navigateToAbout}
        onCategoryClick={handleCategoryClick}
        onPreOwnedClick={() => {
          // Navigate to products page - can be customized to filter for pre-owned items
          navigateToProducts();
        }}
        onCuratedClick={navigateToCurated}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {/* User Info */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 mb-3 overflow-hidden">
                  {user.avatar ? (
                    <ImageWithFallback
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="mb-1">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
                <button
                  onClick={async () => {
                    try {
                      await logout();
                      // Redirect to home page after logout
                      navigateToHome();
                    } catch (error) {
                      console.error('Logout failed:', error);
                      // Still redirect even if logout fails
                      navigateToHome();
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl mb-6">My Orders</h2>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              Order #{order.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              Placed on {new Date(order.date).toLocaleDateString()}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4">
                              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm mb-1">{item.name}</div>
                                <div className="text-xs text-gray-500">
                                  Qty: {item.quantity} | Size: {item.size} | Color:{' '}
                                  {item.color}
                                </div>
                              </div>
                              <div className="text-sm">${item.price.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm">
                            Total: <span className="text-lg">${order.total.toFixed(2)}</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm transition-colors">
                              Track Order
                            </button>
                            <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-2xl mb-6">My Favorites</h2>
                  {isLoadingFavorites ? (
                    <div className="text-center py-12 text-gray-500">
                      Loading your favorites...
                    </div>
                  ) : favoriteProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No favorites yet</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Start adding products to your favorites!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteProducts.map((product) => (
                        <div
                          key={product.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col gap-3"
                        >
                          <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={product.product_image || ''}
                              alt={product.product_name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            {product.brand_name && (
                              <div className="text-[11px] uppercase tracking-wide text-gray-500">
                                {product.brand_name}
                              </div>
                            )}
                            <div className="text-sm font-medium text-gray-800 line-clamp-2">
                              {product.product_name}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-2">
                              {product.product_description || 'No description available.'}
                            </div>
                            <div className="text-sm font-semibold">
                              {product.original_price && product.sale_price && product.original_price > product.sale_price ? (
                                <>
                                  <span className="text-red-600">
                                    {product.currency || '$'}{product.sale_price.toFixed(2)}
                                  </span>
                                  <span className="ml-2 text-xs line-through text-gray-400">
                                    {product.currency || '$'}{product.original_price.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span>{product.currency || '$'}{(product.sale_price || product.original_price || 0).toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                          >
                            <Heart className="w-4 h-4 text-red-500" />
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditedProfile(user);
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editedProfile?.name || ''}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile!, name: e.target.value })
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Email Address</label>
                        <input
                          type="email"
                          value={editedProfile?.email || ''}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile!, email: e.target.value })
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={editedProfile?.phone || ''}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile!, phone: e.target.value })
                          }
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl">Shipping Addresses</h2>
                    <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                      Add New Address
                    </button>
                  </div>

                  {user.address ? (
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="mb-2">Default Address</div>
                          <div className="text-gray-600">
                            <p>{user.address.street}</p>
                            <p>
                              {user.address.city}, {user.address.state} {user.address.zip}
                            </p>
                            <p>{user.address.country}</p>
                          </div>
                        </div>
                        <button className="text-sm text-gray-600 hover:text-black">
                          Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-gray-200 rounded-lg">
                      <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No addresses saved</p>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Tab */}
              {activeTab === 'payment' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl">Payment Methods</h2>
                    <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                      Add Card
                    </button>
                  </div>

                  <div className="text-center py-12 border border-gray-200 rounded-lg">
                    <CreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No payment methods saved</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Add a payment method for faster checkout
                    </p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <h3 className="mb-4">Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-700">Email notifications</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-700">Order updates</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-700">Promotional emails</span>
                          <input type="checkbox" className="rounded" />
                        </label>
                      </div>
                    </div>

                    <div className="border-b pb-6">
                      <h3 className="mb-4">Privacy</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-700">Make profile public</span>
                          <input type="checkbox" className="rounded" />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-700">Show order history</span>
                          <input type="checkbox" className="rounded" />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-red-600">Danger Zone</h3>
                      <button className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer show={true} />
    </div>
  );
}