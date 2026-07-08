'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useFavourites } from '@/lib/favouritesContext';
import { useCart } from '@/lib/cartContext';

export default function FavouritesSection() {
  const { favourites, removeFavourite } = useFavourites();
  const { addToCart } = useCart();

  if (favourites.length === 0) {
    return (
      <div>
        {/* Header */}
        <div className="mb-6 pb-6 border-b border-[#E8E0D5]">
          <h3 className="text-2xl font-black text-[#1A1A1A] mb-1">Favourites</h3>
          <p className="text-sm text-[#999999]">Your saved Maeme's dishes.</p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <Heart size={56} className="text-[#D4B896] mb-6" />
          <h4 className="text-lg font-bold text-[#1A1A1A] mb-2">Nothing to show here</h4>
          <p className="text-sm text-[#999999] mb-6">
            Tap the heart on a dish to save it.
          </p>
          <Link
            href="/menu"
            className="px-6 py-3 bg-[#99041e] text-white font-bold rounded-full hover:bg-[#7f0318] transition-colors"
          >
            Explore menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-[#E8E0D5]">
        <h3 className="text-2xl font-black text-[#1A1A1A] mb-1">Favourites</h3>
        <p className="text-sm text-[#999999]">Your saved Maeme's dishes.</p>
      </div>

      {/* Favourites Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favourites.map(item => (
          <div
            key={item.id}
            className="bg-white border border-[#E8E0D5] rounded-xl overflow-hidden hover:border-[#99041e] transition-colors duration-200"
          >
            {/* Image Container */}
            <div className="relative w-full h-48 bg-[#FAF8F5] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => removeFavourite(item.id)}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                aria-label="Remove from favourites"
              >
                <Heart size={20} className="fill-[#99041e] text-[#99041e]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5">
              <h4 className="font-bold text-[#1A1A1A] mb-1 line-clamp-2">{item.name}</h4>
              <p className="text-xs sm:text-sm text-[#666666] mb-4 line-clamp-2">
                {item.description}
              </p>

              {/* Price and Action */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg sm:text-xl font-black text-[#1A1A1A]">
                    £{(item.price).toFixed(2)}
                  </p>
                  {item.kcal && (
                    <p className="text-xs text-[#999999]">{item.kcal}</p>
                  )}
                </div>
                <button
                  onClick={() => addToCart(parseInt(item.id), item.name, item.price)}
                  className="px-4 py-2 bg-[#FFC107] text-[#1A1A1A] font-bold rounded-full hover:bg-[#FFB300] transition-colors text-sm"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
