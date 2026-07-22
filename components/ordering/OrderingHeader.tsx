'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Clock3, MapPin, ShoppingBag, Truck, UserRound } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { getOrderTypeLabel } from '@/lib/orderTypeDisplay';

export default function OrderingHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const { selectedBranch: branch, selectedOrderType: orderType, isHydrated, setOrderType, getCartCount, getCartTotal } = useCart();
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();
  const cartActive = pathname === '/cart';
  const accountActive = pathname === '/account';
  const estimatedTime = branch
    ? orderType === 'delivery'
      ? branch.deliveryTime
      : branch.pickupTime
    : undefined;

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const updateHeight = () => document.documentElement.style.setProperty('--ordering-header-height', `${header.offsetHeight}px`);
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    updateHeight();
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--ordering-header-height');
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-[70] overflow-hidden bg-[#99041e] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 18%, #ffc257 0 2px, transparent 3px), radial-gradient(circle at 82% 70%, #ffc257 0 1px, transparent 2px)',
          backgroundSize: '34px 34px, 28px 28px',
        }}
      />
      <div className="site-container-wide relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-4 py-3 sm:gap-x-5 sm:py-4 lg:grid-cols-[180px_minmax(0,1fr)_auto] lg:gap-4 lg:py-5">
        <Link href="/order/menu" className="w-fit rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60" aria-label="Return to ordering menu">
          <Image src="/images/maemes-logo.png" alt="Maeme's Piri Piri" width={164} height={88} priority className="h-12 w-auto object-contain sm:h-14 lg:h-16" />
        </Link>

        <div className="order-3 col-span-2 grid min-w-0 grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 sm:gap-x-4 lg:order-none lg:col-span-1">
          <button
            type="button"
            data-open-postcode-modal
            className="col-span-2 min-w-0 rounded-xl text-left transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/50 sm:col-span-1 sm:p-2"
          >
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/65">
              <MapPin size={13} className="text-[#ffc257]" />
              You are ordering from
            </span>
            <strong className="mt-1 block truncate text-sm text-[#ffc257]">{branch?.branchName || 'Choose a restaurant'}</strong>
            <span className="mt-0.5 block truncate text-xs font-semibold text-white/80">
              {branch ? `${branch.postcode} · ${branch.address}` : 'Select your postcode or branch'}
            </span>
          </button>

          <div className="min-w-0 sm:p-2">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/65">
              {orderType === 'pickup' ? <ShoppingBag size={13} /> : <Truck size={13} />}
              Order type
            </span>
            <div className="mt-1.5 flex rounded-full border border-white/20 bg-white/10 p-1">
              {(['delivery', 'pickup'] as const).map((type) => {
                const available = !branch || (type === 'delivery' ? branch.deliveryAvailable : branch.pickupAvailable);
                return (
                  <button
                    key={type}
                    type="button"
                    disabled={!branch || !available}
                    onClick={() => setOrderType(type)}
                    aria-pressed={orderType === type}
                    className={`min-h-8 flex-1 rounded-full px-2 text-[11px] font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc257] disabled:cursor-not-allowed disabled:opacity-40 ${
                      orderType === type ? 'bg-[#ffc257] text-[#99041e]' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {getOrderTypeLabel(type)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 sm:p-2">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/65">
              <Clock3 size={13} className="text-[#ffc257]" />
              Estimated time
            </span>
            <strong className="mt-2 block truncate text-sm text-[#ffc257]">{estimatedTime || 'Select a branch'}</strong>
            <span className="mt-0.5 block text-xs font-semibold text-white/80">
              {branch && orderType ? getOrderTypeLabel(orderType) : 'Delivery or Collection'}
            </span>
          </div>
        </div>

        <nav className="grid min-w-0 grid-cols-2 gap-2 lg:flex lg:justify-end" aria-label="Ordering navigation">
          <Link href="/cart" aria-current={cartActive ? 'page' : undefined} aria-label={`Basket, ${cartCount} items, £${cartTotal.toFixed(2)}`} className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-full bg-[#ffc257] px-3 text-xs font-black text-[#99041e] shadow-[0_10px_24px_rgba(65,0,12,0.18)] transition hover:bg-[#ffd17b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 sm:min-h-12 sm:gap-2 sm:px-4 sm:text-sm ${cartActive ? 'ring-2 ring-white ring-offset-2 ring-offset-[#99041e]' : ''}`}>
            <ShoppingBag size={17} />
            <span>{isHydrated ? cartCount : '–'}</span>
            <span className="truncate border-l border-[#99041e]/25 pl-1.5 sm:pl-2">Basket {isHydrated ? `£${cartTotal.toFixed(2)}` : '…'}</span>
          </Link>
          <Link href="/account" aria-current={accountActive ? 'page' : undefined} aria-label="Open profile" title="Profile" className={`inline-flex h-11 w-11 shrink-0 items-center justify-center justify-self-end rounded-full border border-[#ffc257]/60 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/50 sm:h-12 sm:w-12 ${accountActive ? 'bg-[#ffc257] text-[#99041e]' : 'bg-white/10 text-white hover:bg-white/15'}`}>
            <UserRound size={19} className={accountActive ? 'text-[#99041e]' : 'text-[#ffc257]'} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
