import Image from 'next/image';
import NewsletterSection from '@/components/home/NewsletterSection';
import ScrollRevealSection from '@/components/food/ScrollRevealSection';
import {
  ArrowRight,
  BadgePercent,
  Check,
  Clock3,
  CreditCard,
  Heart,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';

const benefits = [
  { title: 'Order in seconds', copy: 'A smooth, simple checkout built for hungry moments.', icon: ShoppingBag },
  { title: 'App-only offers', copy: 'Unlock exclusive deals made for app customers.', icon: BadgePercent },
  { title: 'Reorder favourites', copy: 'Your go-to meals are always just a tap away.', icon: RefreshCw },
  { title: 'Track every order', copy: 'Follow your food from our grill to your door.', icon: Truck },
  { title: 'Save your favourites', copy: 'Keep the meals and flavours you love close.', icon: Heart },
  { title: 'Pay with confidence', copy: 'Enjoy a secure, quick and convenient checkout.', icon: ShieldCheck },
];

const highlights = [
  'Browse the full Maeme’s menu with ease',
  'Choose delivery or collection in seconds',
  'Stay up to date with the latest offers',
  'Get back to your favourite order faster',
];

function DownloadBadges({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href="#download"
        aria-label="Download the Maeme's app from the App Store"
        className={`inline-flex rounded-xl transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 ${
          inverse ? 'focus-visible:ring-white/30' : 'focus-visible:ring-[var(--maeme-yellow)]/40'
        }`}
      >
        <Image src="/images/app-store-badge.png" alt="Download on the App Store" width={270} height={80} className="h-10 w-auto object-contain sm:h-[56px]" />
      </a>
      <a
        href="#download"
        aria-label="Download the Maeme's app from Google Play"
        className={`inline-flex rounded-xl transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 ${
          inverse ? 'focus-visible:ring-white/30' : 'focus-visible:ring-[var(--maeme-yellow)]/40'
        }`}
      >
        <Image src="/images/google-play-badge.png" alt="Get it on Google Play" width={270} height={80} className="h-10 w-auto object-contain sm:h-[56px]" />
      </a>
    </div>
  );
}

export default function OurAppPage() {
  return (
    <main className="overflow-x-clip bg-[#fffaf4] text-[#1f1210]">
      <section className="w-full overflow-hidden bg-[var(--maeme-red)]" aria-label="Download the Maeme's app">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/our-app-hero-poster.jpg"
          controls={false}
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          aria-label="Maeme's app offers and rewards"
          className="block h-auto w-full max-w-full object-contain"
        >
          <source src="/videos/our-app-hero-banner.mp4" type="video/mp4" />
        </video>
      </section>

      <ScrollRevealSection className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-[1320px]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--maeme-red)]">Made for easier ordering</p>
            <h2 className="mt-3 text-3xl font-black uppercase leading-[1.02] tracking-tight sm:text-4xl lg:text-5xl">
              More flavour. <span className="text-[var(--maeme-red)]">Less waiting.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6f5f5a] sm:text-base">
              Everything you need to enjoy Maeme&apos;s quickly, conveniently and your way.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-4 lg:mt-9 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className="group rounded-[16px] border border-[#ead8c6] bg-white p-4 shadow-[0_12px_32px_rgba(63,24,18,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(var(--maeme-red-rgb),0.25)] hover:shadow-[0_18px_42px_rgba(63,24,18,0.08)] sm:rounded-[18px] sm:p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(var(--maeme-red-rgb),0.07)] text-[var(--maeme-red)] transition group-hover:bg-[var(--maeme-red)] group-hover:text-white">
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <h3 className="mt-3 text-sm font-bold sm:text-lg sm:font-black">{benefit.title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-[#6f5f5a] sm:text-sm">{benefit.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </ScrollRevealSection>

      <ScrollRevealSection className="bg-white px-4 py-8 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1320px] items-center justify-center gap-5 sm:gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative mx-auto flex min-h-[220px] w-full max-w-[700px] items-center justify-center sm:min-h-[480px] lg:min-h-[520px] lg:justify-self-center">
            <Image
              src="/images/maemes-app-composition.png"
              alt="Maeme's app features and ordering experience"
              width={1448}
              height={1086}
              sizes="(min-width: 1024px) 620px, 94vw"
              className="h-auto max-h-[240px] w-full scale-100 object-contain drop-shadow-[0_20px_30px_rgba(63,24,18,0.15)] sm:max-h-none sm:scale-[1.18] sm:drop-shadow-[0_28px_40px_rgba(63,24,18,0.18)]"
            />
          </div>

          <div className="w-full max-w-[600px] lg:justify-self-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--maeme-red)]">Why download the app?</p>
            <h2 className="mt-3 text-[30px] font-bold uppercase leading-[1.02] tracking-tight sm:mt-4 sm:text-5xl sm:font-black sm:leading-[0.98]">
              Your Maeme&apos;s order, <span className="text-[var(--maeme-red)]">made effortless.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#6f5f5a] sm:mt-6 sm:text-lg sm:leading-8">
              Spend less time ordering and more time enjoying the food you love. The app remembers what matters and keeps every step clear.
            </p>
            <ul className="mt-4 grid gap-2.5 sm:mt-8 sm:gap-4">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-sm font-bold leading-6 sm:text-base">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--maeme-yellow)] text-[var(--maeme-red)]">
                    <Check size={15} strokeWidth={3} />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
            <a href="#download" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--maeme-red)] px-6 text-sm font-bold text-white shadow-[0_14px_30px_rgba(var(--maeme-red-rgb),0.20)] transition hover:-translate-y-0.5 hover:bg-[var(--maeme-red-dark)] sm:mt-9 sm:min-h-12 sm:px-7 sm:font-black">
              Get the app <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </ScrollRevealSection>

      <ScrollRevealSection className="px-4 py-8 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[22px] border border-[#e8b92f] bg-[var(--maeme-yellow)] p-5 sm:rounded-[36px] sm:p-12 lg:p-16">
          <Image
            src="/images/app-benefits-rays.jpg"
            alt=""
            fill
            sizes="(min-width: 1320px) 1320px, 100vw"
            className="object-cover object-center"
            aria-hidden="true"
          />
          <div className="relative grid items-center gap-5 sm:gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--maeme-red)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                <Star size={14} fill="currentColor" /> App-only benefits
              </span>
              <h2 className="mt-4 text-[30px] font-bold uppercase leading-[1.02] tracking-tight sm:mt-6 sm:text-5xl sm:font-black sm:leading-none">
                Great food tastes even better <span className="text-[var(--maeme-red)]">with a deal.</span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f5f5a] sm:mt-5 sm:text-lg sm:leading-7">
                Be first in line for exclusive offers, rewards and updates created especially for Maeme&apos;s app customers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-[16px] bg-white p-4 shadow-[0_16px_40px_rgba(63,24,18,0.07)] sm:rounded-[22px] sm:p-6">
                <BadgePercent size={27} className="text-[var(--maeme-red)]" />
                <p className="mt-3 text-sm font-bold sm:mt-4 sm:text-lg sm:font-black">Exclusive savings</p>
                <p className="mt-1.5 text-xs leading-5 text-[#6f5f5a] sm:mt-2 sm:text-sm sm:leading-6">Offers you will only find in the app.</p>
              </div>
              <div className="rounded-[16px] bg-[var(--maeme-red)] p-4 text-white shadow-[0_16px_40px_rgba(var(--maeme-red-rgb),0.18)] sm:rounded-[22px] sm:p-6">
                <Clock3 size={27} className="text-[var(--maeme-yellow)]" />
                <p className="mt-3 text-sm font-bold sm:mt-4 sm:text-lg sm:font-black">Faster every time</p>
                <p className="mt-1.5 text-xs leading-5 text-white/75 sm:mt-2 sm:text-sm sm:leading-6">Reorder favourites without starting again.</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollRevealSection>

      <ScrollRevealSection id="download" className="scroll-mt-24 px-4 pb-8 pt-4 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8 lg:pb-28 xl:pt-28">
        <div className="relative grid w-full items-center gap-5 rounded-[22px] bg-[var(--maeme-red)] p-5 text-white shadow-[0_22px_60px_rgba(var(--maeme-red-rgb),0.18)] sm:gap-10 sm:rounded-[38px] sm:p-12 sm:shadow-[0_28px_80px_rgba(var(--maeme-red-rgb),0.20)] lg:grid-cols-[1fr_auto] lg:p-16 xl:grid-cols-[minmax(0,1fr)_clamp(280px,22vw,400px)_auto] xl:gap-6">
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--maeme-yellow)]">Ready when you are</p>
            <h2 className="mt-3 text-[30px] font-bold uppercase leading-[1.02] tracking-tight sm:mt-4 sm:text-5xl sm:font-black sm:leading-none">
              Get the Maeme&apos;s app today.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/78 sm:mt-5 sm:text-lg sm:leading-7">
              Scan, download and start ordering your favourites faster.
            </p>
            <div className="mt-4 sm:mt-7">
              <DownloadBadges inverse />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-white/70 sm:mt-6 sm:gap-x-6 sm:gap-y-3 sm:font-bold">
              <span className="inline-flex items-center gap-2"><Search size={15} /> Easy menu browsing</span>
              <span className="inline-flex items-center gap-2"><CreditCard size={15} /> Secure checkout</span>
            </div>
          </div>
          <div className="relative hidden self-stretch xl:block">
            <Image
              src="/images/exclusive-deals-sign.png"
              alt="Exclusive deals await"
              width={3300}
              height={4364}
              sizes="400px"
              className="absolute bottom-[-64px] left-[38%] h-auto w-[clamp(330px,22vw,410px)] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_24px_34px_rgba(32,0,7,0.28)]"
            />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[150px] rounded-[18px] bg-white p-3 text-center text-[#1f1210] shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:max-w-[230px] sm:rounded-[24px] sm:p-5 sm:shadow-[0_20px_55px_rgba(0,0,0,0.20)] lg:mx-0">
            <Image src="/images/maemes-app-qr.png" alt="QR code to download the Maeme's app" width={648} height={648} className="h-auto w-full rounded-[12px]" />
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.08em] sm:mt-4 sm:text-sm sm:font-black">Scan to download</p>
          </div>
        </div>
      </ScrollRevealSection>

      <ScrollRevealSection className="bg-white">
        <NewsletterSection />
      </ScrollRevealSection>
    </main>
  );
}
