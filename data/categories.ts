import type { ProductCategory } from '@/types';
import { MENU_CATEGORY_DATA } from '@/lib/menuData';

export const categories: ProductCategory[] = MENU_CATEGORY_DATA.map(({ id, title, image }) => ({
  id,
  name: title,
  image,
}));

export const categoryNames = categories.map(category => category.name);
