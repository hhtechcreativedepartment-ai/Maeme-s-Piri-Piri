import type { ProductCategory } from '@/types';

export const categories: ProductCategory[] = [
  { id: 'grilled-collection', name: 'Grilled Collection', image: '/images/hero-chicken.png' },
  { id: 'maemes-burgers', name: 'Maeme’s Burgers', image: '/images/hero-chicken.png' },
  { id: 'vegetarian-collection', name: 'Vegetarian Collection', image: '/images/chicken-wrap.png' },
  { id: 'fried-collection', name: 'Fried Collection', image: '/images/chicken-fries.png' },
  { id: 'maemes-platter', name: 'Maeme’s Platter', image: '/images/meal-bowl.png' },
  { id: 'kids-meal', name: 'Kids Meal', image: '/images/hero-chicken.png' },
  { id: 'dessert-collection', name: 'Dessert Collection', image: '/images/premium-hero-chicken.png' },
  { id: 'sides-collection', name: 'Sides Collection', image: '/images/chicken-fries.png' },
  { id: 'maemes-extras', name: 'Maeme’s Extras', image: '/images/chicken-wrap.png' },
  { id: 'ice-cream', name: 'Ice Cream', image: '/images/premium-hero-chicken.png' },
  { id: 'dips', name: 'Dips', image: '/images/chicken-fries.png' },
  { id: 'drinks', name: 'Drinks', image: '/images/meal-bowl.png' },
];

export const categoryNames = categories.map(category => category.name);
