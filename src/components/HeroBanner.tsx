import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { IMAGES } from '../assets/imageAssets';
import { ArrowRight, Sparkles, MapPin, ShieldCheck, Clock } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setFilters, setActiveView } = useMarketplace();

  const handleExploreDeals = () => {
    setFilters((prev) => ({ ...prev, minDiscount: 0, category: 'All' }));
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF0F2] border-b border-[#F0D9DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-[#F0D9DF] text-xs font-semibold text-[#B8556D] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B8556D]" />
              <span>Neighbourhood Surplus Inventory Initiative</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17212F] tracking-tight leading-[1.15]">
                Great Products.<br />
                <span className="text-[#B8556D]">Better Prices.</span><br />
                Less Waste.
              </h1>
              <p className="text-base sm:text-lg text-stone-700 max-w-xl font-normal leading-relaxed">
                Discover quality products at discounted prices from shops near you. Helping local store owners clear short-dated stock while you save up to 60% on daily groceries.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExploreDeals}
                className="px-6 py-3.5 bg-[#B8556D] hover:bg-[#A0445A] text-white font-semibold text-sm rounded-lg shadow-sm transition-all transform active:scale-98 flex items-center gap-2.5"
              >
                <span>Explore Deals</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveView('sell');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3.5 bg-white hover:bg-stone-50 text-[#17212F] border border-stone-300 font-semibold text-sm rounded-lg transition-colors"
              >
                List Your Store Inventory
              </button>
            </div>

            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-[#F0D9DF]/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs text-stone-700 font-medium">100% Quality Checked</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B8556D] shrink-0" />
                <span className="text-xs text-stone-700 font-medium">Fast 2-Hr Store Pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-600 shrink-0" />
                <span className="text-xs text-stone-700 font-medium">Hyperlocal 2-5 km</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#F0D9DF] bg-white group">
              <img
                src={IMAGES.heroGroceryMarket}
                alt="Local grocery marketplace store shelves with fresh produce and pantry goods"
                className="w-full h-72 sm:h-88 lg:h-96 object-cover transition duration-300 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17212F]/80 via-transparent to-transparent flex items-end p-5">
                <div className="text-white space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-200">
                    Neighborhood Network
                  </span>
                  <p className="text-base font-bold">Connecting Local Stores & Smart Shoppers</p>
                  <p className="text-xs text-stone-200">
                    Fresh breads, milk cartons, seasonal fruits, & spices approaching best-before dates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
