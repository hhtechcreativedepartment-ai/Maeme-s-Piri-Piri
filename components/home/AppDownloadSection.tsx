'use client';

import Image from 'next/image';
import { BadgePercent, Clock, Gift, Smartphone, Truck } from 'lucide-react';

const appFeatures = [
  { title: 'Skip the Line', copy: 'Order ahead & save time.', icon: Clock },
  { title: 'Deliver Fast', copy: 'Hot & fresh. Right on time.', icon: Truck },
  { title: 'Order Easy', copy: 'Simple, quick & hassle-free.', icon: Smartphone },
  { title: 'Earn Rewards', copy: 'Earn points & unlock treats.', icon: Gift },
  { title: 'More Discount', copy: 'Exclusive app-only offers.', icon: BadgePercent },
];

export default function AppDownloadSection() {
  return (
    <section id="app" className="bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="relative overflow-hidden rounded-[30px] bg-[radial-gradient(circle_at_43%_42%,rgba(var(--maeme-yellow-rgb),0.12),transparent_32%),linear-gradient(135deg,#720014_0%,#990018_45%,#a5001d_68%,#720014_100%)] text-white md:rounded-[40px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_48%,rgba(255,255,255,0.08),transparent_38%)]" />
          <div className="pointer-events-none absolute bottom-8 right-8 hidden grid-cols-7 gap-4 opacity-10 xl:grid">
            {Array.from({ length: 42 }).map((_, index) => (
              <span key={index} className="h-1.5 w-1.5 rounded-full bg-[var(--maeme-yellow)]" />
            ))}
          </div>

          <div className="relative grid min-h-[720px] grid-cols-1 gap-8 p-6 sm:p-10 md:grid-cols-2 md:gap-10 lg:min-h-[750px] lg:grid-cols-[1.05fr_0.96fr_0.78fr_0.62fr] lg:items-center lg:gap-7 lg:p-14 xl:gap-10 xl:p-16">
            <div className="flex min-w-0 flex-col">
              <div className="mb-7 flex items-center gap-4 sm:gap-5">
                <Image
                  src="/images/maemes-logo.png"
                  alt="Maeme's Piri Piri logo"
                  width={128}
                  height={128}
                  className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                  priority={false}
                />
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <span className="whitespace-nowrap text-base font-black uppercase tracking-[0.2em] text-white sm:text-xl xl:text-2xl">
                    Maeme&apos;s App
                  </span>
                  <span className="hidden h-px flex-1 bg-white/15 sm:block" />
                </div>
              </div>

              <h2 className="text-[clamp(38px,7vw,64px)] font-black leading-[0.96] tracking-tight lg:text-[clamp(48px,3.75vw,76px)]">
                <span className="block text-white">Skip the Line.</span>
                <span className="block text-white">Deliver Fast.</span>
                <span className="block text-[var(--maeme-yellow)]">Order Easy.</span>
                <span className="block text-[var(--maeme-yellow)]">Earn Rewards.</span>
                <span
                  className="mt-2 block text-[clamp(32px,6vw,46px)] font-normal leading-none text-white lg:text-[clamp(38px,2.4vw,48px)]"
                  style={{ fontFamily: '"Brush Script MT", "Segoe Script", cursive' }}
                >
                  &amp; More Discount!
                </span>
              </h2>

              <p className="mt-7 text-lg font-semibold leading-none text-white/95 sm:text-xl">Download the app &amp; get</p>
              <div className="mt-3 w-fit rounded-md bg-[var(--maeme-yellow)] px-4 py-2 text-sm font-black uppercase tracking-[0.03em] text-[var(--maeme-red)] shadow-[0_12px_28px_rgba(var(--maeme-yellow-rgb),0.22)] sm:text-lg xl:text-xl">
                Discount on your first order
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a href="#" aria-label="Download on the App Store" className="inline-flex transition hover:-translate-y-0.5">
                  <Image
                    src="/images/app-store-badge.png"
                    alt="Download on the App Store"
                    width={270}
                    height={80}
                    className="h-[48px] w-auto object-contain sm:h-[56px] xl:h-[60px]"
                  />
                </a>
                <a href="#" aria-label="Get it on Google Play" className="inline-flex transition hover:-translate-y-0.5">
                  <Image
                    src="/images/google-play-badge.png"
                    alt="Get it on Google Play"
                    width={270}
                    height={80}
                    className="h-[48px] w-auto object-contain sm:h-[56px] xl:h-[60px]"
                  />
                </a>
              </div>
            </div>

            <div className="relative flex min-w-0 items-center justify-center md:order-2 lg:order-none">
              <div className="absolute bottom-6 h-20 w-[72%] rounded-full bg-black/28 blur-3xl" />
              <Image
                src="/images/maemes-app-mockup.png"
                alt="Maeme's app screens"
                width={3012}
                height={4171}
                sizes="(min-width: 1280px) 520px, (min-width: 1024px) 460px, (min-width: 768px) 48vw, 92vw"
                className="relative z-10 h-auto max-h-[420px] w-full max-w-[520px] object-contain drop-shadow-[0_34px_80px_rgba(0,0,0,0.32)] md:max-h-[500px] lg:max-h-[600px]"
                priority={false}
              />
            </div>

            <div className="min-w-0 md:order-3 lg:order-none">
              <div className="grid gap-0">
                {appFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title}>
                      <div className="flex items-center gap-4 py-3.5 lg:py-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--maeme-yellow)] text-[var(--maeme-yellow)] sm:h-14 sm:w-14">
                          <Icon size={24} strokeWidth={1.9} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-lg font-black leading-tight text-white sm:text-xl xl:text-2xl">{feature.title}</span>
                          <span className="mt-1 block text-sm font-medium leading-tight text-white/88 sm:text-base">{feature.copy}</span>
                        </span>
                      </div>
                      {index < appFeatures.length - 1 && <div className="ml-16 h-px bg-white/14 sm:ml-[72px]" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[260px] flex-col items-center md:order-4 md:max-w-[280px] lg:order-none lg:mx-0 lg:justify-self-start lg:max-w-[250px] xl:max-w-[270px]">
              <div className="w-full rounded-[24px] bg-white p-5 text-center text-[#1f1210] shadow-[0_22px_60px_rgba(0,0,0,0.20)] sm:p-6">
                <Image
                  src="/images/maemes-app-qr.png"
                  alt="QR code to download the Maeme's app"
                  width={232}
                  height={232}
                  className="mx-auto h-auto w-full max-w-[220px] object-contain"
                />
                <p className="mt-4 text-lg font-black leading-[1.08] sm:text-xl">
                  Scan to download
                  <br />
                  the app
                </p>
              </div>
              <span
                aria-hidden="true"
                className="mt-3 hidden self-start rotate-[-18deg] text-[52px] font-normal leading-none text-[var(--maeme-yellow)] xl:block"
                style={{ fontFamily: '"Brush Script MT", "Segoe Script", cursive' }}
              >
                ↝
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
