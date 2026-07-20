export interface MenuItem {
  id: number
  slug?: string
  name: string
  category: string
  servingInfo?: string
  sizeInfo?: string
  includedItems?: string[]
  requiresIncludedDrink?: boolean
  requiredDipCount?: number
  description: string
  price: number
  kcal?: number
  image: string
  popular?: boolean
  startingPrice?: boolean
  quickAddOptions?: MenuQuickAddOption[]
  popupModifiers?: MenuQuickAddOption[]
  freeToppings?: MenuQuickAddOption[]
  mealPrice?: number
  mealTotalPrice?: number
  goLargePrice?: number
  offer?: boolean
  available?: boolean
}

export interface MenuQuickAddOption {
  id: string
  name: string
  price: number
  maxSelections?: number
}

export interface MenuCategory {
  id: string
  title: string
  slug: string
  anchor: string
  image: string
}

const PIRI_PIRI_SEASONING: MenuQuickAddOption = {
  id: 'piri-piri-seasoning',
  name: 'Piri Piri seasoning',
  price: 0.30,
}

const EXTRA_PANEER: MenuQuickAddOption = {
  id: 'extra-paneer',
  name: 'Extra Paneer',
  price: 2.50,
}

const EXTRA_VEGGIE_PATTY: MenuQuickAddOption = {
  id: 'extra-veggie-patty',
  name: 'Extra Veggie Patty',
  price: 2.00,
}

const EXTRA_PATTY: MenuQuickAddOption = {
  id: 'extra-patty',
  name: 'Extra Patty',
  price: 1.00,
}

const EXTRA_FILLET: MenuQuickAddOption = {
  id: 'extra-fillet',
  name: 'Extra Fillet',
  price: 1.00,
}

const GRILLED_EXTRA_FILLET: MenuQuickAddOption = {
  id: 'extra-fillet',
  name: 'Extra Fillet',
  price: 3.00,
  maxSelections: 1,
}

const GRILLED_EXTRA_STRIP: MenuQuickAddOption = {
  id: 'extra-strip',
  name: 'Extra Strip',
  price: 3.00,
  maxSelections: 1,
}

const GRILLED_EXTRA_CHICKEN: MenuQuickAddOption = {
  id: 'extra-chicken',
  name: 'Extra Chicken',
  price: 2.50,
  maxSelections: 1,
}

const SMASH_BURGER_EXTRA_PATTY: MenuQuickAddOption = {
  id: 'extra-patty',
  name: 'Extra Patty',
  price: 2.00,
  maxSelections: 1,
}

export const SMASH_BURGER_FREE_TOPPINGS: MenuQuickAddOption[] = [
  { id: 'lettuce', name: 'Lettuce', price: 0 },
  { id: 'hot-sauce', name: 'Hot Sauce', price: 0 },
  { id: 'green-peppers', name: 'Green Peppers', price: 0 },
  { id: 'mayo', name: 'Mayo', price: 0 },
  { id: 'tomatoes', name: 'Tomatoes', price: 0 },
  { id: 'hp-sauce', name: 'HP Sauce', price: 0 },
  { id: 'jalapeno-peppers', name: 'Jalapeno Peppers', price: 0 },
  { id: 'relish', name: 'Relish', price: 0 },
  { id: 'grilled-onions', name: 'Grilled Onions', price: 0 },
  { id: 'fresh-onions', name: 'Fresh Onions', price: 0 },
  { id: 'grilled-mushrooms', name: 'Grilled Mushrooms', price: 0 },
  { id: 'bbq-sauce', name: 'BBQ Sauce', price: 0 },
  { id: 'ketchup', name: 'Ketchup', price: 0 },
  { id: 'pickles', name: 'Pickles', price: 0 },
  { id: 'mustard', name: 'Mustard', price: 0 },
  { id: 'salsa', name: 'Salsa', price: 0 },
  { id: 'burger-sauce', name: 'Burger Sauce', price: 0 },
  { id: 'sour-cream', name: 'Sour Cream', price: 0 },
  { id: 'sweet-chilli-sauce', name: 'Sweet Chilli Sauce', price: 0 },
]

export const MENU_CATEGORY_DATA: MenuCategory[] = [
  { id: 'offers', title: 'Offers', slug: 'offers', anchor: 'category-offers', image: '/images/exclusive-deals-sign.png' },
  { id: 'grilled-collection', title: 'Grilled Collection', slug: 'grilled-collection', anchor: 'category-grilled-collection', image: '/images/categories/original-brand/grilled-collection.jpg' },
  { id: 'maemes-burgers', title: 'Maeme’s Burgers', slug: 'maemes-burgers', anchor: 'category-maemes-burgers', image: '/images/categories/original-brand/maemes-burgers.jpg' },
  { id: 'fried-wings', title: 'Fried Wings', slug: 'fried-wings', anchor: 'fried-wings', image: '/images/categories/fried/fried-wings.jpg' },
  { id: 'fried-chicken', title: 'Fried Chicken', slug: 'fried-chicken', anchor: 'fried-chicken', image: '/images/categories/fried/fried-chicken.jpg' },
  { id: 'fried-boneless', title: 'Fried Boneless', slug: 'fried-boneless', anchor: 'fried-boneless', image: '/images/categories/fried/fried-boneless.jpg' },
  { id: 'box-meals', title: 'Box Meals', slug: 'box-meals', anchor: 'box-meals', image: '/images/categories/fried/box-meals.jpg' },
  { id: 'sharing-meal', title: 'Sharing Meal', slug: 'sharing-meal', anchor: 'sharing-meal', image: '/images/categories/fried/sharing-meal.jpg' },
  { id: 'vegetarian-collection', title: 'Vegetarian Collection', slug: 'vegetarian-collection', anchor: 'category-vegetarian-collection', image: '/images/categories/original-brand/vegetarian-collection.jpg' },
  { id: 'fried-collection', title: 'Fried Collection', slug: 'fried-collection', anchor: 'category-fried-collection', image: '/images/categories/original-brand/fried-collection.jpg' },
  { id: 'maemes-platter', title: 'Maeme’s Platter', slug: 'maemes-platter', anchor: 'category-maemes-platter', image: '/images/categories/original-brand/maemes-platter.jpg' },
  { id: 'kids-meal', title: 'Kids Meal', slug: 'kids-meal', anchor: 'category-kids-meal', image: '/images/categories/original-brand/kids-meal.jpg' },
  { id: 'dessert-collection', title: 'Dessert Collection', slug: 'dessert-collection', anchor: 'category-dessert-collection', image: '/images/categories/original-brand/dessert-collection.jpg' },
  { id: 'sides-and-extras', title: 'Sides & Extras', slug: 'sides-and-extras', anchor: 'category-sides-and-extras', image: '/images/categories/original-brand/sides-collection.jpg' },
  { id: 'ice-cream', title: 'Ice Cream', slug: 'ice-cream', anchor: 'category-ice-cream', image: '/images/categories/original-brand/ice-cream.jpg' },
  { id: 'dips', title: 'Dips', slug: 'dips', anchor: 'category-dips', image: '/images/categories/original-brand/dips.jpg' },
  { id: 'milkshakes', title: 'Milkshakes', slug: 'milkshakes', anchor: 'category-milkshakes', image: '/Milkshakes.jpg.jpg' },
  { id: 'drinks', title: 'Drinks', slug: 'drinks', anchor: 'category-drinks', image: '/images/categories/original-brand/drinks.jpg' },
]

export const MENU_CATEGORIES = MENU_CATEGORY_DATA.map((category) => category.title)

export const DEFAULT_MENU_ITEM_IMAGE = '/Image-place-holder.jpg'

export const MENU_DATA: MenuItem[] = [
  { id: 101, slug: 'quarter-chicken', name: 'Quarter Chicken', category: 'Grilled Collection', description: 'Maeme’s legendary flame-grilled marinated piri piri chicken.', price: 5.99, image: '/images/products/quarter-chicken.jpg' },
  { id: 102, slug: 'half-chicken', name: 'Half Chicken', category: 'Grilled Collection', description: 'Maeme’s legendary flame-grilled marinated piri piri chicken.', price: 8.99, image: '/images/products/half-chicken.jpg' },
  { id: 103, slug: 'full-chicken', name: 'Whole Chicken', category: 'Grilled Collection', description: 'Maeme’s legendary flame-grilled marinated piri piri chicken.', price: 13.99, image: '/images/products/whole-chicken.jpg' },
  { id: 104, slug: 'tender-strips-5', name: 'Tender Strips', category: 'Grilled Collection', description: 'Five succulent strips of piri piri chicken.', price: 5.99, image: '/images/products/tender-strips.jpg' },
  { id: 105, slug: 'maemes-wings-5', name: 'Maeme’s Wings — 5x Pieces', category: 'Grilled Collection', description: 'Five Maeme’s classic piri piri chicken wings.', price: 4.99, image: '/images/products/maemes-wings-5x-pieces.jpg', offer: true },
  { id: 106, slug: 'maemes-king', name: 'Maeme’s King', category: 'Grilled Collection', description: 'Flame-grilled chicken breast with mayo, lettuce and tomatoes in a soft flour bap.', price: 6.50, image: '/images/products/maemes-king.jpg', popupModifiers: [GRILLED_EXTRA_FILLET] },
  { id: 107, slug: 'maemes-pitta', name: 'Maeme’s Pitta', category: 'Grilled Collection', description: 'Flame-grilled chicken breast with tomato, mayonnaise and lettuce in a freshly toasted pitta.', price: 6.50, image: '/images/products/maemes-pitta.jpg', popupModifiers: [GRILLED_EXTRA_FILLET] },
  { id: 108, slug: 'the-wrap', name: 'The Wrap', category: 'Grilled Collection', description: 'Chicken strips with tomato salsa, mayonnaise and lettuce in a tortilla wrap.', price: 6.50, image: '/images/products/the-wrap.jpg', popupModifiers: [GRILLED_EXTRA_STRIP] },
  { id: 109, slug: 'chicken-cheese-quesadilla', name: 'Chicken & Cheese Quesadilla', category: 'Grilled Collection', description: 'Flame-grilled chicken with tomato salsa and grated mozzarella cheese in a toasted tortilla wrap.', price: 6.99, image: '/images/products/chicken-cheese-quesadilla.jpg', popupModifiers: [GRILLED_EXTRA_CHICKEN] },
  { id: 110, slug: 'maemes-wings-10', name: 'Maeme’s Wings — 10x Pieces', category: 'Grilled Collection', description: 'Ten Maeme’s classic piri piri chicken wings.', price: 7.49, image: '/images/products/maemes-wings-10x-pieces.jpg' },
  { id: 111, slug: 'chicken-and-rice', name: 'Chicken & Rice', category: 'Grilled Collection', description: 'Maeme’s spicy rice with succulent strips of marinated Maeme’s piri piri chicken breast.', price: 7.50, image: '/images/products/chicken-rice.jpg', popupModifiers: [GRILLED_EXTRA_CHICKEN], offer: true },
  { id: 112, slug: 'maemes-grill-box', name: 'Maeme’s Grill Box', category: 'Grilled Collection', description: 'Succulent quarter chicken served with fragrant rice and seasonal steamed vegetables.', price: 8.49, image: '/images/products/maemes-grill-box.jpg' },
  { id: 113, slug: 'chicken-burrito', name: 'Chicken Burrito', category: 'Grilled Collection', description: 'Chicken strips with spicy rice, kidney beans, red onion and tomato salsa in a tortilla wrap.', price: 6.99, image: '/images/products/chicken-burrito.jpg', popupModifiers: [GRILLED_EXTRA_STRIP] },
  { id: 114, slug: 'chicken-nachos', name: 'Chicken Nachos', category: 'Grilled Collection', description: 'Flame-grilled chicken with crunchy nachos, tomato salsa, jalapeños and grated mozzarella cheese.', price: 6.99, image: '/images/products/chicken-nachos.jpg', popupModifiers: [GRILLED_EXTRA_CHICKEN] },
  { id: 115, slug: 'loaded-fries', name: 'Loaded Fries', category: 'Grilled Collection', description: 'Grilled chicken strips seasoned with the customer’s choice of flavour, served on fries and topped with grated mozzarella cheese and fried onions.', price: 6.99, image: '/images/products/loaded-fries.jpg', popupModifiers: [GRILLED_EXTRA_STRIP] },
  { id: 116, slug: 'chicken-salad', name: 'Chicken Salad', category: 'Grilled Collection', description: 'Succulent Maeme’s piri piri chicken strips served with fresh salad.', price: 6.99, image: '/images/products/chicken-salad.jpg' },
  { id: 117, slug: 'smash-burger', name: 'Smash Burger', category: 'Maeme’s Burgers', description: 'Two juicy 100% Angus beef patties with the customer’s choice of toppings and two slices of cheese in a seeded bun.', price: 8.99, image: '/images/products/smash-burger.jpg', popupModifiers: [SMASH_BURGER_EXTRA_PATTY], freeToppings: SMASH_BURGER_FREE_TOPPINGS },
  { id: 118, slug: 'junior-smash-burger', name: 'Junior Smash Burger', category: 'Maeme’s Burgers', description: 'A juicy 100% Angus beef patty with the customer’s choice of toppings and cheese in a seeded bun.', price: 6.49, image: '/images/products/junior-smash-burger.jpg', popupModifiers: [SMASH_BURGER_EXTRA_PATTY], freeToppings: SMASH_BURGER_FREE_TOPPINGS },
  { id: 501, slug: 'paneer-rice', name: 'Paneer Rice', category: 'Vegetarian Collection', description: 'Maeme’s spicy rice with freshly grilled paneer pieces.', price: 7.50, image: '/images/products/paneer-rice.jpg', popupModifiers: [EXTRA_PANEER] },
  { id: 502, slug: 'paneer-burrito', name: 'Paneer Burrito', category: 'Vegetarian Collection', description: 'Grilled paneer with spicy rice, kidney beans, red onion and tomato salsa in a tortilla wrap.', price: 6.50, image: '/images/products/paneer-burrito.jpg', popupModifiers: [EXTRA_PANEER] },
  { id: 503, slug: 'feta-salad', name: 'Feta Salad', category: 'Vegetarian Collection', description: 'Fresh feta cheese served with crispy salad.', price: 6.99, image: '/images/products/feta-salad.jpg' },
  { id: 504, slug: 'paneer-nachos', name: 'Paneer Nachos', category: 'Vegetarian Collection', description: 'Grilled paneer with crunchy nachos, tomato salsa, jalapeños and melted cheese.', price: 6.99, image: '/images/products/paneer-nachos.jpg', popupModifiers: [EXTRA_PANEER] },
  { id: 505, slug: 'paneer-wrap', name: 'Paneer Wrap', category: 'Vegetarian Collection', description: 'Grilled paneer with tomato salsa, mayonnaise and lettuce in a tortilla wrap.', price: 6.00, image: '/images/products/paneer-wrap.jpg', popupModifiers: [EXTRA_PANEER] },
  { id: 506, slug: 'veggie-wrap', name: 'Veggie Wrap', category: 'Vegetarian Collection', description: 'Veggie patty with mayonnaise, tomato salsa and lettuce in a tortilla wrap.', price: 5.49, image: '/images/products/veggie-wrap.jpg' },
  { id: 507, slug: 'veggie-burger', name: 'Veggie Burger', category: 'Vegetarian Collection', description: 'Veggie patty with mayonnaise, tomato, lettuce, cheese and burger sauce in a seeded bun.', price: 4.99, image: '/images/products/veggie-burger.jpg', popupModifiers: [EXTRA_VEGGIE_PATTY] },
  { id: 508, slug: 'paneer-salad', name: 'Paneer Salad', category: 'Vegetarian Collection', description: 'A heavenly mix of grilled paneer, juicy tomatoes, cucumber and crunchy lettuce.', price: 8.49, image: '/images/products/paneer-salad.jpg', popupModifiers: [EXTRA_PANEER] },
  { id: 509, slug: 'paneer-loaded-fries', name: 'Paneer Loaded Fries', category: 'Vegetarian Collection', description: 'Loaded with grilled paneer, melted cheese, tomato salsa, jalapeños and crispy onion crumbs.', price: 8.99, image: '/images/products/paneer-loaded-fries.jpg', popupModifiers: [EXTRA_PANEER] },
  { id: 5, slug: 'quarter-pounder', name: 'Quarter Pounder', category: 'Maeme’s Burgers', description: 'Beef patty with mayonnaise, tomato, lettuce, red onion, cheese, burger sauce and ketchup in a seeded bun.', price: 5.50, image: '/images/products/quarter-pounder.jpg', mealPrice: 3.99 },
  { id: 301, slug: '3-wings', name: '3 Wings', category: 'Sides & Extras', description: '', price: 3.29, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 302, slug: '3-tender-strips', name: '3 Tender Strips', category: 'Sides & Extras', description: '', price: 3.49, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 303, slug: 'mozzarella-sticks', name: 'Mozzarella Sticks', category: 'Sides & Extras', description: '', price: 3.49, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 304, slug: '6-onion-rings', name: '6 Onion Rings', category: 'Sides & Extras', description: '', price: 2.49, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 305, slug: 'corn-on-the-cob', name: 'Corn on the Cob', category: 'Sides & Extras', description: '', price: 2.49, image: DEFAULT_MENU_ITEM_IMAGE, quickAddOptions: [PIRI_PIRI_SEASONING] },
  { id: 306, slug: 'wedges', name: 'Wedges', category: 'Sides & Extras', description: '', price: 3.49, image: DEFAULT_MENU_ITEM_IMAGE, quickAddOptions: [PIRI_PIRI_SEASONING] },
  { id: 307, slug: 'sweet-potato-fries', name: 'Sweet Potato Fries', category: 'Sides & Extras', description: '', price: 3.49, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 308, slug: 'spicy-rice', name: 'Spicy Rice', category: 'Sides & Extras', description: '', price: 3.29, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 309, slug: 'side-salad', name: 'Side Salad', category: 'Sides & Extras', description: '', price: 3.29, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 310, slug: 'chilli-cheese-nuggets', name: 'Chilli Cheese Nuggets', category: 'Sides & Extras', description: '', price: 2.59, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 311, slug: 'cheesy-fries', name: 'Cheesy Fries', category: 'Sides & Extras', description: '', price: 4.29, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 312, slug: 'regular-fries', name: 'Regular Fries', category: 'Sides & Extras', description: '', price: 1.99, image: DEFAULT_MENU_ITEM_IMAGE, quickAddOptions: [PIRI_PIRI_SEASONING] },
  { id: 313, slug: 'large-fries', name: 'Large Fries', category: 'Sides & Extras', description: '', price: 2.29, image: DEFAULT_MENU_ITEM_IMAGE, quickAddOptions: [PIRI_PIRI_SEASONING] },
  { id: 314, slug: 'baked-beans', name: 'Baked Beans', category: 'Sides & Extras', description: '', price: 1.49, image: DEFAULT_MENU_ITEM_IMAGE, quickAddOptions: [PIRI_PIRI_SEASONING] },
  { id: 315, slug: 'pitta-bread', name: 'Pitta Bread', category: 'Sides & Extras', description: '', price: 0.99, image: DEFAULT_MENU_ITEM_IMAGE, quickAddOptions: [PIRI_PIRI_SEASONING] },
  { id: 316, slug: 'cheese-slice', name: 'Cheese Slice', category: 'Sides & Extras', description: '', price: 0.60, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 201, slug: 'solo-platter', name: 'Solo Platter', category: 'Maeme’s Platter', servingInfo: 'Serves 1', description: 'Quarter chicken, 3 Maeme’s chicken wings, pitta bread, regular fries and 1 dip.', price: 11.49, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 202, slug: 'wings-platter-18', name: 'Wings Platter — 18 Pieces', category: 'Maeme’s Platter', servingInfo: 'Serves 2', description: '18 Maeme’s chicken wings.', price: 13.00, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 203, slug: 'wings-platter-28', name: 'Wings Platter — 28 Pieces', category: 'Maeme’s Platter', servingInfo: 'Serves 3', description: '28 Maeme’s chicken wings.', price: 21.90, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 204, slug: 'combo-platter', name: 'Combo Platter', category: 'Maeme’s Platter', servingInfo: 'Serves 2–3', description: 'Half chicken, 3 Maeme’s chicken wings, 2 large fries and 2 dips.', price: 14.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 205, slug: 'family-platter', name: 'Family Platter', category: 'Maeme’s Platter', servingInfo: 'Serves 3–4', description: '1 whole chicken, 4 Maeme’s chicken wings, 2 large fries, 1 spicy rice and 4 dips.', price: 21.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 206, slug: 'mega-platter', name: 'Mega Platter', category: 'Maeme’s Platter', servingInfo: 'Serves 5–6', description: '2 whole chickens, 4 large fries, 4 pitta breads and 4 dips.', price: 34.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 701, slug: 'chicken-burger', name: 'Chicken Burger', category: 'Maeme’s Burgers', description: 'Chicken patty with lettuce and mayo in a seeded bun.', price: 2.99, image: '/images/products/chicken-burger.jpg', popupModifiers: [EXTRA_PATTY], mealPrice: 2.00, goLargePrice: 0.50 },
  { id: 702, slug: 'fish-burger', name: 'Fish Burger', category: 'Maeme’s Burgers', description: 'Fried fish patty with lettuce and mayonnaise in a soft bun.', price: 4.99, image: '/images/products/fish-burger.jpg', popupModifiers: [EXTRA_PATTY], mealPrice: 2.00, goLargePrice: 0.50 },
  { id: 703, slug: 'chicken-nuggets-5', name: 'Chicken Nuggets — 5 Pieces', category: 'Fried Collection', description: 'Five fried chicken nuggets in a crispy breaded coating.', price: 3.50, image: DEFAULT_MENU_ITEM_IMAGE, offer: true },
  { id: 704, slug: 'giant-burger', name: 'Giant Burger', category: 'Maeme’s Burgers', description: 'Fried chicken fillet with mayo, lettuce, tomato, red onion, burger sauce, cheese and hash brown in a seeded bun.', price: 5.99, image: '/images/products/giant-burger.jpg', popupModifiers: [EXTRA_FILLET], mealPrice: 2.00, goLargePrice: 0.50 },
  { id: 705, slug: 'fillet-burger', name: 'Fillet Burger', category: 'Maeme’s Burgers', description: 'Fried chicken fillet with mayo, lettuce, tomato, red onion, burger sauce and cheese in a seeded bun.', price: 4.99, image: '/images/products/fillet-burger.jpg', popupModifiers: [EXTRA_FILLET], mealPrice: 2.00, goLargePrice: 0.50 },
  { id: 706, slug: 'chicken-nuggets-8', name: 'Chicken Nuggets — 8 Pieces', category: 'Fried Collection', description: 'Eight fried chicken nuggets in a crispy breaded coating.', price: 4.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1101, slug: 'boneless-box', name: 'Boneless Box', category: 'Box Meals', includedItems: ['4 chicken strips', 'Popcorn chicken', 'Baked beans', 'Regular fries'], requiresIncludedDrink: true, description: '4 chicken strips, popcorn chicken, baked beans, regular fries and a drink.', price: 6.99, image: DEFAULT_MENU_ITEM_IMAGE, offer: true },
  { id: 1102, slug: 'spicy-chicken-box', name: 'Spicy Chicken Box', category: 'Box Meals', includedItems: ['Spicy chicken fillet burger', '3 spicy wings', 'Baked beans', 'Regular fries'], requiresIncludedDrink: true, description: 'Spicy chicken fillet burger, 3 spicy wings, baked beans, regular fries and a drink.', price: 7.49, image: DEFAULT_MENU_ITEM_IMAGE, offer: true },
  { id: 1103, slug: 'lunch-box', name: 'Lunch Box', category: 'Box Meals', includedItems: ['Chicken fillet burger', '3 wings', 'Corn on the cob', 'Regular fries'], requiresIncludedDrink: true, description: 'Chicken fillet burger, 3 wings, corn on the cob, regular fries and a drink.', price: 7.99, image: DEFAULT_MENU_ITEM_IMAGE, offer: true },
  { id: 1104, slug: 'dinner-box', name: 'Dinner Box', category: 'Box Meals', includedItems: ['Chicken fillet burger', '3 spicy wings', '2 chicken strips', 'Regular fries'], requiresIncludedDrink: true, description: 'Chicken fillet burger, 3 spicy wings, 2 chicken strips, regular fries and a drink.', price: 8.99, image: DEFAULT_MENU_ITEM_IMAGE, offer: true },
  { id: 1201, slug: '4-pcs-chicken-sharing-meal', name: '4 Pcs Chicken Sharing Meal', category: 'Sharing Meal', includedItems: ['4 pieces of chicken', '4 spicy wings', 'Baked beans', '2 regular fries'], requiredDipCount: 2, description: '4 pieces of chicken, 4 spicy wings, baked beans, 2 dips and 2 regular fries.', price: 14.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1202, slug: '6-pcs-chicken-sharing-meal', name: '6 Pcs Chicken Sharing Meal', category: 'Sharing Meal', includedItems: ['6 pieces of chicken', '6 spicy wings', 'Baked beans', '4 regular fries'], requiredDipCount: 4, description: '6 pieces of chicken, 6 spicy wings, baked beans, 4 dips and 4 regular fries.', price: 21.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1203, slug: '8-pcs-chicken-sharing-meal', name: '8 Pcs Chicken Sharing Meal', category: 'Sharing Meal', includedItems: ['8 pieces of chicken', '8 spicy wings', 'Baked beans', '4 mini fillets'], requiredDipCount: 4, description: '8 pieces of chicken, 8 spicy wings, baked beans, 4 dips and 4 mini fillets.', price: 24.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1301, slug: 'fried-wings-2', name: '2 Wings', category: 'Fried Wings', description: '2 pieces of fried chicken wings.', price: 0.99, mealPrice: 2.00, mealTotalPrice: 2.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1302, slug: 'fried-wings-4', name: '4 Wings', category: 'Fried Wings', description: '4 pieces of fried chicken wings.', price: 1.99, mealPrice: 2.00, mealTotalPrice: 3.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1303, slug: 'fried-wings-6', name: '6 Wings', category: 'Fried Wings', description: '6 pieces of fried chicken wings.', price: 2.97, mealPrice: 2.00, mealTotalPrice: 4.97, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1304, slug: 'fried-wings-8', name: '8 Wings', category: 'Fried Wings', description: '8 pieces of fried chicken wings.', price: 3.98, mealPrice: 2.00, mealTotalPrice: 5.98, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1305, slug: 'fried-wings-10', name: '10 Wings', category: 'Fried Wings', description: '10 pieces of fried chicken wings.', price: 4.95, mealPrice: 2.00, mealTotalPrice: 6.95, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1306, slug: 'fried-wings-20', name: '20 Wings', category: 'Fried Wings', description: '20 pieces of fried chicken wings.', price: 9.90, mealPrice: 2.00, mealTotalPrice: 11.90, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1401, slug: 'fried-chicken-1-piece', name: '1 Chicken Piece', category: 'Fried Chicken', description: '1 piece of fried chicken.', price: 1.49, mealPrice: 2.00, mealTotalPrice: 3.49, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1402, slug: 'fried-chicken-2-pieces', name: '2 Chicken Pieces', category: 'Fried Chicken', description: '2 pieces of fried chicken.', price: 2.78, mealPrice: 2.00, mealTotalPrice: 4.78, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1403, slug: 'fried-chicken-3-pieces', name: '3 Chicken Pieces', category: 'Fried Chicken', description: '3 pieces of fried chicken.', price: 4.49, mealPrice: 2.00, mealTotalPrice: 6.49, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1501, slug: 'fried-boneless-8-chicken-popcorn', name: '8 Chicken Popcorn', category: 'Fried Boneless', description: '8 pieces of chicken popcorn.', price: 4.99, mealPrice: 2.00, mealTotalPrice: 6.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1502, slug: 'fried-boneless-5-chicken-popcorn', name: '5 Chicken Popcorn', category: 'Fried Boneless', description: '5 pieces of chicken popcorn.', price: 2.99, mealPrice: 2.00, mealTotalPrice: 4.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1503, slug: 'fried-boneless-5-chicken-strips', name: '5 Chicken Strips', category: 'Fried Boneless', description: '5 pieces of fried chicken strips.', price: 5.79, mealPrice: 2.00, mealTotalPrice: 7.79, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1601, slug: 'burger-sauce', name: 'Burger Sauce', category: 'Dips', description: '', price: 0.50, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1602, slug: 'garlic-sauce', name: 'Garlic Sauce', category: 'Dips', description: '', price: 0.50, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1603, slug: 'piri-piri-mayonnaise', name: 'Piri Piri Mayonnaise', category: 'Dips', description: '', price: 0.50, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 1604, slug: 'sweet-chilli', name: 'Sweet Chilli', category: 'Dips', description: '', price: 0.50, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 601, slug: 'kids-meal-1', name: 'Kids Meal 1', category: 'Kids Meal', includedItems: ['2 grilled chicken wings', 'Fries', 'Fruit Shoot drink'], description: '2 grilled chicken wings, fries and a Fruit Shoot drink.', price: 4.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 602, slug: 'kids-meal-2', name: 'Kids Meal 2', category: 'Kids Meal', includedItems: ['2 pieces of grilled chicken strips', 'Fries', 'Fruit Shoot drink'], description: '2 pieces of grilled chicken strips, fries and a Fruit Shoot drink.', price: 4.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 603, slug: 'kids-meal-3', name: 'Kids Meal 3', category: 'Kids Meal', includedItems: ['Kid steak burger', 'Fries', 'Fruit Shoot drink'], description: 'Kid steak burger, fries and a Fruit Shoot drink.', price: 4.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 604, slug: 'kids-meal-4', name: 'Kids Meal 4', category: 'Kids Meal', includedItems: ['3 chicken nuggets', 'Fries', 'Fruit Shoot drink'], description: '3 chicken nuggets, fries and a Fruit Shoot drink.', price: 4.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 801, slug: 'chocolate-fudge-cake', name: 'Chocolate Fudge Cake', category: 'Dessert Collection', description: '', price: 3.50, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 802, slug: 'strawberry-cheesecake', name: 'Strawberry Cheesecake', category: 'Dessert Collection', description: '', price: 3.50, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 803, slug: 'carrot-cake', name: 'Carrot Cake', category: 'Dessert Collection', description: '', price: 3.50, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 901, slug: 'ben-jerrys-cookie-dough-465ml', name: 'Ben & Jerry’s Cookie Dough', category: 'Ice Cream', sizeInfo: '465ml Family Tub', description: '', price: 6.49, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 902, slug: 'ben-jerrys-caramel-chew-chew-465ml', name: 'Ben & Jerry’s Caramel Chew Chew', category: 'Ice Cream', sizeInfo: '465ml Family Tub', description: '', price: 6.49, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 903, slug: 'ben-jerrys-chocolate-fudge-brownie-465ml', name: 'Ben & Jerry’s Chocolate Fudge Brownie', category: 'Ice Cream', sizeInfo: '465ml Family Tub', description: '', price: 6.49, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 401, slug: 'coke', name: 'Coke', category: 'Drinks', description: '', price: 1.40, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 402, slug: 'diet-coke', name: 'Diet Coke', category: 'Drinks', description: '', price: 1.40, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 403, slug: 'coke-zero', name: 'Coke Zero', category: 'Drinks', description: '', price: 1.40, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 404, slug: 'sprite', name: 'Sprite', category: 'Drinks', description: '', price: 1.40, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 405, slug: 'tango', name: 'Tango', category: 'Drinks', description: '', price: 1.40, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 406, slug: 'fruitshoot-bottle', name: 'Fruitshoot Bottle', category: 'Drinks', description: '', price: 1.40, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 407, slug: 'dr-pepper', name: 'Dr. Pepper', category: 'Drinks', description: '', price: 1.40, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 408, slug: 'fanta-orange', name: 'Fanta Orange', category: 'Drinks', description: '', price: 1.40, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 409, slug: 'sprite-zero', name: 'Sprite Zero', category: 'Drinks', description: '', price: 1.40, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 410, slug: 'water-bottle', name: 'Water Bottle', category: 'Drinks', description: '', price: 1.00, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 411, slug: 'coke-1-75l-bottle', name: 'Coke 1.75L Bottle', category: 'Drinks', description: '', price: 2.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 412, slug: 'diet-coke-1-75l-bottle', name: 'Diet Coke 1.75L Bottle', category: 'Drinks', description: '', price: 2.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 413, slug: 'sprite-1-75l-bottle', name: 'Sprite 1.75L Bottle', category: 'Drinks', description: '', price: 2.99, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 414, slug: 'oreo-milkshake', name: 'Oreo Milkshake', category: 'Milkshakes', description: 'Thick vanilla milkshake blended with Oreo biscuit pieces.', price: 4.99, kcal: 430, image: DEFAULT_MENU_ITEM_IMAGE },
  { id: 415, slug: 'lotus-biscoff-milkshake', name: 'Lotus Biscoff Milkshake', category: 'Milkshakes', description: 'Creamy milkshake blended with Lotus Biscoff and caramel biscuit notes.', price: 5.49, kcal: 460, image: DEFAULT_MENU_ITEM_IMAGE },
]

export const getProductsByCategory = (category: string) => MENU_DATA.filter(product => product.category === category)
export const getFeaturedProducts = () => MENU_DATA.filter(product => product.popular).slice(0, 6)
