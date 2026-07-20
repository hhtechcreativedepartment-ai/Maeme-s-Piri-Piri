'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock3, MapPin, ShoppingBag, Truck, UserRound } from 'lucide-react';
import { Branch } from '@/lib/branchData';
import { OrderType } from '@/lib/cartContext';
import { getOrderTypeLabel } from '@/lib/orderTypeDisplay';

interface OrderingContextBannerProps {
  branch: Branch | null;
  orderType: OrderType | null;
  cartCount: number;
  cartTotal: number;
  onOrderTypeChange: (orderType: OrderType) => void;
}

export default function OrderingContextBanner({
  branch,
  orderType,
  cartCount,
  cartTotal,
  onOrderTypeChange,
}: OrderingContextBannerProps) {
  const estimatedTime = branch
    ? orderType === 'delivery'
      ? branch.deliveryTime
      : branch.pickupTime
    : undefined;

  return (
    <section className="relative overflow-hidden bg-[#99041e] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 18%, #ffc257 0 2px, transparent 3px), radial-gradient(circle at 82% 70%, #ffc257 0 1px, transparent 2px)',
          backgroundSize: '34px 34px, 28px 28px',
        }}
      />
      <div className="site-container-wide relative grid gap-4 py-4 sm:py-5 lg:grid-cols-[180px_minmax(0,1fr)_auto] lg:items-center">
        <Link href="/" className="hidden w-fit rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60 lg:block" aria-label="Maeme's home">
          <Image src="/images/maemes-logo.png" alt="Maeme's Piri Piri" width={164} height={88} priority className="h-16 w-auto object-contain" />
        </Link>

        <div className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
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
                    onClick={() => onOrderTypeChange(type)}
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

        <div className="grid grid-cols-2 gap-2 lg:flex lg:justify-end">
          <Link href="/cart" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ffc257] px-4 text-sm font-black text-[#99041e] shadow-[0_10px_24px_rgba(65,0,12,0.18)] transition hover:bg-[#ffd17b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50">
            <ShoppingBag size={17} />
            <span>{cartCount}</span>
            <span className="border-l border-[#99041e]/25 pl-2">Basket £{cartTotal.toFixed(2)}</span>
          </Link>
          <Link href="/account" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#ffc257]/60 bg-white/10 px-4 text-sm font-black text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/50">
            <UserRound size={17} className="text-[#ffc257]" />
            <span>My Account</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
