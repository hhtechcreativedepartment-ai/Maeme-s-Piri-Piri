import { readStorage, writeStorage } from '@/utils/storage';

const FAVOURITES_KEY = 'maemes.favourites';

function getFavourites() {
  return readStorage<string[]>(FAVOURITES_KEY, []);
}

function saveFavourites(productIds: string[]) {
  writeStorage(FAVOURITES_KEY, productIds);
}

export const favouriteStore = {
  get favourites() {
    return getFavourites();
  },

  addFavourite(productId: string) {
    const favourites = getFavourites();
    if (favourites.includes(productId)) return favourites;
    const nextFavourites = [...favourites, productId];
    saveFavourites(nextFavourites);
    return nextFavourites;
  },

  removeFavourite(productId: string) {
    const nextFavourites = getFavourites().filter(id => id !== productId);
    saveFavourites(nextFavourites);
    return nextFavourites;
  },

  toggleFavourite(productId: string) {
    return getFavourites().includes(productId)
      ? this.removeFavourite(productId)
      : this.addFavourite(productId);
  },

  isFavourite(productId: string) {
    return getFavourites().includes(productId);
  },
};
