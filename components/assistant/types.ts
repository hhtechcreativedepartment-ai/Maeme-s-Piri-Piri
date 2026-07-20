import type { Branch } from '@/lib/branchData';
import type { CartItem } from '@/lib/cartContext';
import type { FavouriteItem } from '@/lib/favouritesContext';
import type { MenuItem } from '@/lib/menuData';
import type { Order } from '@/lib/orderUtils';

export type AssistantStep =
  | 'welcome'
  | 'branchConfirmation'
  | 'branchSelection'
  | 'intentSelection'
  | 'productSearch'
  | 'productSelection'
  | 'productCustomisation'
  | 'cartReview'
  | 'orderType'
  | 'addressSelection'
  | 'authentication'
  | 'paymentSelection'
  | 'finalConfirmation'
  | 'orderProcessing'
  | 'receipt'
  | 'error';

export type AssistantCard =
  | { type: 'products'; products: MenuItem[]; reason?: string }
  | { type: 'categories'; categories: string[] }
  | { type: 'branches'; branches: Branch[] }
  | { type: 'cart' }
  | { type: 'receipt'; order: Order; discount: number; address?: string };

export interface AssistantMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  card?: AssistantCard;
  createdAt: number;
}

export interface DemoAddress {
  id: string;
  label: 'Home' | 'Office' | 'Work';
  summary: string;
  postcode: string;
}

export type DemoPayment = 'cash' | 'visa-4242' | 'mastercard-4444';

export interface AssistantState {
  step: AssistantStep;
  messages: AssistantMessage[];
  history: AssistantStep[];
  selectedProduct: MenuItem | null;
  productMatches: MenuItem[];
  selectedAddress: DemoAddress | null;
  payment: DemoPayment | null;
  discount: number;
  lastOrder: Order | null;
  pendingPrivateIntent: 'favourites' | 'reorder' | null;
  submissionId: string | null;
  isProcessing: boolean;
  error: string | null;
}

export interface AssistantServices {
  menu: {
    all: () => MenuItem[];
    search: (query: string) => MenuItem[];
    recommend: (kind: 'light' | 'normal' | 'hungry' | 'vegetarian', budget?: number) => MenuItem[];
  };
  branches: {
    all: () => Branch[];
    search: (query: string) => Branch[];
    current: Branch | null;
    select: (branchId: string, orderType?: 'delivery' | 'pickup') => void;
  };
  cart: {
    items: CartItem[];
    total: () => number;
    add: (item: CartItem) => void;
    remove: (item: CartItem) => void;
    quantity: (item: CartItem, quantity: number) => void;
    clear: () => void;
    orderType: 'delivery' | 'pickup' | null;
    setOrderType: (type: 'delivery' | 'pickup') => void;
  };
  auth: {
    authenticated: boolean;
  };
  favourites: {
    all: () => FavouriteItem[];
  };
  orders: {
    all: () => Order[];
    add: (order: Order) => void;
  };
}

export type AssistantAction =
  | { type: 'hydrate'; state: AssistantState }
  | { type: 'message'; message: AssistantMessage }
  | { type: 'navigate'; step: AssistantStep }
  | { type: 'back' }
  | { type: 'selectProduct'; product: MenuItem | null }
  | { type: 'matches'; products: MenuItem[] }
  | { type: 'address'; address: DemoAddress | null }
  | { type: 'payment'; payment: DemoPayment | null }
  | { type: 'privateIntent'; intent: AssistantState['pendingPrivateIntent'] }
  | { type: 'processing'; submissionId: string }
  | { type: 'receipt'; order: Order }
  | { type: 'error'; error: string }
  | { type: 'reset' };
