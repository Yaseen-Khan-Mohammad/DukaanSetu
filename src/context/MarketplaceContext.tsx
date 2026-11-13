import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, User, UserRole, CartItem, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS } from '../data/initialData';
import { getDaysRemaining } from '../utils/dateUtils';

export interface FilterState {
  searchQuery: string;
  category: string;
  minDiscount: number;
  maxDistance: number;
  priceRange: 'all' | 'under_50' | '50_150' | 'over_150';
  availability: 'all' | 'in_stock' | 'low_stock';
  expiryFilter: string; // 'all' | 'urgent' | '3days' | '7days'
  sortBy: 'highest_discount' | 'lowest_price' | 'nearest' | 'recently_added';
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  shopName?: string;
  shopAddress?: string;
}

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; error: string };

interface MarketplaceContextType {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  authenticateUser: (email: string, password: string, role: UserRole) => AuthResult;
  registerUser: (payload: RegisterUserPayload) => AuthResult;
  updateUserProfile: (updates: Partial<User>) => void;
  activeView: 'marketplace' | 'sell' | 'orders' | 'profile' | 'cart' | 'checkout';
  setActiveView: (view: 'marketplace' | 'sell' | 'orders' | 'profile' | 'cart' | 'checkout') => void;
  products: Product[];
  filteredProducts: Product[];
  shopOwnerProducts: Product[];
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
  buyerOrders: Order[];
  shopOwnerOrders: Order[];
  createOrder: (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'status' | 'buyerId' | 'buyerRole' | 'sellerId'>
  ) => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addProduct: (productData: Omit<Product, 'id' | 'addedAt' | 'status' | 'discountPercent' | 'shopOwnerId'> & { shopOwnerId?: string }) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  signOut: () => void;
  quickSwitchUser: (userId: string) => void;
  resetPrototype: () => void;
  lastPlacedOrder: Order | null;
  lastPlacedOrders: Order[];
  setLastPlacedOrder: (order: Order | null) => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  category: 'All',
  minDiscount: 0,
  maxDistance: 10,
  priceRange: 'all',
  availability: 'all',
  expiryFilter: 'all',
  sortBy: 'highest_discount',
};

const normalizeOrderStatus = (rawStatus: string): OrderStatus => {
  if (rawStatus === 'Confirmed') return 'Pending';
  if (rawStatus === 'Out for Delivery') return 'Processing';
  if (rawStatus === 'Delivered') return 'Completed';
  if (
    rawStatus === 'Pending' ||
    rawStatus === 'Accepted' ||
    rawStatus === 'Processing' ||
    rawStatus === 'Ready for Pickup' ||
    rawStatus === 'Completed' ||
    rawStatus === 'Rejected'
  ) {
    return rawStatus;
  }
  return 'Pending';
};

const computeProductStatus = (quantity: number): Product['status'] => {
  if (quantity <= 0) return 'sold_out';
  if (quantity <= 5) return 'low_stock';
  return 'available';
};

const normalizeProducts = (list: Product[]): Product[] =>
  list.map((p) => ({
    ...p,
    shopOwnerId: p.shopOwnerId || 'user_shop_1',
    status: computeProductStatus(p.quantity),
  }));

const normalizeOrders = (list: Order[], allUsers: User[]): Order[] =>
  list.map((o) => {
    const matchedBuyer = allUsers.find(
      (u) => u.email.toLowerCase() === (o.customerEmail || '').toLowerCase()
    );
    const derivedSellerId = o.sellerId || o.items?.[0]?.product?.shopOwnerId || 'user_shop_1';
    return {
      ...o,
      buyerId: o.buyerId || matchedBuyer?.id || 'user_cust_1',
      buyerRole: o.buyerRole || matchedBuyer?.role,
      sellerId: derivedSellerId,
      status: normalizeOrderStatus(o.status as string),
    };
  });

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('dukaansetu_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as User[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure seeded demo accounts exist if missing
          const existingIds = new Set(parsed.map((u) => u.id));
          const missingSeeded = INITIAL_USERS.filter((u) => !existingIds.has(u.id));
          return [...parsed, ...missingSeeded];
        }
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

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
  const [lastPlacedOrders, setLastPlacedOrders] = useState<Order[]>([]);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('dukaansetu_products');
    if (saved) {
      try {
        return normalizeProducts(JSON.parse(saved));
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

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

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('dukaansetu_orders');
    if (saved) {
      try {
        return normalizeOrders(JSON.parse(saved), INITIAL_USERS);
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  useEffect(() => {
    localStorage.setItem('dukaansetu_users', JSON.stringify(users));
  }, [users]);

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

  const authenticateUser = (email: string, password: string, role: UserRole): AuthResult => {
    const emailLower = email.trim().toLowerCase();
    if (!emailLower || !password) {
      return { ok: false, error: 'Please enter both your email address and password.' };
    }

    const existingSameEmail = users.find((u) => u.email.toLowerCase() === emailLower);
    if (existingSameEmail) {
      if (existingSameEmail.role !== role) {
        const existingRoleLabel =
          existingSameEmail.role === 'shop_owner'
            ? 'Shop Owner'
            : existingSameEmail.role === 'business_buyer'
            ? 'Business Buyer'
            : 'Individual Customer';
        return {
          ok: false,
          error: `This email is registered as a ${existingRoleLabel}. Please select ${existingRoleLabel} above to sign in.`,
        };
      }
      if (existingSameEmail.password && existingSameEmail.password !== password) {
        return { ok: false, error: 'Incorrect password for this account. Please try again.' };
      }

      setCurrentUser(existingSameEmail);
      setActiveView(existingSameEmail.role === 'shop_owner' ? 'sell' : 'marketplace');
      showToast(`Welcome back to DukaanSetu, ${existingSameEmail.name}!`);
      return { ok: true, user: existingSameEmail };
    }

    // First-time local demo login: create and persist deterministic record so subsequent logins keep the same user.id
    const rawPrefix = emailLower.split('@')[0] || 'User';
    const formattedName = rawPrefix
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    const newUser: User = {
      id: `user_${role}_${Date.now()}`,
      name: formattedName || 'DukaanSetu User',
      email: email.trim(),
      phone: '+91 98450 00000',
      password,
      role,
      shopName:
        role === 'shop_owner'
          ? `${formattedName || 'Local'} Store`
          : role === 'business_buyer'
          ? `${formattedName || 'Business'} Kitchen`
          : undefined,
      shopAddress: role === 'shop_owner' ? 'Indiranagar, Bengaluru' : undefined,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveView(role === 'shop_owner' ? 'sell' : 'marketplace');
    showToast(`Welcome to DukaanSetu, ${newUser.name}!`);
    return { ok: true, user: newUser };
  };

  const registerUser = (payload: RegisterUserPayload): AuthResult => {
    const emailLower = payload.email.trim().toLowerCase();
    const duplicate = users.find((u) => u.email.toLowerCase() === emailLower);
    if (duplicate) {
      return {
        ok: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    const newUser: User = {
      id: `user_${payload.role}_${Date.now()}`,
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      password: payload.password,
      role: payload.role,
      shopName:
        payload.role === 'shop_owner' || payload.role === 'business_buyer'
          ? payload.shopName?.trim() || undefined
          : undefined,
      shopAddress:
        payload.role === 'shop_owner' || payload.role === 'business_buyer'
          ? payload.shopAddress?.trim() || undefined
          : undefined,
      savedAddress: payload.shopAddress?.trim() || undefined,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveView(payload.role === 'shop_owner' ? 'sell' : 'marketplace');
    showToast(`Account registered successfully! Welcome, ${newUser.name}`);
    return { ok: true, user: newUser };
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser: User = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    // Keep seller metadata in sync on that shop owner's own products if store details changed
    if (updatedUser.role === 'shop_owner' && (updates.shopName || updates.shopAddress || updates.phone)) {
      setProducts((prev) =>
        prev.map((p) =>
          p.shopOwnerId === updatedUser.id
            ? {
                ...p,
                shopName: updatedUser.shopName || p.shopName,
                shopAddress: updatedUser.shopAddress || p.shopAddress,
                shopPhone: updatedUser.phone || p.shopPhone,
              }
            : p
        )
      );
    }

    showToast('Profile information updated successfully');
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (product.quantity <= 0) {
      showToast(`"${product.name}" is currently sold out`, 'warning');
      return;
    }

    const existing = cart.find((item) => item.product.id === product.id);
    if (existing && existing.quantity >= product.quantity) {
      showToast(`Maximum available stock (${product.quantity}) already in basket`, 'warning');
      return;
    }

    setCart((prev) => {
      const found = prev.find((item) => item.product.id === product.id);
      if (found) {
        const newQty = Math.min(found.quantity + quantity, product.quantity);
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

  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'status' | 'buyerId' | 'buyerRole' | 'sellerId'>
  ): Order[] => {
    // Group cart items by seller (shopOwnerId) so every shop owner receives strictly their own orders & items
    const itemsBySeller = new Map<string, CartItem[]>();
    orderData.items.forEach((item) => {
      const sellerId = item.product.shopOwnerId || 'user_shop_1';
      const existing = itemsBySeller.get(sellerId) || [];
      existing.push(item);
      itemsBySeller.set(sellerId, existing);
    });

    const nowIso = new Date().toISOString();
    const baseTimestamp = Date.now();
    const createdOrders: Order[] = [];

    let groupIndex = 0;
    itemsBySeller.forEach((sellerItems, sellerId) => {
      const groupSubtotal = sellerItems.reduce(
        (sum, item) => sum + item.product.discountedPrice * item.quantity,
        0
      );
      const groupSavings = sellerItems.reduce(
        (sum, item) => sum + (item.product.originalPrice - item.product.discountedPrice) * item.quantity,
        0
      );
      const groupDeliveryFee = groupIndex === 0 ? orderData.deliveryFee : 0;
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);

      const newOrder: Order = {
        ...orderData,
        id: `ord_${baseTimestamp}_${groupIndex}`,
        orderNumber: `DS-2026-${randomSuffix}`,
        buyerId: currentUser?.id || 'guest',
        buyerRole: currentUser?.role,
        sellerId,
        items: sellerItems,
        subtotal: groupSubtotal,
        savings: groupSavings,
        deliveryFee: groupDeliveryFee,
        totalAmount: groupSubtotal + groupDeliveryFee,
        orderDate: nowIso,
        status: 'Pending',
        shopName: sellerItems[0]?.product.shopName || orderData.shopName,
        shopPhone: sellerItems[0]?.product.shopPhone || orderData.shopPhone,
      };
      createdOrders.push(newOrder);
      groupIndex += 1;
    });

    setOrders((prev) => [...createdOrders, ...prev]);

    setProducts((prev) =>
      prev.map((prod) => {
        const itemOrdered = orderData.items.find((i) => i.product.id === prod.id);
        if (itemOrdered) {
          const remaining = Math.max(0, prod.quantity - itemOrdered.quantity);
          return {
            ...prod,
            quantity: remaining,
            status: computeProductStatus(remaining),
          };
        }
        return prod;
      })
    );

    clearCart();
    setLastPlacedOrders(createdOrders);
    setLastPlacedOrder(createdOrders[0] || null);
    showToast(
      createdOrders.length > 1
        ? `${createdOrders.length} store orders placed successfully!`
        : `Order #${createdOrders[0]?.orderNumber} placed successfully!`
    );
    return createdOrders;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (currentUser?.role === 'shop_owner' && targetOrder.sellerId !== currentUser.id) {
      showToast('You can only update orders belonging to your own shop.', 'warning');
      return;
    }

    const wasRejected = targetOrder.status === 'Rejected';
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));

    // Restore inventory if a shop owner rejects a pending/active order
    if (!wasRejected && status === 'Rejected') {
      setProducts((prev) =>
        prev.map((prod) => {
          const orderedItem = targetOrder.items.find((i) => i.product.id === prod.id);
          if (orderedItem) {
            const restoredQty = prod.quantity + orderedItem.quantity;
            return {
              ...prod,
              quantity: restoredQty,
              status: computeProductStatus(restoredQty),
            };
          }
          return prod;
        })
      );
    }

    showToast(`Order #${targetOrder.orderNumber} updated to ${status}`, 'info');
  };

  const addProduct = (
    productData: Omit<Product, 'id' | 'addedAt' | 'status' | 'discountPercent' | 'shopOwnerId'> & {
      shopOwnerId?: string;
    }
  ) => {
    const discountPercent = Math.round(
      ((productData.originalPrice - productData.discountedPrice) / productData.originalPrice) * 100
    );

    const ownerId = productData.shopOwnerId || currentUser?.id || 'user_shop_1';

    const newProduct: Product = {
      ...productData,
      shopOwnerId: ownerId,
      id: `prod_${Date.now()}`,
      discountPercent: Math.max(0, discountPercent),
      addedAt: new Date().toISOString(),
      status: computeProductStatus(productData.quantity),
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" published to DukaanSetu marketplace!`);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    if (currentUser?.role === 'shop_owner' && target.shopOwnerId !== currentUser.id) {
      showToast('Unauthorized: You can only edit products from your own shop.', 'warning');
      return;
    }

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const updated = { ...prod, ...updates };
          if (updated.originalPrice && updated.discountedPrice) {
            updated.discountPercent = Math.max(
              0,
              Math.round(((updated.originalPrice - updated.discountedPrice) / updated.originalPrice) * 100)
            );
          }
          if (updated.quantity !== undefined) {
            updated.status = computeProductStatus(updated.quantity);
          }
          return updated;
        }
        return prod;
      })
    );
    showToast('Product listing updated successfully');
  };

  const deleteProduct = (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    if (currentUser?.role === 'shop_owner' && target.shopOwnerId !== currentUser.id) {
      showToast('Unauthorized: You can only delete products from your own shop.', 'warning');
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Listing removed from marketplace', 'info');
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const signOut = () => {
    setCurrentUser(null);
    setActiveView('marketplace');
    showToast('Signed out of DukaanSetu', 'info');
  };

  const quickSwitchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId) || INITIAL_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setActiveView(target.role === 'shop_owner' ? 'sell' : 'marketplace');
      showToast(`Logged in as ${target.name} (${target.role.replace('_', ' ')})`);
    }
  };

  const resetPrototype = () => {
    localStorage.removeItem('dukaansetu_users');
    localStorage.removeItem('dukaansetu_user');
    localStorage.removeItem('dukaansetu_products');
    localStorage.removeItem('dukaansetu_cart');
    localStorage.removeItem('dukaansetu_orders');
    setUsers(INITIAL_USERS);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setFilters(defaultFilters);
    setSelectedProduct(null);
    setLastPlacedOrder(null);
    setLastPlacedOrders([]);
    setCurrentUser(null);
    setActiveView('marketplace');
    showToast('Prototype reset to initial defaults', 'info');
  };

  const shopOwnerProducts = useMemo(() => {
    if (!currentUser || currentUser.role !== 'shop_owner') return [];
    return products.filter((p) => p.shopOwnerId === currentUser.id);
  }, [products, currentUser]);

  const shopOwnerOrders = useMemo(() => {
    if (!currentUser || currentUser.role !== 'shop_owner') return [];
    return orders.filter((o) => o.sellerId === currentUser.id);
  }, [orders, currentUser]);

  const buyerOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter(
      (o) =>
        o.buyerId === currentUser.id ||
        (!o.buyerId && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
    );
  }, [orders, currentUser]);

  const filteredProducts = products
    .filter((prod) => {
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const match =
          prod.name.toLowerCase().includes(q) ||
          prod.category.toLowerCase().includes(q) ||
          prod.shopName.toLowerCase().includes(q) ||
          prod.description.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (filters.category !== 'All' && prod.category !== filters.category) {
        return false;
      }

      if (filters.minDiscount > 0 && prod.discountPercent < filters.minDiscount) {
        return false;
      }

      if (prod.distanceKm > filters.maxDistance) {
        return false;
      }

      if (filters.priceRange === 'under_50' && prod.discountedPrice >= 50) {
        return false;
      }
      if (filters.priceRange === '50_150' && (prod.discountedPrice < 50 || prod.discountedPrice > 150)) {
        return false;
      }
      if (filters.priceRange === 'over_150' && prod.discountedPrice <= 150) {
        return false;
      }

      if (filters.availability === 'in_stock' && prod.quantity <= 0) {
        return false;
      }
      if (filters.availability === 'low_stock' && (prod.quantity <= 0 || prod.quantity > 5)) {
        return false;
      }

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
    })
    .sort((a, b) => {
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
        users,
        currentUser,
        setCurrentUser,
        authenticateUser,
        registerUser,
        updateUserProfile,
        activeView,
        setActiveView,
        products,
        filteredProducts,
        shopOwnerProducts,
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
        buyerOrders,
        shopOwnerOrders,
        createOrder,
        updateOrderStatus,
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
        resetPrototype,
        lastPlacedOrder,
        lastPlacedOrders,
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
