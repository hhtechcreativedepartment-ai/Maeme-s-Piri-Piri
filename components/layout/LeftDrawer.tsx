'use client';

import Link from 'next/link';
import { X, LogOut, FileText, Phone, Utensils, MapPinIcon, Settings, Heart, Gift, Home, Clock } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { usePathname, useRouter } from 'next/navigation';

interface LeftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeftDrawer({ isOpen, onClose }: LeftDrawerProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleLogin = () => {
    const redirect = pathname === '/login' ? '/' : pathname;
    router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    onClose();
  };

  const loggedInMenuItems = [
    { label: 'My Account', href: '/account', icon: Settings },
    { label: 'Order History', href: '/account?tab=orders', icon: Clock },
    { label: 'Current Order Tracking', href: '/account?tab=orders', icon: MapPinIcon },
    { label: 'Favourites', href: '/account?tab=favourites', icon: Heart },
    { label: 'Saved Addresses', href: '/account?tab=addresses', icon: Home },
    { label: 'Promos', href: '/account?tab=promos', icon: Gift },
    { label: 'Explore Menu', href: '/menu', icon: Utensils },
    { label: 'Branch Locator', href: '/branches', icon: MapPinIcon },
    { label: 'Privacy Policy', href: '/privacy-policy', icon: FileText },
    { label: 'Terms & Conditions', href: '/terms-and-conditions', icon: FileText },
  ];

  const loggedOutMenuItems = [
    { label: 'Explore Menu', href: '/menu', icon: Utensils },
    { label: 'Branch Locator', href: '/branches', icon: MapPinIcon },
    { label: 'Blog', href: '/blog', icon: FileText },
    { label: 'Privacy Policy', href: '/privacy-policy', icon: FileText },
    { label: 'Terms & Conditions', href: '/terms-and-conditions', icon: FileText },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-label="Close drawer"
      />

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 z-50 flex h-screen w-[90vw] max-w-[420px] flex-col bg-white shadow-[24px_0_70px_rgba(26,18,15,0.24)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isOpen}
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
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

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col bg-white">
          {user ? (
            <>
              <div className="border-b border-[#ead8c6] px-5 py-5">
                <div className="flex items-center gap-3 rounded-2xl bg-[#99041e] p-4 text-white shadow-[0_18px_45px_rgba(153,4,30,0.18)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffc257] text-lg font-black text-[#1a120f]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black">{user.name}</p>
                    <p className="text-sm text-white/80">{user.phone}</p>
                  </div>
                </div>
              </div>
              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto px-4 py-4">
                {loggedInMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#1a120f] transition-colors hover:bg-[#fff8ed]"
                      onClick={onClose}
                    >
                      <Icon size={20} className="text-[#99041e]" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="border-t border-[#ead8c6] p-4">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#99041e] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#7f0318]"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Login Card */}
              <div className="border-b border-[#ead8c6] px-5 py-6">
                <div className="rounded-2xl border border-[#f0d59d] bg-[#fff8ed] p-5 text-center shadow-[0_14px_36px_rgba(50,24,16,0.08)]">
                  <h3 className="mb-2 text-lg font-black text-[#1a120f]">
                    Login to explore
                  </h3>
                  <p className="mb-4 text-sm text-[#6b5b55]">
                    Save favourites and track orders.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="w-full rounded-2xl bg-[#ffc257] px-4 py-3 text-sm font-black text-[#1a120f] transition-colors hover:bg-[#e5a93e]"
                  >
                    Login
                  </button>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto px-4 py-4">
                {loggedOutMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#1a120f] transition-colors hover:bg-[#fff8ed]"
                      onClick={onClose}
                    >
                      <Icon size={20} className="text-[#99041e]" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Hotline Card */}
              <div className="border-t border-[#ead8c6] px-4 py-4">
                <div className="flex items-center gap-3 rounded-2xl bg-[#99041e] p-4 text-white">
                  <Phone size={20} className="flex-shrink-0 text-[#ffc257]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white/75">Order hotline</p>
                    <p className="text-sm font-black">0800 123 4567</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
