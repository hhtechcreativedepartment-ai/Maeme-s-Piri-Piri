import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export function TextInput({ className, helperText, id, label, ...props }: TextInputProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-bold text-[#1a120f]">
          {label}
        </span>
      )}
      <input
        id={id}
        className={cn(
          'h-12 w-full rounded-[16px] border border-[#ead8c6] bg-white px-4 text-base text-[#1a120f] shadow-sm outline-none transition placeholder:text-[#8b7a73] focus:border-[#99041e] focus:ring-4 focus:ring-[#ffc257]/25',
          className,
        )}
        {...props}
      />
      {helperText && <span className="mt-2 block text-sm text-[#6b5b55]">{helperText}</span>}
    </label>
  );
}
