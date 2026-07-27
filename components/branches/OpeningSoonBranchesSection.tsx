import { CalendarDays, MapPin, Store } from 'lucide-react';
import {
  formatUpcomingBranchStatus,
  getUpcomingBranches,
  type UpcomingBranch,
} from '@/lib/branchData';

export default function OpeningSoonBranchesSection({
  branches,
  currentDate = new Date(),
}: {
  branches: UpcomingBranch[];
  currentDate?: Date;
}) {
  const upcomingBranches = getUpcomingBranches(branches, currentDate);

  if (upcomingBranches.length === 0) return null;

  return (
    <section className="mb-8" aria-labelledby="opening-soon-heading">
      <div className="mb-4 sm:flex sm:items-end sm:justify-between sm:gap-8">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#99041E]">Coming to your area</p>
          <h2 id="opening-soon-heading" className="mt-1.5 text-2xl font-black tracking-[-0.025em] text-[#351817] sm:text-3xl">
            Opening Soon
          </h2>
        </div>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#715D57] sm:mt-0 sm:text-right">
          New Maeme&apos;s branches are on the way. Explore the locations opening soon near you.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4" role="list">
        {upcomingBranches.slice(0, 6).map((branch) => (
          <UpcomingBranchCard key={branch.branchId} branch={branch} currentDate={currentDate} />
        ))}
      </div>
    </section>
  );
}

function UpcomingBranchCard({ branch, currentDate }: { branch: UpcomingBranch; currentDate: Date }) {
  const statusLabel = formatUpcomingBranchStatus(branch, currentDate);
  const confirmedLocation = [branch.address, branch.postcode].filter(Boolean).join(', ');

  return (
    <article
      role="listitem"
      aria-label={`${branch.branchName}, ${statusLabel.toLowerCase()}, not currently available for ordering.`}
      className="relative flex min-h-[150px] flex-col overflow-hidden rounded-[20px] border border-[#E9D3C5] bg-white p-4 shadow-[0_12px_34px_rgba(74,32,20,0.05)] transition duration-200 motion-reduce:transition-none sm:p-5 sm:hover:-translate-y-0.5 sm:hover:border-[#99041E]/30 sm:hover:shadow-[0_18px_42px_rgba(74,32,20,0.085)]"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-[#FFC257]" aria-hidden="true" />
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF2D5] text-[#99041E]">
          <Store size={19} aria-hidden="true" />
        </span>
        <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-[#FFF2D5] px-3 py-1.5 text-[11px] font-black text-[#99041E]">
          <CalendarDays size={14} aria-hidden="true" />
          {statusLabel}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-black tracking-[-0.02em] text-[#351817]">{branch.branchName}</h3>
        <p className="mt-1.5 flex items-start gap-2 text-sm leading-5 text-[#715D57]">
          <MapPin size={15} className="mt-0.5 shrink-0 text-[#99041E]" aria-hidden="true" />
          <span>{confirmedLocation || [branch.townOrCity, branch.country].filter(Boolean).join(', ')}</span>
        </p>
      </div>

      <p className="sr-only">This future branch is not currently available for ordering.</p>
    </article>
  );
}
