import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[#99041e] text-white shadow-[0_14px_32px_rgba(153,4,30,0.22)] hover:bg-[#7f0318]',
  secondary: 'bg-[#ffc257] text-[#1a120f] shadow-[0_14px_32px_rgba(255,194,87,0.24)] hover:bg-[#e5a93e]',
  outline: 'border border-[#f0d59d] bg-white text-[#99041e] hover:bg-[#fff8ed]',
  ghost: 'bg-transparent text-[#99041e] hover:bg-[#fff8ed]',
};

export function Button({ className, variant = 'primary', children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-[16px] px-5 py-3 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/35 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
