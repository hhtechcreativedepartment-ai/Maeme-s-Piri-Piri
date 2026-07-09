export interface MenuItem {
  id: number
  name: string
  category: string
  description: string
  price: number
  kcal: number
  image: string
  popular?: boolean
  startingPrice?: boolean
}

export const MENU_CATEGORIES = [
  'Grilled Collection',
  'Maeme’s Burgers',
  'Vegetarian Collection',
  'Fried Collection',
  'Maeme’s Platter',
  'Kids Meal',
  'Dessert Collection',
  'Sides Collection',
  'Maeme’s Extras',
  'Ice Cream',
  'Dips',
  'Drinks',
]

const imageFor = (category: string) => {
  if (category === 'Maeme’s Extras') return '/images/chicken-wrap.png'
  if (category === 'Maeme’s Platter') return '/images/meal-bowl.png'
  if (category === 'Fried Collection' || category === 'Sides Collection') return '/images/chicken-fries.png'
  if (category === 'Dessert Collection' || category === 'Drinks' || category === 'Ice Cream') return '/images/premium-hero-chicken.png'
  return '/images/hero-chicken.png'
}

export const MENU_DATA: MenuItem[] = [
  { id: 1, name: 'Whole Piri Piri Chicken', category: 'Grilled Collection', description: 'A whole flame-grilled chicken brushed with your signature heat.', price: 17.99, kcal: 1250, image: imageFor('Grilled Collection'), popular: true, startingPrice: true },
  { id: 2, name: 'Half Piri Piri Chicken', category: 'Grilled Collection', description: 'Juicy half chicken, marinated overnight and grilled to order.', price: 10.99, kcal: 680, image: imageFor('Grilled Collection'), popular: true },
  { id: 3, name: 'Quarter Chicken', category: 'Grilled Collection', description: 'A classic quarter chicken with crisp flame-kissed edges.', price: 6.99, kcal: 390, image: imageFor('Grilled Collection') },
  { id: 4, name: 'Chicken Burger', category: 'Maeme’s Burgers', description: 'Grilled chicken breast, lettuce, mayo and your chosen piri sauce.', price: 7.99, kcal: 580, image: imageFor('Maeme’s Burgers'), popular: true },
  { id: 5, name: 'Gourmet Beef Burger', category: 'Maeme’s Burgers', description: 'Premium beef patty, cheese, salad and smoky house relish.', price: 9.99, kcal: 710, image: imageFor('Maeme’s Burgers'), startingPrice: true },
  { id: 6, name: 'Chicken Wrap', category: 'Maeme’s Extras', description: 'Flame-grilled chicken strips wrapped with salad and sauce.', price: 8.49, kcal: 540, image: imageFor('Maeme’s Extras') },
  { id: 7, name: 'Chicken Pitta', category: 'Maeme’s Extras', description: 'Warm pitta packed with grilled chicken, crunchy salad and sauce.', price: 8.49, kcal: 520, image: imageFor('Maeme’s Extras') },
  { id: 8, name: 'Chicken Rice Box', category: 'Maeme’s Platter', description: 'Spicy rice topped with grilled chicken and fresh garnish.', price: 9.49, kcal: 620, image: imageFor('Maeme’s Platter'), popular: true },
  { id: 9, name: 'Wings', category: 'Fried Collection', description: 'Six grilled wings tossed in your preferred piri piri flavour.', price: 6.99, kcal: 460, image: imageFor('Fried Collection') },
  { id: 10, name: 'Tender Strips', category: 'Fried Collection', description: 'Four tender chicken strips with a dip on the side.', price: 6.49, kcal: 420, image: imageFor('Fried Collection') },
  { id: 11, name: 'Loaded Fries', category: 'Sides Collection', description: 'Crisp fries loaded with cheese, sauce and fresh herbs.', price: 5.49, kcal: 520, image: imageFor('Sides Collection'), popular: true },
  { id: 12, name: 'Fries', category: 'Sides Collection', description: 'Golden fries, salted and served hot.', price: 3.49, kcal: 360, image: imageFor('Sides Collection') },
  { id: 13, name: 'Corn on the Cob', category: 'Sides Collection', description: 'Grilled sweetcorn finished with butter and piri seasoning.', price: 3.99, kcal: 260, image: imageFor('Sides Collection') },
  { id: 14, name: 'Side Salad', category: 'Sides Collection', description: 'Fresh leaves, cucumber, tomato and house dressing.', price: 3.99, kcal: 140, image: imageFor('Sides Collection') },
  { id: 15, name: 'Kids Burger Meal', category: 'Kids Meal', description: 'Mini chicken burger, fries and a kids drink.', price: 6.99, kcal: 540, image: imageFor('Kids Meal') },
  { id: 16, name: 'Kids Strips Meal', category: 'Kids Meal', description: 'Tender strips, fries and a kids drink.', price: 6.49, kcal: 500, image: imageFor('Kids Meal') },
  { id: 17, name: 'Chocolate Cake', category: 'Dessert Collection', description: 'Rich chocolate cake slice for a sweet finish.', price: 4.49, kcal: 390, image: imageFor('Dessert Collection') },
  { id: 18, name: 'Mango Lassi', category: 'Drinks', description: 'Cool mango yoghurt drink with a smooth finish.', price: 3.99, kcal: 260, image: imageFor('Drinks') },
  { id: 19, name: 'Oreo Milkshake', category: 'Drinks', description: 'Thick vanilla shake blended with Oreo pieces.', price: 4.99, kcal: 430, image: imageFor('Drinks') },
  { id: 20, name: 'Lotus Biscoff Milkshake', category: 'Drinks', description: 'Creamy Biscoff shake with caramel biscuit notes.', price: 5.49, kcal: 460, image: imageFor('Drinks'), popular: true },
]

export const getProductsByCategory = (category: string) => MENU_DATA.filter(product => product.category === category)
export const getFeaturedProducts = () => MENU_DATA.filter(product => product.popular).slice(0, 6)
