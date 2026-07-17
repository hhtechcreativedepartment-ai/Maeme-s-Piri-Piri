'use client';

import { forwardRef, useMemo, useRef, useState } from 'react';
import {
  Clock3,
  Crosshair,
  MapPin,
  Minus,
  Navigation,
  Phone,
  Search,
  Settings2,
  ShoppingBag,
  Store,
  Truck,
  X,
  ZoomIn,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRANCHES, Branch, formatBranchDisplay } from '@/lib/branchData';
import { useCart } from '@/lib/cartContext';

type StoreStatus = 'open' | 'opening' | 'closing' | 'closed';
type ViewMode = 'list' | 'map';

const statusOptions: { id: StoreStatus; label: string; dot: string }[] = [
  { id: 'open', label: 'Open now', dot: 'bg-[#239653]' },
  { id: 'opening', label: 'Opening soon', dot: 'bg-[#F2B134]' },
  { id: 'closing', label: 'Closing soon', dot: 'bg-[#E86919]' },
  { id: 'closed', label: 'Closed', dot: 'bg-[#99041E]' },
];

const pinPositions: Record<string, { left: string; top: string; area: string }> = {
  'maemes-southall': { left: '28%', top: '34%', area: 'Southall' },
  'maemes-watford': { left: '72%', top: '25%', area: 'Watford' },
  'maemes-dalston': { left: '82%', top: '38%', area: 'Dalston' },
  'maemes-eastcote': { left: '31%', top: '16%', area: 'Eastcote' },
  'maemes-croydon': { left: '79%', top: '67%', area: 'Croydon' },
  'maemes-aldershot': { left: '22%', top: '76%', area: 'Aldershot' },
};

function getStatus(branch: Branch): StoreStatus {
  return branch.isOpen === false ? 'closed' : 'open';
}

function todayHours(branch: Branch) {
  return formatBranchDisplay(branch).replace('Open: ', '');
}

export default function BranchesPage() {
  const router = useRouter();
  const { selectBranch } = useCart();
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const [query, setQuery] = useState('');
  const [activeStatuses, setActiveStatuses] = useState<StoreStatus[]>(['open', 'opening', 'closing', 'closed']);
  const [selectedId, setSelectedId] = useState(BRANCHES[0].branchId);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [zoom, setZoom] = useState(1);
  const [mapChanged, setMapChanged] = useState(false);

  const visibleBranches = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    return BRANCHES.filter((branch) => {
      const matchesStatus = activeStatuses.includes(getStatus(branch));
      const matchesQuery = !normalised || [branch.branchName, branch.address, branch.postcode, branch.phone || '']
        .join(' ')
        .toLowerCase()
        .includes(normalised);
      return matchesStatus && matchesQuery;
    });
  }, [activeStatuses, query]);

  const selectedBranch = visibleBranches.find((branch) => branch.branchId === selectedId) || visibleBranches[0] || null;
  const deliveringNow = visibleBranches.filter((branch) => branch.isOpen !== false && branch.deliveryAvailable).length;
  const averageDelivery = visibleBranches.length
    ? Math.round(visibleBranches.reduce((sum, branch) => sum + deliveryMidpoint(branch.deliveryTime), 0) / visibleBranches.length)
    : 0;
  const minimumOrder = visibleBranches.length ? Math.min(...visibleBranches.map((branch) => branch.minDeliveryAmount)) : 0;

  const toggleStatus = (status: StoreStatus) => {
    setActiveStatuses((current) => current.includes(status)
      ? current.filter((item) => item !== status)
      : [...current, status]);
  };

  const activateBranch = (branch: Branch, scroll = false) => {
    setSelectedId(branch.branchId);
    if (scroll) {
      setViewMode('list');
      window.setTimeout(() => cardRefs.current[branch.branchId]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
    }
  };

  const handleOrder = (branch: Branch) => {
    if (branch.isOpen === false) return;
    const orderType = branch.deliveryAvailable ? 'delivery' : 'pickup';
    selectBranch(branch.branchId, orderType);
    router.push('/menu');
  };

  const changeZoom = (next: number) => {
    setZoom(Math.min(1.18, Math.max(0.9, next)));
    setMapChanged(true);
  };

  return (
    <main className="min-h-screen bg-[#FFF9F1] text-[#351817]">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#99041E]">Branch locator</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Find your Maeme&apos;s</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#715D57] sm:text-base sm:leading-7">
            Search by postcode or city, choose your nearest branch, then start a delivery or collection order.
          </p>
        </header>

        <div className="mb-6 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)] lg:gap-7">
          <StoreSearch query={query} onQueryChange={setQuery} />
          <StatusFilters activeStatuses={activeStatuses} onToggle={toggleStatus} />
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-2xl border border-[#EBCFBC] bg-white p-1.5 shadow-sm lg:hidden">
          {(['list', 'map'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              aria-pressed={viewMode === mode}
              className={`rounded-xl px-4 py-3 text-sm font-black capitalize transition ${
                viewMode === mode ? 'bg-[#99041E] text-white' : 'text-[#765B52]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="grid min-w-0 items-start gap-7 lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)]">
          <section className={`${viewMode === 'map' ? 'hidden lg:block' : 'block'} min-w-0`} aria-label="Branch results">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-black text-[#351817]">{visibleBranches.length} branch{visibleBranches.length === 1 ? '' : 'es'} found</p>
              <p className="text-xs font-semibold text-[#806B64]">Delivery and collection available at most stores</p>
            </div>

            {visibleBranches.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-[#E1BFA9] bg-white px-6 py-14 text-center">
                <Search className="mx-auto text-[#99041E]" size={30} />
                <h2 className="mt-4 text-xl font-black">No branches found</h2>
                <p className="mt-2 text-sm text-[#715D57]">Try another postcode, city, branch name or status.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleBranches.map((branch) => (
                  <StoreCard
                    key={branch.branchId}
                    ref={(node) => { cardRefs.current[branch.branchId] = node; }}
                    branch={branch}
                    number={BRANCHES.findIndex((item) => item.branchId === branch.branchId) + 1}
                    selected={selectedBranch?.branchId === branch.branchId}
                    onActivate={() => activateBranch(branch)}
                    onOrder={() => handleOrder(branch)}
                  />
                ))}
              </div>
            )}
          </section>

          <aside className={`${viewMode === 'list' ? 'hidden lg:block' : 'block'} sticky top-24 min-w-0`}>
            <StoresMap
              branches={visibleBranches}
              selectedId={selectedBranch?.branchId || ''}
              zoom={zoom}
              mapChanged={mapChanged}
              onSelect={(branch) => activateBranch(branch, true)}
              onZoom={changeZoom}
              onResetArea={() => setMapChanged(false)}
            />
            <MapSummary total={visibleBranches.length} delivering={deliveringNow} averageDelivery={averageDelivery} minimumOrder={minimumOrder} />
            <QuickJump
              branches={visibleBranches}
              selectedId={selectedBranch?.branchId || ''}
              onSelect={(branch) => activateBranch(branch, true)}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function StoreSearch({ query, onQueryChange }: { query: string; onQueryChange: (value: string) => void }) {
  return (
    <div className="flex min-w-0 gap-3">
      <label className="relative flex min-h-14 min-w-0 flex-1 items-center rounded-2xl border border-[#EBCFBC] bg-white shadow-[0_12px_34px_rgba(86,34,25,0.06)] focus-within:border-[#99041E] focus-within:ring-4 focus-within:ring-[#99041E]/10">
        <Search className="absolute left-4 text-[#99041E]" size={19} />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search postcode or city"
          aria-label="Search branches by postcode or city"
          className="h-full w-full rounded-2xl bg-transparent pl-12 pr-11 text-sm font-semibold outline-none placeholder:text-[#A38D84]"
        />
        {query && (
          <button type="button" onClick={() => onQueryChange('')} aria-label="Clear branch search" className="absolute right-3 rounded-lg p-2 text-[#806B64] transition hover:bg-[#FFF2E7] hover:text-[#99041E]">
            <X size={17} />
          </button>
        )}
      </label>
      <button type="button" aria-label="Branch filter settings" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#EBCFBC] bg-white text-[#99041E] shadow-sm transition hover:-translate-y-0.5 hover:border-[#99041E]/35">
        <Settings2 size={20} />
      </button>
    </div>
  );
}

function StatusFilters({ activeStatuses, onToggle }: { activeStatuses: StoreStatus[]; onToggle: (status: StoreStatus) => void }) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#EBCFBC] bg-white shadow-[0_12px_34px_rgba(86,34,25,0.05)] sm:grid-cols-4" aria-label="Filter branches by status">
      {statusOptions.map((status) => {
        const active = activeStatuses.includes(status.id);
        return (
          <button
            key={status.id}
            type="button"
            onClick={() => onToggle(status.id)}
            aria-pressed={active}
            className={`flex min-h-14 min-w-0 items-center justify-center gap-2 border-[#F0DED2] px-2 text-[11px] font-black transition sm:border-l sm:px-3 sm:text-xs ${
              active ? 'bg-[#FFF9F1] text-[#351817]' : 'bg-white text-[#9D8981] opacity-65'
            }`}
          >
            <span className={`h-3 w-3 rounded-full ${status.dot} ${active ? 'ring-4 ring-current/10' : ''}`} />
            {status.label}
          </button>
        );
      })}
    </div>
  );
}

const StoreCard = forwardRef<HTMLElement, {
  branch: Branch;
  number: number;
  selected: boolean;
  onActivate: () => void;
  onOrder: () => void;
}>(function StoreCard({ branch, number, selected, onActivate, onOrder }, ref) {
  const closed = branch.isOpen === false;
  return (
    <article
      ref={ref}
      tabIndex={0}
      onClick={onActivate}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onActivate();
        }
      }}
      aria-label={`${branch.branchName}, ${closed ? 'closed' : 'open now'}`}
      className={`relative cursor-pointer rounded-[22px] border bg-white p-5 shadow-[0_14px_40px_rgba(74,32,20,0.065)] outline-none transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(74,32,20,0.10)] focus-visible:ring-4 focus-visible:ring-[#FFC257]/45 ${
        selected ? 'border-[#99041E]/50 ring-2 ring-[#99041E]/8' : 'border-[#E9CDBA]'
      }`}
    >
      <span className="absolute -left-3 top-5 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#FFF9F1] bg-[#99041E] text-xs font-black text-white shadow-md">{number}</span>
      <div className="pl-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-black tracking-[-0.025em] sm:text-2xl">{branch.branchName}</h2>
          <StoreStatusBadge closed={closed} />
        </div>
        <p className="mt-3 flex gap-2 text-sm leading-6 text-[#715D57]"><MapPin size={16} className="mt-1 shrink-0 text-[#99041E]" /> {branch.address}, {branch.postcode}</p>
        <a href={`tel:${branch.phone}`} onClick={(event) => event.stopPropagation()} className="mt-1.5 inline-flex items-center gap-2 text-sm font-semibold text-[#715D57] hover:text-[#99041E]"><Phone size={16} className="text-[#99041E]" /> {branch.phone}</a>
      </div>

      <StoreInfoGrid branch={branch} />

      <div className="mt-4 flex flex-wrap gap-3 pl-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${branch.address} ${branch.postcode}`)}`}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#E4C7B5] bg-white px-4 text-sm font-black text-[#99041E] transition hover:bg-[#FFF4EA] sm:flex-none"
        >
          <Navigation size={17} /> Directions
        </a>
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); onOrder(); }}
          disabled={closed}
          aria-disabled={closed}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#FFC257] px-5 text-sm font-black text-[#351817] shadow-sm transition hover:bg-[#F5AF34] active:translate-y-px disabled:cursor-not-allowed disabled:bg-[#E8DFD9] disabled:text-[#A3938B] sm:flex-none"
        >
          <ShoppingBag size={17} /> Order
        </button>
      </div>
    </article>
  );
});

function StoreStatusBadge({ closed }: { closed: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.04em] ${closed ? 'bg-[#F8E7E8] text-[#99041E]' : 'bg-[#E8F5ED] text-[#17673B]'}`}>
      <span className={`h-2 w-2 rounded-full ${closed ? 'bg-[#99041E]' : 'bg-[#239653]'}`} />
      {closed ? 'Closed' : 'Open now'}
    </span>
  );
}

function StoreInfoGrid({ branch }: { branch: Branch }) {
  const items = [
    { label: 'Opening hours', value: todayHours(branch), icon: Clock3 },
    { label: 'Delivery hours', value: branch.deliveryTime || 'Unavailable', icon: Truck },
    { label: 'Collection hours', value: branch.pickupTime || 'Unavailable', icon: ShoppingBag },
    { label: 'Minimum order', value: `£${branch.minDeliveryAmount.toFixed(2)} · Delivery £${branch.deliveryFee.toFixed(2)}`, icon: Store },
  ];
  return (
    <div className="mt-5 grid gap-x-4 gap-y-3 rounded-2xl bg-[#FFF8F2] p-4 sm:grid-cols-2">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex gap-2 border-b border-[#F0DED2] pb-3 last:border-0 sm:[&:nth-last-child(-n+2)]:border-0">
          <Icon size={16} className="mt-0.5 shrink-0 text-[#99041E]" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#99041E]">{label}</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-[#4D3530]">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StoresMap({
  branches,
  selectedId,
  zoom,
  mapChanged,
  onSelect,
  onZoom,
  onResetArea,
}: {
  branches: Branch[];
  selectedId: string;
  zoom: number;
  mapChanged: boolean;
  onSelect: (branch: Branch) => void;
  onZoom: (zoom: number) => void;
  onResetArea: () => void;
}) {
  const useLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(() => onResetArea(), () => undefined);
  };
  return (
    <div className="relative h-[500px] overflow-hidden rounded-t-[26px] border border-[#E6C9B6] bg-[#F2EEE3] shadow-[0_24px_64px_rgba(78,36,25,0.10)] sm:h-[620px] lg:h-[760px]" aria-label="Branch map">
      <div className="absolute inset-0 transition-transform duration-200" style={{ transform: `scale(${zoom})` }}>
        <div className="absolute inset-0 bg-[linear-gradient(28deg,transparent_47%,rgba(255,255,255,0.92)_48%,rgba(255,255,255,0.92)_51%,transparent_52%),linear-gradient(118deg,transparent_47%,rgba(255,255,255,0.78)_48%,rgba(255,255,255,0.78)_51%,transparent_52%),#EDF0E4] bg-[length:130px_130px,180px_180px,auto]" />
        <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_20%_25%,#D9E8CE_0_8%,transparent_9%),radial-gradient(circle_at_72%_62%,#D8E8CD_0_12%,transparent_13%),radial-gradient(circle_at_45%_80%,#DDEBD5_0_10%,transparent_11%)]" />
        {branches.map((branch) => {
          const position = pinPositions[branch.branchId] || { left: '50%', top: '50%', area: branch.postcode };
          const number = BRANCHES.findIndex((item) => item.branchId === branch.branchId) + 1;
          const selected = selectedId === branch.branchId;
          const closed = branch.isOpen === false;
          return (
            <button
              key={branch.branchId}
              type="button"
              onClick={() => onSelect(branch)}
              aria-label={`Select ${branch.branchName}`}
              style={{ left: position.left, top: position.top }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 text-center focus-visible:outline-none"
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white text-sm font-black text-white shadow-[0_8px_22px_rgba(70,24,17,0.24)] transition duration-200 ${closed ? 'bg-[#B9B3AF]' : selected ? 'scale-115 bg-[#99041E] ring-4 ring-[#FFC257]/35' : 'bg-[#C8102E] hover:scale-110'}`}>{number}</span>
              <span className="mt-1 block rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-black text-[#5C4841] backdrop-blur-sm">{position.area}</span>
            </button>
          );
        })}
      </div>

      {mapChanged && (
        <button type="button" onClick={onResetArea} className="absolute left-1/2 top-5 z-30 -translate-x-1/2 rounded-xl bg-[#99041E] px-5 py-3 text-xs font-black text-white shadow-lg transition hover:bg-[#7D0318]">
          Search this area
        </button>
      )}

      <div className="absolute bottom-5 right-4 z-30 grid overflow-hidden rounded-xl border border-[#E3D4C9] bg-white shadow-lg">
        <button type="button" onClick={() => onZoom(zoom + 0.08)} aria-label="Zoom map in" className="p-3 text-[#351817] hover:bg-[#FFF3E8]"><ZoomIn size={20} /></button>
        <button type="button" onClick={() => onZoom(zoom - 0.08)} aria-label="Zoom map out" className="border-t border-[#EEE1D8] p-3 text-[#351817] hover:bg-[#FFF3E8]"><Minus size={20} /></button>
        <button type="button" onClick={useLocation} aria-label="Use current location" className="border-t border-[#EEE1D8] p-3 text-[#99041E] hover:bg-[#FFF3E8]"><Crosshair size={20} /></button>
      </div>
    </div>
  );
}

function MapSummary({ total, delivering, averageDelivery, minimumOrder }: { total: number; delivering: number; averageDelivery: number; minimumOrder: number }) {
  const items = [
    { value: total, label: 'Total branches', icon: Store },
    { value: delivering, label: 'Delivering now', icon: Truck },
    { value: `${averageDelivery || '—'} min`, label: 'Avg. delivery time', icon: Clock3 },
    { value: minimumOrder ? `£${minimumOrder}` : '—', label: 'Min. order', icon: ShoppingBag },
  ];
  return (
    <div className="grid grid-cols-2 border-x border-b border-[#E6C9B6] bg-white sm:grid-cols-4">
      {items.map(({ value, label, icon: Icon }) => (
        <div key={label} className="flex items-center gap-3 border-b border-r border-[#F0DED2] p-4 last:border-r-0 sm:border-b-0">
          <Icon className="shrink-0 text-[#99041E]" size={25} />
          <div>
            <p className="text-lg font-black text-[#99041E]">{value}</p>
            <p className="text-[10px] font-bold text-[#806B64]">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickJump({ branches, selectedId, onSelect }: { branches: Branch[]; selectedId: string; onSelect: (branch: Branch) => void }) {
  return (
    <div className="rounded-b-[26px] border-x border-b border-[#E6C9B6] bg-white p-4 shadow-[0_20px_50px_rgba(78,36,25,0.08)]">
      <p className="text-xs font-black text-[#351817]">Quick jump</p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {branches.map((branch) => {
          const number = BRANCHES.findIndex((item) => item.branchId === branch.branchId) + 1;
          const active = selectedId === branch.branchId;
          return (
            <button key={branch.branchId} type="button" onClick={() => onSelect(branch)} className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-[10px] font-black transition ${active ? 'border-[#99041E] bg-[#FFF0EC] text-[#99041E]' : 'border-[#E7D4C7] bg-white text-[#59443D] hover:bg-[#FFF8F2]'}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] text-white ${branch.isOpen === false ? 'bg-[#B9B3AF]' : 'bg-[#99041E]'}`}>{number}</span>
              {branch.branchName.replace("Maeme's ", '')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function deliveryMidpoint(value?: string) {
  const values = value?.match(/\d+/g)?.map(Number) || [];
  if (!values.length) return 0;
  return values.length > 1 ? (values[0] + values[1]) / 2 : values[0];
}
