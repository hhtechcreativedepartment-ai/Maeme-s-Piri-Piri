import { MENU_DATA, MenuItem } from './menuData';

export const FULL_OPTION_CATEGORY_SLUGS = new Set([
  'grilled-collection',
  'maemes-burgers',
  'vegetarian-collection',
  'fried-collection',
]);

export const MEAL_SELECTION_CATEGORY_SLUGS = new Set([
  ...FULL_OPTION_CATEGORY_SLUGS,
  'fried-wings',
  'fried-chicken',
  'fried-boneless',
]);

export const GO_LARGE_OPTION = { name: 'Go Large', price: 2 };

const VEGETARIAN_GO_LARGE_OPTION = { name: 'Go Large', price: 0.5 };

export interface MealOptionChoice {
  id?: string;
  name: string;
  price: number;
  kcal?: number;
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

const REGULAR_ADD_ON_CATEGORIES: Record<string, string> = {
  sides: 'sides-and-extras',
  dip: 'dips',
  'cake-slice': 'dessert-collection',
};

export function getRegularPaidOptionGroup(groupId: string): MealOptionGroup | undefined {
  const group = MEAL_OPTION_GROUPS.find((candidate) => candidate.id === groupId);
  const category = REGULAR_ADD_ON_CATEGORIES[groupId];
  if (!group || !category) return group;

  return {
    ...group,
    options: MENU_DATA
      .filter((item) => categorySlug(item.category) === category)
      .map((item) => ({
        id: String(item.id),
        name: item.name,
        price: item.price,
        kcal: item.kcal,
        modifiers: item.quickAddOptions,
      })),
  };
}

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

export function getBaseCategorySlug(category: string) {
  return categorySlug(category).replace(/-meal$/, '');
}

export function getProductConfiguration(product: Pick<MenuItem, 'category' | 'isMealVariant' | 'price' | 'kcal'>) {
  const category = categorySlug(product.category);
  const baseCategory = getBaseCategorySlug(product.category);
  const isMealVariant = product.isMealVariant === true || category.endsWith('-meal');
  const hasFullOptions = FULL_OPTION_CATEGORY_SLUGS.has(baseCategory);
  const supportsFlavour = hasFullOptions && baseCategory !== 'maemes-burgers';

  return {
    isMealVariant,
    baseCategorySlug: baseCategory,
    basePrice: product.price,
    baseKcal: product.kcal,
    showMealOptions: isMealVariant && hasFullOptions,
    showGoLarge: isMealVariant && hasFullOptions,
    showFlavour: supportsFlavour,
    showSpecialInstructions: hasFullOptions || baseCategory === 'box-meals' || baseCategory === 'sharing-meal' || baseCategory === 'fried-wings' || baseCategory === 'fried-chicken' || baseCategory === 'fried-boneless',
    requiresSize: false,
  };
}

export function getMealCharge(product: Pick<MenuItem, 'category' | 'price' | 'mealPrice' | 'mealTotalPrice'>) {
  if (product.mealTotalPrice !== undefined) return Math.max(0, product.mealTotalPrice - product.price);
  if (product.mealPrice !== undefined) return product.mealPrice;
  const slug = getBaseCategorySlug(product.category);
  return slug === 'vegetarian-collection' || slug === 'fried-collection' || slug.startsWith('fried-') ? 2 : 3.99;
}

export type ProductConfigurationStepId =
  | 'flavour'
  | 'meal-type'
  | 'go-large'
  | 'kids-drink'
  | 'box-drink'
  | 'sharing-dips'
  | 'fried-fries'
  | 'fried-drink'
  | 'fried-dip'
  | 'platter-sides'
  | 'platter-drink'
  | 'platter-cake'
  | 'extras'
  | 'free-toppings'
  | 'special-instructions'
  | `meal-${string}`
  | 'confirmation';

export interface ProductConfigurationStep {
  id: ProductConfigurationStepId;
  title: string;
  optional: boolean;
}

export function getProductConfigurationSteps(product: MenuItem, mealType: 'Regular' | 'Meal'): ProductConfigurationStep[] {
  const baseCategory = getBaseCategorySlug(product.category);
  const fullOptions = FULL_OPTION_CATEGORY_SLUGS.has(baseCategory);
  const mealSelected = mealType === 'Meal';
  const steps: ProductConfigurationStep[] = [];

  if ((fullOptions && baseCategory !== 'maemes-burgers') || baseCategory === 'fried-wings') {
    steps.push({ id: 'flavour', title: 'Choose your flavour', optional: false });
  }
  if (MEAL_SELECTION_CATEGORY_SLUGS.has(baseCategory)) {
    steps.push({ id: 'meal-type', title: 'Would you like Regular or Meal?', optional: false });
  }
  if (mealSelected && fullOptions) steps.push({ id: 'go-large', title: 'Choose your meal size', optional: false });
  if (mealSelected && fullOptions) {
    MEAL_OPTION_GROUPS.forEach((group) => steps.push({ id: `meal-${group.id}`, title: group.title, optional: !group.required }));
  }
  if (mealSelected && baseCategory.startsWith('fried-')) {
    steps.push({ id: 'fried-fries', title: 'Choose your fries', optional: false });
    steps.push({ id: 'fried-drink', title: 'Choose your drink', optional: false });
    steps.push({ id: 'fried-dip', title: 'Choose your dip', optional: false });
  }
  if (baseCategory === 'kids-meal') steps.push({ id: 'kids-drink', title: 'Choose your Fruit Shoot', optional: false });
  if (baseCategory === 'box-meals' && product.requiresIncludedDrink) steps.push({ id: 'box-drink', title: 'Choose your drink', optional: false });
  if (baseCategory === 'sharing-meal') steps.push({ id: 'sharing-dips', title: 'Choose your dips', optional: false });
  if (baseCategory === 'maemes-platter') {
    steps.push({ id: 'platter-sides', title: 'Add three sides', optional: true });
    steps.push({ id: 'platter-drink', title: 'Add a drink', optional: true });
    steps.push({ id: 'platter-cake', title: 'Add a cake slice', optional: true });
  }
  if (product.popupModifiers?.length) steps.push({ id: 'extras', title: 'Choose extras', optional: true });
  if (product.freeToppings?.length) steps.push({ id: 'free-toppings', title: 'Choose free toppings', optional: true });
  if (!mealSelected && MEAL_SELECTION_CATEGORY_SLUGS.has(baseCategory)) {
    const regularAddOnGroupOrder = ['sides', 'dip', 'cake-slice'];
    const regularGroupTitles: Record<string, string> = {
      sides: 'Choose sides & add-ons',
      dip: 'Choose your dip',
      'cake-slice': 'Choose your dessert',
    };
    regularAddOnGroupOrder.forEach((groupId) => {
      const group = MEAL_OPTION_GROUPS.find((candidate) => candidate.id === groupId);
      if (group?.options.length) steps.push({ id: `meal-${group.id}`, title: regularGroupTitles[group.id] || group.title, optional: !group.required });
    });
  }
  if (fullOptions || ['box-meals', 'sharing-meal', 'fried-wings', 'fried-chicken', 'fried-boneless'].includes(baseCategory)) {
    steps.push({ id: 'special-instructions', title: 'Special instructions', optional: true });
  }
  steps.push({ id: 'confirmation', title: 'Review your order', optional: false });
  return steps;
}

export function getGoLargeOption(category: string, goLargePrice?: number) {
  if (goLargePrice !== undefined) return { name: 'Go Large', price: goLargePrice };
  const slug = categorySlug(category);
  return slug === 'vegetarian-collection' || slug === 'fried-collection' ? VEGETARIAN_GO_LARGE_OPTION : GO_LARGE_OPTION;
}
