import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatCurrency } from '../utils/dateUtils';
import { CheckCircle, Store, Phone, MapPin, X, ArrowRight, PackageCheck } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, setActiveView } = useMarketplace();

  if (!lastPlacedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-3 pb-4 border-b border-stone-100">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17212F]">Order Confirmed!</h2>
          <p className="text-xs text-stone-600">
            Thank you, <strong>{lastPlacedOrder.customerName}</strong>. Your order is registered with the merchant.
          </p>
          <div className="inline-block px-3 py-1 bg-stone-100 rounded text-xs font-mono font-bold text-[#17212F]">
            Order #{lastPlacedOrder.orderNumber}
          </div>
        </div>

        <div className="py-4 space-y-3 text-xs">
          <div className="p-3 bg-[#FAF0F2] rounded-xl border border-[#F0D9DF] space-y-1">
            <div className="font-bold text-[#17212F] flex items-center gap-1.5">
              <Store className="w-4 h-4 text-[#B8556D]" />
              <span>{lastPlacedOrder.shopName}</span>
            </div>
            <div className="text-stone-600 flex items-center gap-1.5 pl-5">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>Merchant Phone: {lastPlacedOrder.shopPhone}</span>
            </div>
            <p className="text-stone-500 pl-5 text-[11px]">
              {lastPlacedOrder.fulfillmentType === 'pickup'
                ? 'Ready for counter collection in approx 2 hours. Pay at store counter.'
                : 'Direct neighborhood delivery dispatched to your address.'}
            </p>
          </div>

          <div className="flex justify-between items-center py-2 px-1 text-stone-700">
            <span>Total Amount:</span>
            <span className="font-mono font-bold text-base text-[#17212F]">
              {formatCurrency(lastPlacedOrder.totalAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 px-3 bg-emerald-50 rounded text-emerald-800 font-semibold text-xs">
            <span>You Saved:</span>
            <span className="font-mono">
              {formatCurrency(lastPlacedOrder.savings)}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => {
              setLastPlacedOrder(null);
              setActiveView('orders');
            }}
            className="flex-1 py-3 px-4 bg-[#B8556D] hover:bg-[#A0445A] text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-2"
          >
            <PackageCheck className="w-4 h-4" />
            <span>View in My Orders</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLastPlacedOrder(null);
              setActiveView('marketplace');
            }}
            className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
