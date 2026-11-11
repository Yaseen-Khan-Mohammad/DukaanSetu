import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShoppingBag, User, Store, LogOut, ChevronDown, PackageCheck, PlusCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    cartCount,
    signOut,
    quickSwitchUser,
    setFilters,
  } = useMarketplace();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNavClick = (view: 'marketplace' | 'sell' | 'orders' | 'profile' | 'cart') => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoriesClick = () => {
    setActiveView('marketplace');
    setTimeout(() => {
      const el = document.getElementById('categories-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleExploreDealsClick = () => {
    setActiveView('marketplace');
    setFilters((prev) => ({ ...prev, category: 'All', searchQuery: '', minDiscount: 0 }));
    setTimeout(() => {
      const el = document.getElementById('products-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      {/* Top Trust & Value Micro-strip */}
      <div className="bg-[#FAF0F2] border-b border-[#F0D9DF] text-[11px] text-[#17212F] py-1 px-4 text-center font-medium">
        <span className="hidden sm:inline">🌱 Save food from waste & save up to 60% on neighborhood grocery essentials. </span>
        <span className="text-[#B8556D] font-semibold">100% Quality Inspected. Free pickup in 2 hours.</span>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('marketplace')}
          className="flex items-center gap-2.5 text-left focus:outline-none shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-[#17212F] flex items-center justify-center text-white font-bold text-base shadow-sm">
            DS
          </div>
          <span className="text-xl font-bold tracking-tight text-[#17212F] whitespace-nowrap">
            Dukaan<span className="text-[#B8556D]">Setu</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
          <button
            type="button"
            onClick={() => handleNavClick('marketplace')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'marketplace'
                ? 'text-[#B8556D] font-semibold border-b-2 border-[#B8556D]'
                : 'hover:text-[#17212F]'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={handleExploreDealsClick}
            className="hover:text-[#17212F] transition-colors whitespace-nowrap py-1"
          >
            Explore Products
          </button>
          <button
            type="button"
            onClick={handleCategoriesClick}
            className="hover:text-[#17212F] transition-colors whitespace-nowrap py-1"
          >
            Categories
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('sell')}
            className={`transition-colors whitespace-nowrap py-1 flex items-center gap-1.5 ${
              activeView === 'sell'
                ? 'text-[#B8556D] font-semibold border-b-2 border-[#B8556D]'
                : 'text-stone-800 hover:text-[#B8556D]'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-[#B8556D]" />
            <span>Sell a Product</span>
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('orders')}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeView === 'orders'
                ? 'text-[#B8556D] font-semibold border-b-2 border-[#B8556D]'
                : 'hover:text-[#17212F]'
            }`}
          >
            My Orders
          </button>
        </nav>

        {/* Zone 3: Actions (Cart & User Profile) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sell Button Highlight for mobile & quick access */}
          <button
            type="button"
            onClick={() => handleNavClick('sell')}
            className="hidden sm:inline-flex md:hidden items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#B8556D] bg-[#FAF0F2] rounded-lg border border-[#F0D9DF]"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Sell</span>
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => handleNavClick('cart')}
            className="relative p-2 rounded-lg text-stone-700 hover:bg-stone-100 hover:text-[#17212F] transition-colors flex items-center justify-center"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#17212F]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#B8556D] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition"
              aria-label="User Account Menu"
            >
              <div className="w-7 h-7 rounded-full bg-[#17212F] text-white flex items-center justify-center text-xs font-bold">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <span className="text-xs font-medium text-[#17212F] hidden lg:inline max-w-[110px] truncate">
                {currentUser?.name || 'Account'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-stone-100">
                  <p className="text-xs font-bold text-[#17212F] truncate">{currentUser?.name || 'Guest User'}</p>
                  <p className="text-[11px] text-stone-500 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-[#B8556D] bg-[#FAF0F2] px-2 py-0.5 rounded">
                    {currentUser?.role === 'shop_owner'
                      ? '🏪 Shop Owner'
                      : currentUser?.role === 'business_buyer'
                      ? '🏢 Business Buyer'
                      : '🛒 Individual Customer'}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => handleNavClick('profile')}
                    className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2.5"
                  >
                    <User className="w-4 h-4 text-stone-500" />
                    <span>My Profile & Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('orders')}
                    className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2.5"
                  >
                    <PackageCheck className="w-4 h-4 text-stone-500" />
                    <span>My Orders</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick('sell')}
                    className="w-full text-left px-4 py-2 text-xs text-[#B8556D] hover:bg-[#FAF0F2] font-medium flex items-center gap-2.5"
                  >
                    <Store className="w-4 h-4 text-[#B8556D]" />
                    <span>Sell a Product / Manage Listings</span>
                  </button>
                </div>

                {/* Switch Demo Role Helper */}
                <div className="border-t border-stone-100 pt-1.5 px-3 pb-1">
                  <p className="text-[10px] text-stone-500 font-semibold mb-1 uppercase tracking-wider">
                    Quick Role Switch
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        quickSwitchUser('user_cust_1');
                        setProfileDropdownOpen(false);
                      }}
                      className="text-[10px] py-1 px-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-center"
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        quickSwitchUser('user_shop_1');
                        setProfileDropdownOpen(false);
                      }}
                      className="text-[10px] py-1 px-1 rounded bg-[#FAF0F2] text-[#B8556D] hover:bg-[#F0D9DF] font-semibold text-center"
                    >
                      Shop Owner
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        quickSwitchUser('user_biz_1');
                        setProfileDropdownOpen(false);
                      }}
                      className="text-[10px] py-1 px-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-center"
                    >
                      Business
                    </button>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-1">
                  <button
                    type="button"
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
