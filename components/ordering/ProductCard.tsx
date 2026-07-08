'use client';

import { Heart, Plus } from 'lucide-react';
import { MenuItem } from '@/lib/menuData';

interface ProductCardProps {
  product: MenuItem;
  onAdd: (product: MenuItem) => void;
  onFavourite?: (product: MenuItem) => void;
}

export default function ProductCard({ product, onAdd, onFavourite }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#f0d59d]/80 bg-white shadow-[0_14px_40px_rgba(74,32,20,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(74,32,20,0.14)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#FFF7E1]">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {product.popular && (
          <span className="absolute left-3 top-3 rounded-full bg-[#ffc257] px-3 py-1 text-xs font-black text-[#1A1A1A]">Popular</span>
        )}
        {product.startingPrice && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-[#99041e] shadow-sm">
            Starting price
          </span>
        )}
        <button
          onClick={() => onFavourite?.(product)}
          className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-[#99041e] shadow-sm hover:bg-[#FFF7E1]"
          aria-label={`Save ${product.name}`}
        >
          <Heart size={18} />
        </button>
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <div className="flex-1">
          <h3 className="text-lg font-black leading-tight text-[#1A1A1A]">{product.name}</h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#666]">{product.description}</p>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-[#F3E5D4] pt-4">
          <div>
            <p className="text-xs font-bold text-[#8A7A6A]">{product.kcal} kcal</p>
            <p className="text-lg font-black text-[#99041e]">
              {product.startingPrice ? 'From ' : ''}£{product.price.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => onAdd(product)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#99041e] text-white shadow-sm hover:bg-[#7f0318]"
            aria-label={`Add ${product.name}`}
          >
            <Plus size={21} strokeWidth={2.7} />
          </button>
        </div>
      </div>
    </article>
  );
}
