'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { FacebookIcon, InstagramIcon, TikTokIcon } from './SocialIcons';

const essentialLinks = [
  { label: 'Public Menu', href: '/menu' },
  { label: 'Franchising', href: '/franchising' },
  { label: "What's New", href: '/blog' },
  { label: 'Our Food', href: '/food' },
  { label: 'Stores', href: '/branches' },
];

const socialLinks = [
  {
    label: 'Maeme’s on Instagram',
    href: 'https://www.instagram.com/maemesuk/',
    icon: InstagramIcon,
  },
  {
    label: 'Maeme’s on Facebook',
    href: 'https://www.facebook.com/maemesfranchising/',
    icon: FacebookIcon,
  },
];

const appLinks = [
  {
    label: 'Download Maeme’s on the App Store',
    href: 'https://apps.apple.com/gb/app/maemes/id6741921858',
    image: '/images/app-store-badge.png',
    alt: 'Download on the App Store',
  },
  {
    label: 'Get Maeme’s on Google Play',
    href: 'https://play.google.com/store/apps/details?id=maemes.co.uk',
    image: '/images/google-play-badge.png',
    alt: 'Get it on Google Play',
  },
];

export default function PublicSiteFooter() {
  const currentYear = new Date().getFullYear();

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#99041e] text-white">
      <div className="mx-auto max-w-[1320px] px-4 pb-4 pt-5 sm:px-6 sm:pb-7 sm:pt-8 lg:px-8">
        <div className="grid items-center gap-4 md:grid-cols-[1.1fr_0.8fr_1.1fr] md:gap-8">
          <nav aria-label="Public website footer" className="order-2 md:order-1">
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:justify-start lg:flex-nowrap lg:gap-x-3 lg:gap-y-0 xl:gap-x-5">
              {essentialLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-8 items-center text-[11px] font-bold text-white/90 underline-offset-4 transition hover:text-[#ffc257] hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257] sm:min-h-9 sm:text-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="order-1 flex flex-col items-center md:order-2">
            <Link
              href="/"
              aria-label="Maeme’s home"
              className="inline-flex rounded-xl bg-white p-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/70"
            >
              <Image
                src="/images/maemes-logo.png"
                alt="Maeme’s Piri Piri"
                width={108}
                height={68}
                className="h-11 w-auto object-contain sm:h-14"
              />
            </Link>

            <div className="mt-3 flex items-center justify-center gap-2.5" aria-label="Maeme’s social media">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#ffc257] transition hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <span
                role="img"
                aria-label="Maeme’s TikTok"
                title="Maeme’s TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#ffc257]"
              >
                <TikTokIcon className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div className="order-3 flex items-center justify-center gap-2 md:justify-end">
            <div className="flex flex-wrap items-center justify-center gap-2 min-[360px]:flex-nowrap">
              {appLinks.map(app => (
                <a
                  key={app.label}
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={app.label}
                  className="inline-flex rounded-md transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257]"
                >
                  <Image
                    src={app.image}
                    alt={app.alt}
                    width={162}
                    height={48}
                    className="h-9 w-auto object-contain sm:h-10"
                  />
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={backToTop}
              aria-label="Back to top"
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#ffc257]/60 bg-[#ffc257] text-[#99041e] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:flex"
            >
              <ArrowUp size={18} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center gap-1 border-t border-white/15 pt-3 text-center text-[11px] font-semibold text-white/75 sm:mt-5 sm:flex-row sm:gap-4 sm:pt-4">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link className="inline-flex min-h-8 items-center transition hover:text-[#ffc257] hover:underline" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="inline-flex min-h-8 items-center transition hover:text-[#ffc257] hover:underline" href="/terms-and-conditions">
              Terms &amp; Conditions
            </Link>
          </div>
          <span className="hidden h-3 w-px bg-white/25 sm:block" aria-hidden="true" />
          <p>© {currentYear} Maeme&apos;s Piri Piri. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
