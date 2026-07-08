'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

interface DishCard {
  productId: string;
  name: string;
  description: string;
  price: number;
  kcal: number;
  image: string;
  badge?: string;
}

const FEATURED_DISHES: DishCard[] = [
  {
    productId: 'chicken-burger',
    name: 'Chicken Burger',
    description: 'Crispy fried chicken with special sauce and fresh toppings',
    price: 7.99,
    kcal: 550,
    image: '🍔',
    badge: 'Popular',
  },
  {
    productId: 'half-chicken',
    name: 'Half Chicken',
    description: 'Flame-grilled piri piri chicken, perfectly seasoned',
    price: 12.99,
    kcal: 620,
    image: '🍗',
  },
  {
    productId: 'chicken-rice-box',
    name: 'Chicken Rice Box',
    description: 'Succulent chicken served with fragrant jasmine rice',
    price: 9.49,
    kcal: 580,
    image: '🍚',
  },
  {
    productId: 'spicy-wrap',
    name: 'Spicy Chicken Wrap',
    description: 'Grilled chicken wrap with piri piri sauce and vegetables',
    price: 8.99,
    kcal: 520,
    image: '🌯',
  },
  {
    productId: 'wings-combo',
    name: 'Wings Combo',
    description: 'Crispy wings coated in signature piri piri spice',
    price: 10.49,
    kcal: 480,
    image: '🍗',
  },
  {
    productId: 'loaded-fries',
    name: 'Loaded Fries',
    description: 'Crispy fries topped with cheese and piri piri chicken',
    price: 6.99,
    kcal: 420,
    image: '🍟',
  },
];

export default function FeaturedDishesSection() {
  const { addToCart } = useCart();
  const [toast, setToast] = useState<{ message: string; productName: string } | null>(null);

  const handleAddToCart = (dish: DishCard) => {
    addToCart(parseInt(dish.productId as any), dish.name, dish.price);

    setToast({
      message: 'Added to cart',
      productName: dish.name,
    });

    setTimeout(() => setToast(null), 3000);
  };

  return (
    <section className="bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] mb-2">
              Featured dishes
            </h2>
            <p className="text-sm sm:text-base text-[#666666] font-medium">
              Maeme&apos;s favourites, cooked to order.
            </p>
          </div>
          <Link
            href="/menu"
            className="hidden sm:inline-block px-6 py-2.5 bg-[#99041e] text-white font-bold text-sm rounded-lg hover:bg-[#7f0318] transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
          >
            See Full Menu
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {FEATURED_DISHES.map((dish) => (
            <div
              key={dish.productId}
              className="bg-white rounded-xl border border-[#E8E0D5] overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Image Area */}
              <div className="relative bg-gradient-to-br from-[#FFF5F5] to-[#FAF8F5] aspect-square flex items-center justify-center overflow-hidden group">
                {dish.badge && (
                  <div className="absolute top-4 right-4 bg-[#99041e] text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    {dish.badge}
                  </div>
                )}
                <div className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-300">
                  {dish.image}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-bold text-[#99041e] leading-snug mb-2">
                  {dish.name}
                </h3>
                <p className="text-sm text-[#555555] leading-relaxed line-clamp-2 mb-3">
                  {dish.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[#F0E5D8]">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-[#999999] font-medium">
                      {dish.kcal} kcal
                    </span>
                    <span className="text-xl font-black text-[#99041e]">
                      £{dish.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(dish)}
                    className="bg-[#99041e] hover:bg-[#7f0318] text-white p-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    aria-label={`Add ${dish.name} to cart`}
                  >
                    <Plus size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-8 left-4 right-4 sm:left-auto sm:right-8 sm:bottom-8 sm:w-80 bg-[#99041e] text-white p-4 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
            <p className="font-semibold text-sm">{toast.message}</p>
            <p className="text-xs text-white/90 mt-1">{toast.productName}</p>
          </div>
        )}

        {/* Mobile CTA */}
        <div className="sm:hidden mt-8">
          <Link
            href="/menu"
            className="block text-center px-6 py-3 bg-[#99041e] text-white font-bold text-sm rounded-lg hover:bg-[#7f0318] transition-colors shadow-sm hover:shadow-md"
          >
            See Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
