'use client';

import { useState, useEffect } from 'react';

export default function HeroCarousel() {
  const slides = [
    {
      id: 1,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/american%20cheese%20Burger-P0F5OgZ2XJTOqe7vZxJLCK2Qv1NQKQ.jpg',
      alt: 'American Cheese Burger',
    },
    {
      id: 3,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/junior-american-cheese-Burger-offer-free-5gDvWwaKdfFSwXkCecurvfpQfU5ddI.jpg',
      alt: 'Junior American Cheese Burger Free Offer',
    },
    {
      id: 4,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Maeme%E2%80%99s-Dalston-2W7M7Ibf4JzrA61lqHxGSFBfBP3AUx.jpg',
      alt: 'Maeme\'s Dalston Now Offers Delivery',
    },
    {
      id: 5,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/camberwell-opening-soon-oc09Zv2IfBPH9pjH69RhUrDI98BwHk.jpg',
      alt: 'Camberwell Opening Soon',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };



  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
      {/* Carousel Container */}
      <div className="relative w-full h-96 sm:h-[500px] lg:h-[600px] bg-white flex items-center justify-center">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dots Navigation - Below Carousel */}
      <div className="w-full bg-white py-4 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-[#99041e] w-8'
                : 'bg-[#99041e]/30 hover:bg-[#99041e]/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
