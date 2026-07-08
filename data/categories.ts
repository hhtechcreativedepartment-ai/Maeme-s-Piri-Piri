import type { ProductCategory } from '@/types';

export const categories: ProductCategory[] = [
  { id: 'grilled-collection', name: 'Grilled Collection', image: '/images/hero-chicken.png' },
  { id: 'burgers', name: 'Burgers', image: '/images/hero-chicken.png' },
  { id: 'wraps-and-pittas', name: 'Wraps & Pittas', image: '/images/chicken-wrap.png' },
  { id: 'rice-boxes', name: 'Rice Boxes', image: '/images/meal-bowl.png' },
  { id: 'wings-and-strips', name: 'Wings & Strips', image: '/images/hero-chicken.png' },
  { id: 'sides', name: 'Sides', image: '/images/chicken-fries.png' },
  { id: 'kids-meals', name: 'Kids Meals', image: '/images/hero-chicken.png' },
  { id: 'desserts', name: 'Desserts', image: '/images/premium-hero-chicken.png' },
  { id: 'drinks', name: 'Drinks', image: '/images/meal-bowl.png' },
  { id: 'milkshakes', name: 'Milkshakes', image: '/images/premium-hero-chicken.png' },
];

export const categoryNames = categories.map(category => category.name);
