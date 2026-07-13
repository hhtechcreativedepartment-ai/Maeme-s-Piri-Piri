import { ImageIcon } from 'lucide-react';
import SpiceLevelAnimation from '@/components/food/SpiceLevelAnimation';
import NewsletterSection from '@/components/home/NewsletterSection';

type ImagePlaceholderProps = {
  label: string;
  className?: string;
};

type HeartBadgeProps = {
  lines: string[];
  tone?: 'red' | 'green';
  className?: string;
};

function ImagePlaceholder({ label, className = '' }: ImagePlaceholderProps) {
  return (
    <div
      className={`flex h-full w-full min-w-0 flex-col items-center justify-center gap-2.5 border border-dashed border-[var(--maeme-red)]/45 bg-white/42 px-4 text-center text-[#3A1715]/65 ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F1D8C8] bg-white/82 sm:h-10 sm:w-10">
        <ImageIcon aria-hidden="true" size={18} strokeWidth={1.8} />
      </span>
      <span className="max-w-xs text-[9px] font-extrabold uppercase leading-4 tracking-[0.15em] sm:text-[10px] lg:text-[11px]">
        {label}
      </span>
    </div>
  );
}

function DecorativeWave({ tone = 'yellow' }: { tone?: 'yellow' | 'red' | 'green' }) {
  const stroke = tone === 'red' ? 'var(--maeme-red)' : tone === 'green' ? '#4D7B50' : 'var(--maeme-yellow)';

  return (
    <svg aria-hidden="true" viewBox="0 0 92 14" className="pointer-events-none mt-2 h-3 w-20 overflow-visible sm:w-24">
      <path d="M2 8C14 1 25 13 38 7C51 1 62 13 76 7C81 5 86 5 90 7" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function HeartBadge({ lines, tone = 'red', className = '' }: HeartBadgeProps) {
  const isGreen = tone === 'green';

  return (
    <div className={`pointer-events-none relative z-20 h-[76px] w-[82px] drop-shadow-[0_8px_12px_rgba(58,23,21,0.14)] sm:h-[96px] sm:w-[104px] lg:h-[104px] lg:w-[112px] ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 120 110" className={`absolute inset-0 h-full w-full ${isGreen ? 'text-[#43784B]' : 'text-[var(--maeme-red)]'}`}>
        <path
          fill="currentColor"
          d="M60 104C53 96 16 72 9 43C3 19 17 5 35 6C48 7 56 15 60 24C64 15 72 7 85 6C103 5 117 19 111 43C104 72 67 96 60 104Z"
        />
      </svg>
      <span className={`absolute inset-x-3 top-[31%] text-center text-[9px] font-black uppercase leading-[1.05] tracking-[0.08em] sm:text-[11px] ${isGreen ? 'text-[#FFF8D8]' : 'text-[var(--maeme-yellow)]'}`}>
        {lines.map((line) => <span key={line} className="block">{line}</span>)}
      </span>
    </div>
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
            <p className="pointer-events-none absolute bottom-2 right-3 rotate-[-4deg] text-base font-black italic text-[var(--maeme-yellow)] sm:right-8 sm:text-xl md:text-[var(--maeme-red)]">
              Flamingly Good
            </p>
          </div>
        </div>
      </section>

      <div className="page-container space-y-5 py-5 sm:space-y-6 sm:py-7 lg:space-y-7 lg:py-8">

        <section className="relative isolate overflow-visible rounded-[22px] border border-[#F1D8C8] bg-[#FFF1E4] sm:rounded-[28px] lg:min-h-[310px]">
          <div aria-hidden="true" className="absolute -right-12 top-1/2 h-64 w-[48%] -translate-y-1/2 rounded-[48%_52%_44%_56%] bg-[var(--maeme-yellow)]/22" />
          <div className="relative grid items-center gap-6 px-5 py-7 sm:gap-7 sm:px-9 sm:py-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-[clamp(32px,5vw,80px)] lg:px-[clamp(32px,5vw,72px)] lg:py-[clamp(32px,4vw,60px)]">
            <div className="min-w-0 max-w-xl">
              <h2 className="mb-[18px] text-[clamp(30px,3vw,54px)] font-black uppercase leading-[0.95] tracking-[-0.035em]">Piri Piri</h2>
              <DecorativeWave />
              <p className="mt-4 max-w-[520px] text-[clamp(14px,1.2vw,18px)] leading-[1.65] text-[#3A1715]/76">
                Our signature marinades and carefully developed recipes create bold, flame-grilled flavour. Every chicken is marinated for up to 24 hours and grilled fresh for a juicy, satisfying result.
              </p>
            </div>
            <div className="relative mx-auto flex w-full max-w-[380px] min-w-0 items-center justify-center overflow-visible">
              <ImagePlaceholder label="WHOLE FLAME-GRILLED CHICKEN IMAGE" className="aspect-[4/3] rounded-[20px] bg-white/48 sm:rounded-[24px]" />
              <span className="pointer-events-none absolute bottom-3 right-4 rotate-[-5deg] rounded-full bg-[var(--maeme-red)] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--maeme-yellow)] sm:right-6">
                Flamingly Good
              </span>
            </div>
          </div>
        </section>

        <section className="relative overflow-visible rounded-[22px] border border-[#F1D8C8] bg-[#FFF4D6] sm:rounded-[28px] lg:min-h-[250px]">
          <div className="grid items-center gap-6 px-5 py-7 sm:gap-7 sm:px-9 sm:py-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-[clamp(32px,5vw,80px)] lg:px-[clamp(32px,5vw,72px)] lg:py-[clamp(32px,4vw,60px)]">
            <div className="relative min-w-0 lg:order-2">
              <h2 className="mb-[18px] text-[clamp(30px,3vw,54px)] font-black uppercase leading-[0.95] tracking-[-0.035em]">Iconic Dishes</h2>
              <DecorativeWave />
              <p className="mt-4 max-w-[520px] text-[clamp(14px,1.2vw,18px)] leading-[1.65] text-[#3A1715]/76">
                Chicken made bold, prepared with premium ingredients and packed with Maeme&apos;s signature flame-grilled flavour.
              </p>
            </div>
            <div className="relative mx-auto flex w-full max-w-[430px] min-w-0 items-center justify-center overflow-visible lg:order-1">
              <ImagePlaceholder label="CHICKEN AND RICE IMAGE" className="aspect-[16/10] rounded-[20px] bg-white/44 sm:rounded-[24px]" />
              <HeartBadge lines={['Fan Faves']} className="absolute -right-3 top-1/2 -translate-y-1/2 rotate-[7deg] sm:-right-5 lg:-right-8" />
            </div>
          </div>
        </section>

        <section className="relative overflow-visible rounded-[22px] border border-[#DDE6D5] bg-[#F2F7E9] sm:rounded-[28px] lg:min-h-[185px]">
          <div className="grid items-center gap-6 px-5 py-7 sm:gap-7 sm:px-9 sm:py-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-[clamp(32px,5vw,80px)] lg:px-[clamp(32px,5vw,72px)] lg:py-[clamp(32px,4vw,48px)]">
            <div className="min-w-0">
              <h2 className="mb-[18px] text-[clamp(30px,3vw,54px)] font-black uppercase leading-[0.95] tracking-[-0.035em]">Dips</h2>
              <p className="max-w-[520px] text-[clamp(14px,1.2vw,18px)] leading-[1.65] text-[#3A1715]/76">
                Freshly prepared to add the perfect finishing touch to every bite.
              </p>
            </div>
            <div className="relative mx-auto flex w-full max-w-[340px] min-w-0 items-center justify-center overflow-visible">
              <ImagePlaceholder label="DIP PRODUCT IMAGE" className="aspect-[16/8] rounded-[20px] bg-white/48 sm:rounded-[24px]" />
              <HeartBadge lines={["Maeme's", 'Garlic Mayo']} tone="green" className="absolute -left-3 top-1/2 -translate-y-1/2 rotate-[-7deg] sm:-left-7" />
              <span aria-hidden="true" className="pointer-events-none absolute -left-6 top-5 z-20 h-3 w-3 rotate-12 rounded-[70%_30%_65%_35%] bg-[#67A36C] sm:-left-10" />
              <span aria-hidden="true" className="pointer-events-none absolute -left-4 bottom-5 z-20 h-2 w-2 -rotate-12 rounded-[65%_35%_70%_30%] bg-[#67A36C] sm:-left-8" />
            </div>
          </div>
        </section>

        <section className="relative overflow-visible rounded-[22px] border border-[#EECFC6] bg-[#FFF0EB] sm:rounded-[28px] lg:min-h-[230px]">
          <div className="grid items-center gap-6 px-5 py-7 sm:gap-7 sm:px-9 sm:py-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-[clamp(32px,5vw,80px)] lg:px-[clamp(32px,5vw,72px)] lg:py-[clamp(32px,4vw,60px)]">
            <div className="min-w-0 lg:order-2">
              <h2 className="mb-[18px] text-[clamp(30px,3vw,54px)] font-black uppercase leading-[0.95] tracking-[-0.035em]">Innovation</h2>
              <DecorativeWave tone="red" />
              <p className="mt-4 max-w-[520px] text-[clamp(14px,1.2vw,18px)] leading-[1.65] text-[#3A1715]/76">
                We continue to create new dishes, seasonal flavours and exciting combinations while staying true to the Maeme&apos;s flame-grilled experience.
              </p>
            </div>
            <div className="relative mx-auto flex w-full max-w-[440px] min-w-0 items-center justify-center overflow-visible lg:order-1">
              <ImagePlaceholder label="QUARTER CHICKEN, RICE AND STEAMED VEGETABLES IMAGE" className="aspect-[16/9] rounded-[20px] bg-white/44 sm:rounded-[24px]" />
            </div>
          </div>
        </section>

        <section className="relative overflow-visible rounded-[22px] border border-[#F1D8C8] bg-[#FFF3E6] sm:rounded-[28px] lg:min-h-[280px]">
          <div className="grid items-center gap-6 px-5 py-7 sm:gap-7 sm:px-9 sm:py-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-[clamp(32px,5vw,80px)] lg:px-[clamp(32px,5vw,72px)] lg:py-[clamp(32px,4vw,60px)]">
            <div className="min-w-0 max-w-[520px]">
              <h2 className="mb-[18px] text-[clamp(30px,3vw,54px)] font-black uppercase leading-[0.95] tracking-[-0.035em]">
                <span className="block">Franchise</span>
                <span className="block text-[var(--maeme-red)]">Partners</span>
              </h2>
              <p className="max-w-[520px] text-[clamp(14px,1.2vw,18px)] leading-[1.65] text-[#3A1715]/76">
                Our franchise partners are carefully selected, locally connected and part of their communities. Together, we grow the Maeme&apos;s family.
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-[440px] min-w-0 overflow-visible px-3 py-2 sm:px-5">
              <div aria-hidden="true" className="absolute inset-x-5 inset-y-2 rotate-[2deg] rounded-[20px] bg-[var(--maeme-yellow)]/32" />
              <div className="relative -rotate-[1deg] rounded-[22px] bg-white p-2 shadow-[0_12px_28px_rgba(58,23,21,0.10)]">
                <ImagePlaceholder label="FRANCHISE TEAM / STORE IMAGE" className="aspect-[16/10] rounded-[17px] bg-[#F7EFE8]" />
              </div>
              <HeartBadge lines={["Maeme's"]} className="absolute -left-2 bottom-[-5px] rotate-[-7deg] sm:-left-5" />
              <span aria-hidden="true" className="pointer-events-none absolute -left-5 bottom-16 z-20 h-5 w-10 rotate-[-28deg] rounded-[70%_30%_60%_40%] bg-[#E78935] sm:-left-9" />
            </div>
          </div>
        </section>

        <section className="relative overflow-visible rounded-[22px] border border-[#DDE6D5] bg-[#EDF4E8] sm:rounded-[28px] lg:min-h-[210px]">
          <div className="grid items-center gap-6 px-5 py-7 sm:gap-7 sm:px-9 sm:py-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-[clamp(32px,5vw,80px)] lg:px-[clamp(32px,5vw,72px)] lg:py-[clamp(32px,4vw,52px)]">
            <div className="min-w-0 lg:order-2">
              <h2 className="mb-[18px] text-[clamp(30px,3vw,54px)] font-black uppercase leading-[0.95] tracking-[-0.035em]">Quality</h2>
              <DecorativeWave tone="green" />
              <p className="mt-4 max-w-[520px] text-[clamp(14px,1.2vw,18px)] leading-[1.65] text-[#3A1715]/76">
                Our preparation processes and operational standards are carefully maintained to provide a consistent, high-quality Maeme&apos;s experience.
              </p>
            </div>
            <div className="relative mx-auto flex w-full max-w-[380px] min-w-0 items-center justify-center overflow-visible lg:order-1">
              <ImagePlaceholder label="FLAME-GRILLED FOOD QUALITY IMAGE" className="aspect-[16/8] rounded-[38%_62%_42%_58%/55%_42%_58%_45%] bg-white/46" />
            </div>
          </div>
        </section>
      </div>

      <NewsletterSection />
    </div>
  );
}
