'use client';

import { useEffect, useRef, useState } from 'react';

interface PublicMenuCategoryNavProps {
  categories: Array<{
    id: string;
    title: string;
    anchor: string;
  }>;
}

export default function PublicMenuCategoryNav({ categories }: PublicMenuCategoryNavProps) {
  const [activeAnchor, setActiveAnchor] = useState(categories[0]?.anchor ?? '');
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const railRef = useRef<HTMLDivElement | null>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    railRef.current?.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const sections = categories
      .map(category => document.getElementById(category.anchor))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      entries => {
        const visibleSection = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveAnchor(visibleSection.target.id);
        }
      },
      {
        rootMargin: '-22% 0px -62% 0px',
        threshold: [0, 0.05, 0.2],
      },
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    linkRefs.current[activeAnchor]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeAnchor]);

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-[var(--site-header-height)] z-30 border-y border-[#eadfca] bg-white/95 px-4 py-3 shadow-[0_8px_22px_rgba(69,25,18,0.06)] backdrop-blur sm:px-6"
    >
      <div className="mx-auto flex max-w-[1380px] items-center gap-2">
        <button
          type="button"
          aria-label="Scroll categories left"
          onClick={() => scrollCategories('left')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d7a9a3] bg-white text-lg font-black text-[#99041e] transition hover:border-[#99041e] hover:bg-[#fff5e5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60"
        >
          ‹
        </button>

        <div
          ref={railRef}
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map(category => {
            const isActive = activeAnchor === category.anchor;

            return (
              <a
                key={category.id}
                ref={node => {
                  linkRefs.current[category.anchor] = node;
                }}
                href={`#${category.anchor}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => setActiveAnchor(category.anchor)}
                className={`inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border px-4 text-[11px] font-black uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60 ${
                  isActive
                    ? 'border-[#ffc257] bg-[#ffc257] text-[#99041e]'
                    : 'border-[#d7a9a3] bg-white text-[#99041e] hover:border-[#99041e] hover:bg-[#fff5e5]'
                }`}
              >
                {category.title}
              </a>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Scroll categories right"
          onClick={() => scrollCategories('right')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d7a9a3] bg-white text-lg font-black text-[#99041e] transition hover:border-[#99041e] hover:bg-[#fff5e5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60"
        >
          ›
        </button>
      </div>
    </nav>
  );
}
