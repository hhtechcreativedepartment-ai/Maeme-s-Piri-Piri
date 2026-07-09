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

    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);
      } catch (e) {
        console.error('Failed to parse saved orders', e);
      }
    }

    if (savedCurrentOrder) {
      try {
        const parsedCurrentOrder = JSON.parse(savedCurrentOrder);
        setCurrentOrder(parsedCurrentOrder);
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
          ? { ...order, status: newStatus, currentStep }
          : order
      );
      localStorage.setItem('userOrders', JSON.stringify(newOrders));
      return newOrders;
    });

    if (currentOrder?.orderNumber === orderNumber) {
      const updated = { ...currentOrder, status: newStatus, currentStep };
      setCurrentOrder(updated);
      localStorage.setItem('currentOrder', JSON.stringify(updated));
    }
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
