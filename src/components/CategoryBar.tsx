import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCategory } from '../types';
import {
  Apple,
  Milk,
  Croissant,
  Package,
  Coffee,
  Sparkles,
  Layers,
} from 'lucide-react';

interface CategoryItem {
  id: ProductCategory | 'All';
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'All', name: 'All Deals', icon: Layers },
  { id: 'Fruits & Vegetables', name: 'Fruits & Vegetables', icon: Apple },
  { id: 'Dairy Products', name: 'Dairy Products', icon: Milk },
  { id: 'Bakery Items', name: 'Bakery Items', icon: Croissant },
  { id: 'Packaged Foods', name: 'Packaged Foods', icon: Package },
  { id: 'Beverages', name: 'Beverages', icon: Coffee },
  { id: 'Household Essentials', name: 'Household Essentials', icon: Sparkles },
  { id: 'Others', name: 'Others', icon: Package },
];

export const CategoryBar: React.FC = () => {
  const { filters, setFilters, products } = useMarketplace();

  const handleCategorySelect = (categoryId: string) => {
    setFilters((prev) => ({ ...prev, category: categoryId }));
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCount = (catName: string) => {
    if (catName === 'All') return products.length;
    return products.filter((p) => p.category === catName).length;
  };

  return (
    <section id="categories-section" className="py-8 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-[#17212F] tracking-tight">Browse by Category</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Select a section to find clearance deals from your nearest stores
            </p>
          </div>
          {filters.category !== 'All' && (
            <button
              type="button"
              onClick={() => handleCategorySelect('All')}
              className="text-xs font-semibold text-[#B8556D] hover:underline"
            >
              Reset Category
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = filters.category === cat.id;
            const count = getCount(cat.id);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-center group ${
                  isSelected
                    ? 'border-[#B8556D] bg-[#FAF0F2] shadow-xs'
                    : 'border-stone-200 bg-white hover:border-[#B8556D]/40 hover:bg-stone-50'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                    isSelected
                      ? 'bg-[#B8556D] text-white'
                      : 'bg-stone-100 text-stone-700 group-hover:bg-[#FAF0F2] group-hover:text-[#B8556D]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-semibold leading-tight line-clamp-1 ${
                    isSelected ? 'text-[#B8556D]' : 'text-[#17212F]'
                  }`}
                >
                  {cat.name}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 font-mono">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
