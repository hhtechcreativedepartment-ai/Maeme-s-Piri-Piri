'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { Branch, CartItem, OrderType, Promo, SavedAddress, SavedCard, UserSession } from '@/types';
import { readStorage, removeStorage, writeStorage } from '@/utils/storage';

interface AppStoreState {
  cart: CartItem[];
  selectedBranch: Branch | null;
  selectedOrderType: OrderType | null;
  userSession: UserSession | null;
  savedAddresses: SavedAddress[];
  savedCards: SavedCard[];
  orders: unknown[];
  favourites: string[];
  promos: Promo[];
}

interface AppStoreValue extends AppStoreState {
  isHydrated: boolean;
  setCart: (cart: CartItem[]) => void;
  setSelectedBranch: (branch: Branch | null) => void;
  setSelectedOrderType: (orderType: OrderType | null) => void;
  setUserSession: (session: UserSession | null) => void;
  resetPrototypeState: () => void;
}

const initialState: AppStoreState = {
  cart: [],
  selectedBranch: null,
  selectedOrderType: null,
  userSession: null,
  savedAddresses: [],
  savedCards: [],
  orders: [],
  favourites: [],
  promos: [],
};

const storageKeys = {
  cart: 'maemes.cart',
  selectedBranch: 'maemes.selectedBranch',
  selectedOrderType: 'maemes.selectedOrderType',
  userSession: 'maemes.userSession',
  savedAddresses: 'maemes.savedAddresses',
  savedCards: 'maemes.savedCards',
  orders: 'maemes.orders',
  favourites: 'maemes.favourites',
  promos: 'maemes.promos',
} as const;

const AppStoreContext = createContext<AppStoreValue | undefined>(undefined);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppStoreState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setState({
      cart: readStorage(storageKeys.cart, []),
      selectedBranch: readStorage(storageKeys.selectedBranch, null),
      selectedOrderType: readStorage(storageKeys.selectedOrderType, null),
      userSession: readStorage(storageKeys.userSession, null),
      savedAddresses: readStorage(storageKeys.savedAddresses, []),
      savedCards: readStorage(storageKeys.savedCards, []),
      orders: readStorage(storageKeys.orders, []),
      favourites: readStorage(storageKeys.favourites, []),
      promos: readStorage(storageKeys.promos, []),
    });
    setIsHydrated(true);
  }, []);

  const value = useMemo<AppStoreValue>(() => ({
    ...state,
    isHydrated,
    setCart: cart => {
      setState(current => ({ ...current, cart }));
      writeStorage(storageKeys.cart, cart);
    },
    setSelectedBranch: selectedBranch => {
      setState(current => ({ ...current, selectedBranch }));
      if (selectedBranch) {
        writeStorage(storageKeys.selectedBranch, selectedBranch);
      } else {
        removeStorage(storageKeys.selectedBranch);
      }
    },
    setSelectedOrderType: selectedOrderType => {
      setState(current => ({ ...current, selectedOrderType }));
      if (selectedOrderType) {
        writeStorage(storageKeys.selectedOrderType, selectedOrderType);
      } else {
        removeStorage(storageKeys.selectedOrderType);
      }
    },
    setUserSession: userSession => {
      setState(current => ({ ...current, userSession }));
      if (userSession) {
        writeStorage(storageKeys.userSession, userSession);
      } else {
        removeStorage(storageKeys.userSession);
      }
    },
    resetPrototypeState: () => {
      setState(initialState);
      Object.values(storageKeys).forEach(removeStorage);
    },
  }), [isHydrated, state]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }
  return context;
}
