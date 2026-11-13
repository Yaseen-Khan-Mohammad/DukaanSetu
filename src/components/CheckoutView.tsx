import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { FulfillmentType, PaymentMethod } from '../types';
import { formatCurrency } from '../utils/dateUtils';
import {
  ArrowLeft,
  Store,
  Truck,
  Banknote,
  QrCode,
  MapPin,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    currentUser,
    cart,
    cartTotal,
    cartSavings,
    createOrder,
    setActiveView,
  } = useMarketplace();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+91 98450 12345');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.savedAddress || 'Flat 402, Shanti Niketan, 12th Main Road, Indiranagar, Bengaluru, 560038'
  );

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_pickup');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = fulfillmentType === 'delivery' ? 30 : 0;
  const finalTotal = cartTotal + deliveryFee;

  const primaryShopName = cart[0]?.product.shopName || 'Krishna Daily Needs & Dairy';
  const primaryShopPhone = cart[0]?.product.shopPhone || '+91 97312 88450';
  const primaryShopAddress = cart[0]?.product.shopAddress || '100 Feet Road, Indiranagar, Bengaluru';

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        fulfillmentType,
        deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress.trim() : undefined,
        paymentMethod,
        items: [...cart],
        subtotal: cartTotal,
        savings: cartSavings,
        deliveryFee,
        totalAmount: finalTotal,
        shopName: primaryShopName,
        shopPhone: primaryShopPhone,
      });

      setIsSubmitting(false);
      setActiveView('orders');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#FAFAFB] flex items-center justify-center py-12 px-4">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold text-[#17212F]">No items to checkout</h2>
          <button
            type="button"
            onClick={() => setActiveView('marketplace')}
            className="px-4 py-2 bg-[#B8556D] text-white text-xs font-semibold rounded-lg"
          >
            Go to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setActiveView('cart')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#B8556D] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping Basket</span>
        </button>

        <h1 className="text-2xl font-bold text-[#17212F] tracking-tight mb-6">
          Checkout & Confirmation
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-xs">
              <h2 className="text-sm font-bold text-[#17212F] uppercase tracking-wider">
                1. Select Fulfillment Mode
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFulfillmentType('pickup');
                    setPaymentMethod('cash_pickup');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    fulfillmentType === 'pickup'
                      ? 'border-[#B8556D] bg-[#FAF0F2]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Store className={`w-4 h-4 ${fulfillmentType === 'pickup' ? 'text-[#B8556D]' : 'text-stone-500'}`} />
                    <span className="text-xs font-bold text-[#17212F]">Store Self-Pickup</span>
                  </div>
                  <div className="text-[11px] text-stone-600">
                    Collect directly from merchant counter. <strong className="text-emerald-700">FREE</strong>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFulfillmentType('delivery');
                    setPaymentMethod('cash_delivery');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    fulfillmentType === 'delivery'
                      ? 'border-[#B8556D] bg-[#FAF0F2]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className={`w-4 h-4 ${fulfillmentType === 'delivery' ? 'text-[#B8556D]' : 'text-stone-500'}`} />
                    <span className="text-xs font-bold text-[#17212F]">Neighborhood Delivery</span>
                  </div>
                  <div className="text-[11px] text-stone-600">
                    Store runner drops to doorstep in 2 hrs. (₹30)
                  </div>
                </button>
              </div>

              {fulfillmentType === 'pickup' && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
                  <div className="font-semibold text-[#17212F] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span>Pickup Location: {primaryShopName}</span>
                  </div>
                  <p className="text-stone-600 pl-5">{primaryShopAddress}</p>
                  <div className="pl-5 text-stone-500 flex items-center gap-3 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" /> Ready in 2 hours
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-stone-400" /> {primaryShopPhone}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-[#17212F] uppercase tracking-wider">
                2. Contact & Delivery Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17212F] mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17212F] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17212F] mb-1">
                  Email Address (for order receipt)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                />
              </div>

              {fulfillmentType === 'delivery' && (
                <div>
                  <label className="block text-xs font-semibold text-[#17212F] mb-1">
                    Delivery Address & Locality *
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-xs">
              <h2 className="text-sm font-bold text-[#17212F] uppercase tracking-wider">
                3. Payment Selection
              </h2>
              <p className="text-xs text-stone-500">
                Safe local transaction. Zero card convenience charges.
              </p>

              <div className="space-y-2">
                {fulfillmentType === 'pickup' ? (
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-[#B8556D] bg-[#FAF0F2] cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cash_pickup'}
                      onChange={() => setPaymentMethod('cash_pickup')}
                      className="accent-[#B8556D]"
                    />
                    <Banknote className="w-4 h-4 text-[#B8556D]" />
                    <div className="text-xs">
                      <span className="font-bold text-[#17212F] block">Pay at Store Counter (Cash / UPI)</span>
                      <span className="text-stone-600">Inspect goods at store before making payment.</span>
                    </div>
                  </label>
                ) : (
                  <>
                    <label
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                        paymentMethod === 'cash_delivery'
                          ? 'border-[#B8556D] bg-[#FAF0F2]'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cash_delivery'}
                        onChange={() => setPaymentMethod('cash_delivery')}
                        className="accent-[#B8556D]"
                      />
                      <Banknote className="w-4 h-4 text-stone-600" />
                      <div className="text-xs">
                        <span className="font-bold text-[#17212F] block">Cash on Delivery (COD)</span>
                        <span className="text-stone-600">Pay cash upon delivery.</span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                        paymentMethod === 'upi_delivery'
                          ? 'border-[#B8556D] bg-[#FAF0F2]'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi_delivery'}
                        onChange={() => setPaymentMethod('upi_delivery')}
                        className="accent-[#B8556D]"
                      />
                      <QrCode className="w-4 h-4 text-[#B8556D]" />
                      <div className="text-xs">
                        <span className="font-bold text-[#17212F] block">UPI on Delivery (GPay / PhonePe / Paytm)</span>
                        <span className="text-stone-600">Scan merchant QR code when order arrives.</span>
                      </div>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-white rounded-xl border border-stone-200 p-6 space-y-5 shadow-xs sticky top-24">
            <h2 className="text-sm font-bold text-[#17212F] uppercase tracking-wider pb-2 border-b border-stone-100">
              Order Items ({cart.length})
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="truncate">
                    <p className="font-bold text-[#17212F] truncate">{product.name}</p>
                    <span className="text-stone-500 font-mono">
                      {quantity} × {formatCurrency(product.discountedPrice)}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#17212F] shrink-0">
                    {formatCurrency(product.discountedPrice * quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-mono">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Fulfillment ({fulfillmentType === 'pickup' ? 'Store Pickup' : 'Delivery'})</span>
                <span className="font-mono font-semibold text-emerald-700">
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 p-2 rounded">
                <span>Total Discount Saved</span>
                <span className="font-mono">-{formatCurrency(cartSavings)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-xs font-bold text-[#17212F]">Total Payable</span>
              <span className="text-2xl font-black text-[#17212F] font-mono tabular-nums">
                {formatCurrency(finalTotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#B8556D] hover:bg-[#A0445A] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Order</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Direct connection to verified local merchant.</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
