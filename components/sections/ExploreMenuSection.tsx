'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MENU_CATEGORY_DATA } from '@/lib/menuData';

export default function ExploreMenuSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  return (
    <section className="bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex-1">
            <h2 className="mb-3 text-4xl font-black leading-tight text-[#1A1A1A] sm:text-5xl lg:text-5xl">
              Explore our menu
            </h2>
            <p className="max-w-md text-base font-normal text-[#666666] sm:text-lg">
              Something delicious for every kind of craving.
            </p>
          </div>
          <Link
            href="/menu"
            className="hidden whitespace-nowrap rounded-full bg-[#99041e] px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors duration-200 hover:bg-[#7f0318] hover:shadow-xl sm:inline-block"
          >
            View all categories
          </Link>
        </div>

        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 shadow-md transition-shadow hover:shadow-lg sm:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} className="text-[#99041e]" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {MENU_CATEGORY_DATA.map((category) => (
              <Link
                key={category.id}
                href={`/menu#${category.anchor}`}
                className="w-40 flex-shrink-0 sm:w-44"
              >
                <div className="snap-start rounded-xl border border-[#E8E0D5] bg-white p-6 text-center transition-all duration-300 hover:border-[#99041e] hover:shadow-lg">
                  <div className="mb-5 flex h-24 items-center justify-center sm:h-28">
                    <img src={category.image} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                  <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#1A1A1A] sm:text-base">
                    {category.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 shadow-md transition-shadow hover:shadow-lg sm:flex"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} className="text-[#99041e]" />
            </button>
          )}
        </div>

        <Link
          href="/menu"
          className="mt-10 block rounded-full bg-[#99041e] px-6 py-3 text-center text-sm font-bold text-white transition-colors duration-200 hover:bg-[#7f0318] sm:hidden"
        >
          View all categories
        </Link>
      </div>
    </section>
  );
}
