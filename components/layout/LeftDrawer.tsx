'use client';

import Link from 'next/link';
import { X, FileText, Gift, MapPinIcon, Utensils } from 'lucide-react';

interface LeftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: 'Menu', href: '/menu', icon: Utensils },
  { label: 'Our Food', href: '/food', icon: FileText },
  { label: 'Branches', href: '/branches', icon: MapPinIcon },
  { label: 'Our App', href: '/app', icon: Gift },
  { label: 'Franchising', href: '/franchising', icon: FileText },
  { label: 'Career', href: '/career', icon: FileText },
];

export default function LeftDrawer({ isOpen, onClose }: LeftDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-label="Close drawer"
      />

      <div
        className={`fixed left-0 top-0 z-50 flex h-dvh w-[90vw] max-w-[420px] flex-col bg-white shadow-[24px_0_70px_rgba(26,18,15,0.24)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isOpen}
        aria-modal="true"
        role="dialog"
      >
        <div className="flex h-24 items-center justify-between border-b border-[#ead8c6] bg-[#fff8ed] px-6 sm:h-28">
          <Link href="/" onClick={onClose} className="inline-flex items-center">
            <img
              src="/images/maemes-logo.png"
              alt="Maeme's Piri Piri"
              className="h-14 w-auto"
            />
          </Link>
          <button
            onClick={onClose}
            className="rounded-xl border border-[#ead8c6] bg-white p-2 text-[#1a120f] shadow-sm transition hover:bg-[#ffc257]"
            aria-label="Close drawer"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.label === 'Menu' ? '/order?notice=1' : item.href}
                target={item.label === 'Menu' ? '_blank' : undefined}
                rel={item.label === 'Menu' ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#1a120f] transition-colors hover:bg-[#fff8ed]"
                onClick={onClose}
              >
                <Icon size={20} className="text-[#99041e]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <footer className="shrink-0 border-t border-[#ead8c6] bg-[#fffaf4] px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-[#6f5f5a]">
            <Link href="/privacy-policy" onClick={onClose} className="transition hover:text-[#99041e] focus-visible:outline-none focus-visible:text-[#99041e]">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" onClick={onClose} className="transition hover:text-[#99041e] focus-visible:outline-none focus-visible:text-[#99041e]">
              Terms &amp; Conditions
            </Link>
          </div>
          <p className="mt-3 text-[11px] font-semibold leading-5 text-[#806f68]">
            © {new Date().getFullYear()} Maeme&apos;s Piri Piri. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
