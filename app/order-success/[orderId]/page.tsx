'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useOrders } from '@/lib/ordersContext';
import { getLastOrder } from '@/lib/orderUtils';
import { BRANCHES } from '@/lib/branchData';
import { useCart } from '@/lib/cartContext';
import { clearCompletedOrderState } from '@/lib/checkoutStateUtils';

export default function OrderSuccessPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const routeOrderId = params.orderId;
  const { currentOrder, getOrderByNumber } = useOrders();
  const {
    clearCart,
    isHydrated,
    selectedBranch,
    selectedOrderType,
  } = useCart();
  const [startingNewOrder, setStartingNewOrder] = useState(false);
  const newOrderStartedRef = useRef(false);
  const order =
    getOrderByNumber(routeOrderId) ||
    (currentOrder?.orderNumber === routeOrderId ? currentOrder : null) ||
    (typeof window !== 'undefined' ? getLastOrder() : null);

  const orderNumber = order?.orderNumber || routeOrderId;
  const estimatedTime = order?.estimatedTime ? `${order.estimatedTime} min` : '35-45 min';
  const restaurant = order?.branchName || "Maeme's";

  const startNewOrder = () => {
    if (!isHydrated || startingNewOrder || newOrderStartedRef.current) return;
    newOrderStartedRef.current = true;
    setStartingNewOrder(true);

    clearCart();
    clearCompletedOrderState();

    const currentBranch = selectedBranch
      ? BRANCHES.find(branch => branch.branchId === selectedBranch.branchId)
      : null;
    const hasValidSelection = Boolean(
      currentBranch
      && selectedOrderType
      && (
        (selectedOrderType === 'delivery' && currentBranch.deliveryAvailable)
        || (selectedOrderType === 'pickup' && currentBranch.pickupAvailable)
      ),
    );

    router.push(hasValidSelection ? '/order/menu' : '/order');
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#fff8ed] px-4 py-16 text-[#1a120f] sm:px-6 lg:px-8">
      <section className="w-full max-w-4xl text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#ffc257] p-2 shadow-[0_22px_60px_rgba(153,4,30,0.18)]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#99041e]">
            <Check size={54} strokeWidth={4} className="text-white" />
          </div>
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-[#99041e]">ORDER CONFIRMED</p>
        <h1 className="mx-auto mt-3 max-w-full break-words text-3xl font-black tracking-tight sm:text-5xl">
          Order placed successfully
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6b5b55]">
          Thanks! The kitchen has received your order and will start preparing it shortly.
        </p>

        <div className="mx-auto mt-9 grid max-w-3xl gap-4 rounded-[24px] border border-[#f0d59d] bg-white p-5 text-left shadow-[0_18px_50px_rgba(50,24,16,0.08)] sm:grid-cols-3 sm:p-6">
          <InfoColumn label="Order number" value={orderNumber} />
          <InfoColumn label="Estimated time" value={estimatedTime} />
          <InfoColumn label="Restaurant" value={restaurant} />
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/track/${orderNumber}`}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#ffc257] px-7 py-3 text-sm font-black text-[#1a120f] shadow-[0_14px_34px_rgba(255,194,87,0.24)] transition hover:bg-[#e5a93e]"
          >
            Track Order
          </Link>
          <button
            type="button"
            onClick={startNewOrder}
            disabled={!isHydrated || startingNewOrder}
            aria-busy={startingNewOrder}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#f0d59d] bg-white px-7 py-3 text-sm font-black text-[#99041e] transition hover:bg-[#fff8ed] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60 disabled:cursor-wait disabled:opacity-65"
          >
            {startingNewOrder && <Loader2 size={17} className="animate-spin" aria-hidden="true" />}
            {startingNewOrder ? 'Starting New Order…' : 'Start a New Order'}
          </button>
        </div>
      </section>
    </main>
  );
}

function InfoColumn({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#fff8ed] p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#99041e]">{label}</p>
      <p className="mt-2 text-lg font-black text-[#1a120f]">{value}</p>
    </div>
  );
}
