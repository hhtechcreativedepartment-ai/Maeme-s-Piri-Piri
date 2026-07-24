'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
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

const heroVideos = [
  {
    name: 'Our Food and signature flavours',
    src: '/videos/our-food/our-food-hero-banner.mp4',
    poster: '/images/our-food-hero-poster.jpg',
  },
  {
    name: 'Maeme’s app offers and rewards',
    src: '/videos/our-app-hero-banner.mp4',
    poster: '/images/our-app-hero-poster.jpg',
  },
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
  const [activeHeroVideo, setActiveHeroVideo] = useState(0);
  const heroVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    heroVideoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeHeroVideo) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeHeroVideo]);

  const showNextHeroVideo = () => {
    setActiveHeroVideo((current) => (current + 1) % heroVideos.length);
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
            {heroVideos.map((video, index) => (
              <video
                key={video.src}
                ref={(element) => {
                  heroVideoRefs.current[index] = element;
                }}
                autoPlay={index === 0}
                muted
                playsInline
                preload={index === 0 ? 'auto' : 'metadata'}
                poster={video.poster}
                controls={false}
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                aria-label={video.name}
                aria-hidden={activeHeroVideo !== index}
                onEnded={showNextHeroVideo}
                onError={index === activeHeroVideo ? showNextHeroVideo : undefined}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  activeHeroVideo === index ? 'z-10 opacity-100' : 'z-0 opacity-0'
                }`}
              >
                <source src={video.src} type="video/mp4" />
              </video>
            ))}
          </div>
          <div className="flex w-full max-w-full justify-center gap-2 bg-white pt-5 max-md:box-border max-md:pt-3">
            {heroVideos.map((video, index) => (
              <button
                key={video.src}
                type="button"
                onClick={() => setActiveHeroVideo(index)}
                aria-label={`Show ${video.name} video`}
                aria-current={activeHeroVideo === index ? 'true' : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--maeme-red)] focus-visible:ring-offset-2 ${
                  activeHeroVideo === index ? 'w-8 bg-[var(--maeme-red)]' : 'w-2.5 bg-[#d8d0ca] hover:bg-[#bfb4ad]'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-8 sm:py-12 lg:py-20">
        <div className="mx-auto grid max-w-[1320px] items-center gap-4 px-4 sm:gap-7 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-8">
          <div className="relative z-10">
            <h2 className="text-[30px] font-bold uppercase leading-[1.02] tracking-[-0.025em] sm:text-5xl sm:font-black sm:leading-[0.98] lg:text-6xl">
              Made Fresh.
              <br />
              <span className="text-[var(--maeme-red)]">Grilled to Perfection.</span>
            </h2>
            <p className="mt-3 text-lg font-bold text-[var(--maeme-yellow)] sm:mt-5 sm:text-2xl sm:font-black">That&apos;s the Maeme&apos;s Promise.</p>
            <p className="mt-2 max-w-lg text-sm leading-6 text-[#6f5f5a] sm:mt-4 sm:text-base sm:leading-7">
              Chicken marinated with signature Piri Piri, grilled over flame and served with the crisp sides you crave.
            </p>
            <button
              onClick={handleMenuAction}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--maeme-red)] px-6 text-sm font-bold text-white transition hover:bg-[var(--maeme-red-dark)] sm:mt-8 sm:min-h-12 sm:gap-3 sm:px-7 sm:font-black"
            >
              Order Now <ArrowRight size={18} />
            </button>
          </div>
          <div className="relative flex min-h-[210px] items-center justify-center sm:min-h-[360px] lg:min-h-[440px]">
            <img
              src="/images/grilled-composition.png"
              alt="Maeme's grilled chicken meal composition"
              className="relative z-10 h-[220px] w-full object-contain drop-shadow-[0_22px_28px_rgba(63,24,18,0.18)] sm:h-[380px] sm:drop-shadow-[0_34px_38px_rgba(63,24,18,0.22)] lg:h-[540px]"
            />
          </div>
        </div>
      </section>

      <AppDownloadSection />

      <section className="relative overflow-hidden bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex max-w-[420px] items-center justify-center gap-4 sm:gap-6">
              <span className="h-px w-12 bg-[var(--maeme-yellow)]/75 sm:w-20" />
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <Flame size={20} fill="var(--maeme-yellow)" strokeWidth={0} className="text-[var(--maeme-yellow)] sm:h-6 sm:w-6" />
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[var(--maeme-red)] sm:text-xs sm:tracking-[0.42em]">How it works</p>
              </div>
              <span className="h-px w-12 bg-[var(--maeme-yellow)]/75 sm:w-20" />
            </div>
            <h2 className="mt-6 text-[30px] font-bold leading-[1.02] tracking-[-0.025em] text-[#1f1210] sm:mt-8 sm:text-4xl sm:font-extrabold lg:text-[52px]">
              Simple. Fast. <span className="text-[var(--maeme-red)]">Delicious.</span>
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--maeme-yellow)] sm:mt-5 sm:w-20" />
            <p className="mt-4 text-sm font-normal leading-6 text-[#4f4541] sm:mt-5 sm:text-lg">
              From our grill to your door - in just a few easy steps.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-7 sm:mt-10 sm:gap-x-6 sm:gap-y-9 md:gap-x-10 lg:grid-cols-4 lg:gap-x-12">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="relative text-center">
                  <div className="relative mx-auto flex h-[82px] w-[82px] items-center justify-center rounded-[16px] border border-[#ead7c7] bg-white shadow-[0_12px_30px_rgba(63,24,18,0.05)] sm:h-[112px] sm:w-[112px] sm:rounded-[20px] lg:h-[126px] lg:w-[126px]">
                    <span className="absolute -left-2 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--maeme-yellow)] text-xs font-bold text-[#1f1210] shadow-[0_8px_18px_rgba(var(--maeme-yellow-rgb),0.22)] sm:-left-3 sm:-top-4 sm:h-10 sm:w-10 sm:text-sm">
                      {index + 1}
                    </span>
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(var(--maeme-red-rgb),0.06)] text-[var(--maeme-red)] sm:h-20 sm:w-20 lg:h-[88px] lg:w-[88px]">
                      <Icon size={29} strokeWidth={1.8} className="sm:h-10 sm:w-10 lg:h-11 lg:w-11" />
                    </span>
                  </div>

                  {index < processSteps.length - 1 && (
                    <div className="absolute left-[calc(50%+86px)] top-[62px] hidden w-[92px] items-center lg:flex">
                      <span className="h-px flex-1 border-t border-dashed border-[var(--maeme-red)]/45" />
                      <span className="mx-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--maeme-red)] bg-white">
                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--maeme-red)]" />
                      </span>
                      <span className="h-px flex-1 border-t border-dashed border-[var(--maeme-red)]/45" />
                    </div>
                  )}

                  <h3 className="mt-3 text-sm font-bold leading-tight text-[#1f1210] sm:mt-5 sm:text-lg sm:font-extrabold lg:text-xl">{step.title}</h3>
                  <div className="mx-auto mt-2 h-0.5 w-8 bg-[var(--maeme-yellow)] sm:mt-3 sm:w-12" />
                  <p className="mx-auto mt-2 max-w-[160px] text-xs leading-5 text-[#4f4541] sm:mt-3 sm:max-w-[190px] sm:text-sm sm:leading-6">{step.copy}</p>
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
              <h2 className="text-[30px] font-bold leading-[1.02] tracking-[-0.025em] text-[#1f1210] sm:text-4xl sm:font-black sm:leading-normal sm:tracking-tight">Find your nearest Maeme&apos;s</h2>
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
