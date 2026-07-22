'use client';

import Link from 'next/link';

const orderingFooterLinks = [
  { label: 'FAQ', href: '/contact' },
  { label: 'Refunds for Missing or Incorrect Orders', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Contact Us', href: '/contact' },
  { label: "Query a Maeme's App order", href: '/contact' },
];

export default function OrderingFooter() {
  return (
    <footer className="shrink-0 bg-[#99041e] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-white sm:px-6 sm:py-3">
      <div className="site-container-wide flex min-h-11 flex-col items-center justify-between gap-2 sm:flex-row sm:gap-5">
        <nav aria-label="Ordering help and legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 sm:justify-start">
          {orderingFooterLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-10 items-center rounded-lg text-sm font-bold text-white/90 transition hover:text-[#ffc257] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257] focus-visible:ring-offset-2 focus-visible:ring-offset-[#99041e]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="shrink-0 pb-1 text-center text-xs font-semibold text-white/80 sm:pb-0 sm:text-right">
          Copyright © Maeme&apos;s {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
