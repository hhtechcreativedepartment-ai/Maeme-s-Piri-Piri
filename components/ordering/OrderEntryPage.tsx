'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Truck, UserRound } from 'lucide-react';
import { useState } from 'react';
import OrderTypeModal from '@/components/ordering/OrderTypeModal';
import { OrderType, useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { getOrderTypeLabel } from '@/lib/orderTypeDisplay';

export default function OrderEntryPage() {
  const {
    selectedBranch,
    selectedOrderType,
    setOrderType,
    getCartCount,
    getCartTotal,
  } = useCart();
  const { user } = useAuth();
  const [pendingOrderType, setPendingOrderType] = useState<OrderType>(selectedOrderType || 'pickup');
  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const beginOrder = (orderType: OrderType) => {
    setOrderType(orderType);
    setPendingOrderType(orderType);
    setShowSelectionModal(true);
  };

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#4d0312] text-white">
      <Image
        src="/images/grilled-composition.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#4d0312]/65" aria-hidden="true" />

      <header className="relative z-10">
        <div className="site-container-wide flex items-center justify-between gap-3 py-4 sm:py-5">
          <Link href="/" className="shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60" aria-label="Maeme's home">
            <Image src="/images/maemes-logo.png" alt="Maeme's Piri Piri" width={176} height={94} priority className="h-12 w-auto object-contain sm:h-16" />
          </Link>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              href="/cart"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ffc257] px-3 text-xs font-black text-[#99041e] shadow-lg transition hover:bg-[#ffd17b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 sm:min-h-12 sm:px-5 sm:text-sm"
            >
              <ShoppingBag size={17} />
              <span>{getCartCount()}</span>
              <span className="hidden border-l border-[#99041e]/25 pl-2 sm:inline">Basket £{getCartTotal().toFixed(2)}</span>
            </Link>
            <Link
              href="/account"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#ffc257]/70 bg-[#99041e] px-3 text-xs font-black text-white shadow-lg transition hover:bg-[#7f0318] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60 sm:min-h-12 sm:px-5 sm:text-sm"
            >
              <UserRound size={17} className="text-[#ffc257]" />
              <span className="hidden sm:inline">{user?.name || 'My Account'}</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 flex flex-1 items-center px-4 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-2xl text-center">
          <h1 className="text-3xl font-black tracking-tight text-[#ffc257] drop-shadow-[0_3px_12px_rgba(40,0,8,0.55)] sm:text-4xl lg:text-5xl">
            Welcome to Maeme&apos;s Online Ordering
          </h1>

          <div className="mx-auto mt-7 rounded-[24px] border border-white/70 bg-[#fff8ed] p-5 text-[#1a120f] shadow-[0_24px_70px_rgba(35,0,7,0.34)] sm:mt-9 sm:p-8">
            <h2 className="text-xl font-black text-[#99041e] sm:text-2xl">How would you like to order?</h2>

            {selectedBranch && selectedOrderType && (
              <div className="mt-4 rounded-2xl border border-[#f0d59d] bg-white px-4 py-3 text-sm">
                <p className="font-black text-[#99041e]">Your previous selection</p>
                <p className="mt-1 font-semibold text-[#6b5b55]">
                  {getOrderTypeLabel(selectedOrderType)} · {selectedBranch.branchName} · {selectedBranch.postcode}
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => beginOrder('pickup')}
                aria-pressed={selectedOrderType === 'pickup'}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#99041e] px-6 text-base font-black text-white shadow-[0_8px_0_#5f0213] transition hover:bg-[#7f0318] active:translate-y-0.5 active:shadow-[0_5px_0_#5f0213] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/70"
              >
                <ShoppingBag size={20} className="text-[#ffc257]" />
                Collection
              </button>
              <button
                type="button"
                onClick={() => beginOrder('delivery')}
                aria-pressed={selectedOrderType === 'delivery'}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#99041e] px-6 text-base font-black text-white shadow-[0_8px_0_#5f0213] transition hover:bg-[#7f0318] active:translate-y-0.5 active:shadow-[0_5px_0_#5f0213] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/70"
              >
                <Truck size={20} className="text-[#ffc257]" />
                Delivery
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/15 bg-[#99041e]/95 px-4 py-4">
        <div className="site-container-wide flex flex-col items-center justify-between gap-3 text-center text-xs font-bold text-white/85 sm:flex-row sm:text-left">
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2" aria-label="Ordering support">
            <Link href="/privacy-policy" className="transition hover:text-[#ffc257]">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="transition hover:text-[#ffc257]">Terms</Link>
            <Link href="/contact" className="transition hover:text-[#ffc257]">Contact Us</Link>
          </nav>
          <p>© {new Date().getFullYear()} Maeme&apos;s Piri Piri</p>
        </div>
      </footer>

      <OrderTypeModal
        isOpen={showSelectionModal}
        initialOrderType={pendingOrderType}
        redirectPath="/order/menu"
        onClose={() => setShowSelectionModal(false)}
      />
    </main>
  );
}
