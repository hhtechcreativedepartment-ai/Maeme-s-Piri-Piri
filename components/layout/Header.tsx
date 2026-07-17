'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MapPin, Menu, ShoppingCart, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/lib/cartContext';
import LeftDrawer from './LeftDrawer';
import { socialIcons } from './SocialIcons';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  let cartCount = 0;
  let cartTotal = 0;
  let branchLabel = 'Select Location';
  let hasOrderSetup = false;
  try {
    const cart = useCart();
    cartCount = cart.getCartCount();
    cartTotal = cart.getCartTotal();
    branchLabel = cart.selectedBranch ? cart.selectedBranch.postcode : 'Select Location';
    hasOrderSetup = Boolean(cart.selectedBranch && cart.selectedOrderType);
  } catch {
    // Cart context not available (e.g., on homepage)
  }

  const navLinks = [
    { label: 'Menu', href: '/menu' },
    { label: 'Our Food', href: '/food' },
    { label: 'Stores', href: '/branches' },
    { label: 'Our App', href: '/app' },
    { label: 'Franchising', href: '/franchising' },
  ];

  const handleOrderNow = () => {
    if (!hasOrderSetup) {
      window.dispatchEvent(new CustomEvent('maemes:open-postcode-modal'));
      return;
    }

    router.push('/menu');
  };

  if (pathname === '/login') {
    return null;
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-[70] w-full border-b border-[#ead7c7] bg-white/95 shadow-[0_8px_28px_rgba(63,24,18,0.035)] backdrop-blur-xl">
      <div className="page-container flex h-20 items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-4 lg:w-[220px]">
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#1f1210] transition-colors hover:bg-[#fff8f2] sm:h-11 sm:w-11 lg:hidden"
            aria-label="Toggle drawer"
            title="Menu"
          >
            <Menu size={24} strokeWidth={2.25} />
          </button>

          <Link href="/" className="group flex shrink-0 items-center">
            <img
              src="/images/maemes-logo.png"
              alt="Maeme's Piri Piri"
              className="h-10 w-auto transition-opacity group-hover:opacity-85 sm:h-13 md:h-14"
            />
          </Link>
        </div>

        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-6 pr-2 lg:flex xl:gap-7 xl:pr-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative whitespace-nowrap py-2 text-sm font-black leading-none text-[#1f1210] transition-colors hover:text-[var(--maeme-red)] ${
                pathname === link.href ? 'text-[var(--maeme-red)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[var(--maeme-red)]' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-1.5 sm:gap-3">
          <div className="hidden items-center gap-3 border-l border-[#ead7c7] pl-5 text-[var(--maeme-red)] lg:flex xl:gap-4 xl:pl-6">
            {socialIcons.map((Icon, index) => (
              <span
                key={index}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(var(--maeme-red-rgb),0.18)] bg-[rgba(var(--maeme-red-rgb),0.06)] transition-colors hover:bg-[rgba(var(--maeme-red-rgb),0.12)]"
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
            ))}
          </div>

          <button
            data-open-postcode-modal
            className="hidden h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#ead7c7] bg-white text-sm font-black leading-none text-[#1f1210] transition hover:bg-[#fff8f2] sm:flex sm:h-11 sm:w-auto sm:px-4"
            aria-label="Select location"
          >
            <MapPin size={17} className="text-[var(--maeme-red)]" />
            <span className="hidden max-w-[112px] truncate sm:inline lg:max-w-[132px]">{branchLabel}</span>
          </button>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full px-0 text-[#1f1210] transition-colors hover:bg-[#fff8f2] sm:h-11 sm:w-auto sm:px-3"
            aria-label="Shopping cart"
            title="View cart"
          >
            <ShoppingCart size={22} strokeWidth={2.25} />
            <span className="hidden whitespace-nowrap text-sm font-black leading-none md:inline">£{cartTotal.toFixed(2)}</span>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--maeme-red)] text-xs font-bold leading-none text-white">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={handleOrderNow}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[var(--maeme-red)] px-3 text-xs font-black leading-none text-white shadow-[0_12px_28px_rgba(var(--maeme-red-rgb),0.20)] transition hover:bg-[var(--maeme-red-dark)] sm:h-11 sm:px-5 sm:text-sm lg:px-6"
          >
            <span className="hidden sm:inline">Order Now</span>
            <span className="sm:hidden">Order</span>
          </button>

          <Link href="/account" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#1f1210] transition hover:bg-[#fff8f2] sm:h-11 sm:w-11" aria-label="Profile">
            <User size={21} strokeWidth={2.25} />
          </Link>
        </div>
      </div>

      <LeftDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </header>
  );
}
