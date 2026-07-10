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

export interface MealOptionChoice {
  name: string;
  price: number;
}

export interface MealOptionGroup {
  id: string;
  title: string;
  required: boolean;
  multiple?: boolean;
  options: MealOptionChoice[];
}

export const MEAL_OPTION_GROUPS: MealOptionGroup[] = [
  {
    id: 'fries',
    title: 'Fries Option',
    required: false,
    options: [
      { name: 'Regular Fries', price: 0 },
      { name: 'Piri Piri Fries', price: 0.3 },
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
      { name: 'Fruitshoot Apple & Blackcurrant', price: 0 },
      { name: 'Fruitshoot Orange', price: 0 },
    ],
  },
  {
    id: 'dip',
    title: 'Dip Option',
    required: false,
    options: [
      { name: 'Burger Sauce', price: 0 },
      { name: 'Garlic Mayo', price: 0 },
      { name: 'Piri Piri Mayo', price: 0 },
      { name: 'Sweet Chilli Sauce', price: 0 },
    ],
  },
  {
    id: 'sides',
    title: 'Sides Option',
    required: false,
    multiple: true,
    options: [
      { name: 'Onion Rings', price: 2.49 },
      { name: 'Cheesy Fries', price: 3.49 },
      { name: 'Corn On The Cob', price: 2.49 },
      { name: 'Large Fries', price: 3.49 },
      { name: 'Large Piri Piri Fries', price: 3.79 },
      { name: 'Mozzarella Sticks', price: 3.99 },
      { name: 'Cheese Slice', price: 0.5 },
      { name: 'Pitta Bread', price: 0.99 },
      { name: 'Baked Beans', price: 1.49 },
      { name: 'Piri Piri Pitta Bread', price: 1.29 },
      { name: 'Piri Piri Corn On The Cob', price: 2.79 },
      { name: 'Piri Piri Wedges', price: 3.49 },
      { name: 'Reg Fries', price: 0 },
      { name: 'Regular Piri Piri Fries', price: 0 },
      { name: 'Side Salad', price: 2.49 },
      { name: 'Spicy Rice', price: 3.49 },
      { name: 'Wedges', price: 3.49 },
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
  const hasFullOptions = FULL_OPTION_CATEGORY_SLUGS.has(categorySlug(category));

  return {
    showSize: hasFullOptions,
    showGoLarge: hasFullOptions,
    showFlavour: hasFullOptions,
    showSpecialInstructions: hasFullOptions,
    requiresSize: hasFullOptions,
  };
}
