import React from 'react';
import { Product } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatCurrency, formatExpiryDisplay } from '../utils/dateUtils';
import { IMAGES, resolveImageUrl } from '../assets/imageAssets';
import { ShoppingBag, Eye, MapPin, Store, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart } = useMarketplace();

  const expiryInfo = formatExpiryDisplay(product.expiryDate);
  const isSoldOut = product.quantity === 0 || product.status === 'sold_out';

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div>
        <div
          className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer"
          onClick={() => setSelectedProduct(product)}
        >
          <img
            src={resolveImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = IMAGES.packagedGrocery;
            }}
          />

          <div className="absolute top-2.5 left-2.5 bg-[#B8556D] text-white px-2.5 py-0.5 text-xs font-bold rounded shadow-xs tracking-tight">
            {product.discountPercent}% OFF
          </div>

          <div
            className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[11px] font-semibold rounded backdrop-blur-xs ${
              expiryInfo.isUrgent
                ? 'bg-amber-900/80 text-amber-100 border border-amber-600/30'
                : 'bg-stone-900/70 text-white'
            }`}
          >
            {expiryInfo.text}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 text-stone-600">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>{product.distanceKm} km away</span>
            </span>
          </div>

          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-sm sm:text-base font-bold text-[#17212F] line-clamp-1 hover:text-[#B8556D] cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-lg sm:text-xl font-extrabold text-[#17212F] font-mono tabular-nums">
              {formatCurrency(product.discountedPrice)}
            </span>
            <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
              {formatCurrency(product.originalPrice)}
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              Save {formatCurrency(product.originalPrice - product.discountedPrice)}
            </span>
          </div>

          <div className="pt-1.5 border-t border-stone-100 space-y-1 text-xs">
            <div className="flex items-center justify-between text-stone-600">
              <span className="flex items-center gap-1.5 truncate max-w-[70%]" title={product.shopName}>
                <Store className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate font-medium">{product.shopName}</span>
              </span>
              <span className="text-[11px] text-stone-400 truncate">{product.shopAddress.split(',')[0]}</span>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-[11px] text-stone-500">
                Best before: <strong className="text-stone-700">{expiryInfo.formattedDate}</strong>
              </span>

              {isSoldOut ? (
                <span className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Sold Out
                </span>
              ) : product.quantity <= 3 ? (
                <span className="text-[11px] font-semibold text-amber-700">
                  Only {product.quantity} left
                </span>
              ) : (
                <span className="text-[11px] text-stone-500">
                  In Stock ({product.quantity})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2">
        <button
          type="button"
          onClick={() => setSelectedProduct(product)}
          className="py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5 text-stone-500" />
          <span>View Details</span>
        </button>

        <button
          type="button"
          disabled={isSoldOut}
          onClick={() => addToCart(product, 1)}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            isSoldOut
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-[#B8556D] hover:bg-[#A0445A] text-white shadow-xs'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{isSoldOut ? 'Sold Out' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};
