import React from 'react';
import { useMarketplace, FilterState } from '../context/MarketplaceContext';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

export const SearchFilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredProducts, products } = useMarketplace();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.category !== 'All' ||
    filters.minDiscount > 0 ||
    filters.maxDistance < 10 ||
    filters.priceRange !== 'all' ||
    filters.availability !== 'all' ||
    filters.expiryFilter !== 'all' ||
    filters.sortBy !== 'highest_discount';

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6 shadow-xs">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by product name, category, or store (e.g. Milk, Sourdough, Apples, Indiranagar)..."
            className="w-full pl-10 pr-9 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D] focus:border-[#B8556D] transition"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <span>Sort:</span>
          </div>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as FilterState['sortBy'],
              }))
            }
            className="text-xs font-semibold py-2 px-3 rounded-lg border border-stone-300 bg-white text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
          >
            <option value="highest_discount">Highest Discount %</option>
            <option value="lowest_price">Lowest Price (₹)</option>
            <option value="nearest">Nearest Shops (Distance)</option>
            <option value="recently_added">Recently Listed</option>
          </select>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2.5 text-xs">
        <div className="flex items-center gap-1 text-stone-500 font-semibold mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        <select
          value={filters.priceRange}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priceRange: e.target.value as FilterState['priceRange'] }))
          }
          className={`py-1 px-2.5 rounded-lg border text-xs font-medium focus:outline-none ${
            filters.priceRange !== 'all'
              ? 'border-[#B8556D] bg-[#FAF0F2] text-[#B8556D] font-semibold'
              : 'border-stone-300 text-stone-700 bg-white'
          }`}
        >
          <option value="all">Price: Any ₹</option>
          <option value="under_50">Under ₹50</option>
          <option value="50_150">₹50 – ₹150</option>
          <option value="over_150">Above ₹150</option>
        </select>

        <select
          value={filters.expiryFilter}
          onChange={(e) => setFilters((prev) => ({ ...prev, expiryFilter: e.target.value }))}
          className={`py-1 px-2.5 rounded-lg border text-xs font-medium focus:outline-none ${
            filters.expiryFilter !== 'all'
              ? 'border-[#B8556D] bg-[#FAF0F2] text-[#B8556D] font-semibold'
              : 'border-stone-300 text-stone-700 bg-white'
          }`}
        >
          <option value="all">Expiry: All dates</option>
          <option value="urgent">Urgent: Within 24-48 hrs</option>
          <option value="3days">Within 3 Days</option>
          <option value="7days">Within 7 Days</option>
        </select>

        <select
          value={filters.minDiscount}
          onChange={(e) => setFilters((prev) => ({ ...prev, minDiscount: Number(e.target.value) }))}
          className={`py-1 px-2.5 rounded-lg border text-xs font-medium focus:outline-none ${
            filters.minDiscount > 0
              ? 'border-[#B8556D] bg-[#FAF0F2] text-[#B8556D] font-semibold'
              : 'border-stone-300 text-stone-700 bg-white'
          }`}
        >
          <option value={0}>Discount: Any %</option>
          <option value={20}>20% or more</option>
          <option value={30}>30% or more</option>
          <option value={45}>45% or more</option>
        </select>

        <select
          value={filters.maxDistance}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxDistance: Number(e.target.value) }))}
          className={`py-1 px-2.5 rounded-lg border text-xs font-medium focus:outline-none ${
            filters.maxDistance < 10
              ? 'border-[#B8556D] bg-[#FAF0F2] text-[#B8556D] font-semibold'
              : 'border-stone-300 text-stone-700 bg-white'
          }`}
        >
          <option value={10}>Distance: City-wide (&lt;10 km)</option>
          <option value={1}>Within 1 km</option>
          <option value={2}>Within 2 km</option>
          <option value={5}>Within 5 km</option>
        </select>

        <select
          value={filters.availability}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, availability: e.target.value as FilterState['availability'] }))
          }
          className={`py-1 px-2.5 rounded-lg border text-xs font-medium focus:outline-none ${
            filters.availability !== 'all'
              ? 'border-[#B8556D] bg-[#FAF0F2] text-[#B8556D] font-semibold'
              : 'border-stone-300 text-stone-700 bg-white'
          }`}
        >
          <option value="all">Availability: All</option>
          <option value="in_stock">In Stock Only</option>
          <option value="low_stock">Limited Stock (&le;5 left)</option>
        </select>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-stone-500 text-xs font-mono">
            Showing <strong className="text-[#17212F]">{filteredProducts.length}</strong> of {products.length} items
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#B8556D] hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
