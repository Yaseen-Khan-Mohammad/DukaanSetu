export type UserRole = 'individual' | 'shop_owner' | 'business_buyer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  shopName?: string;
  shopAddress?: string;
  savedAddress?: string;
}

export type ProductCategory =
  | 'Fruits & Vegetables'
  | 'Dairy Products'
  | 'Bakery Items'
  | 'Packaged Foods'
  | 'Beverages'
  | 'Household Essentials'
  | 'Others';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  quantity: number;
  mfgDate?: string;
  expiryDate: string; // YYYY-MM-DD
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  shopOwnerId?: string;
  distanceKm: number;
  addedAt: string;
  status: 'available' | 'low_stock' | 'sold_out';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type FulfillmentType = 'pickup' | 'delivery';
export type PaymentMethod = 'cash_pickup' | 'cash_delivery' | 'upi_delivery';
export type OrderStatus = 'Confirmed' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  savings: number;
  deliveryFee: number;
  totalAmount: number;
  orderDate: string;
  status: OrderStatus;
  shopName: string;
  shopPhone: string;
}
