'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FavouriteItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  kcal?: string;
}

interface FavouritesContextType {
  favourites: FavouriteItem[];
  addFavourite: (item: FavouriteItem) => void;
  removeFavourite: (itemId: string) => void;
  isFavourite: (itemId: string) => boolean;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('maemes_favourites');
    if (saved) {
      try {
        setFavourites(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading favourites:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever favourites change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('maemes_favourites', JSON.stringify(favourites));
    }
  }, [favourites, isLoaded]);

  const addFavourite = (item: FavouriteItem) => {
    setFavourites(prev => {
      const exists = prev.find(fav => fav.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFavourite = (itemId: string) => {
    setFavourites(prev => prev.filter(fav => fav.id !== itemId));
  };

  const isFavourite = (itemId: string) => {
    return favourites.some(fav => fav.id === itemId);
  };

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error('useFavourites must be used within FavouritesProvider');
  }
  return context;
}
