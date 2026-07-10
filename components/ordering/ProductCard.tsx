'use client';

import { MouseEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { MenuItem } from '@/lib/menuData';
import { useAuth } from '@/lib/authContext';
import { useFavourites } from '@/lib/favouritesContext';

interface ProductCardProps {
  product: MenuItem;
  onAdd: (product: MenuItem) => void;
  onFavourite?: (product: MenuItem) => void;
}

const CATEGORIES_WITHOUT_DESCRIPTION = new Set([
  'dessert-collection',
  'sides-collection',
  'maemes-extras',
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

  useEffect(() => {
    if (!user || isLoading) return;

    const pending = localStorage.getItem(PENDING_FAVOURITE_KEY);
    if (!pending || pending !== productId) return;

    addFavourite(toFavouriteItem(product));
    localStorage.removeItem(PENDING_FAVOURITE_KEY);
  }, [addFavourite, isLoading, product, productId, user]);

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

  return (
    <article className="group relative flex min-h-[160px] items-center gap-4 overflow-hidden rounded-[18px] border border-[#f0d59d]/80 bg-white p-4 shadow-[0_8px_24px_rgba(50,24,16,0.045)] transition hover:-translate-y-0.5 hover:border-[#ead8c6] hover:shadow-[0_14px_34px_rgba(50,24,16,0.075)]">
      <div className="relative h-[120px] w-[120px] shrink-0 self-center overflow-hidden rounded-[14px] bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
        />
        {product.popular && (
          <span className="absolute left-2 top-2 rounded-full bg-[#ffc257] px-2.5 py-1 text-[10px] font-black leading-none text-[#1a120f] shadow-sm">
            Popular
          </span>
        )}
      </div>

      <div className="relative flex min-h-[120px] min-w-0 flex-1 flex-col justify-between gap-2 py-0">
        <button
          onClick={handleFavouriteClick}
          className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[#f0d59d] bg-white text-[#99041e] transition hover:bg-[#fff8ed]"
          aria-label={isSaved ? `Remove ${product.name} from favourites` : `Save ${product.name}`}
          aria-pressed={isSaved}
        >
          <Heart size={15} className={isSaved ? 'fill-[#99041e] text-[#99041e]' : 'fill-transparent text-[#99041e]'} />
        </button>

        <div className="min-w-0 pr-9">
          <h3 className="line-clamp-2 text-[15px] font-black leading-[1.18] text-[#1a120f]">{product.name}</h3>
          {showDescription && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-[1.45] text-[#6b5b55]">{product.description}</p>
          )}
          <p className={`${showDescription ? 'mt-2' : 'mt-3'} text-[11px] font-bold uppercase tracking-[0.08em] text-[#8a7a6a]`}>
            {product.kcal} kcal
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <p className="min-w-0 text-[15px] font-black leading-none text-[#99041e]">
            £{product.price.toFixed(2)}
          </p>
          <button
            onClick={() => onAdd(product)}
            className="inline-flex h-[42px] shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#99041e] px-[18px] text-xs font-black text-white shadow-sm transition hover:bg-[#7f0318]"
            aria-label={`Add ${product.name}`}
          >
            + Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
