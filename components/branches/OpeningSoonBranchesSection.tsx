'use client';

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ArrowRight, CalendarDays, MapPin, Search, Store, X } from 'lucide-react';
import {
  formatUpcomingBranchStatus,
  filterUpcomingBranches,
  getUpcomingBranches,
  type UpcomingBranch,
} from '@/lib/branchData';

const PAGE_SIZE = 24;
const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function OpeningSoonBranchesSection({
  branches,
  currentDate = new Date(),
}: {
  branches: UpcomingBranch[];
  currentDate?: Date;
}) {
  const upcomingBranches = useMemo(
    () => getUpcomingBranches(branches, currentDate),
    [branches, currentDate],
  );
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  if (upcomingBranches.length === 0) return null;

  return (
    <section className="mb-7" aria-labelledby="opening-soon-summary-heading">
      <div className="relative overflow-hidden rounded-[22px] border border-[#E8CCBA] bg-white px-5 py-5 shadow-[0_14px_38px_rgba(74,32,20,0.055)] sm:px-6 sm:py-6">
        <span className="absolute inset-y-0 left-0 w-1 bg-[#FFC257]" aria-hidden="true" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF2D5] text-[#99041E]">
              <Store size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#99041E]">Coming to your area</p>
              <h2 id="opening-soon-summary-heading" className="mt-1 text-2xl font-black tracking-[-0.025em] text-[#351817]">
                Opening Soon
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-[#715D57]">
                More Maeme&apos;s locations are on the way. <strong className="font-black text-[#99041E]">{formatLocationCount(upcomingBranches.length)}</strong>
              </p>
            </div>
          </div>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#99041E] px-5 text-sm font-black text-white shadow-[0_10px_24px_rgba(153,4,30,0.16)] transition hover:bg-[#7D0318] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC257]/55 sm:w-auto"
          >
            View All Opening Soon Branches <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>

      {isOpen && (
        <OpeningSoonBranchesModal
          branches={upcomingBranches}
          currentDate={currentDate}
          onClose={() => setIsOpen(false)}
          returnFocusRef={triggerRef}
        />
      )}
    </section>
  );
}

function OpeningSoonBranchesModal({
  branches,
  currentDate,
  onClose,
  returnFocusRef,
}: {
  branches: UpcomingBranch[];
  currentDate: Date;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(query);
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredBranches = useMemo(
    () => filterUpcomingBranches(branches, deferredQuery),
    [branches, deferredQuery],
  );
  const visibleBranches = filteredBranches.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBranches.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [deferredQuery]);

  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const previousStyles = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    searchRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      body.style.position = previousStyles.position;
      body.style.top = previousStyles.top;
      body.style.width = previousStyles.width;
      body.style.overflow = previousStyles.overflow;
      window.scrollTo(0, scrollY);
      returnFocusRef.current?.focus();
    };
  }, [onClose, returnFocusRef]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#351817]/48 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="opening-soon-modal-title"
        aria-describedby="opening-soon-modal-description"
        className="flex h-[94dvh] w-full flex-col overflow-hidden rounded-t-[26px] border border-[#E8CCBA] bg-[#FFFBF7] shadow-[0_30px_90px_rgba(53,24,23,0.28)] sm:h-auto sm:max-h-[86dvh] sm:max-w-[860px] sm:rounded-[26px]"
      >
        <header className="z-10 shrink-0 border-b border-[#EEDFD5] bg-white px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#99041E]">Upcoming locations</p>
              <h2 id="opening-soon-modal-title" className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#351817] sm:text-3xl">
                Opening Soon
              </h2>
              <p id="opening-soon-modal-description" className="mt-1 text-sm leading-5 text-[#715D57]">
                Explore the Maeme&apos;s branches coming soon near you. <span className="font-bold text-[#99041E]">{formatLocationCount(branches.length)}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close opening soon branches"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E8D2C4] bg-white text-[#99041E] transition hover:bg-[#FFF3E8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC257]/55"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <label className="relative mt-4 block">
            <span className="sr-only">Search upcoming branches by town, city or postcode</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99041E]" size={18} aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by town, city or postcode"
              className="min-h-12 w-full rounded-xl border border-[#E5CBBB] bg-[#FFFDF9] pl-11 pr-12 text-sm font-semibold text-[#351817] outline-none transition placeholder:text-[#9D8981] focus:border-[#99041E] focus:ring-4 focus:ring-[#99041E]/8"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear upcoming branch search"
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#806B64] hover:bg-[#FFF2E7] hover:text-[#99041E]"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </label>

          <p className="mt-3 text-xs font-bold text-[#715D57]" role="status" aria-live="polite">
            {filteredBranches.length} location{filteredBranches.length === 1 ? '' : 's'} found
          </p>
        </header>

        <div className="min-h-0 flex-1 overscroll-contain overflow-y-auto px-4 py-2 [-webkit-overflow-scrolling:touch] sm:px-6 sm:py-3">
          {filteredBranches.length === 0 ? (
            <div className="grid min-h-64 place-items-center text-center" role="status">
              <div>
                <Search className="mx-auto text-[#99041E]" size={28} aria-hidden="true" />
                <h3 className="mt-3 text-lg font-black text-[#351817]">No upcoming branches match your search.</h3>
                <button type="button" onClick={() => setQuery('')} className="mt-4 min-h-11 rounded-xl border border-[#E4C7B5] bg-white px-5 text-sm font-black text-[#99041E] hover:bg-[#FFF4EA]">
                  Clear search
                </button>
              </div>
            </div>
          ) : (
            <div role="list">
              {visibleBranches.map((branch) => (
                <UpcomingBranchRow key={branch.branchId} branch={branch} currentDate={currentDate} />
              ))}
              {hasMore && (
                <div className="flex justify-center border-t border-[#EEDFD5] py-4">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                    className="min-h-11 rounded-xl border border-[#E4C7B5] bg-white px-5 text-sm font-black text-[#99041E] transition hover:bg-[#FFF4EA] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC257]/45"
                  >
                    Load more locations
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UpcomingBranchRow({ branch, currentDate }: { branch: UpcomingBranch; currentDate: Date }) {
  const statusLabel = formatUpcomingBranchStatus(branch, currentDate);
  const confirmedLocation = [branch.address, branch.postcode].filter(Boolean).join(', ');
  const fallbackLocation = [branch.townOrCity, branch.country].filter(Boolean).join(', ');

  return (
    <article
      role="listitem"
      aria-label={`${branch.branchName}, ${statusLabel.toLowerCase()}, not currently available for ordering.`}
      className="flex min-h-[88px] flex-col gap-3 border-b border-[#EEDFD5] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF2D5] text-[#99041E]">
          <MapPin size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-black tracking-[-0.015em] text-[#351817]">{branch.branchName}</h3>
          <p className="mt-1 text-sm leading-5 text-[#715D57]">{confirmedLocation || fallbackLocation}</p>
        </div>
      </div>
      <span className="inline-flex min-h-8 w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#FFF2D5] px-3 py-1.5 text-[11px] font-black text-[#99041E]">
        <CalendarDays size={14} aria-hidden="true" /> {statusLabel}
      </span>
      <span className="sr-only">Not currently available for ordering.</span>
    </article>
  );
}

function formatLocationCount(count: number): string {
  return `${count} upcoming location${count === 1 ? '' : 's'}`;
}
