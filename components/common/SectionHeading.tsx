import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({ action, className, subtitle, title }: SectionHeadingProps) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="max-w-2xl">
        <h2 className="text-3xl font-black leading-tight tracking-tight text-[#1a120f] sm:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-3 text-base leading-7 text-[#6b5b55]">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
