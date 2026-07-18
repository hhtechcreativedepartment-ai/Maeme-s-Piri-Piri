'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order } from './orderUtils';

interface OrdersContextType {
  orders: Order[];
  currentOrder: Order | null;
  addOrder: (order: Order) => void;
  getOrderByNumber: (orderNumber: string) => Order | null;
  getAllOrders: () => Order[];
  updateOrderStatus: (orderNumber: string, newStatus: Order['status'], currentStep: Order['currentStep']) => void;
  cancelOrder: (orderNumber: string, reason: string) => boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [, setIsHydrated] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('userOrders');
    const savedCurrentOrder = localStorage.getItem('currentOrder');
    const savedAddresses = localStorage.getItem('maemes.checkout.savedAddresses');
    let fallbackDeliveryAddress = '';

    if (savedAddresses) {
      try {
        const addresses = JSON.parse(savedAddresses) as Array<{
          recipientName?: string;
          address?: string;
          city?: string;
          postcode?: string;
        }>;
        const address = addresses[0];
        if (address) {
          fallbackDeliveryAddress = [
            address.recipientName,
            address.address,
            address.city,
            address.postcode,
          ].filter(Boolean).join(', ');
        }
      } catch {
        fallbackDeliveryAddress = '';
      }
    }

    const addLegacyDeliveryAddress = (order: Order): Order => (
      order.orderType === 'delivery' && !order.deliveryAddress && fallbackDeliveryAddress
        ? { ...order, deliveryAddress: fallbackDeliveryAddress }
        : order
    );

    if (savedOrders) {
      try {
        const parsedOrders = (JSON.parse(savedOrders) as Order[]).map(addLegacyDeliveryAddress);
        setOrders(parsedOrders);
        localStorage.setItem('userOrders', JSON.stringify(parsedOrders));
      } catch (e) {
        console.error('Failed to parse saved orders', e);
      }
    }

    if (savedCurrentOrder) {
      try {
        const parsedCurrentOrder = addLegacyDeliveryAddress(JSON.parse(savedCurrentOrder) as Order);
        setCurrentOrder(parsedCurrentOrder);
        localStorage.setItem('currentOrder', JSON.stringify(parsedCurrentOrder));
      } catch (e) {
        console.error('Failed to parse current order', e);
      }
    }

    setIsHydrated(true);
  }, []);

  const addOrder = (order: Order) => {
    setOrders(prevOrders => {
      const newOrders = [order, ...prevOrders];
      localStorage.setItem('userOrders', JSON.stringify(newOrders));
      return newOrders;
    });
    setCurrentOrder(order);
    localStorage.setItem('currentOrder', JSON.stringify(order));
  };

  const getOrderByNumber = (orderNumber: string): Order | null => {
    return orders.find(order => order.orderNumber === orderNumber) || null;
  };

  const getAllOrders = (): Order[] => {
    return orders;
  };

  const updateOrderStatus = (orderNumber: string, newStatus: Order['status'], currentStep: Order['currentStep']) => {
    setOrders(prevOrders => {
      const newOrders = prevOrders.map(order =>
        order.orderNumber === orderNumber
          ? order.status === 'cancelled'
            ? order
            : { ...order, status: newStatus, currentStep }
          : order
      );
      localStorage.setItem('userOrders', JSON.stringify(newOrders));
      return newOrders;
    });

    if (currentOrder?.orderNumber === orderNumber) {
      if (currentOrder.status === 'cancelled') return;
      const updated = { ...currentOrder, status: newStatus, currentStep };
      setCurrentOrder(updated);
      localStorage.setItem('currentOrder', JSON.stringify(updated));
    }
  };

  const cancelOrder = (orderNumber: string, reason: string): boolean => {
    const targetOrder = orders.find((order) => order.orderNumber === orderNumber)
      || (currentOrder?.orderNumber === orderNumber ? currentOrder : null);

    if (!targetOrder || targetOrder.status !== 'received' || targetOrder.currentStep !== 0 || !reason.trim()) {
      return false;
    }

    const cancelledOrder: Order = {
      ...targetOrder,
      status: 'cancelled',
      cancellationReason: reason.trim(),
      cancelledAt: Date.now(),
    };

    setOrders((previousOrders) => {
      const nextOrders = previousOrders.map((order) => (
        order.orderNumber === orderNumber ? cancelledOrder : order
      ));
      localStorage.setItem('userOrders', JSON.stringify(nextOrders));
      return nextOrders;
    });

    if (currentOrder?.orderNumber === orderNumber) {
      setCurrentOrder(cancelledOrder);
      localStorage.setItem('currentOrder', JSON.stringify(cancelledOrder));
    }

    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      try {
        const parsedLastOrder = JSON.parse(lastOrder) as Order;
        if (parsedLastOrder.orderNumber === orderNumber) {
          localStorage.setItem('lastOrder', JSON.stringify(cancelledOrder));
        }
      } catch {
        // Ignore malformed legacy order data.
      }
    }

    return true;
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        currentOrder,
        addOrder,
        getOrderByNumber,
        getAllOrders,
        updateOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};
