'use client';

import Image from 'next/image';
import { KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { MenuItem, MenuQuickAddOption } from '@/lib/menuData';
import { useAuth } from '@/lib/authContext';
import { useFavourites } from '@/lib/favouritesContext';

interface ProductCardProps {
  product: MenuItem;
  onAdd: (product: MenuItem, selectedOptions?: MenuQuickAddOption[]) => void;
  onFavourite?: (product: MenuItem) => void;
}

const CATEGORIES_WITHOUT_DESCRIPTION = new Set([
  'dessert-collection',
  'sides-and-extras',
  'ice-cream',
  'dips',
  'drinks',
]);

const PENDING_FAVOURITE_KEY = 'maemes_pending_favourite';

function categorySlug(value: string) {
  return value
    .toLowerCase()
    .replace(/(?:\u00e2\u20ac\u2122|\u00e2\u20ac\u02dc)/g, '')
    .replace(/[\u2018\u2019']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toFavouriteItem(product: MenuItem) {
  return {
    id: String(product.id),
    name: product.name,
    title: product.name,
    image: product.image,
    category: product.category,
    price: product.price,
    kcal: product.kcal,
    description: product.description || '',
  };
}

export default function ProductCard({ product, onAdd, onFavourite }: ProductCardProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { addFavourite, removeFavourite, isFavourite } = useFavourites();
  const productId = String(product.id);
  const isSaved = isFavourite(productId);
  const showDescription = !CATEGORIES_WITHOUT_DESCRIPTION.has(categorySlug(product.category));
  const [selectedQuickOptionIds, setSelectedQuickOptionIds] = useState<string[]>([]);
  const selectedQuickOptions = product.quickAddOptions?.filter((option) => selectedQuickOptionIds.includes(option.id)) || [];
  const displayedPrice = product.price + selectedQuickOptions.reduce((total, option) => total + option.price, 0);
  const isCompactMealPriceProduct = ['fried-wings', 'fried-chicken', 'fried-boneless'].includes(categorySlug(product.category));

  useEffect(() => {
    if (!user || isLoading) return;

    const pending = localStorage.getItem(PENDING_FAVOURITE_KEY);
    if (!pending || pending !== productId) return;

    addFavourite(toFavouriteItem(product));
    localStorage.removeItem(PENDING_FAVOURITE_KEY);
  }, [addFavourite, isLoading, product, productId, user]);

  const orderProduct = () => onAdd(product, selectedQuickOptions);

  const handleFavouriteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (onFavourite) {
      onFavourite(product);
      return;
    }

    if (!user) {
      localStorage.setItem(PENDING_FAVOURITE_KEY, productId);
      const redirect = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    if (isSaved) removeFavourite(productId);
    else addFavourite(toFavouriteItem(product));
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    orderProduct();
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Order ${product.name}`}
      onClick={orderProduct}
      onKeyDown={handleCardKeyDown}
      className="group relative flex h-full min-h-[430px] cursor-pointer flex-col overflow-hidden rounded-[20px] border border-[#f0d59d]/80 bg-white shadow-[0_8px_24px_rgba(50,24,16,0.045)] transition duration-200 hover:-translate-y-1 hover:border-[#ead8c6] hover:shadow-[0_16px_38px_rgba(50,24,16,0.09)] active:scale-[0.995] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/70"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden border-b border-[#f0d59d]/60 bg-[#fff8ed]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1279px) 50vw, 310px"
          className="object-contain p-5 transition duration-300 group-hover:scale-[1.035]"
        />
        {product.popular && (
          <span className="absolute left-3 top-3 rounded-full bg-[#ffc257] px-3 py-1.5 text-[10px] font-black leading-none text-[#99041e] shadow-sm">
            Popular
          </span>
        )}
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col p-5">
        <button
          type="button"
          onClick={handleFavouriteClick}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#f0d59d] bg-white text-[#99041e] shadow-sm transition hover:bg-[#fff8ed] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60"
          aria-label={isSaved ? `Remove ${product.name} from favourites` : `Save ${product.name}`}
          aria-pressed={isSaved}
        >
          <Heart size={17} className={isSaved ? 'fill-[#99041e] text-[#99041e]' : 'fill-transparent text-[#99041e]'} />
        </button>

        <div className="min-w-0 pr-11">
          <h3 className="line-clamp-2 text-lg font-black leading-tight text-[#99041e]">{product.name}</h3>
          {product.servingInfo && (
            <p className="mt-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#99041e]">{product.servingInfo}</p>
          )}
          {product.sizeInfo && (
            <p className="mt-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#99041e]">{product.sizeInfo}</p>
          )}
        </div>

        {showDescription && product.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6b5b55]">{product.description}</p>
        )}

        {product.quickAddOptions?.map((option) => {
          const selected = selectedQuickOptionIds.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedQuickOptionIds((current) => (
                  selected ? current.filter((id) => id !== option.id) : [...current, option.id]
                ));
              }}
              aria-pressed={selected}
              className={`mt-3 w-fit rounded-full border px-3 py-1.5 text-[11px] font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60 ${
                selected
                  ? 'border-[#99041e] bg-[#99041e] text-white'
                  : 'border-[#ead8c6] bg-[#fff8ed] text-[#99041e] hover:border-[#99041e]'
              }`}
            >
              {option.name} +£{option.price.toFixed(2)}
            </button>
          );
        })}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#f0d59d]/70 pt-4">
          <div className="min-w-0">
            <p className="text-xl font-black leading-none text-[#99041e]">£{displayedPrice.toFixed(2)}</p>
            {product.kcal != null && (
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#8a7a6a]">{product.kcal} kcal</p>
            )}
            {isCompactMealPriceProduct && product.mealTotalPrice !== undefined && (
              <p className="mt-1.5 text-xs font-black leading-none text-[#6b5b55]">Meal £{product.mealTotalPrice.toFixed(2)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              orderProduct();
            }}
            className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#99041e] px-4 text-xs font-black text-white shadow-sm transition hover:bg-[#7f0318] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60"
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
