'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: 'Grilled Collection', image: '🍗' },
  { id: 2, name: 'Burgers', image: '🍔' },
  { id: 3, name: 'Wraps & Pittas', image: '🌯' },
  { id: 4, name: 'Rice Boxes', image: '🍚' },
  { id: 5, name: 'Wings & Strips', image: '🍗' },
  { id: 6, name: 'Sides', image: '🍟' },
  { id: 7, name: 'Kids Meals', image: '👶' },
  { id: 8, name: 'Desserts', image: '🍰' },
  { id: 9, name: 'Drinks', image: '🥤' },
];

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
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header - Centered & Premium */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="flex-1">
            <h2 className="text-4xl sm:text-5xl lg:text-5xl font-black text-[#1A1A1A] mb-3 leading-tight">
              Explore our menu
            </h2>
            <p className="text-base sm:text-lg text-[#666666] font-regular max-w-md">
              Something delicious for every kind of craving.
            </p>
          </div>
          <Link
            href="/menu"
            className="hidden sm:inline-block px-6 py-3 bg-[#99041e] text-white font-bold text-sm rounded-full hover:bg-[#7f0318] transition-colors duration-200 whitespace-nowrap shadow-lg hover:shadow-xl"
          >
            View all categories
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow hidden sm:flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} className="text-[#99041e]" />
            </button>
          )}

          {/* Categories Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/menu?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex-shrink-0 w-40 sm:w-44"
              >
                <div className="bg-white rounded-xl border border-[#E8E0D5] p-6 text-center hover:border-[#99041e] hover:shadow-lg transition-all duration-300 snap-start">
                  <div className="text-6xl sm:text-7xl mb-5 text-center">
                    {category.image}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1A1A1A] line-clamp-2 leading-snug">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow hidden sm:flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} className="text-[#99041e]" />
            </button>
          )}
        </div>

        {/* Mobile CTA */}
        <Link
          href="/menu"
          className="sm:hidden block mt-10 text-center text-white bg-[#99041e] py-3 px-6 rounded-full font-bold text-sm hover:bg-[#7f0318] transition-colors duration-200"
        >
          View all categories
        </Link>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
