import type { Promo } from '@/types';

export const promos: Promo[] = [
  {
    code: 'MAEMES10',
    title: '10% off your next order',
    description: 'Enjoy 10% off your next Maeme’s order.',
    discountPercent: 10,
  },
  {
    code: 'FAMILY5',
    title: 'GBP 5 off family feasts',
    description: 'Save on larger grilled chicken orders for sharing.',
    discountAmount: 5,
  },
  {
    code: 'SHAKEUP',
    title: 'Milkshake treat',
    description: 'Add a milkshake to selected meals and save.',
    discountAmount: 2,
  },
];
