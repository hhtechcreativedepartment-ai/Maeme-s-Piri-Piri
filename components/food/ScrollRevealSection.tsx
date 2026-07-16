'use client';

import { type ComponentPropsWithoutRef, useLayoutEffect, useRef, useState } from 'react';

type ScrollRevealSectionProps = ComponentPropsWithoutRef<'section'>;

export default function ScrollRevealSection({ className = '', ...props }: ScrollRevealSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealState, setRevealState] = useState<'pending' | 'hidden' | 'visible'>('pending');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealState('visible');
      return;
    }

    setRevealState('hidden');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealState('visible');
        observer.unobserve(entry.target);
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-reveal-state={revealState}
      className={`food-scroll-section ${className}`}
      {...props}
    />
  );
}
