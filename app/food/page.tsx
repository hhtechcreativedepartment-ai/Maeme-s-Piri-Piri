import Image from 'next/image';
import ScrollRevealSection from '@/components/food/ScrollRevealSection';
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
      <section className="w-full overflow-hidden bg-[var(--maeme-red)]" aria-label="Our Food, Our Flavour">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-label="Maeme's Our Food and signature flavours"
          className="block h-auto w-full max-w-full object-contain"
        >
          <source src="/videos/our-food/our-food-hero-banner.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      <div className="page-container py-8 sm:py-12 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <ScrollRevealSection className="group relative isolate overflow-hidden rounded-[28px] border border-[#A90C22]/35 bg-[#B90023] text-white shadow-[0_26px_70px_rgba(113,7,28,0.18)] sm:rounded-[36px] lg:col-span-12">
            <img src="/images/piri-piri-new-background-1.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="relative grid min-h-[480px] items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[0.82fr_1.18fr] lg:px-[clamp(48px,6vw,96px)] lg:py-14">
              <div className="food-scroll-text relative z-10 max-w-[560px]">
                <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--maeme-yellow)] backdrop-blur-sm">The Maeme&apos;s signature</span>
                <h2 className="text-[clamp(40px,5vw,76px)] font-black uppercase leading-[0.88] tracking-[-0.055em]">Piri Piri</h2>
                <DecorativeWave />
                <p className="mt-6 max-w-[520px] text-[clamp(15px,1.2vw,18px)] leading-[1.75] text-white/86">
                  Our signature marinades and carefully developed recipes create bold, flame-grilled flavour. Every chicken is marinated for up to 24 hours and grilled fresh for a juicy, satisfying result.
                </p>
              </div>
              <div className="food-scroll-image relative mx-auto h-[300px] w-full max-w-[760px] sm:h-[390px] lg:h-[470px]">
                <img src="/images/flame-grilled-perfection.png" alt="Flame-grilled chicken perfection" className="absolute inset-0 h-full w-full translate-x-3 translate-y-4 scale-[1.08] object-contain object-center drop-shadow-[0_28px_32px_rgba(64,5,12,0.24)] transition-transform duration-700 ease-out group-hover:translate-x-3 group-hover:translate-y-4 group-hover:scale-[1.1] sm:translate-x-5 sm:translate-y-5 sm:group-hover:translate-x-5 sm:group-hover:translate-y-5" />
              </div>
            </div>
          </ScrollRevealSection>

          <ScrollRevealSection className="group relative overflow-hidden rounded-[28px] border border-[#F0CF88] bg-[linear-gradient(145deg,#FFF9EA_0%,#FFE8A7_100%)] shadow-[0_22px_58px_rgba(99,57,13,0.10)] sm:rounded-[34px] lg:col-span-7">
            <div className="relative flex h-full min-h-[560px] flex-col px-6 pb-8 pt-8 sm:px-10 sm:pb-10 lg:px-12">
              <div className="food-scroll-text relative z-10 max-w-[540px]">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--maeme-red)]">Customer favourites</span>
                <h2 className="mt-3 text-[clamp(34px,4vw,58px)] font-black uppercase leading-[0.92] tracking-[-0.045em]">Iconic Dishes</h2>
                <DecorativeWave />
                <p className="mt-5 max-w-[500px] text-[clamp(14px,1.1vw,17px)] leading-[1.7] text-[#3A1715]/76">
                  Chicken made bold, prepared with premium ingredients and packed with Maeme&apos;s signature flame-grilled flavour.
                </p>
              </div>
              <div className="food-scroll-image relative mt-auto h-[300px] w-full sm:h-[350px]">
                <img src="/images/maemes-fan-favorites-box.png" alt="Maeme’s Fan Favorites chicken and rice box" className="absolute inset-0 h-full w-full object-contain object-center drop-shadow-[0_24px_30px_rgba(95,45,9,0.18)] transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
              </div>
            </div>
          </ScrollRevealSection>

          <ScrollRevealSection className="group relative overflow-hidden rounded-[28px] border border-[#D83A43]/45 bg-[linear-gradient(155deg,#FFF8F3_0%,#FFE9E3_100%)] shadow-[0_22px_58px_rgba(102,20,25,0.09)] sm:rounded-[34px] lg:col-span-5">
            <div className="relative flex h-full min-h-[560px] flex-col px-6 pb-8 pt-8 sm:px-10 sm:pb-10">
              <div className="food-scroll-text relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--maeme-red)]">The finishing touch</span>
                <h2 className="mt-3 text-[clamp(34px,4vw,58px)] font-black uppercase leading-[0.92] tracking-[-0.045em]">Dips</h2>
                <div className="mt-4 h-1.5 w-16 rounded-full bg-[var(--maeme-red)]" />
                <p className="mt-5 max-w-[420px] text-[clamp(14px,1.1vw,17px)] leading-[1.7] text-[#3A1715]/76">
                  Freshly prepared to add the perfect finishing touch to every bite.
                </p>
              </div>
              <div className="food-scroll-image relative mt-auto h-[290px] w-full sm:h-[350px]">
                <img src="/images/maemes-dip-heart-sticker.png" alt="Maeme’s dip" className="absolute inset-0 h-full w-full object-contain object-center drop-shadow-[0_22px_26px_rgba(90,18,18,0.16)] transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
              </div>
            </div>
          </ScrollRevealSection>

          <ScrollRevealSection className="group relative overflow-hidden rounded-[28px] border border-[#E9B624]/55 bg-[#FFCA08] shadow-[0_24px_64px_rgba(112,70,7,0.11)] sm:rounded-[36px] lg:col-span-12">
            <img src="/images/innovation-frame-8.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="relative grid min-h-[480px] items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.12fr_0.88fr] lg:px-[clamp(48px,6vw,92px)]">
              <div className="food-scroll-image relative h-[320px] w-full sm:h-[400px] lg:h-[460px]">
                <img src="/images/maemes-grilled-box.png" alt="Maeme’s Grilled Box" className="absolute inset-0 h-full w-full translate-y-4 object-contain object-center drop-shadow-[0_28px_34px_rgba(105,55,4,0.18)] transition-transform duration-700 ease-out group-hover:translate-y-4 group-hover:scale-[1.018] sm:translate-y-5 sm:group-hover:translate-y-5" />
              </div>
              <div className="food-scroll-text max-w-[540px] lg:justify-self-end">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--maeme-red)]">Always evolving</span>
                <h2 className="mt-3 text-[clamp(38px,4.5vw,66px)] font-black uppercase leading-[0.9] tracking-[-0.05em]">Innovation</h2>
                <DecorativeWave tone="red" />
                <p className="mt-6 text-[clamp(14px,1.1vw,18px)] leading-[1.75] text-[#3A1715]/76">
                  We continue to create new dishes, seasonal flavours and exciting combinations while staying true to the Maeme&apos;s flame-grilled experience.
                </p>
              </div>
            </div>
          </ScrollRevealSection>

          <ScrollRevealSection className="group relative overflow-hidden rounded-[28px] border border-[#EDC9B9] bg-[linear-gradient(145deg,#FFF9F3_0%,#FFE9DD_100%)] shadow-[0_22px_58px_rgba(91,35,24,0.09)] sm:rounded-[34px] lg:col-span-7">
            <div className="relative flex min-h-[600px] flex-col px-6 pb-6 pt-8 sm:px-10 sm:pt-10 lg:px-12">
              <div className="food-scroll-text relative z-10 max-w-[520px]">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--maeme-red)]">Growing together</span>
                <h2 className="mt-3 text-[clamp(34px,4vw,58px)] font-black uppercase leading-[0.9] tracking-[-0.045em]">
                  <span className="block">Franchise</span>
                  <span className="block text-[var(--maeme-red)]">Partners</span>
                </h2>
                <p className="mt-6 max-w-[510px] text-[clamp(14px,1.1vw,17px)] leading-[1.72] text-[#3A1715]/76">
                  Our franchise partners are carefully selected, locally connected and part of their communities. Together, we grow the Maeme&apos;s family.
                </p>
              </div>
              <div className="food-scroll-image relative mt-auto h-[340px] w-full sm:h-[390px]">
                <Image src="/images/maemes-family-composition.png" alt="Maeme's family franchise partners" fill sizes="(min-width: 1024px) 720px, 94vw" className="object-contain object-center drop-shadow-[0_24px_30px_rgba(89,25,18,0.16)] transition-transform duration-700 ease-out group-hover:scale-[1.015]" />
              </div>
            </div>
          </ScrollRevealSection>

          <ScrollRevealSection className="group relative overflow-hidden rounded-[28px] border border-[#E7C84F] bg-[linear-gradient(155deg,#FFFDF1_0%,#FFF0A8_100%)] shadow-[0_22px_58px_rgba(100,78,9,0.10)] sm:rounded-[34px] lg:col-span-5">
            <div className="relative flex h-full min-h-[600px] flex-col px-6 pb-8 pt-8 sm:px-10 sm:pb-10">
              <div className="food-scroll-text relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#4D7B50]">Standards that matter</span>
                <h2 className="mt-3 text-[clamp(34px,4vw,58px)] font-black uppercase leading-[0.92] tracking-[-0.045em]">Quality</h2>
                <DecorativeWave tone="green" />
                <p className="mt-5 max-w-[440px] text-[clamp(14px,1.1vw,17px)] leading-[1.72] text-[#3A1715]/76">
                  Our preparation processes and operational standards are carefully maintained to provide a consistent, high-quality Maeme&apos;s experience.
                </p>
              </div>
              <div className="food-scroll-image relative mt-auto h-[320px] w-full sm:h-[380px]">
                <img src="/images/fired-up-with-flavor-composition.png" alt="Fired up with flavor, flame-grilled chicken" className="absolute inset-0 h-full w-full object-contain object-center drop-shadow-[0_24px_30px_rgba(83,58,5,0.16)] transition-transform duration-700 ease-out group-hover:scale-[1.015]" />
              </div>
            </div>
          </ScrollRevealSection>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
