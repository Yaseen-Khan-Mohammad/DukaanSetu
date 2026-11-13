import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatCurrency, formatExpiryDisplay } from '../utils/dateUtils';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Store,
  Clock,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartSavings,
    setActiveView,
  } = useMarketplace();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAFAFB] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF0F2] text-[#B8556D] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#17212F]">Your Basket is Empty</h2>
          <p className="text-xs text-stone-600">
            You haven't added any discounted clearance items yet. Discover fresh short-dated goods from local stores.
          </p>
          <button
            type="button"
            onClick={() => setActiveView('marketplace')}
            className="w-full py-3 px-4 bg-[#B8556D] hover:bg-[#A0445A] text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            Explore Neighborhood Deals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setActiveView('marketplace')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#B8556D] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#17212F] tracking-tight">Shopping Basket</h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline font-medium"
          >
            Clear Entire Basket
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-3">
            {cart.map(({ product, quantity }) => {
              const expiryInfo = formatExpiryDisplay(product.expiryDate);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/src/assets/images/product_packaged_grocery_1794550482310.jpg';
                      }}
                    />

                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-[#B8556D] uppercase tracking-wider block">
                        {product.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#17212F]">{product.name}</h3>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <Store className="w-3 h-3 text-stone-400" />
                          <span>{product.shopName}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-amber-800">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{expiryInfo.text}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1.5 text-stone-600 hover:bg-stone-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#17212F] font-mono min-w-[28px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.quantity}
                        className="p-1.5 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-[#17212F] font-mono tabular-nums">
                        {formatCurrency(product.discountedPrice * quantity)}
                      </div>
                      <div className="text-[11px] text-stone-400 line-through font-mono">
                        {formatCurrency(product.originalPrice * quantity)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 p-6 space-y-5 shadow-xs sticky top-24">
            <h2 className="text-base font-bold text-[#17212F] pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal (Items)</span>
                <span className="font-mono font-medium text-[#17212F]">{formatCurrency(cartTotal)}</span>
              </div>

              <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <span>Your Total Savings</span>
                <span className="font-mono">-{formatCurrency(cartSavings)}</span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Store Self-Pickup</span>
                <span className="font-semibold text-emerald-700">FREE</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <div>
                <span className="text-xs font-semibold text-[#17212F] block">Total Amount</span>
                <span className="text-[10px] text-stone-500">Includes all taxes</span>
              </div>
              <span className="text-2xl font-black text-[#17212F] font-mono tabular-nums">
                {formatCurrency(cartTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveView('checkout');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 px-4 bg-[#B8556D] hover:bg-[#A0445A] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-3 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Pay at counter or cash on delivery.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
