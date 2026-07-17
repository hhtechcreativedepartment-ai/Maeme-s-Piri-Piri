'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  MapPin,
  ShoppingBag,
  Star,
  Store,
  Truck,
  Utensils,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cartContext';
import OrderTypeModal from '@/components/ordering/OrderTypeModal';
import AppDownloadSection from '@/components/home/AppDownloadSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { MENU_CATEGORY_DATA } from '@/lib/menuData';

const heroSlides = [
  { name: 'Maeme’s App Rewards Offer', image: '/images/banners/maemes-app-rewards-offer.png' },
  { name: 'Chicken Rice Box', image: '/images/banners/chicken-rice-box.png' },
  { name: '5 Spicy Wings Meal', image: '/images/banners/spicy-wings-meal.png' },
  { name: '5 Chicken Nuggets Meal', image: '/images/banners/chicken-nuggets-meal-new.png' },
  { name: 'Signature Milkshakes', image: '/images/banners/signature-milkshakes-new.png' },
];

const processSteps = [
  { title: 'Choose Location', copy: 'Find your nearest Maeme\'s branch.', icon: MapPin },
  { title: 'Choose Your Meal', copy: 'Pick favourites and heat level.', icon: Utensils },
  { title: 'Fast Delivery', copy: 'Track your order in real time.', icon: Truck },
  { title: 'Enjoy', copy: 'Fresh, hot and grilled perfectly.', icon: ShoppingBag },
];

const stores = [
  { name: 'Shoreditch', address: '18 Kingsland Road, London E2', time: '30-40 min', rating: '4.8', image: '/images/stores/maemes-store-2.png' },
  { name: 'Stratford', address: 'Westfield Avenue, London E20', time: '25-35 min', rating: '4.7', image: '/images/stores/maemes-store-3.png' },
  { name: 'Croydon', address: '103 North End, Croydon CR0', time: '35-45 min', rating: '4.8', image: '/images/stores/maemes-store-4.png' },
  { name: 'Wembley', address: 'Empire Way, Wembley HA9', time: '30-40 min', rating: '4.6', image: '/images/stores/maemes-store-1.png' },
];

export default function InternationalHomePage() {
  const router = useRouter();
  const { selectedBranch, selectedOrderType } = useCart();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const menuCarouselRef = useRef<HTMLDivElement>(null);
  const [canScrollMenuLeft, setCanScrollMenuLeft] = useState(false);
  const [canScrollMenuRight, setCanScrollMenuRight] = useState(true);

  useEffect(() => {
    const slideTimer = window.setInterval(() => {
      setActiveHeroSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(slideTimer);
  }, []);

  const updateMenuCarouselState = () => {
    const carousel = menuCarouselRef.current;
    if (!carousel) return;

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    setCanScrollMenuLeft(carousel.scrollLeft > 6);
    setCanScrollMenuRight(carousel.scrollLeft < maxScrollLeft - 6);
  };

  useEffect(() => {
    const carousel = menuCarouselRef.current;
    if (!carousel) return;

    updateMenuCarouselState();
    carousel.addEventListener('scroll', updateMenuCarouselState, { passive: true });
    window.addEventListener('resize', updateMenuCarouselState);

    return () => {
      carousel.removeEventListener('scroll', updateMenuCarouselState);
      window.removeEventListener('resize', updateMenuCarouselState);
    };
  }, []);

  const scrollMenuCarousel = (direction: 'left' | 'right') => {
    const carousel = menuCarouselRef.current;
    if (!carousel) return;

    const cards = Array.from(
      carousel.querySelectorAll<HTMLElement>('[data-menu-category-card]'),
    );
    if (!cards.length) return;

    const firstCardOffset = cards[0].offsetLeft;
    const currentIndex = cards.reduce((nearestIndex, card, index) => {
      const cardScrollPosition = card.offsetLeft - firstCardOffset;
      const nearestScrollPosition = cards[nearestIndex].offsetLeft - firstCardOffset;

      return Math.abs(cardScrollPosition - carousel.scrollLeft) <
        Math.abs(nearestScrollPosition - carousel.scrollLeft)
        ? index
        : nearestIndex;
    }, 0);
    const targetIndex = Math.max(
      0,
      Math.min(cards.length - 1, currentIndex + (direction === 'left' ? -1 : 1)),
    );

    carousel.scrollTo({
      left: cards[targetIndex].offsetLeft - firstCardOffset,
      behavior: 'smooth',
    });
  };

  const requireOrdering = () => {
    if (!selectedBranch || !selectedOrderType) {
      setShowOrderModal(true);
      return false;
    }

    return true;
  };

  const handleMenuAction = () => {
    if (!requireOrdering()) return;
    router.push('/menu');
  };

  return (
    <main className="w-full overflow-x-hidden bg-white text-[#1f1210] max-md:max-w-full max-md:min-w-0">
      <section className="relative bg-white pb-10 pt-8 max-md:box-border max-md:w-full max-md:max-w-full max-md:pb-5 max-md:pt-3 lg:pb-14">
        <div className="page-container max-md:box-border max-md:w-full max-md:max-w-full">
          <div className="relative aspect-[1920/750] min-h-[168px] min-w-0 overflow-hidden rounded-[26px] border border-[#ead7c7] bg-[#fff8ef] shadow-[0_26px_80px_rgba(63,24,18,0.10)] max-md:box-border max-md:h-auto max-md:w-full max-md:max-w-full max-md:min-h-0 max-md:rounded-[18px] sm:min-h-[260px] lg:min-h-0">
            {heroSlides.map((slide, index) => (
              <Image
                key={slide.name}
                src={slide.image}
                alt={slide.name}
                fill
                sizes="100vw"
                priority={index === 0}
                quality={100}
                className="absolute inset-0 object-contain transition-opacity duration-700 ease-out max-md:h-full max-md:w-full max-md:max-w-full"
                style={{ opacity: index === activeHeroSlide ? 1 : 0 }}
              />
            ))}
          </div>
          <div className="flex w-full max-w-full justify-center gap-2 bg-white pt-5 max-md:box-border max-md:pt-3">
            {heroSlides.map((slide, dot) => (
              <button
                key={slide.name}
                onClick={() => setActiveHeroSlide(dot)}
                className={`h-2.5 rounded-full transition ${dot === activeHeroSlide ? 'w-8 bg-[var(--maeme-red)]' : 'w-2.5 bg-[#d8d0ca]'}`}
                aria-label={`Go to promotional slide ${dot + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="maeme-menu-carousel-section bg-white py-14 max-md:w-full max-md:max-w-full max-md:py-7 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 max-md:box-border max-md:w-full max-md:min-w-0 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-5 max-md:mb-6 max-md:gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--maeme-red)]">Explore our</p>
              <h2 className="mt-2 text-[32px] font-black uppercase tracking-tight max-md:text-[clamp(25px,7.4vw,30px)] max-md:leading-none sm:text-5xl">
                <span>Menu </span>
                <span className="text-[var(--maeme-red)]">Categories</span>
              </h2>
              <div className="mt-4 h-1.5 w-20 rounded-full bg-[var(--maeme-yellow)] max-md:mt-3" />
            </div>
            <Link href="/menu" className="inline-flex items-center gap-2 text-sm font-black text-[var(--maeme-red)]">
              View Full Menu <ArrowRight size={17} />
            </Link>
          </div>

          <div className="flex min-w-0 items-center gap-4 py-3 max-md:w-full max-md:max-w-full max-md:gap-0 max-md:py-0">
            <button
              type="button"
              onClick={() => scrollMenuCarousel('left')}
              disabled={!canScrollMenuLeft}
              className="maeme-menu-carousel-arrow relative z-10 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(var(--maeme-red-rgb),0.14)] bg-white text-[#1f1210] shadow-[0_8px_22px_rgba(31,18,16,0.06)] transition hover:border-[rgba(var(--maeme-red-rgb),0.28)] hover:text-[var(--maeme-red)] hover:shadow-[0_12px_28px_rgba(31,18,16,0.09)] disabled:pointer-events-none disabled:opacity-30 md:flex"
              aria-label="Scroll menu categories left"
            >
              <ChevronLeft size={21} strokeWidth={2.4} />
            </button>

            <div
              ref={menuCarouselRef}
              className="maeme-menu-carousel-track flex min-w-0 flex-1 snap-x snap-mandatory scroll-px-2 items-stretch gap-4 overflow-x-auto scroll-smooth px-2 pb-7 pt-2 [scrollbar-width:none] max-md:w-full max-md:max-w-full max-md:touch-pan-x max-md:gap-3 max-md:overscroll-x-contain max-md:pb-2 max-md:pt-1 sm:gap-5 [&::-webkit-scrollbar]:hidden"
            >
              {MENU_CATEGORY_DATA.map((category) => (
              <Link
                key={category.id}
                data-menu-category-card
                href={`/menu#${category.anchor}`}
                className="maeme-menu-category-card group flex h-[232px] w-[78vw] min-w-[236px] max-w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-[16px] border border-[#ead8c6] bg-[#FFFFFF] p-4 text-left shadow-[0_10px_26px_rgba(31,18,16,0.045)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(var(--maeme-red-rgb),0.22)] hover:shadow-[0_16px_34px_rgba(31,18,16,0.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--maeme-yellow)]/30 max-md:h-[clamp(184px,50vw,215px)] max-md:w-[clamp(190px,62vw,246px)] max-md:min-w-[clamp(190px,62vw,246px)] max-md:max-w-[246px] max-md:p-3 sm:h-[244px] sm:w-[calc((100%-40px)/3)] sm:min-w-[226px] sm:max-w-none lg:w-[calc((100%-80px)/5)] lg:min-w-[0]"
              >
                <h3 className="min-h-[38px] text-sm font-black uppercase leading-tight tracking-[0.025em] text-[#1f1210] max-md:min-h-[30px] max-md:text-xs sm:text-[15px]">
                  {category.title}
                </h3>
                <span className="mt-3 flex min-h-0 flex-1 items-center justify-center px-3 py-4 max-md:mt-1 max-md:px-1 max-md:py-2">
                  <img
                    src={category.image}
                    alt={`${category.title} category`}
                    className="max-h-[150px] w-full object-contain object-center transition-transform duration-300 ease-out group-hover:scale-[1.018] max-md:h-full max-md:max-h-[132px] max-md:max-w-full sm:max-h-[158px]"
                  />
                </span>
              </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollMenuCarousel('right')}
              disabled={!canScrollMenuRight}
              className="maeme-menu-carousel-arrow relative z-10 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(var(--maeme-red-rgb),0.14)] bg-white text-[#1f1210] shadow-[0_8px_22px_rgba(31,18,16,0.06)] transition hover:border-[rgba(var(--maeme-red-rgb),0.28)] hover:text-[var(--maeme-red)] hover:shadow-[0_12px_28px_rgba(31,18,16,0.09)] disabled:pointer-events-none disabled:opacity-30 md:flex"
              aria-label="Scroll menu categories right"
            >
              <ChevronRight size={21} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="relative z-10">
            <h2 className="text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Made Fresh.
              <br />
              <span className="text-[var(--maeme-red)]">Grilled to Perfection.</span>
            </h2>
            <p className="mt-5 text-2xl font-black text-[var(--maeme-yellow)]">That&apos;s the Maeme&apos;s Promise.</p>
            <p className="mt-4 max-w-lg text-base leading-7 text-[#6f5f5a]">
              Chicken marinated with signature Piri Piri, grilled over flame and served with the crisp sides you crave.
            </p>
            <button
              onClick={handleMenuAction}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[var(--maeme-red)] px-7 text-sm font-black text-white transition hover:bg-[var(--maeme-red-dark)]"
            >
              Order Now <ArrowRight size={18} />
            </button>
          </div>
          <div className="relative flex min-h-[340px] items-center justify-center sm:min-h-[440px]">
            <img
              src="/images/grilled-composition.png"
              alt="Maeme's grilled chicken meal composition"
              className="relative z-10 h-[360px] w-full object-contain drop-shadow-[0_34px_38px_rgba(63,24,18,0.22)] sm:h-[460px] lg:h-[540px]"
            />
          </div>
        </div>
      </section>

      <AppDownloadSection />

      <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex max-w-[520px] items-center justify-center gap-7">
              <span className="h-px w-20 bg-[var(--maeme-yellow)]/75" />
              <div className="flex flex-col items-center gap-3">
                <Flame size={28} fill="var(--maeme-yellow)" strokeWidth={0} className="text-[var(--maeme-yellow)]" />
                <p className="text-sm font-black uppercase tracking-[0.48em] text-[var(--maeme-red)]">How it works</p>
              </div>
              <span className="h-px w-20 bg-[var(--maeme-yellow)]/75" />
            </div>
            <h2 className="mt-14 text-[44px] font-black leading-none tracking-tight text-[#1f1210] sm:text-6xl lg:text-[76px]">
              Simple. Fast. <span className="text-[var(--maeme-red)]">Delicious.</span>
            </h2>
            <div className="mx-auto mt-9 h-1.5 w-28 rounded-full bg-[var(--maeme-yellow)]" />
            <p className="mt-9 text-lg font-medium leading-8 text-[#4f4541] sm:text-2xl">
              From our grill to your door - in just a few easy steps.
            </p>
          </div>

          <div className="mt-20 grid gap-y-14 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:gap-x-16">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="relative text-center">
                  <div className="relative mx-auto flex h-[150px] w-[150px] items-center justify-center rounded-[22px] border border-[#ead7c7] bg-white shadow-[0_18px_48px_rgba(63,24,18,0.06)]">
                    <span className="absolute -left-4 -top-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--maeme-yellow)] text-lg font-black text-[#1f1210] shadow-[0_12px_26px_rgba(var(--maeme-yellow-rgb),0.26)]">
                      {index + 1}
                    </span>
                    <span className="flex h-[106px] w-[106px] items-center justify-center rounded-full bg-[rgba(var(--maeme-red-rgb),0.06)] text-[var(--maeme-red)]">
                      <Icon size={54} strokeWidth={1.9} />
                    </span>
                  </div>

                  {index < processSteps.length - 1 && (
                    <div className="absolute left-[calc(50%+102px)] top-[74px] hidden w-[124px] items-center lg:flex">
                      <span className="h-px flex-1 border-t border-dashed border-[var(--maeme-red)]/45" />
                      <span className="mx-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--maeme-red)] bg-white">
                        <span className="h-3.5 w-3.5 rounded-full bg-[var(--maeme-red)]" />
                      </span>
                      <span className="h-px flex-1 border-t border-dashed border-[var(--maeme-red)]/45" />
                    </div>
                  )}

                  <h3 className="mt-10 text-2xl font-black leading-tight text-[#1f1210]">{step.title}</h3>
                  <div className="mx-auto mt-5 h-0.5 w-16 bg-[var(--maeme-yellow)]" />
                  <p className="mx-auto mt-7 max-w-[210px] text-base leading-8 text-[#4f4541]">{step.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-[#1f1210]">Find your nearest Maeme&apos;s</h2>
              <p className="mt-2 text-base leading-7 text-[#6f5f5a]">Fresh flame-grilled flavour, ready for collection or delivery.</p>
            </div>
            <Link href="/branches" className="inline-flex items-center gap-2 text-sm font-black text-[var(--maeme-red)]">
              View all stores <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-5">
            {stores.map((store) => (
              <article key={store.name} className="overflow-hidden rounded-[20px] border border-[#ead7c7] bg-white shadow-[0_14px_38px_rgba(63,24,18,0.07)]">
                <img src={store.image} alt={`${store.name} Maeme's branch`} className="h-32 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-black text-[#1f1210]">{store.name}</h3>
                    <span className="rounded-full bg-[#e7f6ed] px-2.5 py-1 text-xs font-black text-[#198754]">Open</span>
                  </div>
                  <p className="mt-3 flex gap-2 text-sm leading-6 text-[#6f5f5a]">
                    <MapPin size={16} className="mt-1 shrink-0 text-[var(--maeme-red)]" />
                    {store.address}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs font-black text-[#1f1210]">
                    <span className="inline-flex items-center gap-1"><Clock size={14} /> {store.time}</span>
                    <span className="inline-flex items-center gap-1"><Star size={14} fill="var(--maeme-yellow)" className="text-[var(--maeme-yellow)]" /> {store.rating}</span>
                  </div>
                </div>
              </article>
            ))}
            <article className="flex min-h-[280px] flex-col justify-between rounded-[20px] bg-[var(--maeme-red)] p-6 text-white shadow-[0_18px_48px_rgba(var(--maeme-red-rgb),0.18)]">
              <Store size={34} className="text-[var(--maeme-yellow)]" />
              <div>
                <h3 className="text-2xl font-black">Open a Maeme&apos;s</h3>
                <p className="mt-3 text-sm leading-6 text-white/78">Join a global brand loved by millions.</p>
              </div>
              <Link href="/franchising" className="inline-flex items-center gap-2 text-sm font-black text-[var(--maeme-yellow)]">
                Partner With Us <ArrowRight size={17} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <NewsletterSection />

      <OrderTypeModal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} />
    </main>
  );
}
