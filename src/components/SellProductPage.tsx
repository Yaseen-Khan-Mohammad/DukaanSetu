import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCategory, Product } from '../types';
import { 
  Store, 
  Upload, 
  Calendar, 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';

const CATEGORIES: ProductCategory[] = [
  'Fruits & Vegetables',
  'Dairy Products',
  'Bakery Items',
  'Packaged Foods',
  'Beverages',
  'Household Essentials',
  'Others',
];

const PRESET_IMAGES = [
  { label: 'Fresh Milk & Dairy', url: '/src/assets/images/product_fresh_milk_dairy_1794418650564.jpg' },
  { label: 'Artisan Bakery Bread', url: '/src/assets/images/product_bakery_artisan_bread_1794418651293.jpg' },
  { label: 'Farm Fresh Fruits & Produce', url: '/src/assets/images/product_fresh_fruits_basket_1794418651708.jpg' },
  { label: 'Packaged Grocery & Grains', url: '/src/assets/images/product_packaged_grocery_1794418652852.jpg' },
  { label: 'Store General Merchandise', url: '/src/assets/images/hero_grocery_market_1794418650248.jpg' },
];

export const SellProductPage: React.FC = () => {
  const { currentUser, addProduct, setActiveView, showToast } = useMarketplace();

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Dairy Products');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [useCustomImage, setUseCustomImage] = useState(false);

  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [discountedPrice, setDiscountedPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('10');
  const [mfgDate, setMfgDate] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');

  const [shopName, setShopName] = useState(currentUser?.shopName || 'Shree Ganesh Daily Mart');
  const [shopAddress, setShopAddress] = useState(currentUser?.shopAddress || '12th Main Road, Indiranagar, Bengaluru');
  const [shopPhone, setShopPhone] = useState(currentUser?.phone || '+91 98450 67890');

  const [safetyCertified, setSafetyCertified] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Auto-calculate discount percentage
  const orig = parseFloat(originalPrice) || 0;
  const disc = parseFloat(discountedPrice) || 0;
  const calculatedDiscount = orig > 0 && disc > 0 && orig > disc ? Math.round(((orig - disc) / orig) * 100) : 0;

  // Minimum expiry date is tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minExpiryDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Validate required fields
    if (!name.trim()) {
      setFormError('Please provide the product name.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please write a brief description of the product.');
      return;
    }
    if (orig <= 0 || isNaN(orig)) {
      setFormError('Original price (MRP) must be greater than ₹0.');
      return;
    }
    if (disc <= 0 || isNaN(disc)) {
      setFormError('Selling price must be greater than ₹0.');
      return;
    }
    if (disc >= orig) {
      setFormError('DukaanSetu requires discounted clearance pricing. Selling price must be strictly lower than Original MRP.');
      return;
    }
    const qtyNum = parseInt(quantity, 10);
    if (qtyNum <= 0 || isNaN(qtyNum)) {
      setFormError('Available quantity must be at least 1 unit.');
      return;
    }
    if (!expiryDate) {
      setFormError('Please select the Expiry or Best-Before date.');
      return;
    }

    // 2. Validate expiry date (cannot be expired)
    const selectedExpiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedExpiry <= today) {
      setFormError('Expired products cannot be listed on DukaanSetu. The expiry date must be in the future.');
      return;
    }

    if (!shopName.trim() || !shopAddress.trim() || !shopPhone.trim()) {
      setFormError('Store name, address, and contact number are required.');
      return;
    }

    if (!safetyCertified) {
      setFormError('Please check the box confirming this product is safe, undamaged, and hygienic.');
      return;
    }

    // Choose final image URL
    const imageUrl = useCustomImage && customImageUrl.trim() ? customImageUrl.trim() : selectedImage;

    // Add product to store
    addProduct({
      name: name.trim(),
      category,
      description: description.trim(),
      imageUrl,
      originalPrice: Math.round(orig),
      discountedPrice: Math.round(disc),
      quantity: qtyNum,
      mfgDate: mfgDate || undefined,
      expiryDate,
      shopName: shopName.trim(),
      shopAddress: shopAddress.trim(),
      shopPhone: shopPhone.trim(),
      shopOwnerId: currentUser?.id,
      distanceKm: 0.8,
    });

    setPublishSuccess(true);
  };

  const handleResetForm = () => {
    setName('');
    setDescription('');
    setOriginalPrice('');
    setDiscountedPrice('');
    setQuantity('10');
    setMfgDate('');
    setExpiryDate('');
    setSafetyCertified(false);
    setPublishSuccess(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <button
          type="button"
          onClick={() => setActiveView('marketplace')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#B8556D] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        {/* Page Header */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8556D] uppercase tracking-wider">
                <Store className="w-4 h-4" />
                <span>Shop Owner Listing Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17212F] tracking-tight">
                List a Product on DukaanSetu
              </h1>
              <p className="text-sm text-stone-600 max-w-2xl">
                Recover capital from short-dated stock before expiry, reduce food waste, and reach thousands of nearby neighborhood customers.
              </p>
            </div>

            <div className="p-3 bg-[#FAF0F2] rounded-xl border border-[#F0D9DF] text-center shrink-0 w-full sm:w-auto">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Active Store
              </span>
              <span className="text-sm font-bold text-[#17212F]">{shopName}</span>
            </div>
          </div>
        </div>

        {/* Success Modal / Banner */}
        {publishSuccess ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#17212F]">Product Published Successfully!</h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Your listing <strong>"{name}"</strong> is now live on the DukaanSetu marketplace with <strong>{calculatedDiscount}% discount</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setActiveView('marketplace');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-2.5 bg-[#B8556D] hover:bg-[#A0445A] text-white text-sm font-semibold rounded-lg shadow-xs transition"
              >
                View in Marketplace
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold rounded-lg transition"
              >
                List Another Product
              </button>
            </div>
          </div>
        ) : (
          /* Product Listing Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Callout */}
            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-red-700">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
                <p className="font-medium">{formError}</p>
              </div>
            )}

            {/* 1. Basic Product Info */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
              <h3 className="text-base font-bold text-[#17212F] pb-2 border-b border-stone-100">
                1. Product Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amul Pure Cow Ghee (1 Litre)"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D] bg-white font-medium text-[#17212F]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe condition, packaging, flavor, and storage guidelines (e.g. Unopened carton, stored at 4°C, authentic batch)..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  required
                />
              </div>

              {/* Product Photo Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-2">
                  Product Image *
                </label>
                <p className="text-xs text-stone-500 mb-3">
                  Select a commercial product photograph matching your inventory, or enter an external image URL.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
                  {PRESET_IMAGES.map((img) => (
                    <div
                      key={img.url}
                      onClick={() => {
                        setSelectedImage(img.url);
                        setUseCustomImage(false);
                      }}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                        !useCustomImage && selectedImage === img.url
                          ? 'border-[#B8556D] ring-2 ring-[#B8556D]/30'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[10px] text-white text-center font-medium truncate">
                        {img.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="useCustomImg"
                    checked={useCustomImage}
                    onChange={(e) => setUseCustomImage(e.target.checked)}
                    className="accent-[#B8556D]"
                  />
                  <label htmlFor="useCustomImg" className="text-xs text-stone-700 font-medium cursor-pointer">
                    Use custom image URL or photo upload link
                  </label>
                </div>

                {useCustomImage && (
                  <div className="mt-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://example.com/product-photo.jpg"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 2. Pricing and Dates */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
              <h3 className="text-base font-bold text-[#17212F] pb-2 border-b border-stone-100">
                2. Pricing & Expiry Transparency
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                    Original Price (MRP) ₹ *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-stone-500 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="100"
                      className="w-full pl-8 pr-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                    Discounted Selling Price ₹ *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-stone-500 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={discountedPrice}
                      onChange={(e) => setDiscountedPrice(e.target.value)}
                      placeholder="60"
                      className="w-full pl-8 pr-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="10"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    required
                  />
                </div>
              </div>

              {/* Discount Preview Badge */}
              {calculatedDiscount > 0 ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-800">
                    Calculated Customer Discount: <strong>{calculatedDiscount}% OFF</strong>
                  </span>
                  <span className="text-emerald-700">
                    Customer saves ₹{Math.round(orig - disc)} per unit
                  </span>
                </div>
              ) : orig > 0 && disc >= orig ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  Notice: Selling price must be lower than original MRP to provide clearance value.
                </div>
              ) : null}

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                    Expiry / Best-Before Date *
                  </label>
                  <input
                    type="date"
                    min={minExpiryDate}
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    required
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Must be in the future. Expired items are strictly rejected.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                    Manufacturing Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={mfgDate}
                    onChange={(e) => setMfgDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Shop & Store Details */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-[#17212F] pb-2 border-b border-stone-100">
                3. Store & Pickup Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                    Shop / Store Name *
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                    Store Contact Phone *
                  </label>
                  <input
                    type="tel"
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                  Store Pickup Address *
                </label>
                <input
                  type="text"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  placeholder="Street address, Locality, City, PIN code"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  required
                />
              </div>

              {/* Quality & Safety Checkbox */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyCertified}
                    onChange={(e) => setSafetyCertified(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#B8556D] accent-[#B8556D]"
                    required
                  />
                  <span className="text-xs text-stone-700 leading-normal">
                    <strong>Merchant Quality & Safety Guarantee:</strong> I certify that this item is intact, sealed in its original manufacturer packaging, undamaged, hygienic, and safe for consumption up until its stated expiry date.
                  </span>
                </label>
              </div>
            </div>

            {/* Submission Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-stone-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Zero listing fees for local merchant demonstration.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveView('marketplace')}
                  className="w-1/2 sm:w-auto px-5 py-3 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 sm:w-auto px-7 py-3 text-xs font-semibold text-white bg-[#B8556D] hover:bg-[#A0445A] rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4" />
                  <span>Publish Product</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
