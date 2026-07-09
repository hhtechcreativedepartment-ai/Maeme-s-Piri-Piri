'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Branch, BRANCHES, findNearestBranch } from './branchData';

export interface CartItemCustomization {
  selectedSize?: string;
  selectedFlavour?: string;
  selectedSpiceLevel?: string;
  selectedAddOns?: { name: string; price: number }[];
  specialInstructions?: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  image?: string;
  basePrice?: number;
  selectedSize?: string;
  selectedFlavour?: string;
  selectedSpiceLevel?: string;
  selectedAddOns?: { name: string; price: number }[];
  specialInstructions?: string;
  unitPrice?: number;
  customization?: CartItemCustomization;
  totalPrice?: number;
}

export type OrderType = 'delivery' | 'pickup';

export interface CartContextType {
  items: CartItem[];
  selectedBranch: Branch | null;
  selectedOrderType: OrderType | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, customization?: CartItemCustomization) => void;
  updateQuantity: (productId: number, quantity: number, customization?: CartItemCustomization) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  selectBranchByPostcode: (postcode: string) => void;
  selectBranch: (branchId: string, orderType?: OrderType) => void;
  setOrderType: (orderType: OrderType) => void;
  clearBranch: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType | null>(null);
  const [, setIsHydrated] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedBranchId = localStorage.getItem('selectedBranchId');
    const savedOrderType = localStorage.getItem('selectedOrderType') as OrderType | null;
    const savedItems = localStorage.getItem('cartItems');
    
    if (savedBranchId) {
      const branch = BRANCHES.find(b => b.branchId === savedBranchId);
      if (branch) {
        setSelectedBranch(branch);
      }
    }
    if (savedOrderType === 'delivery' || savedOrderType === 'pickup') {
      setSelectedOrderType(savedOrderType);
    }
    
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        setItems(parsedItems);
      } catch (e) {
        console.error('Failed to parse saved cart items', e);
      }
    }
    
    setIsHydrated(true);
  }, []);

  const addToCart = (item: CartItem) => {
    setItems(prevItems => {
      const newItems = [...prevItems, item];
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = (productId: number, customization?: CartItemCustomization) => {
    setItems(prevItems => {
      const newItems = customization
        ? prevItems.filter(item => !(item.productId === productId && JSON.stringify(item.customization) === JSON.stringify(customization)))
        : prevItems.filter(item => item.productId !== productId);
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number, customization?: CartItemCustomization) => {
    if (quantity <= 0) {
      removeFromCart(productId, customization);
    } else {
      setItems(prevItems => {
        const newItems = prevItems.map(item => {
          if (item.productId === productId) {
            if (customization && JSON.stringify(item.customization) === JSON.stringify(customization)) {
              return { ...item, quantity, totalPrice: (item.unitPrice ?? item.price) * quantity };
            } else if (!customization && !item.customization) {
              return { ...item, quantity, totalPrice: (item.unitPrice ?? item.price) * quantity };
            }
          }
          return item;
        });
        localStorage.setItem('cartItems', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const getCartTotal = () => {
    return items.reduce((sum, item) => sum + (item.unitPrice ?? item.price) * item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const selectBranchByPostcode = (postcode: string) => {
    const branch = findNearestBranch(postcode);
    setSelectedBranch(branch);
    localStorage.setItem('selectedBranchId', branch.branchId);
  };

  const selectBranch = (branchId: string, orderType?: OrderType) => {
    const branch = BRANCHES.find(b => b.branchId === branchId);
    if (branch) {
      setSelectedBranch(branch);
      localStorage.setItem('selectedBranchId', branchId);
      if (orderType) {
        setSelectedOrderType(orderType);
        localStorage.setItem('selectedOrderType', orderType);
      }
    }
  };

  const setOrderType = (orderType: OrderType) => {
    setSelectedOrderType(orderType);
    localStorage.setItem('selectedOrderType', orderType);
  };

  const clearBranch = () => {
    setSelectedBranch(null);
    setSelectedOrderType(null);
    localStorage.removeItem('selectedBranchId');
    localStorage.removeItem('selectedOrderType');
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        selectedBranch,
        selectedOrderType,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
        selectBranchByPostcode,
        selectBranch,
        setOrderType,
        clearBranch,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
