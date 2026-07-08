'use client';

import { useMemo, useState } from 'react';
import { Clock, MapPin, Navigation, Phone, Search, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRANCHES, Branch, formatBranchDisplay } from '@/lib/branchData';
import { useCart } from '@/lib/cartContext';

function todayHours(branch: Branch) {
  return formatBranchDisplay(branch).replace('Open: ', '');
}

export default function BranchesPage() {
  const router = useRouter();
  const { selectBranch } = useCart();
  const [query, setQuery] = useState('');

  const branches = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    if (!normalised) return BRANCHES;
    return BRANCHES.filter((branch) =>
      [branch.branchName, branch.address, branch.postcode, branch.phone || '']
        .join(' ')
        .toLowerCase()
        .includes(normalised)
    );
  }, [query]);

  const handleOrder = (branch: Branch) => {
    selectBranch(branch.branchId, 'delivery');
    router.push('/menu');
  };

  return (
    <main className="min-h-screen bg-[#fff8ed] px-4 py-10 text-[#1a120f] sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1320px]">
        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#99041e]">Branch locator</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Find your Maeme&apos;s</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#6b5b55]">
            Search by postcode or city, choose your nearest branch, then start a delivery or collection order.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
          <section className="min-w-0">
            <label className="mb-5 flex min-h-14 items-center gap-3 rounded-2xl border border-[#f0d59d] bg-white px-4 shadow-[0_14px_38px_rgba(50,24,16,0.08)]">
              <Search size={19} className="text-[#99041e]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search postcode or city"
                className="w-full bg-transparent text-sm font-semibold outline-none"
              />
            </label>

            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-black text-[#99041e]">{branches.length} branch{branches.length === 1 ? '' : 'es'} found</p>
              <p className="text-xs font-semibold text-[#6b5b55]">Delivery and collection available at most stores</p>
            </div>

            <div className="space-y-4">
              {branches.map((branch) => {
                const open = branch.isOpen !== false;
                return (
                  <article key={branch.branchId} className="rounded-[24px] border border-[#f0d59d] bg-white p-5 shadow-[0_14px_38px_rgba(50,24,16,0.08)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-2xl font-black">{branch.branchName}</h2>
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${open ? 'bg-[#e8f5ed] text-[#126336]' : 'bg-[#f8e7e7] text-[#99041e]'}`}>
                            {open ? 'Open now' : 'Closed'}
                          </span>
                        </div>
                        <p className="mt-3 flex gap-2 text-sm leading-6 text-[#6b5b55]"><MapPin size={17} className="mt-0.5 shrink-0 text-[#99041e]" /> {branch.address}, {branch.postcode}</p>
                        <p className="mt-2 flex gap-2 text-sm font-semibold text-[#6b5b55]"><Phone size={17} className="shrink-0 text-[#99041e]" /> {branch.phone}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 rounded-2xl bg-[#fff8ed] p-4 text-sm md:grid-cols-2">
                      <Info label="Opening hours" value={todayHours(branch)} />
                      <Info label="Delivery hours" value={branch.deliveryTime || '35-45 min'} />
                      <Info label="Collection hours" value={branch.pickupTime || '15-20 min'} />
                      <Info label="Minimum order" value={`£${branch.minDeliveryAmount.toFixed(2)} · Delivery £${branch.deliveryFee.toFixed(2)}`} />
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${branch.address} ${branch.postcode}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#f0d59d] bg-white px-5 py-3 text-sm font-black text-[#99041e]"
                      >
                        <Navigation size={17} />
                        Directions
                      </a>
                      <button
                        onClick={() => handleOrder(branch)}
                        disabled={!open}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#ffc257] px-5 py-3 text-sm font-black text-[#1a120f] transition hover:bg-[#e5a93e] disabled:cursor-not-allowed disabled:bg-[#ead8c6] disabled:text-[#8a7d74]"
                      >
                        <ShoppingBag size={17} />
                        Order
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="sticky top-28 h-max min-h-[580px] overflow-hidden rounded-[28px] border border-[#f0d59d] bg-[#99041e] p-5 text-white shadow-[0_24px_70px_rgba(153,4,30,0.18)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffc257]">Map preview</p>
                <h2 className="mt-2 text-3xl font-black">Maeme&apos;s near you</h2>
              </div>
              <MapPin size={36} className="text-[#ffc257]" />
            </div>
            <div className="relative mt-6 grid min-h-[455px] place-items-center overflow-hidden rounded-[24px] border border-white/20 bg-white/10 p-6 text-center">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '46px 46px' }} />
              <div className="relative z-10 max-w-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ffc257] text-[#99041e] shadow-xl">
                  <MapPin size={42} />
                </div>
                <p className="mt-5 text-xl font-black">Interactive map placeholder</p>
                <p className="mt-2 text-sm leading-6 text-white/78">
                  Connect Google Maps or Mapbox when live geocoding is ready. Branch cards already include address and direction links.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <Clock size={16} className="mt-0.5 shrink-0 text-[#99041e]" />
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#99041e]">{label}</p>
        <p className="mt-1 font-semibold text-[#1a120f]">{value}</p>
      </div>
    </div>
  );
}
