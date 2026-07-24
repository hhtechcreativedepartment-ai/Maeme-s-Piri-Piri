'use client';

import Image from 'next/image';
import { useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  Award,
  Building2,
  Check,
  ClipboardCheck,
  Handshake,
  Headphones,
  MapPinned,
  Rocket,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';

const partnershipBenefits = [
  {
    icon: Award,
    title: 'A distinctive brand',
    copy: 'Bring Maeme’s flame-grilled Piri Piri experience to customers in your local market.',
  },
  {
    icon: ClipboardCheck,
    title: 'A clear operating model',
    copy: 'Follow established processes designed to support consistent food, service and presentation.',
  },
  {
    icon: Users,
    title: 'Training and guidance',
    copy: 'Prepare your team with practical guidance before launch and support as the business develops.',
  },
  {
    icon: TrendingUp,
    title: 'Built for local growth',
    copy: 'Combine your local knowledge with the identity and operating experience of the Maeme’s brand.',
  },
];

const supportAreas = [
  'Location and site planning guidance',
  'Store setup and launch preparation',
  'Team training and operating standards',
  'Brand, menu and marketing direction',
];

const journey = [
  {
    icon: Handshake,
    title: 'Initial enquiry',
    copy: 'Tell us about you, your preferred region and your goals.',
  },
  {
    icon: Headphones,
    title: 'Discovery call',
    copy: 'Discuss the opportunity, expectations and mutual fit with our team.',
  },
  {
    icon: MapPinned,
    title: 'Planning',
    copy: 'Explore location, business planning and the route towards opening.',
  },
  {
    icon: Rocket,
    title: 'Launch and support',
    copy: 'Prepare your team, open your store and continue growing with guidance.',
  },
];

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  location: '',
  experience: '',
  message: '',
};

export default function FranchisingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const updateField = (field: keyof typeof initialFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setIsSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setFormData(initialFormData);
  };

  return (
    <main className="overflow-x-clip bg-white text-[#1f1210]">
      <section className="relative overflow-hidden bg-[#99041e] text-white">
        <Image
          src="/images/franchise-frame-9.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:py-20">
          <div className="max-w-[610px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffc257]">
              <Store size={15} /> Franchise with Maeme&apos;s
            </span>
            <h1 className="mt-5 text-[38px] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-5xl lg:text-[64px]">
              Grow a business with
              <span className="block text-[#ffc257]">bold flavour.</span>
            </h1>
            <p className="mt-5 max-w-[580px] text-sm leading-6 text-white/82 sm:text-lg sm:leading-8">
              Join the Maeme&apos;s family and build a locally connected restaurant backed by a clear brand, an established operating approach and ongoing guidance.
            </p>
            <a
              href="#franchise-enquiry"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ffc257] px-7 text-sm font-black text-[#99041e] shadow-[0_16px_38px_rgba(37,0,8,0.22)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            >
              Start your enquiry <ArrowRight size={17} />
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-[720px]">
            <div className="absolute -inset-3 rounded-[28px] bg-[#ffc257]/18 blur-2xl" />
            <div className="relative overflow-hidden rounded-[24px] border border-white/20 bg-white p-2 shadow-[0_30px_80px_rgba(42,0,10,0.28)] sm:rounded-[30px] sm:p-3">
              <Image
                src="/images/franchise-partners.jpg"
                alt="Maeme's franchise partners and restaurant team"
                width={776}
                height={494}
                priority
                sizes="(min-width: 1024px) 56vw, 94vw"
                className="aspect-[776/494] w-full rounded-[18px] object-cover sm:rounded-[22px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf4] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1320px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#99041e]">A partnership built to grow</p>
            <h2 className="mt-3 text-[32px] font-black leading-[1.02] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Why partner with <span className="text-[#99041e]">Maeme&apos;s?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#6f5f5a] sm:text-base sm:leading-7">
              Bring entrepreneurial drive and local knowledge. We bring the brand direction, operating framework and guidance.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
            {partnershipBenefits.map(({ icon: Icon, title, copy }) => (
              <article
                key={title}
                className="rounded-[18px] border border-[#ead8c6] bg-white p-4 shadow-[0_12px_34px_rgba(63,24,18,0.055)] sm:rounded-[22px] sm:p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#99041e] text-[#ffc257] sm:h-12 sm:w-12">
                  <Icon size={21} />
                </span>
                <h3 className="mt-4 text-sm font-black leading-tight text-[#99041e] sm:text-lg">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#6f5f5a] sm:text-sm sm:leading-6">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-8 overflow-hidden rounded-[26px] border border-[#f0d59d] bg-[#fff4e6] p-5 sm:rounded-[34px] sm:p-9 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:p-12">
          <Image src="/images/franchise-frame-7.jpg" alt="" fill sizes="100vw" className="object-cover" aria-hidden="true" />
          <div className="relative order-2 lg:order-1">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#99041e]">Support at every stage</p>
            <h2 className="mt-3 text-[30px] font-black leading-[1.02] tracking-[-0.03em] sm:text-4xl">
              Your ambition. <span className="text-[#99041e]">Our guidance.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#6f5f5a] sm:text-base sm:leading-7">
              From early conversations through launch preparation, the focus stays on building a strong local operation that represents Maeme&apos;s consistently.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {supportAreas.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm font-semibold leading-5 text-[#3f302b]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ffc257] text-[#99041e]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative order-1 mx-auto flex min-h-[230px] w-full items-center justify-center lg:order-2 lg:min-h-[390px]">
            <Image
              src="/images/grilled-composition.png"
              alt="Maeme's flame-grilled food selection"
              width={1200}
              height={850}
              sizes="(min-width: 1024px) 52vw, 92vw"
              className="h-auto max-h-[270px] w-full object-contain drop-shadow-[0_26px_32px_rgba(92,32,15,0.18)] lg:max-h-[430px]"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#99041e] px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1320px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ffc257]">Your franchise journey</p>
            <h2 className="mt-3 text-[32px] font-black leading-[1.02] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              From enquiry to opening
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
            {journey.map(({ icon: Icon, title, copy }, index) => (
              <article key={title} className="relative rounded-[18px] border border-white/15 bg-white/[0.07] p-4 sm:rounded-[22px] sm:p-6">
                <span className="absolute right-3 top-3 text-3xl font-black text-white/10 sm:text-5xl">0{index + 1}</span>
                <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffc257] text-[#99041e] sm:h-12 sm:w-12">
                  <Icon size={21} />
                </span>
                <h3 className="relative mt-4 text-sm font-black leading-tight sm:text-lg">{title}</h3>
                <p className="relative mt-2 text-xs leading-5 text-white/72 sm:text-sm sm:leading-6">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="franchise-enquiry" className="scroll-mt-24 bg-[#fffaf4] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#99041e] text-[#ffc257]">
              <Building2 size={24} />
            </span>
            <p className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-[#99041e]">Franchise enquiry</p>
            <h2 className="mt-3 text-[32px] font-black leading-[1.02] tracking-[-0.03em] sm:text-4xl">
              Let&apos;s explore the opportunity.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#6f5f5a] sm:text-base sm:leading-7">
              Share a few details about your background and preferred location. Our franchise team can then discuss the next step with you.
            </p>
            <div className="mt-6 rounded-[20px] border border-[#f0d59d] bg-white p-5">
              <p className="text-sm font-black text-[#99041e]">What happens next?</p>
              <p className="mt-2 text-sm leading-6 text-[#6f5f5a]">
                Your enquiry will be reviewed before a member of the franchise team contacts you for an initial conversation.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[24px] border border-[#ead8c6] bg-white p-5 shadow-[0_18px_50px_rgba(63,24,18,0.07)] sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Full name" required>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className={inputClassName}
                  autoComplete="name"
                  required
                />
              </FormField>
              <FormField label="Email address" required>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className={inputClassName}
                  autoComplete="email"
                  required
                />
              </FormField>
              <FormField label="Phone number" required>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  className={inputClassName}
                  autoComplete="tel"
                  required
                />
              </FormField>
              <FormField label="Preferred location or region" required>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(event) => updateField('location', event.target.value)}
                  className={inputClassName}
                  required
                />
              </FormField>
            </div>

            <div className="mt-5">
              <FormField label="Relevant experience">
                <select
                  value={formData.experience}
                  onChange={(event) => updateField('experience', event.target.value)}
                  className={inputClassName}
                >
                  <option value="">Select an option</option>
                  <option value="hospitality">Hospitality or catering</option>
                  <option value="qsr">Quick-service restaurant</option>
                  <option value="retail">Retail</option>
                  <option value="business">Business ownership or management</option>
                  <option value="other">Other experience</option>
                </select>
              </FormField>
            </div>

            <div className="mt-5">
              <FormField label="Tell us about your goals">
                <textarea
                  value={formData.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  className={`${inputClassName} min-h-28 resize-y`}
                  placeholder="Share your plans, preferred area or any relevant experience."
                />
              </FormField>
            </div>

            {isSubmitted && (
              <p role="status" className="mt-5 rounded-xl border border-[#b9dfc7] bg-[#f0fbf4] px-4 py-3 text-sm font-semibold text-[#176b3a]">
                Thank you. Your franchise enquiry has been received.
              </p>
            )}

            <button
              type="submit"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#99041e] px-7 text-sm font-black text-white transition hover:bg-[#7f0318] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/50"
            >
              Send franchise enquiry <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

const inputClassName = 'min-h-12 w-full rounded-xl border border-[#ddc8b5] bg-[#fffdf9] px-4 text-sm text-[#1f1210] outline-none transition placeholder:text-[#9a8880] focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10';

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#3f302b]">
        {label}{required && <span className="text-[#99041e]"> *</span>}
      </span>
      {children}
    </label>
  );
}
