'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, Mail, MapPin, Phone, Smartphone } from 'lucide-react';
import { socialIcons } from './SocialIcons';
import { isOrderFlowRoute } from '@/lib/orderFlowRoutes';
import OrderingFooter from '@/components/ordering/OrderingFooter';

const quickLinks = [
  { label: 'Menu', href: '/menu' },
  { label: 'Our Food', href: '/food' },
  { label: 'Stores', href: '/branches' },
  { label: 'Our App', href: '/app' },
  { label: 'Franchising', href: '/franchising' },
];

const supportLinks = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'My Account', href: '/account' },
  { label: 'Track Order', href: '/orders' },
];

const legalLinks = [
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

export default function Footer() {
  const pathname = usePathname();
  const usesOrderingFooter = pathname === '/order/menu'
    || pathname === '/menu'
    || pathname === '/cart'
    || pathname === '/checkout'
    || pathname === '/account';

  if (usesOrderingFooter) {
    return <OrderingFooter />;
  }

  if (pathname === '/login' || isOrderFlowRoute(pathname)) {
    return null;
  }

  return (
    <footer className="bg-[var(--maeme-red)] text-white">
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[1.25fr_0.8fr_0.8fr_0.75fr_1fr_0.85fr]">
          <div className="min-w-0">
            <Link href="/" className="inline-flex rounded-2xl bg-white p-3 shadow-[0_14px_38px_rgba(0,0,0,0.16)]">
              <img src="/images/maemes-logo.png" alt="Maeme's Piri Piri" className="h-16 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">
              Maeme&apos;s Piri Piri serves freshly grilled chicken, bold sauces and fast ordering for delivery or collection across local branches.
            </p>
            <div className="mt-5 flex gap-3">
              {socialIcons.map((Icon, index) => (
                <span key={index} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[var(--maeme-yellow)]">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
              ))}
            </div>
          </div>

          <FooterColumn title="Explore" links={quickLinks} />
          <FooterColumn title="Help & Support" links={supportLinks} />
          <FooterColumn title="Legal" links={legalLinks} />

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[var(--maeme-yellow)]">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm text-white/82">
              <li className="flex gap-3"><Phone size={18} className="shrink-0 text-[var(--maeme-yellow)]" /> 0800 123 4567</li>
              <li className="flex gap-3"><Mail size={18} className="shrink-0 text-[var(--maeme-yellow)]" /> hello@maemespiripiri.co.uk</li>
              <li className="flex gap-3"><MapPin size={18} className="shrink-0 text-[var(--maeme-yellow)]" /> Branches across London and the UK</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[var(--maeme-yellow)]">Get the app</h3>
            <div className="mt-5 grid gap-3">
              <div className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-black">
                <Smartphone size={19} className="text-[var(--maeme-yellow)]" /> App Store
              </div>
              <div className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-black">
                <Smartphone size={19} className="text-[var(--maeme-yellow)]" /> Google Play
              </div>
              <div className="mt-2 flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-[var(--maeme-red)]">
                <img
                  src="/images/maemes-app-qr.png"
                  alt="QR code to download the Maeme's app"
                  className="h-full w-full rounded-2xl object-contain p-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-[1320px] flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Maeme&apos;s Piri Piri. All rights reserved.</p>
          <div className="flex items-center gap-3 text-white/75">
            <CreditCard size={18} className="text-[var(--maeme-yellow)]" />
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Apple Pay</span>
          </div>
        </div>
      </section>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <nav>
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[var(--maeme-yellow)]">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm font-semibold text-white/82 transition hover:text-[var(--maeme-yellow)]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
