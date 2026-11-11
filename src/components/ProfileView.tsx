import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatCurrency, formatExpiryDisplay } from '../utils/dateUtils';
import { Product, UserRole } from '../types';
import { 
  User, 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  LogOut, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  Save, 
  X,
  PackageCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    products, 
    updateProduct, 
    deleteProduct, 
    setActiveView, 
    signOut,
    showToast,
    quickSwitchUser
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'info' | 'listings'>('info');

  // Edit Profile modal/state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [role, setRole] = useState<UserRole>(currentUser?.role || 'individual');
  const [shopName, setShopName] = useState(currentUser?.shopName || '');
  const [shopAddress, setShopAddress] = useState(currentUser?.shopAddress || '');
  const [savedAddress, setSavedAddress] = useState(currentUser?.savedAddress || '');

  // Edit Product Listing state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // Shop Owner's listings: all products matching their shopOwnerId or all if owner
  const myListings = products.filter(
    (p) => (currentUser?.id && p.shopOwnerId === currentUser.id) || (currentUser?.role === 'shop_owner' && p.shopName.includes(currentUser.shopName || 'Krishna'))
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      name,
      email,
      phone,
      role,
      shopName: role === 'shop_owner' ? shopName : undefined,
      shopAddress: role === 'shop_owner' ? shopAddress : undefined,
      savedAddress,
    };

    setCurrentUser(updatedUser);
    setIsEditingProfile(false);
    showToast('Profile information updated successfully');
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setEditPrice(prod.discountedPrice);
    setEditStock(prod.quantity);
  };

  const handleSaveProductEdit = (productId: string) => {
    updateProduct(productId, {
      discountedPrice: editPrice,
      quantity: editStock,
    });
    setEditingProductId(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#17212F] text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#17212F]">
                    {currentUser?.name || 'Account Settings'}
                  </h1>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#FAF0F2] text-[#B8556D]">
                    {currentUser?.role === 'shop_owner'
                      ? 'Shop Owner'
                      : currentUser?.role === 'business_buyer'
                      ? 'Business Buyer'
                      : 'Individual Customer'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono">{currentUser?.email}</p>
                {currentUser?.shopName && (
                  <p className="text-xs text-stone-700 font-medium flex items-center gap-1.5 pt-0.5">
                    <Store className="w-3.5 h-3.5 text-[#B8556D]" />
                    <span>Store: {currentUser.shopName}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={signOut}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Switcher helper */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-stone-500 font-medium">Test app with different account personas:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => quickSwitchUser('user_cust_1')}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-medium"
              >
                Priya (Customer)
              </button>
              <button
                type="button"
                onClick={() => quickSwitchUser('user_shop_1')}
                className="px-2.5 py-1 bg-[#FAF0F2] text-[#B8556D] hover:bg-[#F0D9DF] rounded font-semibold"
              >
                Ramesh (Shop Owner)
              </button>
              <button
                type="button"
                onClick={() => quickSwitchUser('user_biz_1')}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-medium"
              >
                Vikram (Business Buyer)
              </button>
            </div>
          </div>
        </div>

        {/* Tabs: Account Details vs My Store Listings */}
        <div className="flex border-b border-stone-200 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`pb-3 text-sm font-semibold transition border-b-2 ${
              activeTab === 'info'
                ? 'border-[#B8556D] text-[#B8556D]'
                : 'border-transparent text-stone-600 hover:text-[#17212F]'
            }`}
          >
            Account Details
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className={`pb-3 text-sm font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'listings'
                ? 'border-[#B8556D] text-[#B8556D]'
                : 'border-transparent text-stone-600 hover:text-[#17212F]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>My Store Listings ({myListings.length})</span>
          </button>
        </div>

        {/* Tab 1: Account Details */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-[#17212F] uppercase tracking-wider pb-2 border-b border-stone-100">
                Contact Information
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-stone-700">
                  <Mail className="w-4 h-4 text-stone-400" />
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Email</span>
                    <span className="font-medium text-[#17212F]">{currentUser?.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-stone-700">
                  <Phone className="w-4 h-4 text-stone-400" />
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Phone</span>
                    <span className="font-medium text-[#17212F]">{currentUser?.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-stone-700">
                  <Briefcase className="w-4 h-4 text-stone-400" />
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Account Type</span>
                    <span className="font-medium capitalize text-[#17212F]">
                      {currentUser?.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-[#17212F] uppercase tracking-wider pb-2 border-b border-stone-100">
                Addresses & Delivery
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 text-stone-700">
                  <MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Saved Address</span>
                    <span className="font-medium text-[#17212F]">
                      {currentUser?.savedAddress || 'Indiranagar, Bengaluru, 560038'}
                    </span>
                  </div>
                </div>

                {currentUser?.shopAddress && (
                  <div className="flex items-start gap-3 text-stone-700 pt-2 border-t border-stone-100">
                    <Store className="w-4 h-4 text-[#B8556D] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">Store Pickup Location</span>
                      <span className="font-medium text-[#17212F]">{currentUser.shopAddress}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Listings (Manage, Edit, Remove Products) */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#17212F]">Active Clearance Inventory</h2>
                <p className="text-xs text-stone-500">
                  Manage discounted pricing and update remaining quantities for your listed stock
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveView('sell')}
                className="px-4 py-2 bg-[#B8556D] hover:bg-[#A0445A] text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List New Product</span>
              </button>
            </div>

            {myListings.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-8 text-center space-y-3 shadow-xs">
                <Store className="w-10 h-10 text-stone-400 mx-auto" />
                <p className="text-sm font-semibold text-[#17212F]">No products currently listed</p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Start posting short-dated items to clear stock quickly and connect with nearby shoppers.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveView('sell')}
                  className="px-4 py-2 bg-[#B8556D] text-white text-xs font-semibold rounded-lg"
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase">
                      <tr>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Original MRP</th>
                        <th className="py-3 px-4">Discounted Price</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Expiry Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {myListings.map((prod) => {
                        const expiry = formatExpiryDisplay(prod.expiryDate);
                        const isEditingThis = editingProductId === prod.id;

                        return (
                          <tr key={prod.id} className="hover:bg-stone-50/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="w-10 h-10 rounded object-cover border border-stone-200 shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <p className="font-bold text-[#17212F] line-clamp-1">{prod.name}</p>
                                  <span className="text-[11px] text-stone-400">{prod.category}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4 font-mono font-medium text-stone-500">
                              {formatCurrency(prod.originalPrice)}
                            </td>

                            <td className="py-3 px-4 font-mono font-bold text-[#17212F]">
                              {isEditingThis ? (
                                <input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(Number(e.target.value))}
                                  className="w-20 px-2 py-1 text-xs border border-stone-300 rounded font-mono"
                                />
                              ) : (
                                <span>{formatCurrency(prod.discountedPrice)}</span>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              {isEditingThis ? (
                                <input
                                  type="number"
                                  value={editStock}
                                  onChange={(e) => setEditStock(Number(e.target.value))}
                                  className="w-16 px-2 py-1 text-xs border border-stone-300 rounded font-mono"
                                />
                              ) : (
                                <span className={prod.quantity === 0 ? 'text-red-600 font-bold' : 'text-stone-700'}>
                                  {prod.quantity} units
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-stone-600">
                              <span className="block font-medium">{expiry.formattedDate}</span>
                              <span className="text-[10px] text-amber-800">{expiry.text}</span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              {isEditingThis ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveProductEdit(prod.id)}
                                    className="p-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded"
                                    title="Save"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingProductId(null)}
                                    className="p-1.5 bg-stone-100 text-stone-600 hover:bg-stone-200 rounded"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditProduct(prod)}
                                    className="p-1.5 text-stone-600 hover:text-[#17212F] hover:bg-stone-100 rounded"
                                    title="Edit price/stock"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteProduct(prod.id)}
                                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    title="Remove listing"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="text-base font-bold text-[#17212F]">Edit Profile</h3>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-[#17212F] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-sm rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#B8556D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17212F] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-sm rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#B8556D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17212F] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-sm rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#B8556D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17212F] mb-1">Account Type</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-1.5 text-sm rounded border border-stone-300 bg-white"
                  >
                    <option value="individual">Individual Customer</option>
                    <option value="shop_owner">Shop Owner</option>
                    <option value="business_buyer">Business Buyer</option>
                  </select>
                </div>

                {role === 'shop_owner' && (
                  <>
                    <div>
                      <label className="block font-semibold text-[#17212F] mb-1">Shop / Store Name</label>
                      <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#17212F] mb-1">Shop Address</label>
                      <input
                        type="text"
                        value={shopAddress}
                        onChange={(e) => setShopAddress(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm rounded border border-stone-300"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-semibold text-[#17212F] mb-1">Saved Address</label>
                  <textarea
                    rows={2}
                    value={savedAddress}
                    onChange={(e) => setSavedAddress(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm rounded border border-stone-300"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 py-2 text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-white bg-[#B8556D] rounded-lg hover:bg-[#A0445A] font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
