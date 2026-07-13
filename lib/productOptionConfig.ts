import { MENU_DATA } from './menuData';

export const FULL_OPTION_CATEGORY_SLUGS = new Set([
  'grilled-collection',
  'maemes-burgers',
  'vegetarian-collection',
  'fried-collection',
]);

export const MEAL_SIZE_OPTIONS = [
  { name: 'Regular', price: 0 },
  { name: 'Meal', price: 3.99 },
];

export const GO_LARGE_OPTION = { name: 'Go Large', price: 2 };

const VEGETARIAN_MEAL_SIZE_OPTIONS = [
  { name: 'Regular', price: 0 },
  { name: 'Meal', price: 2 },
];

const VEGETARIAN_GO_LARGE_OPTION = { name: 'Go Large', price: 0.5 };

export interface MealOptionChoice {
  id?: string;
  name: string;
  price: number;
  modifiers?: MealOptionModifier[];
  selectedModifiers?: MealOptionModifier[];
}

export interface MealOptionModifier {
  id: string;
  name: string;
  price: number;
}

const PIRI_PIRI_MODIFIER: MealOptionModifier = {
  id: 'piri-piri-seasoning',
  name: 'Piri Piri seasoning',
  price: 0.30,
};

export interface MealOptionGroup {
  id: string;
  title: string;
  required: boolean;
  multiple?: boolean;
  options: MealOptionChoice[];
}

export const INCLUDED_DIP_OPTIONS: MealOptionChoice[] = MENU_DATA
  .filter((product) => product.category === 'Dips')
  .map((product) => ({
    id: String(product.id),
    name: product.name,
    price: 0,
  }));

export const MEAL_OPTION_GROUPS: MealOptionGroup[] = [
  {
    id: 'fries',
    title: 'Fries Option',
    required: false,
    options: [
      { id: 'regular-fries', name: 'Regular Fries', price: 0, modifiers: [PIRI_PIRI_MODIFIER] },
    ],
  },
  {
    id: 'drink',
    title: 'Drink Option',
    required: false,
    options: [
      { name: 'Coke', price: 0 },
      { name: 'Coke Zero', price: 0 },
      { name: 'Diet Coke', price: 0 },
      { name: 'Dr Pepper', price: 0 },
      { name: 'Fanta Orange', price: 0 },
      { name: 'Sprite', price: 0 },
      { name: 'Sprite Zero', price: 0 },
      { name: 'Tango Apple', price: 0 },
      { name: 'Tango Orange', price: 0 },
      { id: 'fruitshoot-apple-blackcurrant', name: 'Fruitshoot Apple & Blackcurrant', price: 0 },
      { id: 'fruitshoot-orange', name: 'Fruitshoot Orange', price: 0 },
    ],
  },
  {
    id: 'dip',
    title: 'Dip Option',
    required: false,
    options: INCLUDED_DIP_OPTIONS,
  },
  {
    id: 'sides',
    title: 'Sides & Extras',
    required: false,
    multiple: true,
    options: [
      { id: '6-onion-rings', name: '6 Onion Rings', price: 2.49 },
      { id: 'cheesy-fries', name: 'Cheesy Fries', price: 3.49 },
      { id: 'corn-on-the-cob', name: 'Corn on the Cob', price: 2.49, modifiers: [PIRI_PIRI_MODIFIER] },
      { id: 'large-fries', name: 'Large Fries', price: 3.49, modifiers: [PIRI_PIRI_MODIFIER] },
      { id: 'mozzarella-sticks', name: 'Mozzarella Sticks', price: 3.99 },
      { id: 'cheese-slice', name: 'Cheese Slice', price: 0.5 },
      { id: 'pitta-bread', name: 'Pitta Bread', price: 0.99, modifiers: [PIRI_PIRI_MODIFIER] },
      { id: 'baked-beans', name: 'Baked Beans', price: 1.49, modifiers: [PIRI_PIRI_MODIFIER] },
      { id: 'regular-fries', name: 'Regular Fries', price: 0, modifiers: [PIRI_PIRI_MODIFIER] },
      { id: 'side-salad', name: 'Side Salad', price: 2.49 },
      { id: 'spicy-rice', name: 'Spicy Rice', price: 3.49 },
      { id: 'wedges', name: 'Wedges', price: 3.49, modifiers: [PIRI_PIRI_MODIFIER] },
    ],
  },
  {
    id: 'cake-slice',
    title: 'Cake Slice',
    required: false,
    multiple: true,
    options: [
      { name: 'Carrot Cake Slice', price: 3.99 },
      { name: 'Chocolate Fudge Cake Slice', price: 3.99 },
      { name: 'Strawberry Cheese Cake Slice', price: 3.99 },
    ],
  },
];

export const FLAVOUR_OPTIONS = [
  'Lemon & Herb',
  'Mild',
  'Mango & Lime',
  'Medium',
  'Hot',
  'Extra Hot',
  'Extra Hot & Sweet',
  'BBQ',
  'Garlic & Herb',
];

export function categorySlug(value: string) {
  return value
    .toLowerCase()
    .replace(/(?:\u00e2\u20ac\u2122|\u00e2\u20ac\u02dc)/g, '')
    .replace(/[\u2018\u2019']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getProductOptionVisibility(category: string) {
  const slug = categorySlug(category);
  const hasFullOptions = FULL_OPTION_CATEGORY_SLUGS.has(slug);
  const supportsFlavour = hasFullOptions && slug !== 'maemes-burgers';

  return {
    showSize: hasFullOptions,
    showGoLarge: hasFullOptions,
    showFlavour: supportsFlavour,
    showSpecialInstructions: hasFullOptions || slug === 'box-meals' || slug === 'sharing-meal' || slug === 'fried-wings' || slug === 'fried-chicken' || slug === 'fried-boneless',
    requiresSize: hasFullOptions,
  };
}

export function getMealSizeOptions(category: string, mealPrice?: number) {
  if (mealPrice !== undefined) return [{ name: 'Regular', price: 0 }, { name: 'Meal', price: mealPrice }];
  const slug = categorySlug(category);
  return slug === 'vegetarian-collection' || slug === 'fried-collection' ? VEGETARIAN_MEAL_SIZE_OPTIONS : MEAL_SIZE_OPTIONS;
}

export function getGoLargeOption(category: string, goLargePrice?: number) {
  if (goLargePrice !== undefined) return { name: 'Go Large', price: goLargePrice };
  const slug = categorySlug(category);
  return slug === 'vegetarian-collection' || slug === 'fried-collection' ? VEGETARIAN_GO_LARGE_OPTION : GO_LARGE_OPTION;
}
