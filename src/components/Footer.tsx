import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Store, ShieldCheck, HeartHandshake, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setFilters } = useMarketplace();

  const handleNav = (view: 'marketplace' | 'sell' | 'orders' | 'profile') => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategory = (category: string) => {
    setActiveView('marketplace');
    setFilters((prev) => ({ ...prev, category }));
    setTimeout(() => {
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <footer className="bg-[#17212F] text-stone-300 text-xs border-t border-stone-800">
      <div className="border-b border-stone-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-stone-800 text-[#B8556D] shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Empowering Local Dukandars</h4>
              <p className="text-stone-400 mt-0.5 leading-relaxed">
                Helping neighborhood provision stores, bakeries, and dairies recover inventory capital before expiry.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-stone-800 text-emerald-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Affordable Quality for All</h4>
              <p className="text-stone-400 mt-0.5 leading-relaxed">
                Save 30% to 60% on everyday branded pantry essentials, fresh dairy, and artisan bakery goods.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-stone-800 text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Strict Quality & Safety Checks</h4>
              <p className="text-stone-400 mt-0.5 leading-relaxed">
                Full transparency on best-before dates. 100% sealed manufacturer packaging inspected prior to listing.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-[#17212F] flex items-center justify-center font-bold text-sm">
              DS
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Dukaan<span className="text-[#B8556D]">Setu</span>
            </span>
          </div>

          <p className="text-stone-400 text-xs leading-relaxed">
            DukaanSetu is India's hyperlocal marketplace connecting neighborhood shop owners with smart individual consumers and commercial food buyers. We bridge inventory waste and value recovery.
          </p>

          <div className="pt-2 space-y-1.5 text-[11px] text-stone-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Bengaluru · Mumbai · Delhi NCR · Hyderabad</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-stone-500" />
              <span>support@dukaansetu.in</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={() => handleNav('marketplace')}
                className="hover:text-white transition"
              >
                Marketplace Home
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('sell')}
                className="hover:text-[#B8556D] transition font-medium text-[#B8556D]"
              >
                Sell a Product
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('orders')}
                className="hover:text-white transition"
              >
                My Orders & Receipts
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('profile')}
                className="hover:text-white transition"
              >
                Merchant & Buyer Profile
              </button>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Top Categories</h4>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={() => handleCategory('Dairy Products')}
                className="hover:text-white transition"
              >
                Dairy Products (Milk, Curd, Butter)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleCategory('Bakery Items')}
                className="hover:text-white transition"
              >
                Bakery Items (Breads, Baguettes, Cakes)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleCategory('Fruits & Vegetables')}
                className="hover:text-white transition"
              >
                Fruits & Vegetables
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleCategory('Packaged Foods')}
                className="hover:text-white transition"
              >
                Packaged Foods & Grains
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleCategory('Beverages')}
                className="hover:text-white transition"
              >
                Beverages & Juices
              </button>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">For Store Owners</h4>
          <p className="text-stone-400 text-xs">
            Have excess inventory or items nearing expiry? Turn unsold inventory into immediate cash flow.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => handleNav('sell')}
              className="px-4 py-2 bg-[#B8556D] hover:bg-[#A0445A] text-white font-semibold rounded-lg text-xs transition"
            >
              List Store Stock
            </button>
          </div>
          <span className="text-[11px] text-stone-500 block">
            Zero upfront onboarding charge for verified kiranas.
          </span>
        </div>
      </div>

      <div className="border-t border-stone-800/80 py-4 bg-[#121a25]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500">
          <p>© 2026 DukaanSetu Retail Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>FSSAI Standards Compliant</span>
            <span>·</span>
            <span>Food Waste Reduction Partner</span>
            <span>·</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
