import type { Promo } from '@/types';
import { promos as seedPromos } from '@/data/promos';
import { readStorage, writeStorage } from '@/utils/storage';

const PROMOS_KEY = 'maemes.promos';
const APPLIED_PROMO_KEY = 'maemes.appliedPromo';

function getPromos() {
  return readStorage<Promo[]>(PROMOS_KEY, seedPromos);
}

export const promoStore = {
  get promos() {
    return getPromos();
  },

  get appliedPromo() {
    return readStorage<Promo | null>(APPLIED_PROMO_KEY, null);
  },

  setPromos(promos: Promo[]) {
    writeStorage(PROMOS_KEY, promos);
    return promos;
  },

  applyPromo(code: string) {
    const promo = getPromos().find(item => item.code.toLowerCase() === code.trim().toLowerCase()) || null;
    if (promo) writeStorage(APPLIED_PROMO_KEY, promo);
    return promo;
  },

  calculateDiscount(subtotal: number, promo = this.appliedPromo) {
    if (!promo) return 0;
    if (promo.discountAmount) return Math.min(promo.discountAmount, subtotal);
    if (promo.discountPercent) return Number((subtotal * (promo.discountPercent / 100)).toFixed(2));
    return 0;
  },
};
