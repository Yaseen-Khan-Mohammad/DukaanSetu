import heroGroceryMarket from './images/hero_grocery_market_1794550479421.jpg';
import freshMilkDairy from './images/product_fresh_milk_dairy_1794550479400.jpg';
import bakeryArtisanBread from './images/product_bakery_artisan_bread_1794550480367.jpg';
import freshFruitsBasket from './images/product_fresh_fruits_basket_1794550480653.jpg';
import packagedGrocery from './images/product_packaged_grocery_1794550482310.jpg';

export const IMAGES = {
  heroGroceryMarket,
  freshMilkDairy,
  bakeryArtisanBread,
  freshFruitsBasket,
  packagedGrocery,
};

export function resolveImageUrl(url: string): string {
  if (!url) return packagedGrocery;
  if (url.includes('hero_grocery_market')) return heroGroceryMarket;
  if (url.includes('product_fresh_milk_dairy')) return freshMilkDairy;
  if (url.includes('product_bakery_artisan_bread')) return bakeryArtisanBread;
  if (url.includes('product_fresh_fruits_basket')) return freshFruitsBasket;
  if (url.includes('product_packaged_grocery')) return packagedGrocery;
  return url;
}
