import Image from 'next/image';
import ScrollRevealSection from '@/components/food/ScrollRevealSection';
import SpiceLevelAnimation from '@/components/food/SpiceLevelAnimation';
import NewsletterSection from '@/components/home/NewsletterSection';

function DecorativeWave({ tone = 'yellow' }: { tone?: 'yellow' | 'red' | 'green' }) {
  const stroke = tone === 'red' ? 'var(--maeme-red)' : tone === 'green' ? '#4D7B50' : 'var(--maeme-yellow)';

  return (
    <svg aria-hidden="true" viewBox="0 0 92 14" className="pointer-events-none mt-2 h-3 w-20 overflow-visible sm:w-24">
      <path d="M2 8C14 1 25 13 38 7C51 1 62 13 76 7C81 5 86 5 90 7" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function FoodPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#FFF8F2] text-[#3A1715]">
      <section className="relative isolate w-full max-w-none overflow-hidden border-y border-[#F1D8C8] bg-[#FFF3E6] md:min-h-[520px] lg:min-h-[clamp(560px,48vw,730px)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-[58%] bg-[var(--maeme-red)] [clip-path:ellipse(88%_112%_at_0%_50%)] md:block" />
        <div aria-hidden="true" className="pointer-events-none absolute right-[-3%] top-[-30%] z-0 hidden h-[150%] w-[54%] opacity-[0.13] md:block [background:repeating-conic-gradient(from_2deg_at_50%_50%,var(--maeme-yellow)_0deg_4deg,transparent_4deg_12deg)] [mask-image:radial-gradient(circle,black_0%,transparent_68%)]" />

        <div className="relative z-10 grid items-center gap-7 bg-[var(--maeme-red)] px-5 pb-8 pt-10 sm:px-7 md:min-h-[520px] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-8 md:bg-transparent md:px-9 md:py-12 lg:min-h-[clamp(560px,48vw,730px)] lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-[clamp(40px,5vw,88px)] lg:px-[clamp(40px,6vw,110px)] lg:py-[clamp(48px,6vw,90px)]">
          <div className="relative z-20 min-w-0 max-w-[640px] text-white">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--maeme-yellow)] sm:text-sm">Maeme&apos;s Piri Piri</p>
              <h1 className="mt-5 text-[clamp(2.8rem,5.6vw,5.9rem)] font-black uppercase leading-[0.88] tracking-[-0.055em]">
                <span className="block">Our Food,</span>
                <span className="mt-2 block text-[var(--maeme-yellow)]">Our Flavour</span>
              </h1>
              <p className="mt-6 max-w-lg text-sm font-semibold leading-6 text-white/84 sm:text-base sm:leading-7">
                Enjoy fresh, flame-grilled food with a choice of bold and delicious flavours.
              </p>
          </div>

          <div className="relative z-20 mx-auto flex min-h-[300px] w-full min-w-0 items-center justify-center overflow-visible md:min-h-[360px] lg:min-h-[420px]">
            <SpiceLevelAnimation />
            <Image
              src="/images/signature-flavours-sticker.png"
              alt="Signature Flavours"
              width={1280}
              height={1280}
              className="pointer-events-none absolute bottom-0 right-0 z-30 h-auto w-[clamp(120px,20vw,270px)] object-contain sm:bottom-1 sm:right-2 md:bottom-0 md:right-[2%] lg:bottom-[-2%] lg:right-[3%]"
            />
          </div>
        </div>
      </section>

      <div className="page-container space-y-5 py-5 sm:space-y-6 sm:py-7 lg:space-y-7 lg:py-8">

        <ScrollRevealSection className="relative isolate overflow-hidden rounded-[22px] border border-[#A9080B] bg-[#CB090D] text-white sm:rounded-[28px] lg:min-h-[420px]">
          <img
            src="/images/piri-piri-frame-13.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <img
            src="/images/flame-grilled-perfection.png"
            alt="Flame-grilled chicken perfection"
            className="food-scroll-image absolute -right-[3%] top-[58%] z-[1] hidden h-[125%] w-[60%] -translate-y-1/2 object-contain object-center lg:block"
          />
          <div className="relative grid items-center gap-6 px-5 py-7 sm:gap-7 sm:px-9 sm:py-9 lg:min-h-[420px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-[clamp(32px,5vw,80px)] lg:px-[clamp(32px,5vw,72px)] lg:py-[clamp(32px,4vw,60px)]">
            <div className="food-scroll-text min-w-0 max-w-xl">
              <h2 className="mb-[18px] text-[clamp(30px,3vw,54px)] font-black uppercase leading-[0.95] tracking-[-0.035em]">Piri Piri</h2>
              <DecorativeWave />
              <p className="mt-4 max-w-[520px] text-[clamp(14px,1.2vw,18px)] leading-[1.65] text-white/88">
                Our signature marinades and carefully developed recipes create bold, flame-grilled flavour. Every chicken is marinated for up to 24 hours and grilled fresh for a juicy, satisfying result.
              </p>
            </div>
            <div className="food-scroll-image relative mx-auto flex aspect-[16/9] w-full max-w-[680px] min-w-0 items-center justify-center overflow-hidden rounded-[20px] sm:rounded-[24px] lg:hidden">
              <img
                src="/images/piri-piri-frame-13.jpg"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover object-[70%_center]"
              />
              <img
                src="/images/flame-grilled-perfection.png"
                alt="Flame-grilled chicken perfection"
                className="absolute inset-0 h-full w-full translate-y-[6%] scale-[1.4] object-contain object-center p-2"
              />
            </div>
          </div>
        </ScrollRevealSection>

        <ScrollRevealSection className="relative overflow-hidden rounded-[22px] border border-[#E6A921] bg-[#FDB515] sm:rounded-[28px] lg:min-h-[460px]">
          <img
            src="/images/iconic-dishes-frame-12.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <img
            src="/images/maemes-fan-favorites-box.png"
            alt="Maeme’s Fan Favorites chicken and rice box"
            className="food-scroll-image absolute left-[1%] top-[54%] z-[1] hidden h-[95%] w-[48%] -translate-y-1/2 object-contain object-center lg:block"
          />
          <div className="relative grid items-center gap-6 px-5 py-7 sm:gap-7 sm:px-9 sm:py-9 lg:min-h-[460px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-[clamp(32px,5vw,80px)] lg:px-[clamp(32px,5vw,72px)] lg:py-[clamp(32px,4vw,60px)]">
            <div className="food-scroll-text relative min-w-0 lg:order-2 lg:-translate-y-5">
              <h2 className="mb-[18px] text-[clamp(30px,3vw,54px)] font-black uppercase leading-[0.95] tracking-[-0.035em]">Iconic Dishes</h2>
              <DecorativeWave />
              <p className="mt-4 max-w-[520px] text-[clamp(14px,1.2vw,18px)] leading-[1.65] text-[#3A1715]/76">
                Chicken made bold, prepared with premium ingredients and packed with Maeme&apos;s signature flame-grilled flavour.
              </p>
            </div>
            <div aria-hidden="true" className="hidden lg:block lg:order-1" />
            <div className="food-scroll-image relative mx-auto aspect-square w-full max-w-[480px] overflow-hidden lg:hidden lg:order-1">
              <img
                src="/images/maemes-fan-favorites-box.png"
                alt="Maeme’s Fan Favorites chicken and rice box"
                className="absolute inset-0 h-full w-full object-contain object-center"
              />
            </div>
          </div>
        </ScrollRevealSection>

        <ScrollRevealSection className="relative overflow-hidden rounded-[22px] border border-[#9F171C] bg-[#B91D22] text-white sm:rounded-[28px] lg:min-h-[320px]">
          <img
            src="/images/dips-frame-11.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="relative grid items-center gap-6 px-5 py-7 sm:gap-7 sm:px-9 sm:py-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:min-h-[320px] lg:gap-[clamp(32px,5vw,80px)] lg:px-[clamp(32px,5vw,72px)] lg:py-[clamp(32px,4vw,48px)]">
            <div className="food-scroll-text min-w-0">
              <h2 className="mb-[18px] text-[clamp(30px,3vw,54px)] font-black uppercase leading-[0.95] tracking-[-0.035em]">Dips</h2>
              <p className="max-w-[520px] text-[clamp(14px,1.2vw,18px)] leading-[1.65] text-white/88">
                Freshly prepared to add the perfect finishing touch to every bite.
              </p>
            </div>
            <div className="food-scroll-image relative mx-auto aspect-square w-full max-w-[360px] min-w-0 overflow-hidden">
              <img
                src="/images/maemes-dip-heart-sticker.png"
                alt="Maeme’s dip"
                className="absolute inset-0 h-full w-full object-contain object-center"
              />
            </div>
          </div>
        </ScrollRevealSection>

        <ScrollRevealSection className="relative overflow-hidden rounded-[22px] border border-[#E8B62C] bg-[#FFCA08] sm:rounded-[28px] lg:min-h-[420px]">
          <img
            src="/images/innovation-frame-10.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="relative grid items-center gap-6 px-5 py-7 sm:gap-7 sm:px-9 sm:py-9 lg:min-h-[420px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-[clamp(32px,5vw,80px)] lg:px-[clamp(32px,5vw,72px)] lg:py-[clamp(32px,4vw,60px)]">
            <div className="food-scroll-text min-w-0 lg:order-2">
              <h2 className="mb-[18px] text-[clamp(30px,3vw,54px)] font-black uppercase leading-[0.95] tracking-[-0.035em]">Innovation</h2>
              <DecorativeWave tone="red" />
              <p className="mt-4 max-w-[520px] text-[clamp(14px,1.2vw,18px)] leading-[1.65] text-[#3A1715]/76">
                We continue to create new dishes, seasonal flavours and exciting combinations while staying true to the Maeme&apos;s flame-grilled experience.
              </p>
            </div>
            <div className="food-scroll-image relative mx-auto h-[420px] w-full max-w-[650px] min-w-0 overflow-hidden lg:order-1">
              <img
                src="/images/maemes-grilled-box.png"
                alt="Maeme’s Grilled Box"
                className="absolute inset-0 h-full w-full translate-y-4 scale-110 object-contain object-center sm:translate-y-5"
              />
            </div>
          </div>
        </ScrollRevealSection>

        <ScrollRevealSection className="relative overflow-hidden rounded-[22px] border border-[#C91F22] bg-[var(--maeme-red)] text-white sm:rounded-[28px] lg:min-h-[420px]">
          <img
            src="/images/franchise-frame-9.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="relative grid items-center gap-5 px-5 py-7 sm:px-9 sm:py-9 lg:min-h-[420px] lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-[clamp(20px,3vw,48px)] lg:px-[clamp(32px,5vw,72px)] lg:py-[clamp(32px,4vw,60px)]">
            <div className="food-scroll-text min-w-0 max-w-[520px]">
              <h2 className="mb-[18px] text-[clamp(30px,3vw,54px)] font-black uppercase leading-[0.95] tracking-[-0.035em]">
                <span className="block">Franchise</span>
                <span className="block text-[var(--maeme-yellow)]">Partners</span>
              </h2>
              <p className="max-w-[520px] text-[clamp(14px,1.2vw,18px)] leading-[1.65] text-white/88">
                Our franchise partners are carefully selected, locally connected and part of their communities. Together, we grow the Maeme&apos;s family.
              </p>
            </div>
            <div className="food-scroll-image relative mx-auto mt-3 h-[340px] w-full max-w-[650px] min-w-0 sm:h-[420px] lg:mt-0 lg:h-[480px]">
              <Image
                src="/images/maemes-family-composition.png"
                alt="Maeme's family franchise partners"
                fill
                sizes="(min-width: 1024px) 650px, 94vw"
                className="object-contain object-center"
              />
            </div>
          </div>
        </ScrollRevealSection>

        <ScrollRevealSection className="relative overflow-hidden rounded-[22px] border border-[#E8C23D] bg-[#FFCA08] sm:rounded-[28px] lg:min-h-[420px]">
          <img
            src="/images/quality-frame-8.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="relative grid items-center gap-6 px-5 py-9 sm:gap-7 sm:px-9 sm:py-12 lg:min-h-[420px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-[clamp(32px,5vw,80px)] lg:px-[clamp(32px,5vw,72px)] lg:py-[clamp(44px,5vw,70px)]">
            <div className="food-scroll-text min-w-0 lg:order-2">
              <h2 className="mb-[18px] text-[clamp(30px,3vw,54px)] font-black uppercase leading-[0.95] tracking-[-0.035em]">Quality</h2>
              <DecorativeWave tone="green" />
              <p className="mt-4 max-w-[520px] text-[clamp(14px,1.2vw,18px)] leading-[1.65] text-[#3A1715]/76">
                Our preparation processes and operational standards are carefully maintained to provide a consistent, high-quality Maeme&apos;s experience.
              </p>
            </div>
            <div className="food-scroll-image relative mx-auto h-[280px] w-full max-w-[620px] min-w-0 overflow-visible sm:h-[340px] lg:order-1 lg:h-[390px]">
              <img
                src="/images/fired-up-with-flavor-composition.png"
                alt="Fired up with flavor, flame-grilled chicken"
                className="absolute inset-0 h-full w-full object-contain object-center"
              />
            </div>
          </div>
        </ScrollRevealSection>
      </div>

      <NewsletterSection />
    </div>
  );
}
