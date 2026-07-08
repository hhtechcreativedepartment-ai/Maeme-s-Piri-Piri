export type OrderType = 'delivery' | 'pickup';

export type PaymentMethod = 'cash' | 'card' | 'apple-pay' | 'google-pay';

export interface Branch {
  id: string;
  name: string;
  address: string;
  postcode: string;
  phone?: string;
  openingHours: Record<string, string>;
  openNow: boolean;
  deliveryTime: string;
  pickupTime: string;
  minOrder: number;
  deliveryFee: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  kcal: number;
  popular: boolean;
  options: ProductOptionGroup[];
  addOns: ProductAddOn[];
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  required: boolean;
  values: ProductOption[];
}

export interface ProductOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface ProductAddOn {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  basePrice: number;
  selectedSize?: string;
  selectedFlavour?: string;
  selectedAddOns: Array<{ name: string; price: number }>;
  specialInstructions?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface UserSession {
  userId: string;
  name: string;
  phone: string;
  email?: string;
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Office' | 'Work' | 'Other';
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  isDefault?: boolean;
}

export interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  nameOnCard: string;
}

export interface Promo {
  code: string;
  title: string;
  description?: string;
  discountAmount?: number;
  discountPercent?: number;
}

export interface Order {
  id: string;
  userId: string;
  branchId: string;
  orderType: OrderType;
  status: 'confirmed' | 'preparing' | 'on-the-way' | 'ready' | 'completed' | 'cancelled';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  discount: number;
  total: number;
  createdAt: string;
  paymentMethod: PaymentMethod;
}

export interface CheckoutState {
  orderType: OrderType | null;
  deliveryAddressId: string | null;
  paymentMethod: PaymentMethod | null;
  voucherCode: string;
  notes: string;
}
