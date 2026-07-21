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
  isSelected?: boolean;
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

export default function ProductCard({ product, onAdd, onFavourite, isSelected = false }: ProductCardProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { addFavourite, removeFavourite, isFavourite } = useFavourites();
  const productId = String(product.id);
  const isSaved = isFavourite(productId);
  const showDescription = !CATEGORIES_WITHOUT_DESCRIPTION.has(categorySlug(product.category));
  const [selectedQuickOptionIds, setSelectedQuickOptionIds] = useState<string[]>([]);
  const selectedQuickOptions = product.quickAddOptions?.filter((option) => selectedQuickOptionIds.includes(option.id)) || [];
  const displayedPrice = product.price + selectedQuickOptions.reduce((total, option) => total + option.price, 0);
  const isUnavailable = product.available === false;

  useEffect(() => {
    if (!user || isLoading) return;

    const pending = localStorage.getItem(PENDING_FAVOURITE_KEY);
    if (!pending || pending !== productId) return;

    addFavourite(toFavouriteItem(product));
    localStorage.removeItem(PENDING_FAVOURITE_KEY);
  }, [addFavourite, isLoading, product, productId, user]);

  const orderProduct = () => {
    if (!isUnavailable) onAdd(product, selectedQuickOptions);
  };

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
      tabIndex={isUnavailable ? -1 : 0}
      aria-label={`Order ${product.name}`}
      aria-disabled={isUnavailable}
      data-selected={isSelected}
      data-unavailable={isUnavailable}
      onClick={orderProduct}
      onKeyDown={handleCardKeyDown}
      className="menu-product-card group relative flex h-full min-h-[160px] cursor-pointer flex-row items-stretch gap-4 overflow-hidden rounded-[18px] border-2 border-transparent bg-white p-4 shadow-[0_6px_20px_rgba(50,24,16,0.05)] sm:min-h-[470px] sm:flex-col sm:gap-0 sm:rounded-lg sm:p-0"
    >
      <div className="relative h-[120px] w-[120px] shrink-0 self-center overflow-hidden rounded-[14px] bg-white sm:aspect-square sm:h-auto sm:w-full sm:self-auto sm:rounded-none">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 639px) 120px, (max-width: 1279px) 50vw, 310px"
          className="menu-product-card-image object-contain p-2 sm:p-6"
        />
        {product.popular && (
          <span className="absolute right-3 top-3 rounded-full bg-[#ffc257] px-3 py-1.5 text-[10px] font-black leading-none text-[#99041e] shadow-sm">
            Popular
          </span>
        )}
      </div>

      <div className="flex min-h-[120px] min-w-0 flex-1 flex-col py-0 sm:min-h-0 sm:px-5 sm:pb-5 sm:pt-3">
        <button
          type="button"
          onClick={handleFavouriteClick}
          className="absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#f0d59d] bg-white text-[#99041e] shadow-sm transition hover:bg-[#fff8ed] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60 sm:left-4 sm:top-4 sm:h-9 sm:w-9"
          aria-label={isSaved ? `Remove ${product.name} from favourites` : `Save ${product.name}`}
          aria-pressed={isSaved}
        >
          <Heart size={17} className={isSaved ? 'fill-[#99041e] text-[#99041e]' : 'fill-transparent text-[#99041e]'} />
        </button>

        <div className="min-w-0">
          <h3 className="line-clamp-2 pr-1 text-[15px] font-black leading-[1.18] text-[#99041e] sm:text-lg sm:leading-tight">{product.name}</h3>
          {product.servingInfo && (
            <p className="mt-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#99041e]">{product.servingInfo}</p>
          )}
          {product.sizeInfo && (
            <p className="mt-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#99041e]">{product.sizeInfo}</p>
          )}
        </div>

        {showDescription && product.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-[1.45] text-[#6b5b55] sm:mt-3 sm:line-clamp-3 sm:text-sm sm:leading-6">{product.description}</p>
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
              className={`mt-2 w-fit rounded-full border px-2.5 py-1 text-[10px] font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60 sm:mt-3 sm:px-3 sm:py-1.5 sm:text-[11px] ${
                selected
                  ? 'border-[#99041e] bg-[#99041e] text-white'
                  : 'border-[#ead8c6] bg-[#fff8ed] text-[#99041e] hover:border-[#99041e]'
              }`}
            >
              {option.name} +£{option.price.toFixed(2)}
            </button>
          );
        })}

        <div className="mt-auto border-t border-[#f0d59d]/70 pt-2 sm:pt-4">
          <div className="flex min-w-0 items-end justify-between gap-3">
            <p className="text-[15px] font-black leading-none text-[#99041e] sm:text-xl">£{displayedPrice.toFixed(2)}</p>
            <p className="text-right text-[10px] font-semibold text-[#6b5b55] sm:text-xs">
              {product.kcal != null ? `${product.kcal} kcal` : 'kcal unavailable'}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
