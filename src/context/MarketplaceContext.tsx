import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, User, CartItem, Order, ProductCategory } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS } from '../data/initialData';
import { getDaysRemaining } from '../utils/dateUtils';

interface FilterState {
  searchQuery: string;
  category: string;
  minDiscount: number;
  maxDistance: number;
  expiryFilter: string; // 'all' | 'urgent' | '3days' | '7days'
  sortBy: 'highest_discount' | 'lowest_price' | 'nearest' | 'recently_added';
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface MarketplaceContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activeView: 'marketplace' | 'sell' | 'orders' | 'profile' | 'cart' | 'checkout';
  setActiveView: (view: 'marketplace' | 'sell' | 'orders' | 'profile' | 'cart' | 'checkout') => void;
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSavings: number;
  cartCount: number;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'status'>) => Order;
  addProduct: (productData: Omit<Product, 'id' | 'addedAt' | 'status' | 'discountPercent'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  signOut: () => void;
  quickSwitchUser: (userId: string) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  category: 'All',
  minDiscount: 0,
  maxDistance: 10,
  expiryFilter: 'all',
  sortBy: 'highest_discount',
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication: start with demo user or null (the user asked for sign-in page to be first displayed)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dukaansetu_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeView, setActiveView] = useState<'marketplace' | 'sell' | 'orders' | 'profile' | 'cart' | 'checkout'>('marketplace');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('dukaansetu_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dukaansetu_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('dukaansetu_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  // Filters
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Sync with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dukaansetu_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dukaansetu_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('dukaansetu_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('dukaansetu_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dukaansetu_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.quantity) }];
    });
    showToast(`Added "${product.name}" to your basket`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clampedQty = Math.min(quantity, item.product.quantity);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from basket', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.discountedPrice * item.quantity, 0);
  const cartSavings = cart.reduce(
    (sum, item) => sum + (item.product.originalPrice - item.product.discountedPrice) * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'status'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber: `DS-2026-${randomSuffix}`,
      orderDate: new Date().toISOString(),
      status: 'Confirmed',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update quantities of products
    setProducts((prev) =>
      prev.map((prod) => {
        const itemOrdered = orderData.items.find((i) => i.product.id === prod.id);
        if (itemOrdered) {
          const remaining = Math.max(0, prod.quantity - itemOrdered.quantity);
          return {
            ...prod,
            quantity: remaining,
            status: remaining === 0 ? 'sold_out' : remaining <= 3 ? 'low_stock' : 'available',
          };
        }
        return prod;
      })
    );

    clearCart();
    setLastPlacedOrder(newOrder);
    showToast(`Order #${newOrder.orderNumber} placed successfully!`);
    return newOrder;
  };

  const addProduct = (productData: Omit<Product, 'id' | 'addedAt' | 'status' | 'discountPercent'>) => {
    const discountPercent = Math.round(
      ((productData.originalPrice - productData.discountedPrice) / productData.originalPrice) * 100
    );

    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      discountPercent: Math.max(0, discountPercent),
      addedAt: new Date().toISOString(),
      status: productData.quantity <= 3 ? 'low_stock' : 'available',
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" published to DukaanSetu marketplace!`);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const updated = { ...prod, ...updates };
          if (updated.originalPrice && updated.discountedPrice) {
            updated.discountPercent = Math.round(
              ((updated.originalPrice - updated.discountedPrice) / updated.originalPrice) * 100
            );
          }
          if (updated.quantity !== undefined) {
            updated.status = updated.quantity === 0 ? 'sold_out' : updated.quantity <= 3 ? 'low_stock' : 'available';
          }
          return updated;
        }
        return prod;
      })
    );
    showToast('Listing updated successfully');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Listing removed from marketplace', 'info');
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const signOut = () => {
    setCurrentUser(null);
    showToast('Signed out of DukaanSetu', 'info');
  };

  const quickSwitchUser = (userId: string) => {
    const target = INITIAL_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      showToast(`Logged in as ${target.name} (${target.role.replace('_', ' ')})`);
    }
  };

  // Filter and sort products
  const filteredProducts = products.filter((prod) => {
    // 1. Search query (name, category, shop name)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        prod.name.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q) ||
        prod.shopName.toLowerCase().includes(q) ||
        prod.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Category
    if (filters.category !== 'All' && prod.category !== filters.category) {
      return false;
    }

    // 3. Discount %
    if (filters.minDiscount > 0 && prod.discountPercent < filters.minDiscount) {
      return false;
    }

    // 4. Distance
    if (prod.distanceKm > filters.maxDistance) {
      return false;
    }

    // 5. Expiry filter
    const daysLeft = getDaysRemaining(prod.expiryDate);
    if (filters.expiryFilter === 'urgent' && (daysLeft > 1 || daysLeft < 0)) {
      return false;
    }
    if (filters.expiryFilter === '3days' && (daysLeft > 3 || daysLeft < 0)) {
      return false;
    }
    if (filters.expiryFilter === '7days' && (daysLeft > 7 || daysLeft < 0)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'highest_discount') {
      return b.discountPercent - a.discountPercent;
    }
    if (filters.sortBy === 'lowest_price') {
      return a.discountedPrice - b.discountedPrice;
    }
    if (filters.sortBy === 'nearest') {
      return a.distanceKm - b.distanceKm;
    }
    if (filters.sortBy === 'recently_added') {
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }
    return 0;
  });

  return (
    <MarketplaceContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeView,
        setActiveView,
        products,
        filteredProducts,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartSavings,
        cartCount,
        orders,
        createOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        filters,
        setFilters,
        resetFilters,
        toasts,
        showToast,
        signOut,
        quickSwitchUser,
        lastPlacedOrder,
        setLastPlacedOrder,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
