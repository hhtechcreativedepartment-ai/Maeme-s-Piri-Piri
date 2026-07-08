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
  'Burgers',
  'Wraps & Pittas',
  'Rice Boxes',
  'Wings & Strips',
  'Sides',
  'Kids Meals',
  'Desserts',
  'Drinks',
  'Milkshakes',
]

const imageFor = (category: string) => {
  if (category.includes('Wrap')) return '/images/chicken-wrap.png'
  if (category.includes('Rice')) return '/images/meal-bowl.png'
  if (category === 'Sides') return '/images/chicken-fries.png'
  if (category === 'Desserts' || category === 'Drinks' || category === 'Milkshakes') return '/images/premium-hero-chicken.png'
  return '/images/hero-chicken.png'
}

export const MENU_DATA: MenuItem[] = [
  { id: 1, name: 'Whole Piri Piri Chicken', category: 'Grilled Collection', description: 'A whole flame-grilled chicken brushed with your signature heat.', price: 17.99, kcal: 1250, image: imageFor('Grilled Collection'), popular: true, startingPrice: true },
  { id: 2, name: 'Half Piri Piri Chicken', category: 'Grilled Collection', description: 'Juicy half chicken, marinated overnight and grilled to order.', price: 10.99, kcal: 680, image: imageFor('Grilled Collection'), popular: true },
  { id: 3, name: 'Quarter Chicken', category: 'Grilled Collection', description: 'A classic quarter chicken with crisp flame-kissed edges.', price: 6.99, kcal: 390, image: imageFor('Grilled Collection') },
  { id: 4, name: 'Chicken Burger', category: 'Burgers', description: 'Grilled chicken breast, lettuce, mayo and your chosen piri sauce.', price: 7.99, kcal: 580, image: imageFor('Burgers'), popular: true },
  { id: 5, name: 'Gourmet Beef Burger', category: 'Burgers', description: 'Premium beef patty, cheese, salad and smoky house relish.', price: 9.99, kcal: 710, image: imageFor('Burgers'), startingPrice: true },
  { id: 6, name: 'Chicken Wrap', category: 'Wraps & Pittas', description: 'Flame-grilled chicken strips wrapped with salad and sauce.', price: 8.49, kcal: 540, image: imageFor('Wraps & Pittas') },
  { id: 7, name: 'Chicken Pitta', category: 'Wraps & Pittas', description: 'Warm pitta packed with grilled chicken, crunchy salad and sauce.', price: 8.49, kcal: 520, image: imageFor('Wraps & Pittas') },
  { id: 8, name: 'Chicken Rice Box', category: 'Rice Boxes', description: 'Spicy rice topped with grilled chicken and fresh garnish.', price: 9.49, kcal: 620, image: imageFor('Rice Boxes'), popular: true },
  { id: 9, name: 'Wings', category: 'Wings & Strips', description: 'Six grilled wings tossed in your preferred piri piri flavour.', price: 6.99, kcal: 460, image: imageFor('Wings & Strips') },
  { id: 10, name: 'Tender Strips', category: 'Wings & Strips', description: 'Four tender chicken strips with a dip on the side.', price: 6.49, kcal: 420, image: imageFor('Wings & Strips') },
  { id: 11, name: 'Loaded Fries', category: 'Sides', description: 'Crisp fries loaded with cheese, sauce and fresh herbs.', price: 5.49, kcal: 520, image: imageFor('Sides'), popular: true },
  { id: 12, name: 'Fries', category: 'Sides', description: 'Golden fries, salted and served hot.', price: 3.49, kcal: 360, image: imageFor('Sides') },
  { id: 13, name: 'Corn on the Cob', category: 'Sides', description: 'Grilled sweetcorn finished with butter and piri seasoning.', price: 3.99, kcal: 260, image: imageFor('Sides') },
  { id: 14, name: 'Side Salad', category: 'Sides', description: 'Fresh leaves, cucumber, tomato and house dressing.', price: 3.99, kcal: 140, image: imageFor('Sides') },
  { id: 15, name: 'Kids Burger Meal', category: 'Kids Meals', description: 'Mini chicken burger, fries and a kids drink.', price: 6.99, kcal: 540, image: imageFor('Kids Meals') },
  { id: 16, name: 'Kids Strips Meal', category: 'Kids Meals', description: 'Tender strips, fries and a kids drink.', price: 6.49, kcal: 500, image: imageFor('Kids Meals') },
  { id: 17, name: 'Chocolate Cake', category: 'Desserts', description: 'Rich chocolate cake slice for a sweet finish.', price: 4.49, kcal: 390, image: imageFor('Desserts') },
  { id: 18, name: 'Mango Lassi', category: 'Drinks', description: 'Cool mango yoghurt drink with a smooth finish.', price: 3.99, kcal: 260, image: imageFor('Drinks') },
  { id: 19, name: 'Oreo Milkshake', category: 'Milkshakes', description: 'Thick vanilla shake blended with Oreo pieces.', price: 4.99, kcal: 430, image: imageFor('Milkshakes') },
  { id: 20, name: 'Lotus Biscoff Milkshake', category: 'Milkshakes', description: 'Creamy Biscoff shake with caramel biscuit notes.', price: 5.49, kcal: 460, image: imageFor('Milkshakes'), popular: true },
]

export const getProductsByCategory = (category: string) => MENU_DATA.filter(product => product.category === category)
export const getFeaturedProducts = () => MENU_DATA.filter(product => product.popular).slice(0, 6)
