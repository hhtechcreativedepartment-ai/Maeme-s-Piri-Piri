import type { CartItem } from '@/types';
import { readStorage, writeStorage, removeStorage } from '@/utils/storage';

const CART_KEY = 'maemes.cart';
const SERVICE_CHARGE = 0.79;

function getItems() {
  return readStorage<CartItem[]>(CART_KEY, []);
}

function saveItems(items: CartItem[]) {
  writeStorage(CART_KEY, items);
}

export const cartStore = {
  get items() {
    return getItems();
  },

  addItem(item: CartItem) {
    const items = getItems();
    saveItems([...items, item]);
    return getItems();
  },

  removeItem(itemId: string) {
    const nextItems = getItems().filter(item => item.id !== itemId);
    saveItems(nextItems);
    return nextItems;
  },

  updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) return this.removeItem(itemId);

    const nextItems = getItems().map(item => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        quantity,
        totalPrice: Number((item.unitPrice * quantity).toFixed(2)),
      };
    });
    saveItems(nextItems);
    return nextItems;
  },

  clearCart() {
    removeStorage(CART_KEY);
    return [];
  },

  calculateSubtotal() {
    return Number(getItems().reduce((total, item) => total + item.totalPrice, 0).toFixed(2));
  },

  calculateTotal(deliveryFee = 0, discount = 0) {
    const total = this.calculateSubtotal() + deliveryFee + SERVICE_CHARGE - discount;
    return Number(Math.max(total, 0).toFixed(2));
  },
};
