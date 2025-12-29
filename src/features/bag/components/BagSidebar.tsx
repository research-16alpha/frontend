import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { ImageWithFallback } from '../../../shared/components/figma/ImageWithFallback';

export function BagSidebar() {
  const { bag, isCartOpen, setIsCartOpen, removeFromBag, updateBagQuantity } = useApp();

  const subtotal = bag.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-xl font-headline">Bag</h2>
                <span className="text-sm text-gray-500 font-body">({bag.length})</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {bag.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2 font-body">Your bag is empty</p>
                  <p className="text-sm text-gray-400 font-body">Add some products to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bag.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}-${index}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm mb-1 truncate font-body">{item.name}</h3>
                        <div className="text-xs text-gray-500 mb-2 font-body">
                          {item.size} / {item.color}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateBagQuantity(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-8 text-center font-body">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateBagQuantity(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromBag(item.id, item.size, item.color)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                        <div className="text-sm font-body">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Totals and Checkout */}
            {bag.length > 0 && (
              <div className="border-t p-6 space-y-4">
                {/* Totals */}
                <div className="space-y-2 text-sm font-body">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span>Total</span>
                    <span className="text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Banner */}
                {subtotal < 100 && (
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-center font-body">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}

                {/* Checkout Button */}
                <button className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors font-body">
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full border-2 border-gray-300 py-3 hover:bg-gray-50 transition-colors font-body"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
