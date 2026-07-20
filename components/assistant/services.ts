'use client';

import { useMemo } from 'react';
import { BRANCHES } from '@/lib/branchData';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/cartContext';
import { useFavourites } from '@/lib/favouritesContext';
import { MENU_DATA } from '@/lib/menuData';
import { useOrders } from '@/lib/ordersContext';
import type { AssistantServices } from './types';

const normalize = (value: string) => value.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

export function useAssistantServices(): AssistantServices {
  const cart = useCart();
  const auth = useAuth();
  const favourites = useFavourites();
  const orders = useOrders();

  return useMemo(() => ({
    menu: {
      all: () => MENU_DATA,
      search: (query: string) => {
        const tokens = normalize(query).split(' ').filter(Boolean);
        return MENU_DATA
          .filter((product) => {
            const haystack = normalize(`${product.name} ${product.category} ${product.description}`);
            return tokens.some((token) => haystack.includes(token));
          })
          .slice(0, 4);
      },
      recommend: (kind, budget) => {
        let products = MENU_DATA.filter((product) => !budget || product.price <= budget);
        if (kind === 'vegetarian') products = products.filter((product) => normalize(product.category).includes('vegetarian'));
        if (kind === 'light') {
          const nonFoodCategories = new Set([
            'dips',
            'drinks',
            'milkshakes',
            'ice cream',
            'dessert collection',
            'sides extras',
            'sides and extras',
            'maemes extras',
          ]);
          products = products
            .filter((product) => product.price >= 3 && product.price <= 8)
            .filter((product) => !nonFoodCategories.has(normalize(product.category)))
            .filter((product) => !/\b(sauce|dip|seasoning|topping|drink|shake|fries)\b/i.test(product.name))
            .sort((a, b) => a.price - b.price);
        }
        if (kind === 'hungry') {
          products = products.filter((product) => /platter|sharing|box|meal|chicken/i.test(`${product.category} ${product.name}`)).sort((a, b) => b.price - a.price);
        }
        if (kind === 'normal') products = products.filter((product) => product.offer || product.popular || product.price <= 10);
        return products.slice(0, 4);
      },
    },
    branches: {
      all: () => BRANCHES,
      search: (query: string) => {
        const value = normalize(query);
        return BRANCHES.filter((branch) => normalize(`${branch.branchName} ${branch.address} ${branch.postcode}`).includes(value));
      },
      current: cart.selectedBranch,
      select: cart.selectBranch,
    },
    cart: {
      items: cart.items,
      total: cart.getCartTotal,
      add: cart.addToCart,
      remove: (item) => cart.removeFromCart(item.productId, item.customization),
      quantity: (item, quantity) => cart.updateQuantity(item.productId, quantity, item.customization),
      clear: cart.clearCart,
      orderType: cart.selectedOrderType,
      setOrderType: cart.setOrderType,
    },
    auth: { authenticated: auth.isAuthenticated },
    favourites: { all: () => favourites.favourites },
    orders: { all: orders.getAllOrders, add: orders.addOrder },
  }), [auth.isAuthenticated, cart, favourites.favourites, orders]);
}
