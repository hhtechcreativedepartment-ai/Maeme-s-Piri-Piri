'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  Clock,
  Flame,
  MapPin,
  Navigation,
  Smartphone,
  Sparkles,
  Truck,
  Utensils,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRANCHES } from '@/lib/branchData';
import { getFeaturedProducts, MENU_CATEGORIES, MENU_DATA, MenuItem } from '@/lib/menuData';
import { useCart } from '@/lib/cartContext';
import { blogs } from '@/data/blogs';
import OrderTypeModal from '@/components/ordering/OrderTypeModal';
import ProductCard from '@/components/ordering/ProductCard';
import PremiumProductCustomizationModal from '@/components/modals/PremiumProductCustomizationModal';

const flavours = [
  { name: 'Lemon & Herb', heat: 'Mild', tone: 'text-[#126336]', ring: 'border-[#b7dfc4] bg-[#f3fbf5]' },
  { name: 'Mango & Lime', heat: 'Mild', tone: 'text-[#126336]', ring: 'border-[#b7dfc4] bg-[#f3fbf5]' },
  { name: 'Tangy BBQ', heat: 'Mild', tone: 'text-[#126336]', ring: 'border-[#b7dfc4] bg-[#f3fbf5]' },
  { name: 'Garlic Mild', heat: 'Medium', tone: 'text-[#d45f0b]', ring: 'border-[#f3c08d] bg-[#fff7ed]' },
  { name: 'Hot Piri Piri', heat: 'Hot', tone: 'text-[#d71920]', ring: 'border-[#f2a0a4] bg-[#fff5f5]' },
  { name: 'Extra Hot', heat: 'Extra Hot', tone: 'text-[#99041e]', ring: 'border-[#d78a99] bg-[#fff4f6]' },
  { name: 'Inferno', heat: 'Extra Hot', tone: 'text-[#99041e]', ring: 'border-[#d78a99] bg-[#fff4f6]' },
  { name: 'African Devil', heat: 'Extra Hot', tone: 'text-[#99041e]', ring: 'border-[#d78a99] bg-[#fff4f6]' },
  { name: "Maeme's Extra Hot", heat: 'Extra Hot', tone: 'text-[#99041e]', ring: 'border-[#d78a99] bg-[#fff4f6]' },
];

const heroFeatures = [
  { label: 'Flame-Grilled Fresh', icon: Flame },
  { label: '9 Signature Flavours', icon: Sparkles },
  { label: 'Delivery or Pickup', icon: Truck },
];

const categoryImage: Record<string, string> = {
  'Grilled Collection': '/images/hero-chicken.png',
  'Maeme’s Burgers': '/images/premium-hero-chicken.png',
  'Vegetarian Collection': '/images/chicken-wrap.png',
  'Fried Collection': '/images/chicken-fries.png',
  'Maeme’s Platter': '/images/meal-bowl.png',
  'Kids Meal': '/images/chicken-fries.png',
  'Dessert Collection': '/images/premium-hero-chicken.png',
  'Sides Collection': '/images/chicken-fries.png',
  'Maeme’s Extras': '/images/chicken-wrap.png',
  'Ice Cream': '/images/premium-hero-chicken.png',
  Dips: '/images/chicken-fries.png',
  Drinks: '/images/meal-bowl.png',
};

const whyChooseUs = [
  { label: 'Flame-grilled fresh', icon: Flame },
  { label: 'Signature sauces', icon: Sparkles },
  { label: 'Fast ordering', icon: ArrowRight },
  { label: 'Delivery or pickup', icon: Truck },
  { label: 'Freshly prepared meals', icon: Utensils },
];

const galleryImages = [
  '/images/hero-chicken.png',
  '/images/chicken-wrap.png',
  '/images/meal-bowl.png',
  '/images/chicken-fries.png',
];

export default function PremiumHomePage() {
  const router = useRouter();
  const { selectedBranch, selectedOrderType } = useCart();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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

  const handleAdd = (product: MenuItem) => {
    if (!requireOrdering()) return;
    setSelectedProduct(product);
  };

  const handleProductAdded = () => {
    setToast('Added to cart');
    window.setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="w-full overflow-x-hidden bg-white text-[#1a120f]">
      <section className="relative overflow-hidden bg-[#fffdf9]">
        <div className="mx-auto max-w-[1320px] px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pb-12 lg:pt-16">
          <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="relative z-10 min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.42em] text-[#b15c08]">
                FLAME-GRILLED PERFECTION
              </p>
              <h1 className="mt-4 max-w-2xl break-words font-serif text-5xl font-black leading-[0.92] tracking-tight text-[#241512] sm:text-6xl lg:text-[84px]">
                <span className="block">Bold Flavour.</span>
                <span className="block text-[#99041e]">Made for You.</span>
              </h1>
              <p className="mt-5 max-w-[520px] break-words text-base font-medium leading-7 text-[#5f514c] sm:text-lg">
                Fresh ingredients, signature Piri Piri heat and bold flavours - grilled to perfection, every time.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleMenuAction}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#99041e] px-8 py-4 text-sm font-black text-white shadow-[0_18px_42px_rgba(153,4,30,0.24)] transition hover:-translate-y-0.5 hover:bg-[#7f0318]"
                >
                  Order Now <ArrowRight size={18} />
                </button>
                <button
                  onClick={handleMenuAction}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#99041e] bg-white px-8 py-4 text-sm font-black text-[#99041e] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fff8ed]"
                >
                  View Menu
                </button>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
                {heroFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff3df] text-[#99041e]">
                        <Icon size={22} strokeWidth={2.6} />
                      </div>
                      <p className="text-sm font-black leading-tight text-[#34221d]">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative min-w-0 overflow-hidden rounded-[28px] pb-1 pr-1 sm:overflow-visible lg:min-h-[540px]">
              <div className="absolute inset-x-0 top-4 h-[76%] rounded-[28px] bg-[#99041e]/8 blur-3xl" />
              <img
                src="/images/premium-hero-chicken.png"
                alt="Maeme's grilled chicken plate"
                className="relative z-10 ml-auto h-[360px] w-full rounded-[28px] object-cover object-center shadow-[0_32px_90px_rgba(50,24,16,0.18)] sm:h-[460px] lg:h-[540px] lg:w-[108%]"
              />
              <div className="absolute right-3 top-1/2 z-20 flex h-28 w-28 -translate-y-1/2 rotate-[-8deg] flex-col items-center justify-center rounded-full border-4 border-[#99041e] bg-white text-center shadow-[0_18px_40px_rgba(50,24,16,0.18)] sm:right-6 sm:h-32 sm:w-32">
                <span className="text-[10px] font-black uppercase leading-none tracking-[0.15em] text-[#99041e]">Made the</span>
                <span className="mt-1 text-xl font-black leading-none text-[#99041e]">Maeme&apos;s</span>
                <span className="mt-1 text-[11px] font-black uppercase leading-none tracking-[0.16em] text-[#99041e]">Way</span>
              </div>
            </div>
          </div>

          <div className="relative z-20 mt-8 overflow-hidden rounded-[24px] border border-[#f0d59d] bg-white shadow-[0_24px_70px_rgba(50,24,16,0.10)]">
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.34fr_0.66fr] lg:p-7">
              <div className="flex flex-col justify-center">
                <h2 className="font-serif text-3xl font-black leading-tight text-[#241512]">
                  Choose your heat.
                  <br />
                  Build your meal.
                </h2>
                <p className="mt-3 max-w-sm text-sm font-medium leading-6 text-[#6b5b55]">
                  Pick your perfect spice level from our signature range.
                </p>
              </div>

              <div className="relative min-w-0">
                <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-9 lg:gap-2 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
                  {flavours.map((flavour) => (
                    <button
                      key={flavour.name}
                      onClick={handleMenuAction}
                      className="group flex min-w-[96px] flex-col items-center rounded-2xl px-2 py-2 text-center transition hover:-translate-y-1 lg:min-w-0 lg:px-1"
                    >
                      <span className={`flex h-12 w-12 items-center justify-center rounded-full border ${flavour.ring} ${flavour.tone} transition group-hover:shadow-md`}>
                        <Flame size={22} strokeWidth={2.5} />
                      </span>
                      <span className="mt-2 min-h-9 text-xs font-black leading-tight text-[#34221d]">{flavour.name}</span>
                      <span className={`mt-1 text-[11px] font-black leading-none ${flavour.tone}`}>{flavour.heat}</span>
                    </button>
                  ))}
                </div>
                <div className="pointer-events-none absolute -bottom-2 -right-3 hidden items-end justify-end min-[1800px]:flex">
                  <img src="/images/chicken-fries.png" alt="" className="h-20 w-20 rounded-full object-cover shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="app" className="scroll-mt-28 bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-[#1a120f]">Explore our menu</h2>
              <p className="mt-2 text-base leading-7 text-[#6b5b55]">Something delicious for every kind of craving.</p>
            </div>
            <button onClick={handleMenuAction} className="inline-flex items-center gap-2 text-sm font-black text-[#99041e]">
              View all categories <ArrowRight size={17} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MENU_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={handleMenuAction}
                className="group min-w-[230px] overflow-hidden rounded-2xl border border-[#ffc257]/70 bg-white text-left shadow-[0_14px_38px_rgba(50,24,16,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(50,24,16,0.14)]"
              >
                <img
                  src={categoryImage[category] || MENU_DATA.find((item) => item.category === category)?.image || '/images/hero-chicken.png'}
                  alt=""
                  className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="p-4">
                  <span className="text-base font-black text-[#1a120f]">{category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff8ed] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-[#1a120f]">Featured dishes</h2>
              <p className="mt-2 text-base leading-7 text-[#6b5b55]">Maeme&apos;s favourites, cooked to order.</p>
            </div>
            <button onClick={handleMenuAction} className="text-left text-sm font-black text-[#99041e] sm:text-right">
              See full menu
            </button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getFeaturedProducts().map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAdd} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#99041e] py-14 text-white sm:py-16">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/15 bg-white/8 p-5 shadow-sm backdrop-blur">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffc257] text-[#1a120f]">
                    <Icon size={21} strokeWidth={2.5} />
                  </div>
                  <p className="mt-4 text-lg font-black leading-tight">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-[#1a120f]">Find your nearest Maeme&apos;s</h2>
            <p className="mt-3 text-base leading-7 text-[#6b5b55]">
              Choose delivery or pickup from your local branch before placing an order.
            </p>
            <button
              onClick={() => setShowOrderModal(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#ffc257] px-6 py-3 text-sm font-black text-[#1a120f] shadow-sm transition hover:bg-[#e5a93e]"
            >
              <Navigation size={17} />
              Select location
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {BRANCHES.slice(0, 4).map((branch) => (
              <article key={branch.branchId} className="rounded-2xl border border-[#f0d59d] bg-white p-5 shadow-[0_14px_36px_rgba(50,24,16,0.08)]">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-black text-[#1a120f]">{branch.branchName}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-black ${branch.isOpen === false ? 'bg-[#f6e6e6] text-[#99041e]' : 'bg-[#e8f5ed] text-[#126336]'}`}>
                    {branch.isOpen === false ? 'Closed' : 'Open Now'}
                  </span>
                </div>
                <p className="mt-3 flex gap-2 text-sm leading-6 text-[#6b5b55]">
                  <MapPin size={16} className="mt-1 shrink-0 text-[#99041e]" />
                  <span>{branch.address}, {branch.postcode}</span>
                </p>
                <p className="mt-3 flex items-center gap-2 text-xs font-black text-[#99041e]">
                  <Clock size={15} />
                  Delivery {branch.deliveryTime} - Pickup {branch.pickupTime}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff8ed] py-12">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-3 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {galleryImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Maeme's dish ${index + 1}`}
              className="h-52 w-full rounded-2xl border border-[#f0d59d] object-cover shadow-sm sm:h-64"
            />
          ))}
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#99041e] text-[#ffc257]">
              <Smartphone size={25} />
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-tight text-[#1a120f]">Order Maeme&apos;s on the app</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-[#6b5b55]">
              Save favourites, reorder faster and keep track of every flame-grilled feast.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-[#1a120f] px-6 py-3 text-sm font-black text-white">App Store</button>
              <button className="rounded-2xl bg-[#1a120f] px-6 py-3 text-sm font-black text-white">Google Play</button>
            </div>
          </div>
          <div className="relative mx-auto flex h-[420px] w-full max-w-sm items-center justify-center rounded-[28px] bg-[#99041e] p-5 shadow-[0_28px_80px_rgba(153,4,30,0.20)]">
            <div className="h-full w-full rounded-[24px] border border-white/15 bg-white p-5">
              <img src="/images/maemes-logo.png" alt="Maeme's Piri Piri" className="h-16 w-auto" />
              <img src="/images/meal-bowl.png" alt="" className="mt-6 h-44 w-full rounded-2xl object-cover" />
              <p className="mt-5 text-xl font-black text-[#1a120f]">Your favourites, ready faster.</p>
              <div className="mt-5 rounded-2xl bg-[#ffc257] px-5 py-4 text-center text-sm font-black text-[#1a120f]">
                Reorder in seconds
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff8ed] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-[#1a120f]">Latest from Maeme&apos;s</h2>
              <p className="mt-2 text-base leading-7 text-[#6b5b55]">Food guides, flavour tips and ordering ideas.</p>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-black text-[#99041e]">
              Read the blog <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {blogs.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-2xl border border-[#f0d59d] bg-white shadow-[0_14px_38px_rgba(50,24,16,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(50,24,16,0.14)]">
                <img src={post.image} alt="" className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#99041e]">{post.category}</p>
                  <h3 className="mt-2 text-xl font-black leading-tight text-[#1a120f]">{post.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#6b5b55]">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <OrderTypeModal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} />
      {toast && (
        <div className="fixed bottom-8 left-4 right-4 z-[90] mx-auto max-w-sm rounded-2xl bg-[#99041e] px-5 py-4 text-sm font-black text-white shadow-[0_18px_46px_rgba(153,4,30,0.28)] lg:left-auto lg:right-8 lg:mx-0">
          {toast}
        </div>
      )}
      <PremiumProductCustomizationModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdded={handleProductAdded}
      />
    </div>
  );
}
