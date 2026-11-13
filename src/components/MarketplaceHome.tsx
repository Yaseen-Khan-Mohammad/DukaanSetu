import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { HeroBanner } from './HeroBanner';
import { CategoryBar } from './CategoryBar';
import { SearchFilterBar } from './SearchFilterBar';
import { ProductCard } from './ProductCard';
import { ShoppingBag, Sparkles, RotateCcw } from 'lucide-react';

export const MarketplaceHome: React.FC = () => {
  const { filteredProducts, resetFilters, filters } = useMarketplace();

  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      <HeroBanner />
      <CategoryBar />

      <section id="products-section" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8556D] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Near-Expiry Inventory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17212F] tracking-tight">
              Featured Short-Dated Deals
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Quality-inspected clearance items from verified grocery stores in your neighborhood.
            </p>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Showing clearance inventory sorted by{' '}
            <strong className="text-[#17212F] font-semibold">
              {filters.sortBy === 'highest_discount'
                ? 'Highest Discount'
                : filters.sortBy === 'lowest_price'
                ? 'Lowest Price'
                : filters.sortBy === 'nearest'
                ? 'Nearest Shops'
                : 'Recently Added'}
            </strong>
          </div>
        </div>

        <SearchFilterBar />

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#FAF0F2] text-[#B8556D] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#17212F]">No matching items found</h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              We couldn't find any products matching your current filters or search terms. Try widening your distance or discount criteria.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#B8556D] hover:bg-[#A0445A] text-white text-xs font-semibold rounded-lg shadow-xs transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-14 p-6 sm:p-8 bg-[#FAF0F2] rounded-2xl border border-[#F0D9DF] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-bold text-[#B8556D] uppercase tracking-wider">
              Collective Neighborhood Impact
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#17212F]">
              ₹4,80,000+ Worth of Edible Food Rescued This Month
            </h3>
            <p className="text-xs text-stone-600 max-w-xl">
              By connecting local kiranas with neighborhood buyers, DukaanSetu prevents fresh food and packaged groceries from heading to municipal landfills.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-white px-4 py-2.5 rounded-xl border border-[#F0D9DF] text-center">
              <span className="block text-lg font-black text-[#17212F] font-mono">320+</span>
              <span className="text-[11px] text-stone-500 font-medium">Partner Dukans</span>
            </div>
            <div className="bg-white px-4 py-2.5 rounded-xl border border-[#F0D9DF] text-center">
              <span className="block text-lg font-black text-emerald-700 font-mono">14,200 kg</span>
              <span className="text-[11px] text-stone-500 font-medium">Waste Prevented</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
