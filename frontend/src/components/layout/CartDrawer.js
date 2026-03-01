import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

export const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { t, language } = useLanguage();

  const formatPrice = (price) => {
    return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            data-testid="cart-backdrop"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-mono-cream border-l border-mono-border z-50 flex flex-col"
            data-testid="cart-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-mono-border">
              <h2 className="font-serif text-2xl italic text-mono-primary">{t('cart.title')}</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                data-testid="close-cart-btn"
                className="p-2 text-mono-secondary hover:text-mono-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-mono-secondary/30 mb-4" />
                  <p className="font-sans text-mono-secondary mb-6">{t('cart.empty')}</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="font-sans text-sm uppercase tracking-widest text-mono-accent underline underline-offset-4 hover:text-mono-primary transition-colors"
                  >
                    {t('cart.continueShopping')}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.product.id}-${item.variantId}`}
                      className="flex gap-4 pb-6 border-b border-mono-border"
                      data-testid={`cart-item-${item.product.id}`}
                    >
                      {/* Image */}
                      <div className="w-24 h-24 bg-mono-surface rounded overflow-hidden flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0].src}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-mono-surface-dark" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-mono-primary">
                          {language === 'tr' && item.product.title_tr
                            ? item.product.title_tr
                            : item.product.title}
                        </h3>
                        <p className="font-sans text-sm text-mono-accent mt-1">
                          {formatPrice(item.product.price)}
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.variantId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-mono-border rounded hover:border-mono-accent transition-colors"
                            data-testid={`decrease-qty-${item.product.id}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-sans text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.variantId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-mono-border rounded hover:border-mono-accent transition-colors"
                            data-testid={`increase-qty-${item.product.id}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.variantId)}
                        className="text-mono-secondary hover:text-mono-error transition-colors"
                        data-testid={`remove-item-${item.product.id}`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-mono-border">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-sans text-sm uppercase tracking-widest text-mono-secondary">
                    {t('cart.subtotal')}
                  </span>
                  <span className="font-serif text-2xl text-mono-primary">{formatPrice(cartTotal)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  data-testid="checkout-btn"
                  className="block w-full py-4 text-center font-sans text-sm uppercase tracking-widest bg-mono-accent text-mono-cream hover:bg-mono-highlight transition-colors rounded-full"
                >
                  {t('cart.checkout')}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
