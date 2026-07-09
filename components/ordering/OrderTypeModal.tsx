'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Clock, MapPin, Navigation, Search, ShoppingBag, Truck, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRANCHES, formatBranchDisplay } from '@/lib/branchData';
import { OrderType, useCart } from '@/lib/cartContext';

interface OrderTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectToMenu?: boolean;
  onSelected?: () => void;
}

export default function OrderTypeModal({ isOpen, onClose, redirectToMenu = true, onSelected }: OrderTypeModalProps) {
  const router = useRouter();
  const { selectBranch } = useCart();
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  const branches = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    const availableBranches = BRANCHES.filter(branch =>
      orderType === 'delivery' ? branch.deliveryAvailable : branch.pickupAvailable
    );

    if (!normalised) return availableBranches;

    return availableBranches.filter(branch =>
      [branch.branchName, branch.address, branch.postcode].some(value =>
        value.toLowerCase().includes(normalised)
      )
    );
  }, [orderType, query]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSelect = (branchId: string) => {
    selectBranch(branchId, orderType);
    onSelected?.();
    onClose();
    if (redirectToMenu) router.push('/menu');
  };

  const handleSearch = () => {
    setSearched(true);
  };

  const handleUseLocation = () => {
    setQuery(orderType === 'delivery' ? 'UB1' : 'Southall');
    setSearched(true);
  };

  const modal = (
    <div className="postcode-modal-overlay fixed inset-0 z-[9998] box-border flex items-center justify-center overflow-x-hidden bg-black/55 px-3 py-4 backdrop-blur-sm sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-type-title"
        className="postcode-modal relative z-[9999] box-border max-h-[calc(100vh-2rem)] w-full max-w-[780px] overflow-hidden rounded-[24px] border border-[#f0d59d] bg-white shadow-[0_28px_90px_rgba(26,18,15,0.32)] sm:max-h-[calc(100vh-48px)]"
      >
        <div className="relative border-b border-[#ead8c6] bg-[#fff8ed] px-5 py-6 text-center sm:px-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl border border-[#ead8c6] bg-white p-2 text-[#1A1A1A] shadow-sm transition hover:bg-[#ffc257]"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          <img src="/images/maemes-logo.png" alt="Maeme's Piri Piri" className="mx-auto h-16 w-auto" />
          <h2 id="order-type-title" className="mt-4 text-2xl font-black tracking-tight text-[#1A1A1A] sm:text-3xl">
            Select your order type
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 text-[#6b5b55]">
            {orderType === 'delivery'
              ? "Enter your postcode to find your nearest Maeme's"
              : "Choose your nearest Maeme's for collection"}
          </p>
        </div>

        <div className="box-border max-h-[calc(92vh-186px)] overflow-y-auto overflow-x-hidden bg-white p-4 sm:p-6">
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-[#ead8c6] bg-[#fff8ed] p-1.5">
            {(['delivery', 'pickup'] as OrderType[]).map(type => (
              <button
                key={type}
                onClick={() => {
                  setOrderType(type);
                  setSearched(false);
                  setQuery('');
                }}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black capitalize transition ${
                  orderType === type
                    ? 'bg-[#99041e] text-white shadow-[0_12px_28px_rgba(153,4,30,0.20)]'
                    : 'text-[#6F4B3A] hover:bg-white'
                }`}
              >
                {type === 'delivery' ? <Truck size={17} /> : <ShoppingBag size={17} />}
                {type}
              </button>
            ))}
          </div>

          <div className="box-border w-full rounded-2xl border border-[#ead8c6] bg-[#fff8ed] p-3 sm:p-4">
            <p className="mb-3 text-sm font-bold text-[#1A1A1A]">
              {orderType === 'delivery'
                ? "Enter your postcode to find your nearest Maeme's"
                : "Choose your nearest Maeme's for collection"}
            </p>
            <div className="grid w-full min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <label className="relative block min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B2E3B]" size={18} />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder={orderType === 'delivery' ? 'Postcode' : 'City, region or postcode'}
                className="box-border h-12 w-full min-w-0 rounded-xl border border-[#E7D7C4] bg-[#FFFCF7] pl-11 pr-4 text-sm font-semibold outline-none ring-[#99041e]/20 focus:border-[#99041e] focus:ring-4"
              />
            </label>
            <button
              onClick={handleUseLocation}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#E7D7C4] bg-white px-4 text-sm font-black text-[#99041e] transition hover:bg-[#FFF7E1] md:w-auto"
            >
              <Navigation size={17} />
              Use Current Location
            </button>
            <button
              onClick={handleSearch}
              className="h-12 w-full rounded-xl bg-[#ffc257] px-6 text-sm font-black text-[#1A1A1A] shadow-sm transition hover:bg-[#e5a93e] md:w-auto"
            >
              Search
            </button>
            </div>
          </div>

          {searched ? (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#99041e]">
                  Branch results
                </h3>
                <p className="text-xs font-bold text-[#6b5b55]">
                  {branches.length} {branches.length === 1 ? 'branch' : 'branches'} found
                </p>
              </div>

              {branches.length === 0 ? (
                <div className="rounded-2xl border border-[#ead8c6] bg-white p-6 text-center">
                  <p className="text-lg font-black text-[#1A1A1A]">No branch found</p>
                  <p className="mt-2 text-sm text-[#6b5b55]">Try another postcode, city or nearby area.</p>
                </div>
              ) : (
                branches.map(branch => {
                  const isClosed = branch.isOpen === false;
                  return (
                    <article key={branch.branchId} className="rounded-2xl border border-[#EBD9C5] bg-white p-4 shadow-[0_14px_40px_rgba(74,32,20,0.08)]">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-black text-[#1A1A1A]">{branch.branchName}</h3>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-black ${isClosed ? 'bg-[#F6E6E6] text-[#99041e]' : 'bg-[#E8F5ED] text-[#126336]'}`}>
                              {isClosed ? 'Closed' : 'Open Now'}
                            </span>
                          </div>
                          <p className="mt-2 flex gap-2 text-sm leading-6 text-[#666]">
                            <MapPin size={16} className="mt-0.5 shrink-0 text-[#99041e]" />
                            <span>{branch.address}</span>
                          </p>
                          <p className="mt-1 pl-6 text-sm font-black text-[#1A1A1A]">{branch.postcode}</p>

                          <div className="mt-3 grid gap-2 text-xs font-bold text-[#6F4B3A] sm:grid-cols-2">
                            <span className="inline-flex items-center gap-2">
                              <Clock size={15} className="text-[#99041e]" />
                              {formatBranchDisplay(branch)}
                            </span>
                            <span>Delivery time: {branch.deliveryTime}</span>
                            <span>Pickup time: {branch.pickupTime}</span>
                            <span>Minimum order: £{branch.minDeliveryAmount.toFixed(2)}</span>
                            <span>Delivery fee: £{branch.deliveryFee.toFixed(2)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelect(branch.branchId)}
                          disabled={isClosed}
                          className="rounded-xl bg-[#ffc257] px-5 py-3 text-sm font-black text-[#1A1A1A] shadow-sm transition hover:bg-[#e5a93e] disabled:cursor-not-allowed disabled:bg-[#ead8c6] disabled:text-[#8b7a73]"
                        >
                          Select for {orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[#f0d59d] bg-[#fffaf2] p-6 text-center">
              <p className="font-black text-[#1A1A1A]">
                Search to see available Maeme&apos;s branches.
              </p>
              <p className="mt-2 text-sm text-[#6b5b55]">
                You can browse as a guest. We only need your branch and order type before ordering.
              </p>
            </div>
          )}
                    </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
