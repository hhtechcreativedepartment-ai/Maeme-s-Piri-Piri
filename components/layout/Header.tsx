'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { isOrderFlowRoute } from '@/lib/orderFlowRoutes';
import LeftDrawer from './LeftDrawer';
import { socialIcons } from './SocialIcons';

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const drawerButtonRef = useRef<HTMLButtonElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navLinks = [
    { label: 'Menu', href: '/menu' },
    { label: 'Our Food', href: '/food' },
    { label: 'Stores', href: '/branches' },
    { label: 'Our App', href: '/app' },
    { label: 'Franchising', href: '/franchising' },
  ];

  useEffect(() => {
    if (pathname === '/login' || pathname === '/account' || isOrderFlowRoute(pathname)) {
      document.documentElement.style.setProperty('--site-header-height', '0px');
      return;
    }

    const header = headerRef.current;
    if (!header) return;

    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty('--site-header-height', `${header.offsetHeight}px`);
    };
    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(header);
    updateHeaderHeight();

    return () => observer.disconnect();
  }, [pathname]);

  if (pathname === '/login' || pathname === '/account' || isOrderFlowRoute(pathname)) {
    return null;
  }

  return (
    <header ref={headerRef} className="fixed left-0 right-0 top-0 z-[70] w-full border-b border-[#ead7c7] bg-white/95 shadow-[0_8px_28px_rgba(63,24,18,0.035)] backdrop-blur-xl">
      <div className="page-container flex h-20 items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-4 lg:w-[220px]">
          <button
            ref={drawerButtonRef}
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

          <Link
            href="/order?notice=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[var(--maeme-red)] px-3 text-xs font-black leading-none text-white shadow-[0_12px_28px_rgba(var(--maeme-red-rgb),0.20)] transition hover:bg-[var(--maeme-red-dark)] sm:h-11 sm:px-5 sm:text-sm lg:px-6"
          >
            <span className="hidden sm:inline">Order Now</span>
            <span className="sm:hidden">Order</span>
          </Link>

        </div>
      </div>

      <LeftDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </header>
  );
}
