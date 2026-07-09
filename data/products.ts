import type { Product, ProductAddOn, ProductOptionGroup } from '@/types';

const heatOptions: ProductOptionGroup = {
  id: 'heat',
  name: 'Flavour / heat',
  required: true,
  values: [
    { id: 'lemon-herb', name: 'Lemon & Herb', priceDelta: 0 },
    { id: 'mild', name: 'Mild', priceDelta: 0 },
    { id: 'mango-lime', name: 'Mango & Lime', priceDelta: 0 },
    { id: 'medium', name: 'Medium', priceDelta: 0 },
    { id: 'hot', name: 'Hot', priceDelta: 0 },
    { id: 'extra-hot', name: 'Extra Hot', priceDelta: 0 },
    { id: 'extra-hot-sweet', name: 'Extra Hot & Sweet', priceDelta: 0 },
    { id: 'bbq', name: 'BBQ', priceDelta: 0 },
    { id: 'garlic-herb', name: 'Garlic & Herb', priceDelta: 0 },
  ],
};

const sizeOptions: ProductOptionGroup = {
  id: 'size',
  name: 'Size',
  required: true,
  values: [
    { id: 'regular', name: 'Regular', priceDelta: 0 },
    { id: 'large', name: 'Large', priceDelta: 2 },
  ],
};

const drinkSizeOptions: ProductOptionGroup = {
  id: 'size',
  name: 'Size',
  required: true,
  values: [
    { id: 'regular', name: 'Regular', priceDelta: 0 },
    { id: 'large', name: 'Large', priceDelta: 1 },
  ],
};

const standardAddOns: ProductAddOn[] = [
  { id: 'extra-cheese', name: 'Extra cheese', price: 1.5 },
  { id: 'fries', name: 'Fries', price: 2.49 },
  { id: 'drink', name: 'Drink', price: 1.99 },
  { id: 'dip', name: 'Dip', price: 0.75 },
  { id: 'extra-sauce', name: 'Extra sauce', price: 0.75 },
  { id: 'fresh-salad', name: 'Fresh salad', price: 1.5 },
];

const sideAddOns: ProductAddOn[] = [
  { id: 'dip', name: 'Dip', price: 0.75 },
  { id: 'extra-sauce', name: 'Extra sauce', price: 0.75 },
  { id: 'cheese-sauce', name: 'Cheese sauce', price: 1.25 },
];

const noAddOns: ProductAddOn[] = [];

function product(
  id: string,
  name: string,
  category: string,
  description: string,
  image: string,
  price: number,
  kcal: number,
  popular = false,
  options: ProductOptionGroup[] = [sizeOptions, heatOptions],
  addOns: ProductAddOn[] = standardAddOns,
): Product {
  return { id, name, category, description, image, price, kcal, popular, options, addOns };
}

export const products: Product[] = [
  product('whole-piri-piri-chicken', 'Whole Piri Piri Chicken', 'Grilled Collection', 'A whole flame-grilled chicken marinated overnight and brushed with your chosen Maemeâ€™s sauce.', '/images/hero-chicken.png', 17.99, 1250, true),
  product('half-piri-piri-chicken', 'Half Piri Piri Chicken', 'Grilled Collection', 'Juicy half chicken cooked over flame with crisp edges and a bold piri finish.', '/images/hero-chicken.png', 10.99, 680, true),
  product('quarter-chicken', 'Quarter Chicken', 'Grilled Collection', 'A classic quarter chicken portion, freshly grilled and finished with signature sauce.', '/images/hero-chicken.png', 6.99, 390),
  product('chicken-burger', 'Chicken Burger', 'Maeme’s Burgers', 'Grilled chicken breast with lettuce, mayo and your favourite Maemeâ€™s flavour in a toasted bun.', '/images/hero-chicken.png', 7.99, 580, true),
  product('gourmet-beef-burger', 'Gourmet Beef Burger', 'Maeme’s Burgers', 'Premium beef patty with cheese, salad and a smoky house relish.', '/images/hero-chicken.png', 9.99, 710),
  product('chicken-wrap', 'Chicken Wrap', 'Maeme’s Extras', 'Flame-grilled chicken strips wrapped with salad, sauce and a soft tortilla.', '/images/chicken-wrap.png', 8.49, 540),
  product('chicken-pitta', 'Chicken Pitta', 'Maeme’s Extras', 'Warm pitta packed with grilled chicken, crunchy salad and your chosen sauce.', '/images/chicken-wrap.png', 8.49, 520),
  product('chicken-rice-box', 'Chicken Rice Box', 'Maeme’s Platter', 'Spicy rice topped with grilled chicken, fresh garnish and a drizzle of Maemeâ€™s sauce.', '/images/meal-bowl.png', 9.49, 620, true),
  product('wings', 'Wings', 'Fried Collection', 'Six flame-grilled wings tossed in your preferred piri piri flavour.', '/images/hero-chicken.png', 6.99, 460, true),
  product('tender-strips', 'Tender Strips', 'Fried Collection', 'Four tender chicken strips grilled fresh and served with a dip.', '/images/hero-chicken.png', 6.49, 420),
  product('loaded-fries', 'Loaded Fries', 'Sides Collection', 'Crisp fries loaded with cheese, sauce and fresh herbs.', '/images/chicken-fries.png', 5.49, 520, true, [sizeOptions], sideAddOns),
  product('fries', 'Fries', 'Sides Collection', 'Golden fries, salted and served hot.', '/images/chicken-fries.png', 3.49, 360, false, [sizeOptions], sideAddOns),
  product('corn-on-the-cob', 'Corn on the Cob', 'Sides Collection', 'Sweetcorn grilled and finished with butter and piri seasoning.', '/images/chicken-fries.png', 3.99, 260, false, [], sideAddOns),
  product('side-salad', 'Side Salad', 'Sides Collection', 'Fresh leaves, cucumber, tomato and house dressing.', '/images/chicken-fries.png', 3.99, 140, false, [], noAddOns),
  product('kids-burger-meal', 'Kids Burger Meal', 'Kids Meal', 'Mini chicken burger with fries and a kids drink.', '/images/hero-chicken.png', 6.99, 540, false, [heatOptions], noAddOns),
  product('kids-strips-meal', 'Kids Strips Meal', 'Kids Meal', 'Tender strips with fries and a kids drink.', '/images/hero-chicken.png', 6.49, 500, false, [heatOptions], noAddOns),
  product('chocolate-cake', 'Chocolate Cake', 'Dessert Collection', 'Rich chocolate cake slice for a sweet finish.', '/images/premium-hero-chicken.png', 4.49, 390, false, [], noAddOns),
  product('mango-lassi', 'Mango Lassi', 'Drinks', 'Cool mango yoghurt drink with a smooth finish.', '/images/meal-bowl.png', 3.99, 260, true, [drinkSizeOptions], noAddOns),
  product('oreo-milkshake', 'Oreo Milkshake', 'Drinks', 'Thick vanilla shake blended with Oreo pieces.', '/images/premium-hero-chicken.png', 4.99, 430, false, [drinkSizeOptions], noAddOns),
  product('lotus-biscoff-milkshake', 'Lotus Biscoff Milkshake', 'Drinks', 'Creamy Biscoff shake with caramel biscuit notes.', '/images/premium-hero-chicken.png', 5.49, 460, true, [drinkSizeOptions], noAddOns),
];

