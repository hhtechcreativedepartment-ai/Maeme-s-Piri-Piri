import { Heart, Plus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  name: string;
  description: string;
  image: string;
  price: number;
  kcal?: number;
  popular?: boolean;
  className?: string;
}

export function ProductCard({ className, description, image, kcal, name, popular, price }: ProductCardProps) {
  return (
    <article
      className={cn(
        'overflow-hidden rounded-[20px] border border-[#f0d59d]/70 bg-white shadow-[0_18px_50px_rgba(50,24,16,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(50,24,16,0.14)]',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#fff8ed]">
        <img src={image} alt={name} className="h-full w-full object-cover" />
        {popular && (
          <span className="absolute left-4 top-4 rounded-full bg-[#ffc257] px-3 py-1 text-xs font-black text-[#1a120f]">
            Popular
          </span>
        )}
        <button className="absolute right-4 top-4 rounded-full bg-white/95 p-2 text-[#99041e] shadow-sm" aria-label={`Save ${name}`}>
          <Heart size={18} />
        </button>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-lg font-black leading-tight text-[#1a120f]">{name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6b5b55]">{description}</p>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-[#ead8c6] pt-4">
          <div>
            {kcal && <p className="text-xs font-bold text-[#8b7a73]">{kcal} kcal</p>}
            <p className="text-lg font-black text-[#99041e]">{formatCurrency(price)}</p>
          </div>
          <Button variant="primary" className="h-11 min-h-0 w-11 rounded-[14px] p-0" aria-label={`Add ${name}`}>
            <Plus size={20} />
          </Button>
        </div>
      </div>
    </article>
  );
}
