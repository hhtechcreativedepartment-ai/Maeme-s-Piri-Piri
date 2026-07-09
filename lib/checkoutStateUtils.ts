import type { NewPaymentMethodInput, SavedPaymentMethod } from './paymentConfig';

interface CheckoutAddress {
  id: string;
  type: 'home' | 'office' | 'work' | 'other';
  street: string;
  postcode: string;
}

export interface CheckoutState {
  orderType: 'delivery' | 'pickup' | null;
  selectedAddressId: string | null;
  selectedPaymentId: string | null;
  paymentMethod: 'card' | 'cash';
  savedAddresses: CheckoutAddress[];
  savedPaymentMethods: Array<SavedPaymentMethod | NewPaymentMethodInput>;
}

const CHECKOUT_STATE_KEY = 'checkoutState';

export const saveCheckoutState = (state: CheckoutState) => {
  localStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify(state));
};

export const getCheckoutState = (): CheckoutState | null => {
  const saved = localStorage.getItem(CHECKOUT_STATE_KEY);
  if (!saved) return null;
  
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse checkout state', e);
    return null;
  }
};

export const clearCheckoutState = () => {
  localStorage.removeItem(CHECKOUT_STATE_KEY);
};

export const hasCheckoutState = (): boolean => {
  return !!localStorage.getItem(CHECKOUT_STATE_KEY);
};
