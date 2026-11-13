import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { OrderStatus, Product, ProductCategory } from '../types';
import { formatCurrency, formatExpiryDisplay } from '../utils/dateUtils';
import { resolveImageUrl } from '../assets/imageAssets';
import { SellProductPage } from './SellProductPage';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ClipboardList,
  Boxes,
  IndianRupee,
  Store,
  LogOut,
  RotateCcw,
  Menu,
  X,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  AlertTriangle,
  Search,
  Phone,
  Mail,
  MapPin,
  Truck,
  Save,
  Minus,
  Plus,
  ShoppingBag,
  Clock,
} from 'lucide-react';

type DashboardSection =
  | 'dashboard'
  | 'my_products'
  | 'add_product'
  | 'orders_received'
  | 'inventory'
  | 'sales'
  | 'profile';

const CATEGORIES: ProductCategory[] = [
  'Fruits & Vegetables',
  'Dairy Products',
  'Bakery Items',
  'Packaged Foods',
  'Beverages',
  'Household Essentials',
  'Others',
];

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Accepted: 'bg-sky-100 text-sky-800 border-sky-200',
  Processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Ready for Pickup': 'bg-blue-100 text-blue-800 border-blue-200',
  Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
};

const LISTING_STATUS_BADGE: Record<Product['status'], { label: string; classes: string }> = {
  available: { label: 'Available', classes: 'bg-emerald-100 text-emerald-800' },
  low_stock: { label: 'Low Stock', classes: 'bg-amber-100 text-amber-800' },
  sold_out: { label: 'Sold Out', classes: 'bg-red-100 text-red-700' },
};

const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Accepted',
  'Processing',
  'Ready for Pickup',
];

export const ShopOwnerDashboard: React.FC = () => {
  const {
    currentUser,
    shopOwnerProducts,
    shopOwnerOrders,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateUserProfile,
    quickSwitchUser,
    signOut,
    resetPrototype,
    showToast,
  } = useMarketplace();

  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // My Products local state
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Edit product modal form state
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ProductCategory>('Dairy Products');
  const [editDescription, setEditDescription] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editDiscountedPrice, setEditDiscountedPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editExpiryDate, setEditExpiryDate] = useState('');
  const [editMfgDate, setEditMfgDate] = useState('');
  const [editError, setEditError] = useState('');

  // Orders Received filter state
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | OrderStatus>('All');

  // Inventory Management state
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'low' | 'out'>('all');
  const [draftStockMap, setDraftStockMap] = useState<Record<string, number>>({});

  // Sales & Earnings filter state
  const [salesFilter, setSalesFilter] = useState<'completed' | 'active_and_completed' | 'all'>('completed');

  // Shop Profile edit state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileShopName, setProfileShopName] = useState(currentUser?.shopName || '');
  const [profileShopAddress, setProfileShopAddress] = useState(currentUser?.shopAddress || '');

  // Computed KPI Metrics strictly from this Shop Owner's own products & orders
  const metrics = useMemo(() => {
    const activeOrders = shopOwnerOrders.filter((o) =>
      ACTIVE_ORDER_STATUSES.includes(o.status)
    );
    const completedOrders = shopOwnerOrders.filter((o) => o.status === 'Completed');
    const pendingOrdersCount = shopOwnerOrders.filter((o) => o.status === 'Pending').length;
    const totalSales = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pipelineRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const lowStockCount = shopOwnerProducts.filter((p) => p.quantity > 0 && p.quantity <= 5).length;
    const outOfStockCount = shopOwnerProducts.filter((p) => p.quantity === 0).length;
    const totalUnitsAvailable = shopOwnerProducts.reduce((sum, p) => sum + p.quantity, 0);
    const averageOrderValue =
      completedOrders.length > 0 ? Math.round(totalSales / completedOrders.length) : 0;

    return {
      totalProducts: shopOwnerProducts.length,
      activeOrdersCount: activeOrders.length,
      completedOrdersCount: completedOrders.length,
      pendingOrdersCount,
      totalSales,
      pipelineRevenue,
      lowStockCount,
      outOfStockCount,
      totalUnitsAvailable,
      averageOrderValue,
    };
  }, [shopOwnerProducts, shopOwnerOrders]);

  const recentOrders = useMemo(() => {
    return [...shopOwnerOrders]
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 6);
  }, [shopOwnerOrders]);

  const filteredOwnerProducts = useMemo(() => {
    return shopOwnerProducts.filter((prod) => {
      if (productCategoryFilter !== 'All' && prod.category !== productCategoryFilter) {
        return false;
      }
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return (
          prod.name.toLowerCase().includes(q) ||
          prod.category.toLowerCase().includes(q) ||
          prod.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [shopOwnerProducts, productCategoryFilter, productSearch]);

  const filteredOwnerOrders = useMemo(() => {
    const sorted = [...shopOwnerOrders].sort(
      (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
    if (orderStatusFilter === 'All') return sorted;
    return sorted.filter((o) => o.status === orderStatusFilter);
  }, [shopOwnerOrders, orderStatusFilter]);

  const inventoryProducts = useMemo(() => {
    return shopOwnerProducts.filter((p) => {
      if (inventoryFilter === 'low') return p.quantity > 0 && p.quantity <= 5;
      if (inventoryFilter === 'out') return p.quantity === 0;
      return true;
    });
  }, [shopOwnerProducts, inventoryFilter]);

  const salesHistoryOrders = useMemo(() => {
    const sorted = [...shopOwnerOrders].sort(
      (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
    if (salesFilter === 'completed') {
      return sorted.filter((o) => o.status === 'Completed');
    }
    if (salesFilter === 'active_and_completed') {
      return sorted.filter((o) => o.status !== 'Rejected');
    }
    return sorted;
  }, [shopOwnerOrders, salesFilter]);

  const navigateSection = (section: DashboardSection) => {
    setActiveSection(section);
    setMobileSidebarOpen(false);
    if (section === 'profile' && currentUser) {
      setProfileName(currentUser.name || '');
      setProfileEmail(currentUser.email || '');
      setProfilePhone(currentUser.phone || '');
      setProfileShopName(currentUser.shopName || '');
      setProfileShopAddress(currentUser.shopAddress || '');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditCategory(prod.category);
    setEditDescription(prod.description);
    setEditOriginalPrice(String(prod.originalPrice));
    setEditDiscountedPrice(String(prod.discountedPrice));
    setEditQuantity(String(prod.quantity));
    setEditExpiryDate(prod.expiryDate);
    setEditMfgDate(prod.mfgDate || '');
    setEditError('');
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setEditError('');

    const orig = Number(editOriginalPrice);
    const disc = Number(editDiscountedPrice);
    const qty = parseInt(editQuantity, 10);

    if (!editName.trim() || !editDescription.trim()) {
      setEditError('Product name and description are required.');
      return;
    }
    if (isNaN(orig) || orig <= 0 || isNaN(disc) || disc <= 0) {
      setEditError('Prices must be positive amounts.');
      return;
    }
    if (disc >= orig) {
      setEditError('Discounted selling price must be strictly lower than Original MRP.');
      return;
    }
    if (isNaN(qty) || qty < 0) {
      setEditError('Available quantity cannot be negative.');
      return;
    }
    if (!editExpiryDate) {
      setEditError('Please specify an expiry date.');
      return;
    }

    updateProduct(editingProduct.id, {
      name: editName.trim(),
      category: editCategory,
      description: editDescription.trim(),
      originalPrice: Math.round(orig),
      discountedPrice: Math.round(disc),
      quantity: qty,
      expiryDate: editExpiryDate,
      mfgDate: editMfgDate || undefined,
    });
    setEditingProduct(null);
  };

  const getDraftStock = (prod: Product) =>
    draftStockMap[prod.id] !== undefined ? draftStockMap[prod.id] : prod.quantity;

  const handleStockDraftChange = (prodId: string, nextValue: number) => {
    const safeVal = Math.max(0, isNaN(nextValue) ? 0 : Math.floor(nextValue));
    setDraftStockMap((prev) => ({ ...prev, [prodId]: safeVal }));
  };

  const handleCommitStockUpdate = (prod: Product) => {
    const nextQty = getDraftStock(prod);
    updateProduct(prod.id, { quantity: nextQty });
    setDraftStockMap((prev) => {
      const next = { ...prev };
      delete next[prod.id];
      return next;
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim() || !profilePhone.trim() || !profileShopName.trim()) {
      showToast('Please fill all required store and contact fields.', 'warning');
      return;
    }
    updateUserProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      shopName: profileShopName.trim(),
      shopAddress: profileShopAddress.trim(),
    });
  };

  const sidebarItems: {
    id: DashboardSection;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
    badgeTone?: 'rose' | 'amber';
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my_products', label: 'My Products', icon: Package },
    { id: 'add_product', label: 'Add Product', icon: PlusCircle },
    {
      id: 'orders_received',
      label: 'Orders Received',
      icon: ClipboardList,
      badge: metrics.pendingOrdersCount,
      badgeTone: 'rose',
    },
    {
      id: 'inventory',
      label: 'Inventory Management',
      icon: Boxes,
      badge: metrics.lowStockCount + metrics.outOfStockCount,
      badgeTone: 'amber',
    },
    { id: 'sales', label: 'Sales & Earnings', icon: IndianRupee },
    { id: 'profile', label: 'Shop Profile', icon: Store },
  ];

  const sectionTitles: Record<DashboardSection, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Shop Owner Dashboard',
      subtitle: 'Overview of your store inventory, incoming orders, and completed sales',
    },
    my_products: {
      title: 'My Products',
      subtitle: 'Manage products listed exclusively under your shop account',
    },
    add_product: {
      title: 'Add Product',
      subtitle: 'List short-dated inventory at discounted prices for local buyers',
    },
    orders_received: {
      title: 'Orders Received',
      subtitle: 'Review customer & business orders, accept/reject requests, and update status',
    },
    inventory: {
      title: 'Inventory Management',
      subtitle: 'Monitor stock levels, identify low-stock items, and update quantities',
    },
    sales: {
      title: 'Sales & Earnings',
      subtitle: 'Track revenue, completed orders, and full transaction history',
    },
    profile: {
      title: 'Shop Profile',
      subtitle: 'Manage store contact details, pickup address, and merchant account',
    },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-[#17212F] flex flex-col lg:flex-row">
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Persistent Left Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 shrink-0 bg-[#17212F] text-white flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="px-5 h-16 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#B8556D] flex items-center justify-center text-white font-bold text-sm">
                DS
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white block leading-none">
                  Dukaan<span className="text-[#E89CAE]">Setu</span>
                </span>
                <span className="text-[10px] text-stone-300 font-medium">Seller Portal</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1 text-stone-300 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Store Identity Strip */}
          <div className="mx-4 mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
              Active Store
            </p>
            <p className="text-xs font-bold text-white truncate mt-0.5">
              {currentUser?.shopName || 'My Local Store'}
            </p>
            <p className="text-[11px] text-stone-300 truncate">{currentUser?.name}</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateSection(item.id)}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#B8556D] text-white shadow-xs'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono tabular-nums ${
                        isActive
                          ? 'bg-white text-[#B8556D]'
                          : item.badgeTone === 'amber'
                          ? 'bg-amber-400/20 text-amber-300'
                          : 'bg-[#B8556D] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Action */}
          <div className="p-3 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={signOut}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-[#17212F] truncate">
                {sectionTitles[activeSection].title}
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block truncate">
                {sectionTitles[activeSection].subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {activeSection !== 'add_product' && (
              <button
                type="button"
                onClick={() => navigateSection('add_product')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B8556D] hover:bg-[#A0445A] text-white text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}

            <button
              type="button"
              onClick={resetPrototype}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-[11px] font-semibold text-stone-700 transition-colors whitespace-nowrap"
              title="Reset all demo data and return to sign-in"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Prototype</span>
            </button>
          </div>
        </header>

        {/* Section Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* 1. DASHBOARD HOME */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Four Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Total Products Listed
                    </p>
                    <p className="text-2xl font-extrabold text-[#17212F] font-mono tabular-nums mt-2">
                      {metrics.totalProducts}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {metrics.totalUnitsAvailable} units total across listings
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#FAF0F2] text-[#B8556D] flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Active Orders
                    </p>
                    <p className="text-2xl font-extrabold text-[#17212F] font-mono tabular-nums mt-2">
                      {metrics.activeOrdersCount}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {metrics.pendingOrdersCount} awaiting acceptance
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Completed Orders
                    </p>
                    <p className="text-2xl font-extrabold text-[#17212F] font-mono tabular-nums mt-2">
                      {metrics.completedOrdersCount}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Fulfilled to local buyers
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Total Sales
                    </p>
                    <p className="text-2xl font-extrabold text-[#17212F] font-mono tabular-nums mt-2">
                      {formatCurrency(metrics.totalSales)}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      +{formatCurrency(metrics.pipelineRevenue)} in active orders
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#17212F] text-white flex items-center justify-center shrink-0">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Quick Low Stock Alert if needed */}
              {(metrics.lowStockCount > 0 || metrics.outOfStockCount > 0) && (
                <div className="bg-[#FAF0F2] border border-[#F0D9DF] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs">
                    <AlertTriangle className="w-5 h-5 text-[#B8556D] shrink-0" />
                    <div>
                      <p className="font-bold text-[#17212F]">Inventory Attention Needed</p>
                      <p className="text-stone-600">
                        You have {metrics.lowStockCount} low-stock and {metrics.outOfStockCount} out-of-stock product(s).
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateSection('inventory')}
                    className="px-3.5 py-2 rounded-lg bg-white border border-[#F0D9DF] text-xs font-semibold text-[#B8556D] hover:bg-stone-50 whitespace-nowrap"
                  >
                    Manage Inventory
                  </button>
                </div>
              )}

              {/* Recent Orders Table */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#17212F]">Recent Orders</h2>
                    <p className="text-xs text-stone-500">
                      Latest orders received for {currentUser?.shopName || 'your shop'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateSection('orders_received')}
                    className="text-xs font-semibold text-[#B8556D] hover:underline whitespace-nowrap"
                  >
                    View All Orders
                  </button>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="p-10 text-center space-y-2">
                    <ShoppingBag className="w-9 h-9 text-stone-300 mx-auto" />
                    <p className="text-sm font-semibold text-[#17212F]">No orders received yet</p>
                    <p className="text-xs text-stone-500">
                      Orders placed by Individual and Business Buyers for your products will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Order ID</th>
                          <th className="py-3 px-4 font-semibold">Product Name</th>
                          <th className="py-3 px-4 font-semibold">Buyer Name</th>
                          <th className="py-3 px-4 font-semibold">Quantity</th>
                          <th className="py-3 px-4 font-semibold">Order Amount</th>
                          <th className="py-3 px-4 font-semibold">Order Date</th>
                          <th className="py-3 px-4 font-semibold">Order Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {recentOrders.map((order) => {
                          const totalQty = order.items.reduce((sum, i) => sum + i.quantity, 0);
                          const primaryItem = order.items[0]?.product.name || 'Store Item';
                          const extraItemsCount = order.items.length - 1;
                          const formattedDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          });

                          return (
                            <tr
                              key={order.id}
                              onClick={() => navigateSection('orders_received')}
                              className="hover:bg-[#FAF0F2]/40 cursor-pointer transition-colors"
                            >
                              <td className="py-3.5 px-4 font-mono font-bold text-[#17212F] whitespace-nowrap">
                                {order.orderNumber}
                              </td>
                              <td className="py-3.5 px-4 max-w-[240px]">
                                <span className="font-semibold text-[#17212F] block truncate">
                                  {primaryItem}
                                </span>
                                {extraItemsCount > 0 && (
                                  <span className="text-[11px] text-stone-500">
                                    +{extraItemsCount} more item{extraItemsCount > 1 ? 's' : ''}
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="font-medium text-[#17212F]">{order.customerName}</span>
                              </td>
                              <td className="py-3.5 px-4 font-mono tabular-nums text-stone-700">
                                {totalQty} {totalQty === 1 ? 'unit' : 'units'}
                              </td>
                              <td className="py-3.5 px-4 font-mono font-bold tabular-nums text-[#17212F]">
                                {formatCurrency(order.totalAmount)}
                              </td>
                              <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                                {formattedDate}
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold border ${
                                    ORDER_STATUS_STYLES[order.status]
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. MY PRODUCTS */}
          {activeSection === 'my_products' && (
            <div className="space-y-5">
              {/* Filter & Search Bar */}
              <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search your listed products..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    />
                  </div>

                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-medium text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-xs text-stone-500 font-medium">
                    {filteredOwnerProducts.length} product{filteredOwnerProducts.length === 1 ? '' : 's'}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateSection('add_product')}
                    className="px-4 py-2 bg-[#B8556D] hover:bg-[#A0445A] text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {filteredOwnerProducts.length === 0 ? (
                <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
                  <Package className="w-10 h-10 text-stone-300 mx-auto" />
                  <h3 className="text-base font-bold text-[#17212F]">
                    {shopOwnerProducts.length === 0
                      ? 'No Products Listed Under This Shop Yet'
                      : 'No Matching Products Found'}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    {shopOwnerProducts.length === 0
                      ? 'Add your first short-dated product to start receiving orders from local Individual and Business Buyers.'
                      : 'Try clearing your search or category filter.'}
                  </p>
                  {shopOwnerProducts.length === 0 && (
                    <button
                      type="button"
                      onClick={() => navigateSection('add_product')}
                      className="px-5 py-2.5 bg-[#B8556D] hover:bg-[#A0445A] text-white text-xs font-semibold rounded-lg transition"
                    >
                      Add Your First Product
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Product</th>
                          <th className="py-3 px-4 font-semibold">Category</th>
                          <th className="py-3 px-4 font-semibold">Price</th>
                          <th className="py-3 px-4 font-semibold">Available Qty</th>
                          <th className="py-3 px-4 font-semibold">Expiry Date</th>
                          <th className="py-3 px-4 font-semibold">Listing Status</th>
                          <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredOwnerProducts.map((prod) => {
                          const expiry = formatExpiryDisplay(prod.expiryDate);
                          const statusBadge = LISTING_STATUS_BADGE[prod.status];
                          const isConfirmingDelete = confirmDeleteId === prod.id;

                          return (
                            <tr key={prod.id} className="hover:bg-stone-50/70">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={resolveImageUrl(prod.imageUrl)}
                                    alt={prod.name}
                                    className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0 bg-stone-50"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="min-w-0 max-w-[230px]">
                                    <p className="font-bold text-[#17212F] truncate">{prod.name}</p>
                                    <p className="text-[11px] text-stone-500 truncate">{prod.description}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-stone-700 font-medium whitespace-nowrap">
                                {prod.category}
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-mono font-bold text-[#17212F]">
                                    {formatCurrency(prod.discountedPrice)}
                                  </span>
                                  <span className="font-mono text-[11px] text-stone-400 line-through">
                                    {formatCurrency(prod.originalPrice)}
                                  </span>
                                </div>
                                <span className="text-[10px] font-semibold text-[#B8556D]">
                                  {prod.discountPercent}% OFF
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-[#17212F] whitespace-nowrap">
                                {prod.quantity} units
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className="font-medium text-[#17212F] block">{expiry.formattedDate}</span>
                                <span className="text-[11px] text-amber-700">{expiry.text}</span>
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${statusBadge.classes}`}>
                                  {statusBadge.label}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                {isConfirmingDelete ? (
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        deleteProduct(prod.id);
                                        setConfirmDeleteId(null);
                                      }}
                                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-semibold"
                                    >
                                      Confirm Delete
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-semibold"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => openEditModal(prod)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-[#FAF0F2] hover:border-[#F0D9DF] text-stone-700 hover:text-[#B8556D] font-semibold transition"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(prod.id)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-red-50 hover:border-red-200 text-stone-600 hover:text-red-600 font-semibold transition"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. ADD PRODUCT (Reuses Existing Listing Functionality) */}
          {activeSection === 'add_product' && (
            <SellProductPage
              embeddedInDashboard
              onProductAdded={() => navigateSection('my_products')}
              onCancel={() => navigateSection('my_products')}
            />
          )}

          {/* 4. ORDERS RECEIVED */}
          {activeSection === 'orders_received' && (
            <div className="space-y-5">
              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    'All',
                    'Pending',
                    'Accepted',
                    'Processing',
                    'Ready for Pickup',
                    'Completed',
                    'Rejected',
                  ] as const
                ).map((statusTab) => {
                  const count =
                    statusTab === 'All'
                      ? shopOwnerOrders.length
                      : shopOwnerOrders.filter((o) => o.status === statusTab).length;
                  const active = orderStatusFilter === statusTab;
                  return (
                    <button
                      key={statusTab}
                      type="button"
                      onClick={() => setOrderStatusFilter(statusTab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition whitespace-nowrap ${
                        active
                          ? 'bg-[#B8556D] text-white border-[#B8556D]'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {statusTab} ({count})
                    </button>
                  );
                })}
              </div>

              {filteredOwnerOrders.length === 0 ? (
                <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-2">
                  <ClipboardList className="w-10 h-10 text-stone-300 mx-auto" />
                  <h3 className="text-base font-bold text-[#17212F]">
                    No {orderStatusFilter === 'All' ? '' : `${orderStatusFilter} `}Orders Found
                  </h3>
                  <p className="text-xs text-stone-500">
                    Orders placed by Individual and Business Buyers for your shop's products appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOwnerOrders.map((order) => {
                    const formattedDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const totalQty = order.items.reduce((sum, i) => sum + i.quantity, 0);

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs"
                      >
                        {/* Order Header */}
                        <div className="bg-stone-50/80 px-5 py-3.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-mono font-bold text-[#17212F] text-sm">
                              {order.orderNumber}
                            </span>
                            <span className="text-stone-400">·</span>
                            <span className="text-stone-600">{formattedDate}</span>
                            {order.buyerRole === 'business_buyer' && (
                              <span className="px-2 py-0.5 rounded bg-[#EEF3FA] text-[#2B4C7E] text-[10px] font-bold">
                                Business Buyer
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                                ORDER_STATUS_STYLES[order.status]
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="font-mono font-extrabold text-sm text-[#17212F]">
                              {formatCurrency(order.totalAmount)}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-4">
                          {/* Buyer Info & Fulfillment */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-stone-100 text-xs">
                            <div className="space-y-1.5">
                              <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                                Buyer Information
                              </span>
                              <p className="font-bold text-[#17212F] text-sm">{order.customerName}</p>
                              <div className="flex flex-wrap items-center gap-4 text-stone-600">
                                <span className="inline-flex items-center gap-1 font-mono">
                                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                                  {order.customerPhone}
                                </span>
                                {order.customerEmail && (
                                  <span className="inline-flex items-center gap-1">
                                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                                    {order.customerEmail}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                                Fulfillment & Payment
                              </span>
                              <div className="flex items-center gap-1.5 font-semibold text-[#17212F]">
                                {order.fulfillmentType === 'pickup' ? (
                                  <>
                                    <Store className="w-4 h-4 text-[#B8556D]" />
                                    <span>Store Self-Pickup</span>
                                  </>
                                ) : (
                                  <>
                                    <Truck className="w-4 h-4 text-blue-700" />
                                    <span>Delivery: {order.deliveryAddress || 'Address provided'}</span>
                                  </>
                                )}
                              </div>
                              <p className="text-stone-500">
                                Payment:{' '}
                                {order.paymentMethod === 'cash_pickup'
                                  ? 'Pay at Store Counter'
                                  : order.paymentMethod === 'cash_delivery'
                                  ? 'Cash on Delivery'
                                  : 'UPI on Delivery'}{' '}
                                · Total Units: <strong className="font-mono">{totalQty}</strong>
                              </p>
                            </div>
                          </div>

                          {/* Ordered Items */}
                          <div className="space-y-2">
                            <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                              Ordered Items ({order.items.length})
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {order.items.map(({ product, quantity }) => (
                                <div
                                  key={product.id}
                                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <img
                                      src={resolveImageUrl(product.imageUrl)}
                                      alt={product.name}
                                      className="w-10 h-10 rounded object-cover border border-stone-200 shrink-0 bg-white"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="min-w-0">
                                      <p className="font-semibold text-[#17212F] truncate">{product.name}</p>
                                      <p className="text-[11px] text-stone-500 font-mono">
                                        {quantity} × {formatCurrency(product.discountedPrice)}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-mono font-bold text-[#17212F] shrink-0">
                                    {formatCurrency(product.discountedPrice * quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Actions */}
                          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-xs text-stone-500">
                              Subtotal: <strong className="font-mono text-[#17212F]">{formatCurrency(order.subtotal)}</strong>
                              {order.deliveryFee > 0 && (
                                <span className="ml-2">
                                  + Delivery: <strong className="font-mono text-[#17212F]">{formatCurrency(order.deliveryFee)}</strong>
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {order.status === 'Pending' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => updateOrderStatus(order.id, 'Accepted')}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Accept Order</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateOrderStatus(order.id, 'Rejected')}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Reject Order</span>
                                  </button>
                                </>
                              )}

                              {order.status !== 'Pending' &&
                                order.status !== 'Completed' &&
                                order.status !== 'Rejected' && (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <label className="text-[11px] font-semibold text-stone-500">
                                      Update Status:
                                    </label>
                                    <select
                                      value={order.status}
                                      onChange={(e) =>
                                        updateOrderStatus(order.id, e.target.value as OrderStatus)
                                      }
                                      className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-semibold text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                                    >
                                      <option value="Accepted">Accepted</option>
                                      <option value="Processing">Processing</option>
                                      <option value="Ready for Pickup">Ready for Pickup</option>
                                      <option value="Completed">Completed</option>
                                      <option value="Rejected">Rejected</option>
                                    </select>

                                    {order.status === 'Accepted' && (
                                      <button
                                        type="button"
                                        onClick={() => updateOrderStatus(order.id, 'Processing')}
                                        className="px-3 py-1.5 rounded-lg bg-[#17212F] hover:bg-[#243347] text-white text-xs font-semibold transition"
                                      >
                                        Start Processing
                                      </button>
                                    )}
                                    {order.status === 'Processing' && (
                                      <button
                                        type="button"
                                        onClick={() => updateOrderStatus(order.id, 'Ready for Pickup')}
                                        className="px-3 py-1.5 rounded-lg bg-[#B8556D] hover:bg-[#A0445A] text-white text-xs font-semibold transition"
                                      >
                                        Mark Ready for Pickup
                                      </button>
                                    )}
                                    {order.status === 'Ready for Pickup' && (
                                      <button
                                        type="button"
                                        onClick={() => updateOrderStatus(order.id, 'Completed')}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                                      >
                                        Mark Completed
                                      </button>
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 5. INVENTORY MANAGEMENT */}
          {activeSection === 'inventory' && (
            <div className="space-y-5">
              {/* Filter & Summary Row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInventoryFilter('all')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition ${
                      inventoryFilter === 'all'
                        ? 'bg-[#17212F] text-white border-[#17212F]'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    All Products ({shopOwnerProducts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInventoryFilter('low')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition ${
                      inventoryFilter === 'low'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
                    }`}
                  >
                    Low Stock ≤ 5 ({metrics.lowStockCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInventoryFilter('out')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition ${
                      inventoryFilter === 'out'
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-red-700 border-red-200 hover:bg-red-50'
                    }`}
                  >
                    Out of Stock ({metrics.outOfStockCount})
                  </button>
                </div>

                <span className="text-xs text-stone-500 font-medium">
                  Low-stock threshold: <strong className="text-[#17212F]">5 units or fewer</strong>
                </span>
              </div>

              {inventoryProducts.length === 0 ? (
                <div className="bg-white rounded-xl border border-stone-200 p-10 text-center space-y-2">
                  <Boxes className="w-10 h-10 text-stone-300 mx-auto" />
                  <p className="text-sm font-bold text-[#17212F]">No products in this stock filter</p>
                  <p className="text-xs text-stone-500">
                    Switch tabs above or add new products to manage store stock.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Product</th>
                          <th className="py-3 px-4 font-semibold">Category</th>
                          <th className="py-3 px-4 font-semibold">Expiry</th>
                          <th className="py-3 px-4 font-semibold">Stock Status</th>
                          <th className="py-3 px-4 font-semibold">Current Stock</th>
                          <th className="py-3 px-4 font-semibold text-right">Adjust Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {inventoryProducts.map((prod) => {
                          const expiry = formatExpiryDisplay(prod.expiryDate);
                          const draftQty = getDraftStock(prod);
                          const hasUnsavedChange = draftQty !== prod.quantity;
                          const isLow = prod.quantity > 0 && prod.quantity <= 5;
                          const isOut = prod.quantity === 0;

                          return (
                            <tr
                              key={prod.id}
                              className={isOut ? 'bg-red-50/40' : isLow ? 'bg-amber-50/40' : 'hover:bg-stone-50/60'}
                            >
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={resolveImageUrl(prod.imageUrl)}
                                    alt={prod.name}
                                    className="w-10 h-10 rounded object-cover border border-stone-200 shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="font-bold text-[#17212F] line-clamp-1 max-w-[220px]">
                                    {prod.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                                {prod.category}
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span className="text-[#17212F] font-medium block">{expiry.formattedDate}</span>
                                <span className="text-[11px] text-stone-500">{expiry.text}</span>
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                {isOut ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-100 text-red-700 font-bold text-[11px]">
                                    <AlertTriangle className="w-3 h-3" />
                                    Out of Stock
                                  </span>
                                ) : isLow ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-bold text-[11px]">
                                    <AlertTriangle className="w-3 h-3" />
                                    Low Stock
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                                    In Stock
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 font-mono font-bold tabular-nums text-[#17212F] whitespace-nowrap">
                                {prod.quantity} units
                              </td>
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-2">
                                  <div className="inline-flex items-center rounded-lg border border-stone-300 bg-white overflow-hidden">
                                    <button
                                      type="button"
                                      onClick={() => handleStockDraftChange(prod.id, draftQty - 1)}
                                      className="p-1.5 text-stone-600 hover:bg-stone-100"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <input
                                      type="number"
                                      min={0}
                                      value={draftQty}
                                      onChange={(e) =>
                                        handleStockDraftChange(prod.id, parseInt(e.target.value, 10))
                                      }
                                      className="w-14 text-center py-1 text-xs font-mono font-bold text-[#17212F] focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleStockDraftChange(prod.id, draftQty + 1)}
                                      className="p-1.5 text-stone-600 hover:bg-stone-100"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    disabled={!hasUnsavedChange}
                                    onClick={() => handleCommitStockUpdate(prod)}
                                    className="px-3 py-1.5 rounded-lg bg-[#B8556D] hover:bg-[#A0445A] disabled:bg-stone-200 disabled:text-stone-400 text-white text-xs font-semibold transition inline-flex items-center gap-1"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Update</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. SALES & EARNINGS */}
          {activeSection === 'sales' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Total Completed Sales
                  </p>
                  <p className="text-2xl font-extrabold text-[#17212F] font-mono tabular-nums mt-2">
                    {formatCurrency(metrics.totalSales)}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    Verified from completed orders
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Completed Orders
                  </p>
                  <p className="text-2xl font-extrabold text-[#17212F] font-mono tabular-nums mt-2">
                    {metrics.completedOrdersCount}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    {metrics.activeOrdersCount} still in progress
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Active Pipeline Value
                  </p>
                  <p className="text-2xl font-extrabold text-[#17212F] font-mono tabular-nums mt-2">
                    {formatCurrency(metrics.pipelineRevenue)}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Pending, Accepted, Processing & Ready
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Average Order Value
                  </p>
                  <p className="text-2xl font-extrabold text-[#17212F] font-mono tabular-nums mt-2">
                    {formatCurrency(metrics.averageOrderValue)}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Across completed orders
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#17212F]">Sales History</h2>
                    <p className="text-xs text-stone-500">
                      Itemized earnings computed directly from live orders for {currentUser?.shopName}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(
                      [
                        { id: 'completed', label: 'Completed Only' },
                        { id: 'active_and_completed', label: 'Active + Completed' },
                        { id: 'all', label: 'All Orders' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSalesFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          salesFilter === tab.id
                            ? 'bg-[#B8556D] text-white border-[#B8556D]'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {salesHistoryOrders.length === 0 ? (
                  <div className="p-10 text-center space-y-2">
                    <IndianRupee className="w-9 h-9 text-stone-300 mx-auto" />
                    <p className="text-sm font-semibold text-[#17212F]">No sales records in this view</p>
                    <p className="text-xs text-stone-500">
                      Complete pending or active orders in Orders Received to record earnings here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Order ID</th>
                          <th className="py-3 px-4 font-semibold">Date</th>
                          <th className="py-3 px-4 font-semibold">Buyer</th>
                          <th className="py-3 px-4 font-semibold">Items & Qty</th>
                          <th className="py-3 px-4 font-semibold">Payment</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-4 font-semibold text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {salesHistoryOrders.map((order) => {
                          const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);
                          const formattedDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          });
                          return (
                            <tr key={order.id} className="hover:bg-stone-50/70">
                              <td className="py-3.5 px-4 font-mono font-bold text-[#17212F] whitespace-nowrap">
                                {order.orderNumber}
                              </td>
                              <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                                {formattedDate}
                              </td>
                              <td className="py-3.5 px-4 font-medium text-[#17212F]">
                                {order.customerName}
                              </td>
                              <td className="py-3.5 px-4 text-stone-600">
                                {order.items.map((i) => `${i.product.name} (×${i.quantity})`).join(', ')}
                                <span className="block text-[11px] text-stone-400">
                                  Total: {totalQty} unit{totalQty === 1 ? '' : 's'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                                {order.paymentMethod === 'cash_pickup'
                                  ? 'Counter Cash/UPI'
                                  : order.paymentMethod === 'cash_delivery'
                                  ? 'COD'
                                  : 'UPI Delivery'}
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                                    ORDER_STATUS_STYLES[order.status]
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums text-[#17212F] whitespace-nowrap">
                                {formatCurrency(order.totalAmount)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. SHOP PROFILE */}
          {activeSection === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form
                onSubmit={handleSaveProfile}
                className="lg:col-span-8 bg-white rounded-xl border border-stone-200 p-6 space-y-5 shadow-xs"
              >
                <div className="pb-3 border-b border-stone-100">
                  <h2 className="text-base font-bold text-[#17212F]">Store & Owner Details</h2>
                  <p className="text-xs text-stone-500">
                    Updating your store details automatically updates your active product listings.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                      Owner Full Name *
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                      Shop / Store Name *
                    </label>
                    <input
                      type="text"
                      value={profileShopName}
                      onChange={(e) => setProfileShopName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                      Store Contact Phone *
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-semibold text-[#17212F] uppercase tracking-wider mb-1.5">
                    Store Pickup Address
                  </label>
                  <textarea
                    rows={2}
                    value={profileShopAddress}
                    onChange={(e) => setProfileShopAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#B8556D] hover:bg-[#A0445A] text-white text-xs font-semibold transition inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Shop Profile</span>
                  </button>
                </div>
              </form>

              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-xs text-xs">
                  <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                    <div className="w-12 h-12 rounded-xl bg-[#17212F] text-white flex items-center justify-center text-lg font-bold">
                      {currentUser?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#17212F]">{currentUser?.shopName}</p>
                      <span className="inline-block px-2 py-0.5 rounded bg-[#FAF0F2] text-[#B8556D] text-[10px] font-bold">
                        Verified Shop Owner
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-stone-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{currentUser?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="font-mono">{currentUser?.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{currentUser?.shopAddress || 'Address not set'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF0F2] rounded-xl border border-[#F0D9DF] p-4 space-y-2.5 text-xs">
                  <p className="font-bold text-[#17212F]">Switch Demo Store Account</p>
                  <p className="text-[11px] text-stone-600">
                    Test multi-seller isolation between different shop owner accounts:
                  </p>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => quickSwitchUser('user_shop_1')}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-semibold transition ${
                        currentUser?.id === 'user_shop_1'
                          ? 'bg-[#B8556D] text-white border-[#B8556D]'
                          : 'bg-white text-[#17212F] border-[#F0D9DF] hover:bg-stone-50'
                      }`}
                    >
                      Ramesh Patel · Krishna Daily Needs
                    </button>
                    <button
                      type="button"
                      onClick={() => quickSwitchUser('user_shop_2')}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-semibold transition ${
                        currentUser?.id === 'user_shop_2'
                          ? 'bg-[#B8556D] text-white border-[#B8556D]'
                          : 'bg-white text-[#17212F] border-[#F0D9DF] hover:bg-stone-50'
                      }`}
                    >
                      Anita Nair · Oven & Crust Bakehouse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-[#17212F]">Edit & Update Product</h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 text-stone-400 hover:text-stone-600"
                aria-label="Close edit modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEditedProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#17212F] mb-1">Product Name *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17212F] mb-1">Category *</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as ProductCategory)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17212F] mb-1">Description *</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#17212F] mb-1">Original MRP (₹) *</label>
                  <input
                    type="number"
                    min={1}
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17212F] mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    min={1}
                    value={editDiscountedPrice}
                    onChange={(e) => setEditDiscountedPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17212F] mb-1">Quantity *</label>
                  <input
                    type="number"
                    min={0}
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#17212F] mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    value={editExpiryDate}
                    onChange={(e) => setEditExpiryDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#17212F] mb-1">Mfg Date</label>
                  <input
                    type="date"
                    value={editMfgDate}
                    onChange={(e) => setEditMfgDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#B8556D]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#B8556D] hover:bg-[#A0445A] text-white font-semibold"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
