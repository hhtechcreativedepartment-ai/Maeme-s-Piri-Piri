import type { MenuItem } from '@/lib/menuData';

export type ParsedIntent =
  | { type: 'cancel' | 'restart' | 'back' | 'cart' | 'checkout' | 'menu' | 'branch' | 'favourites' | 'reorder' | 'delivery' | 'collection' | 'confirm' }
  | { type: 'customise'; instruction: string }
  | { type: 'address'; label: 'Home' | 'Office' | 'Work' }
  | { type: 'recommend'; appetite: 'light' | 'normal' | 'hungry' | 'vegetarian'; budget?: number }
  | { type: 'product'; matches: MenuItem[] }
  | { type: 'unknown' };

const normalize = (value: string) => value
  .toLowerCase()
  .replace(/[’']/g, '')
  .replace(/[^a-z0-9£.\s&-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

function productScore(query: string, product: MenuItem) {
  const searchable = normalize(`${product.name} ${product.category} ${product.description}`);
  const tokens = query.split(' ').filter((token) => token.length > 2 && !['want', 'need', 'show', 'give', 'please', 'with', 'meal'].includes(token));
  const tokenScore = tokens.reduce((score, token) => score + (searchable.includes(token) ? 2 : 0), 0);
  const exactBonus = searchable.includes(query) || query.includes(normalize(product.name)) ? 8 : 0;
  return tokenScore + exactBonus;
}

export function parseIntent(input: string, menu: MenuItem[]): ParsedIntent {
  const text = normalize(input);
  if (!text) return { type: 'unknown' };

  if (/\b(start again|restart|clear conversation)\b/.test(text)) return { type: 'restart' };
  if (/\b(cancel|stop order|cancel order)\b/.test(text)) return { type: 'cancel' };
  if (/\b(go back|back)\b/.test(text)) return { type: 'back' };
  if (/\b(change branch|change postcode|another branch|nearby branch)\b/.test(text)) return { type: 'branch' };
  if (/\b(favourite|favorite)\b/.test(text)) return { type: 'favourites' };
  if (/\b(reorder|previous order|order again)\b/.test(text)) return { type: 'reorder' };
  if (/\b(view cart|show cart|basket|checkout)\b/.test(text)) return text.includes('checkout') ? { type: 'checkout' } : { type: 'cart' };
  if (/^(view |show |open )?(complete |full )?menu$/.test(text)) return { type: 'menu' };
  if (/\b(deliver|send)\b.*\b(home|office|work)\b/.test(text)) {
    const label = text.includes('office') ? 'Office' : text.includes('work') ? 'Work' : 'Home';
    return { type: 'address', label };
  }
  if (/\b(make it a meal|make it meal|go large|change (my )?drink|remove (the )?fries|piri piri fries|add (a )?coke|make that regular)\b/.test(text)) {
    return { type: 'customise', instruction: text };
  }
  if (/\b(deliver|delivery)\b/.test(text)) return { type: 'delivery' };
  if (/\b(collect|collection|pick up|pickup)\b/.test(text)) return { type: 'collection' };
  if (/^(yes,? )?(place|confirm)( my| demo)? order$|^yes,? place my order$/.test(text)) return { type: 'confirm' };

  const budgetMatch = text.match(/(?:under|below|less than|max(?:imum)?)\s*£?\s*(\d+(?:\.\d+)?)/);
  if (/\b(recommend|suggest|something|hungry|light|vegetarian|veggie|lunch|dinner)\b/.test(text)) {
    const appetite = /\b(very hungry|filling|sharing|feast)\b/.test(text)
      ? 'hungry'
      : /\b(light|small|snack|lunch)\b/.test(text)
        ? 'light'
        : /\b(vegetarian|veggie|paneer)\b/.test(text)
          ? 'vegetarian'
          : 'normal';
    return { type: 'recommend', appetite, budget: budgetMatch ? Number(budgetMatch[1]) : undefined };
  }

  const ranked = menu
    .map((product) => ({ product, score: productScore(text, product) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, 4)
    .map((entry) => entry.product);

  return ranked.length ? { type: 'product', matches: ranked } : { type: 'unknown' };
}
