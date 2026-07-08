'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  Clock,
  Flame,
  Gift,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Store,
  Truck,
  Utensils,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cartContext';
import OrderTypeModal from '@/components/ordering/OrderTypeModal';

const categoryCards = [
  { name: 'Grilled Collection', image: '/images/categories/grilled-collection.png' },
  { name: 'Burgers', image: '/images/categories/burgers.png' },
  { name: 'Wraps & Pittas', image: '/images/categories/wraps-pittas.png' },
  { name: 'Rice Boxes', image: '/images/categories/rice-boxes.png' },
  { name: 'Wings & Strips', image: '/images/categories/wings-strips.png' },
  { name: 'Sides', image: '/images/categories/sides.png' },
  { name: 'Kids Meals', image: '/images/categories/kids-meals.png' },
  { name: 'Desserts', image: '/images/categories/desserts.png' },
  { name: 'Drinks', image: '/images/categories/drinks-milkshakes.png' },
  { name: 'Milkshakes', image: '/images/categories/drinks-milkshakes.png' },
];

const heroSlides = [
  { name: 'Chicken Rice Box', image: '/images/banners/chicken-rice-box.png' },
  { name: '5 Spicy Wings Meal', image: '/images/banners/spicy-wings-meal.png' },
  { name: '5 Chicken Nuggets Meal', image: '/images/banners/chicken-nuggets-meal.png' },
  { name: 'Signature Milkshakes', image: '/images/banners/signature-milkshakes.png' },
];

const appFeatures = [
  { label: 'Exclusive App Offers', icon: Gift },
  { label: 'Earn & Redeem Rewards', icon: Award },
  { label: 'Faster Ordering', icon: Zap },
];

const processSteps = [
  { title: 'Choose Location', copy: 'Find your nearest Maeme\'s branch.', icon: MapPin },
  { title: 'Choose Your Meal', copy: 'Pick favourites and heat level.', icon: Utensils },
  { title: 'Fast Delivery', copy: 'Track your order in real time.', icon: Truck },
  { title: 'Enjoy', copy: 'Fresh, hot and grilled perfectly.', icon: ShoppingBag },
];

const stores = [
  { name: 'Shoreditch', address: '18 Kingsland Road, London E2', time: '30-40 min', rating: '4.8' },
  { name: 'Stratford', address: 'Westfield Avenue, London E20', time: '25-35 min', rating: '4.7' },
  { name: 'Croydon', address: '103 North End, Croydon CR0', time: '35-45 min', rating: '4.8' },
  { name: 'Wembley', address: 'Empire Way, Wembley HA9', time: '30-40 min', rating: '4.6' },
];

export default function InternationalHomePage() {
  const router = useRouter();
  const { selectedBranch, selectedOrderType } = useCart();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  useEffect(() => {
    const slideTimer = window.setInterval(() => {
      setActiveHeroSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(slideTimer);
  }, []);

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
    <main className="w-full overflow-x-hidden bg-white text-[#1f1210]">
      <section className="relative bg-white px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14">
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="relative aspect-[1920/750] min-h-[168px] min-w-0 overflow-hidden rounded-[26px] border border-[#ead7c7] bg-[#fff8ef] shadow-[0_26px_80px_rgba(63,24,18,0.10)] sm:min-h-[260px] lg:min-h-0">
            {heroSlides.map((slide, index) => (
              <Image
                key={slide.name}
                src={slide.image}
                alt={slide.name}
                fill
                sizes="100vw"
                priority={index === 0}
                quality={100}
                className="absolute inset-0 object-contain transition-opacity duration-700 ease-out"
                style={{ opacity: index === activeHeroSlide ? 1 : 0 }}
              />
            ))}
          </div>
          <div className="flex justify-center gap-2 bg-white pt-5">
            {heroSlides.map((slide, dot) => (
              <button
                key={slide.name}
                onClick={() => setActiveHeroSlide(dot)}
                className={`h-2.5 rounded-full transition ${dot === activeHeroSlide ? 'w-8 bg-[#d60812]' : 'w-2.5 bg-[#d8d0ca]'}`}
                aria-label={`Go to promotional slide ${dot + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#a90012]">Explore our</p>
              <h2 className="mt-2 text-[32px] font-black uppercase tracking-tight sm:text-5xl">
                <span>Menu </span>
                <span className="text-[#d60812]">Categories</span>
              </h2>
              <div className="mt-4 h-1.5 w-20 rounded-full bg-[#ffc400]" />
            </div>
            <Link href="/menu" className="inline-flex items-center gap-2 text-sm font-black text-[#d60812]">
              View Full Menu <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-5">
            {categoryCards.map((category) => (
              <button
                key={category.name}
                onClick={handleMenuAction}
                className="group flex h-[218px] min-w-0 flex-col justify-between overflow-hidden rounded-[18px] border border-[#ead7c7] bg-white px-4 pb-4 pt-5 text-left shadow-[0_14px_34px_rgba(63,24,18,0.07)] transition hover:-translate-y-1 hover:border-[#d60812]/45 hover:shadow-[0_20px_48px_rgba(63,24,18,0.12)] sm:h-[236px] sm:p-5"
              >
                <h3 className="min-h-[38px] text-sm font-black uppercase leading-tight tracking-[0.035em] text-[#1f1210] sm:text-[15px]">
                  {category.name}
                </h3>
                <img
                  src={category.image}
                  alt={`${category.name} category`}
                  className="mx-auto h-32 w-full object-contain object-bottom drop-shadow-[0_18px_18px_rgba(63,24,18,0.10)] transition duration-500 group-hover:scale-105 sm:h-36"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
        <div className="absolute right-8 top-8 text-[260px] font-black leading-none text-[#d60812]/[0.035]">FRESH</div>
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="relative z-10">
            <h2 className="text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Made Fresh.
              <br />
              <span className="text-[#d60812]">Grilled to Perfection.</span>
            </h2>
            <p className="mt-5 text-2xl font-black text-[#ffc400]">That&apos;s the Maeme&apos;s Promise.</p>
            <p className="mt-4 max-w-lg text-base leading-7 text-[#6f5f5a]">
              Chicken marinated with signature Piri Piri, grilled over flame and served with the crisp sides you crave.
            </p>
            <button
              onClick={handleMenuAction}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#d60812] px-7 text-sm font-black text-white transition hover:bg-[#a90012]"
            >
              Order Now <ArrowRight size={18} />
            </button>
          </div>
          <div className="relative overflow-hidden rounded-[28px] border border-[#ead7c7] bg-[#fff8f2] p-6 shadow-[0_24px_70px_rgba(63,24,18,0.10)]">
            <div className="absolute left-6 top-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#d60812] bg-white text-center text-sm font-black uppercase leading-tight text-[#d60812] shadow-lg">
              <ShieldCheck size={20} />
              100%
              <br />
              Halal
            </div>
            <img src="/images/chicken-fries.png" alt="Fresh grilled chicken with fries and dip" className="h-[360px] w-full rounded-[22px] object-cover object-center sm:h-[460px]" />
          </div>
        </div>
      </section>

      <section id="app" className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#a90012_0%,#d60812_56%,#7f0010_100%)] px-6 py-10 text-white shadow-[0_28px_80px_rgba(169,0,18,0.24)] sm:px-10 lg:px-14 lg:py-14">
            <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_0.82fr_0.62fr]">
              <div>
                <h2 className="max-w-xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl">
                  More Rewards.
                  <br />
                  More Flavour.
                  <br />
                  <span className="text-[#ffc400]">Only in the App.</span>
                </h2>
                <p className="mt-5 max-w-lg text-base font-medium leading-7 text-white/82">
                  Download the Maeme&apos;s app and enjoy exclusive offers, faster ordering, and loyalty rewards.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#1f1210] px-6 text-sm font-black text-white">
                    App Store
                  </button>
                  <button className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#1f1210] px-6 text-sm font-black text-white">
                    Google Play
                  </button>
                </div>
              </div>

              <div className="relative mx-auto h-[430px] w-[260px] rotate-[-5deg] rounded-[38px] border-[10px] border-[#21110e] bg-white p-4 shadow-[0_34px_80px_rgba(0,0,0,0.28)] lg:mx-0">
                <div className="mx-auto mb-4 h-1.5 w-20 rounded-full bg-[#21110e]" />
                <div className="rounded-[24px] bg-[#fff8f2] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d60812]">Rewards</p>
                  <p className="mt-2 text-3xl font-black text-[#1f1210]">1,240 pts</p>
                </div>
                <img src="/images/meal-bowl.png" alt="" className="mt-4 h-36 w-full rounded-[22px] object-cover" />
                <div className="mt-4 rounded-[22px] bg-[#d60812] p-4 text-white">
                  <p className="text-sm font-black">Latest offer</p>
                  <p className="mt-1 text-xs leading-5 text-white/80">Family feast, faster checkout, fresh rewards.</p>
                </div>
                <div className="mt-4 h-12 rounded-[18px] bg-[#ffc400]" />
              </div>

              <div className="grid gap-4">
                {appFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.label} className="flex items-center gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffc400] text-[#1f1210]">
                        <Icon size={22} strokeWidth={2.7} />
                      </span>
                      <span className="text-base font-black leading-tight">{feature.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-12 top-10 hidden text-[#ead7c7]/45 lg:block">
          <Flame size={260} strokeWidth={0.7} />
        </div>
        <div className="pointer-events-none absolute -left-10 bottom-20 hidden grid-cols-4 gap-5 opacity-35 lg:grid">
          {Array.from({ length: 20 }).map((_, index) => (
            <span key={index} className="h-2.5 w-2.5 rounded-full bg-[#f1b6b8]" />
          ))}
        </div>
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex max-w-sm items-center justify-center gap-5">
              <span className="h-px w-16 bg-[#ffc400]" />
              <div className="flex flex-col items-center gap-2">
                <Flame size={20} fill="#ffc400" className="text-[#ffc400]" />
                <p className="text-sm font-black uppercase tracking-[0.42em] text-[#d60812]">How it works</p>
              </div>
              <span className="h-px w-16 bg-[#ffc400]" />
            </div>
            <h2 className="mt-8 font-serif text-5xl font-black leading-none tracking-tight text-[#1f1210] sm:text-6xl lg:text-[82px]">
              Simple. Fast. <span className="text-[#d60812]">Delicious.</span>
            </h2>
            <div className="mx-auto mt-8 h-1.5 w-24 rounded-full bg-[#ffc400]" />
            <p className="mt-7 text-lg font-medium leading-8 text-[#4f4541] sm:text-2xl">
              From our grill to your door - in just a few easy steps.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-14">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="group relative min-h-[310px] overflow-visible rounded-[24px] border border-[#ead7c7] bg-white px-7 pb-8 pt-20 text-center shadow-[0_24px_60px_rgba(63,24,18,0.08)] transition hover:-translate-y-1 hover:shadow-[0_30px_76px_rgba(63,24,18,0.12)]"
                >
                  {index < processSteps.length - 1 && (
                    <span className="absolute left-[calc(100%+14px)] top-1/2 z-20 hidden h-[30px] w-[30px] -translate-y-1/2 rounded-full border-2 border-[#d60812] bg-white lg:block">
                      <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d60812]" />
                    </span>
                  )}
                  {index < processSteps.length - 1 && (
                    <span className="absolute left-full top-1/2 hidden h-px w-14 -translate-y-1/2 bg-[#d60812] lg:block" />
                  )}
                  <div className="absolute left-0 top-0 h-20 w-20 overflow-hidden rounded-tl-[24px]">
                    <span className="absolute -left-8 -top-8 h-28 w-28 rounded-br-full bg-[#d60812]" />
                  </div>
                  <span className="absolute left-8 top-8 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#ffc400] text-xl font-black text-white shadow-[0_12px_28px_rgba(255,196,0,0.30)]">
                    {index + 1}
                  </span>
                  <span className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#fff2f2] text-[#d60812]">
                    <Icon size={52} strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-8 text-2xl font-black leading-tight text-[#1f1210]">{step.title}</h3>
                  <div className="mx-auto mt-5 h-0.5 w-16 bg-[#ffc400]" />
                  <p className="mx-auto mt-7 max-w-[190px] text-base leading-8 text-[#4f4541]">{step.copy}</p>
                  <span className="pointer-events-none absolute bottom-0 right-0 h-10 w-full rounded-br-[24px] bg-[radial-gradient(140%_100%_at_100%_100%,rgba(214,8,18,0.82)_0%,rgba(214,8,18,0.42)_34%,transparent_35%)]" />
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
            <Link href="/branches" className="inline-flex items-center gap-2 text-sm font-black text-[#d60812]">
              View all stores <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-5">
            {stores.map((store) => (
              <article key={store.name} className="overflow-hidden rounded-[20px] border border-[#ead7c7] bg-white shadow-[0_14px_38px_rgba(63,24,18,0.07)]">
                <img src="/images/premium-hero-chicken.png" alt="" className="h-32 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-black text-[#1f1210]">{store.name}</h3>
                    <span className="rounded-full bg-[#e7f6ed] px-2.5 py-1 text-xs font-black text-[#198754]">Open</span>
                  </div>
                  <p className="mt-3 flex gap-2 text-sm leading-6 text-[#6f5f5a]">
                    <MapPin size={16} className="mt-1 shrink-0 text-[#d60812]" />
                    {store.address}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs font-black text-[#1f1210]">
                    <span className="inline-flex items-center gap-1"><Clock size={14} /> {store.time}</span>
                    <span className="inline-flex items-center gap-1"><Star size={14} fill="#ffc400" className="text-[#ffc400]" /> {store.rating}</span>
                  </div>
                </div>
              </article>
            ))}
            <article className="flex min-h-[280px] flex-col justify-between rounded-[20px] bg-[#a90012] p-6 text-white shadow-[0_18px_48px_rgba(169,0,18,0.18)]">
              <Store size={34} className="text-[#ffc400]" />
              <div>
                <h3 className="text-2xl font-black">Open a Maeme&apos;s</h3>
                <p className="mt-3 text-sm leading-6 text-white/78">Join a global brand loved by millions.</p>
              </div>
              <Link href="/franchising" className="inline-flex items-center gap-2 text-sm font-black text-[#ffc400]">
                Partner With Us <ArrowRight size={17} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1320px] items-center gap-5 rounded-[20px] bg-[#a90012] px-5 py-5 text-white shadow-[0_18px_46px_rgba(169,0,18,0.18)] md:grid-cols-[1fr_minmax(360px,0.92fr)] lg:px-8">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Get Exclusive Deals & Updates</h2>
            <p className="mt-1 text-sm font-medium text-white/80">Join our newsletter and never miss an offer!</p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row sm:gap-0">
            <input
              type="email"
              placeholder="Enter your email address"
              className="min-h-12 flex-1 rounded-xl border-0 bg-white px-4 text-sm font-semibold text-[#1f1210] outline-none placeholder:text-[#8c7a74] sm:rounded-r-none"
            />
            <button className="min-h-12 rounded-xl bg-[#ffc400] px-7 text-sm font-black text-[#1f1210] transition hover:bg-[#f0b400] sm:rounded-l-none">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <OrderTypeModal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} />
    </main>
  );
}
