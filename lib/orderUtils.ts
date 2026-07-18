export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  orderNumber: string;
  timestamp: number;
  branchName: string;
  branchAddress: string;
  deliveryAddress?: string;
  orderType: 'delivery' | 'pickup';
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'card' | 'cash';
  estimatedTime: number; // minutes
  currentStep: 0 | 1 | 2 | 3; // 0: received, 1: preparing, 2: ready/out, 3: completed
  cancellationReason?: string;
  cancelledAt?: number;
}

const ORDER_STATUS_STEPS = ['Order Received', 'Preparing', 'Ready / Out for Delivery', 'Completed'] as const;

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

export function createOrder(data: {
  branchName: string;
  branchAddress: string;
  deliveryAddress?: string;
  orderType: 'delivery' | 'pickup';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'card' | 'cash';
}): Order {
  return {
    orderNumber: generateOrderNumber(),
    timestamp: Date.now(),
    branchName: data.branchName,
    branchAddress: data.branchAddress,
    deliveryAddress: data.deliveryAddress,
    orderType: data.orderType,
    status: 'received',
    items: data.items,
    subtotal: data.subtotal,
    deliveryFee: data.deliveryFee,
    total: data.total,
    paymentMethod: data.paymentMethod,
    estimatedTime: data.orderType === 'delivery' ? 45 : 30,
    currentStep: 0,
  };
}

export function getOrderStatusSteps() {
  return ORDER_STATUS_STEPS;
}

export function getEstimatedArrivalTime(order: Order): string {
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + order.estimatedTime * 60000);
  return arrivalTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function saveOrder(order: Order): void {
  localStorage.setItem('lastOrder', JSON.stringify(order));
}

export function getLastOrder(): Order | null {
  const saved = localStorage.getItem('lastOrder');
  return saved ? JSON.parse(saved) : null;
}

export function getMockOrderProgress(orderNumber: string): Order {
  const lastOrder = getLastOrder();
  if (!lastOrder || lastOrder.orderNumber !== orderNumber) {
    return lastOrder || ({} as Order);
  }
  if (lastOrder.status === 'cancelled') {
    return lastOrder;
  }

  // Simulate order progress based on time elapsed
  const elapsedMinutes = Math.floor((Date.now() - lastOrder.timestamp) / 60000);
  let currentStep: 0 | 1 | 2 | 3 = 0;

  if (elapsedMinutes > lastOrder.estimatedTime) {
    currentStep = 3;
  } else if (elapsedMinutes > lastOrder.estimatedTime * 0.7) {
    currentStep = 2;
  } else if (elapsedMinutes > lastOrder.estimatedTime * 0.3) {
    currentStep = 1;
  }

  return {
    ...lastOrder,
    currentStep,
    status: currentStep === 3 ? 'completed' : currentStep === 2 ? 'ready' : currentStep === 1 ? 'preparing' : 'received',
  };
}
