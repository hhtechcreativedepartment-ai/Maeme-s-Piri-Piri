import type { CartItem, Order, OrderType, PaymentMethod } from '@/types';
import { orders as seedOrders } from '@/data/orders';
import { readStorage, writeStorage } from '@/utils/storage';

const ORDERS_KEY = 'maemes.orders';
const CURRENT_ORDER_KEY = 'maemes.currentOrder';

function getOrders() {
  return readStorage<Order[]>(ORDERS_KEY, seedOrders);
}

function saveOrders(orders: Order[]) {
  writeStorage(ORDERS_KEY, orders);
}

interface CreateOrderInput {
  userId: string;
  branchId: string;
  orderType: OrderType;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  discount: number;
  paymentMethod: PaymentMethod;
}

export const orderStore = {
  get orders() {
    return getOrders();
  },

  createOrder(input: CreateOrderInput) {
    const total = Number((input.subtotal + input.deliveryFee + input.serviceCharge - input.discount).toFixed(2));
    const order: Order = {
      id: `MM-${Date.now()}`,
      userId: input.userId,
      branchId: input.branchId,
      orderType: input.orderType,
      status: 'confirmed',
      items: input.items,
      subtotal: input.subtotal,
      deliveryFee: input.deliveryFee,
      serviceCharge: input.serviceCharge,
      discount: input.discount,
      total,
      createdAt: new Date().toISOString(),
      paymentMethod: input.paymentMethod,
    };
    const nextOrders = [order, ...getOrders()];
    saveOrders(nextOrders);
    writeStorage(CURRENT_ORDER_KEY, order);
    return order;
  },

  getOrdersByUser(userId: string) {
    return getOrders().filter(order => order.userId === userId);
  },

  getCurrentOrder() {
    return readStorage<Order | null>(CURRENT_ORDER_KEY, null);
  },

  updateOrderStatus(orderId: string, status: Order['status']) {
    const nextOrders = getOrders().map(order => order.id === orderId ? { ...order, status } : order);
    saveOrders(nextOrders);
    const updated = nextOrders.find(order => order.id === orderId) || null;
    if (updated) writeStorage(CURRENT_ORDER_KEY, updated);
    return updated;
  },

  cancelOrder(orderId: string) {
    return this.updateOrderStatus(orderId, 'cancelled');
  },
};
