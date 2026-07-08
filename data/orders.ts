import type { Order } from '@/types';

export const orders: Order[] = [
  {
    id: 'MM-2407-1001',
    userId: 'user-demo-001',
    branchId: 'maemes-southall',
    orderType: 'delivery',
    status: 'confirmed',
    items: [
      {
        id: 'cart-demo-001',
        productId: 'half-piri-piri-chicken',
        name: 'Half Piri Piri Chicken',
        image: '/images/hero-chicken.png',
        basePrice: 10.99,
        selectedSize: 'Regular',
        selectedFlavour: 'Medium',
        selectedAddOns: [{ name: 'Dip', price: 0.75 }],
        quantity: 1,
        unitPrice: 11.74,
        totalPrice: 11.74,
      },
    ],
    subtotal: 11.74,
    deliveryFee: 2.49,
    serviceCharge: 0.79,
    discount: 0,
    total: 15.02,
    createdAt: '2026-07-07T12:15:00.000Z',
    paymentMethod: 'card',
  },
];
