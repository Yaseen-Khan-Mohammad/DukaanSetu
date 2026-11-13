import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatCurrency, formatExpiryDisplay } from '../utils/dateUtils';
import {
  X,
  ShoppingBag,
  Zap,
  MapPin,
  Store,
  Phone,
  ShieldCheck,
  Clock,
  Plus,
  Minus,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setActiveView } = useMarketplace();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const expiryInfo = formatExpiryDisplay(selectedProduct.expiryDate);
  const isSoldOut = selectedProduct.quantity === 0 || selectedProduct.status === 'sold_out';

  const handleAddToCart = () => {
    addToCart(selectedProduct, qty);
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, qty);
    setSelectedProduct(null);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={() => setSelectedProduct(null)}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
            <span>{selectedProduct.category}</span>
            <span>·</span>
            <span className="text-[#B8556D]">{selectedProduct.discountPercent}% Discounted Clearance</span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedProduct(null)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
          <div className="md:col-span-5 space-y-3">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 relative">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/src/assets/images/product_packaged_grocery_1794550482310.jpg';
                }}
              />
              <div className="absolute top-3 left-3 bg-[#B8556D] text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                {selectedProduct.discountPercent}% OFF
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#17212F]">
                <Store className="w-4 h-4 text-[#B8556D]" />
                <span>{selectedProduct.shopName}</span>
              </div>
              <div className="flex items-start gap-2 text-stone-600">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>{selectedProduct.shopAddress} ({selectedProduct.distanceKm} km away)</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="font-mono">{selectedProduct.shopPhone}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#17212F] tracking-tight">
                  {selectedProduct.name}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Product ID: <span className="font-mono">{selectedProduct.id}</span>
                </p>
              </div>

              <div className="p-4 bg-[#FAF0F2] rounded-xl border border-[#F0D9DF] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Discounted Price
                  </div>
                  <div className="flex items-baseline gap-2.5 mt-0.5">
                    <span className="text-2xl font-black text-[#17212F] font-mono tabular-nums">
                      {formatCurrency(selectedProduct.discountedPrice)}
                    </span>
                    <span className="text-sm text-stone-400 line-through font-mono tabular-nums">
                      {formatCurrency(selectedProduct.originalPrice)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                    You save {formatCurrency(selectedProduct.originalPrice - selectedProduct.discountedPrice)}
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-1">Taxes included</span>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Expiry & Shelf-Life Notice</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  This product is approaching its best-before date (<strong>{expiryInfo.formattedDate}</strong> · {expiryInfo.text}). It has been verified for quality, safety, and intact packaging by the local merchant.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#17212F] uppercase tracking-wider mb-1">
                  Description
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-500 block">Availability</span>
                  <span className={`text-xs font-bold ${isSoldOut ? 'text-red-600' : 'text-emerald-700'}`}>
                    {isSoldOut ? 'Out of Stock' : `${selectedProduct.quantity} units available in store`}
                  </span>
                </div>

                {!isSoldOut && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-600 font-medium">Quantity:</span>
                    <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                        disabled={qty <= 1}
                        className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-[#17212F] font-mono min-w-[32px] text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty((prev) => Math.min(selectedProduct.quantity, prev + 1))}
                        disabled={qty >= selectedProduct.quantity}
                        className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isSoldOut}
                onClick={handleAddToCart}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold border-2 border-[#B8556D] text-[#B8556D] hover:bg-[#FAF0F2] transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                disabled={isSoldOut}
                onClick={handleBuyNow}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#B8556D] hover:bg-[#A0445A] text-white shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>DukaanSetu Zero-Waste Guarantee: Freshness and seal verified.</span>
          </div>
          <span className="hidden sm:inline">Store pickup in 2 hours</span>
        </div>
      </div>
    </div>
  );
};
