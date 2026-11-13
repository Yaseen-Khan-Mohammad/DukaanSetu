import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatCurrency } from '../utils/dateUtils';
import { resolveImageUrl } from '../assets/imageAssets';
import {
  PackageCheck,
  Store,
  Phone,
  ArrowLeft,
  ShoppingBag,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { orders, products, setActiveView, addToCart, updateOrderStatus, showToast } = useMarketplace();

  const handleReorder = (items: typeof orders[number]['items']) => {
    let addedAny = false;
    items.forEach((item) => {
      const liveProduct = products.find((p) => p.id === item.product.id);
      if (liveProduct && liveProduct.quantity > 0) {
        addToCart(liveProduct, 1);
        addedAny = true;
      }
    });
    if (addedAny) {
      setActiveView('cart');
    } else {
      showToast('None of those items are currently in stock', 'warning');
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAFAFB] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#17212F]">No Orders Yet</h2>
          <p className="text-xs text-stone-600">
            You haven't placed any orders on DukaanSetu yet. Browse neighborhood deals and rescue items before expiry!
          </p>
          <button
            type="button"
            onClick={() => setActiveView('marketplace')}
            className="w-full py-3 px-4 bg-[#B8556D] hover:bg-[#A0445A] text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            Explore Clearance Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setActiveView('marketplace')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#B8556D] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#17212F] tracking-tight">My Orders & Receipts</h1>
            <p className="text-xs text-stone-500 mt-1">
              Track active store pickups and review past order savings
            </p>
          </div>

          <span className="text-xs font-semibold text-[#17212F] bg-white px-3 py-1.5 rounded-lg border border-stone-200">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Placed
          </span>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition"
              >
                <div className="bg-stone-50/70 p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#17212F] font-mono">{order.orderNumber}</span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-500">{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Ready for Pickup'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>

                    <span className="text-stone-500">
                      Total: <strong className="text-[#17212F] font-mono">{formatCurrency(order.totalAmount)}</strong>
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-stone-100 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                        Fulfillment Partner
                      </span>
                      <div className="flex items-center gap-2 font-bold text-[#17212F]">
                        <Store className="w-4 h-4 text-[#B8556D]" />
                        <span>{order.shopName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-600">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-mono">{order.shopPhone}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                        Delivery / Pickup Details
                      </span>
                      <div className="flex items-center gap-2 font-semibold text-[#17212F]">
                        {order.fulfillmentType === 'pickup' ? (
                          <>
                            <Store className="w-4 h-4 text-emerald-700" />
                            <span>Store Self-Pickup (Counter Collection)</span>
                          </>
                        ) : (
                          <>
                            <Truck className="w-4 h-4 text-blue-700" />
                            <span>Doorstep Delivery: {order.deliveryAddress || 'Address on file'}</span>
                          </>
                        )}
                      </div>
                      <span className="text-stone-500 block">
                        Payment: {order.paymentMethod === 'cash_pickup' ? 'Pay at Store Counter' : order.paymentMethod === 'cash_delivery' ? 'Cash on Delivery' : 'UPI on Delivery'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                      Ordered Products
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.items.map(({ product, quantity }) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-stone-50 border border-stone-100 text-xs"
                        >
                          <img
                            src={resolveImageUrl(product.imageUrl)}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover bg-white shrink-0 border border-stone-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="truncate flex-1">
                            <p className="font-semibold text-[#17212F] truncate">{product.name}</p>
                            <span className="text-stone-500 font-mono text-[11px]">
                              Qty: {quantity} · {formatCurrency(product.discountedPrice * quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-stone-100">
                    <span className="text-emerald-700 font-semibold">
                      You saved {formatCurrency(order.savings)} on this purchase through DukaanSetu.
                    </span>

                    <div className="flex items-center gap-4">
                      {order.status !== 'Delivered' && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                          className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Collected / Delivered</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleReorder(order.items)}
                        className="text-xs font-semibold text-[#B8556D] hover:underline flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Re-order Items</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
