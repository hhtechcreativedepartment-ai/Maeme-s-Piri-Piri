import type { CheckoutState, PaymentMethod, OrderType } from '@/types';
import { readStorage, removeStorage, writeStorage } from '@/utils/storage';

const CHECKOUT_KEY = 'maemes.checkout';

const initialCheckoutState: CheckoutState = {
  orderType: null,
  deliveryAddressId: null,
  paymentMethod: null,
  voucherCode: '',
  notes: '',
};

function getCheckout() {
  return readStorage<CheckoutState>(CHECKOUT_KEY, initialCheckoutState);
}

function saveCheckout(state: CheckoutState) {
  writeStorage(CHECKOUT_KEY, state);
  return state;
}

export const checkoutStore = {
  get state() {
    return getCheckout();
  },

  setOrderType(orderType: OrderType) {
    return saveCheckout({ ...getCheckout(), orderType });
  },

  setDeliveryAddress(addressId: string | null) {
    return saveCheckout({ ...getCheckout(), deliveryAddressId: addressId });
  },

  setPaymentMethod(paymentMethod: PaymentMethod | null) {
    return saveCheckout({ ...getCheckout(), paymentMethod });
  },

  setVoucherCode(voucherCode: string) {
    return saveCheckout({ ...getCheckout(), voucherCode });
  },

  setNotes(notes: string) {
    return saveCheckout({ ...getCheckout(), notes });
  },

  clearCheckout() {
    removeStorage(CHECKOUT_KEY);
    return initialCheckoutState;
  },
};
