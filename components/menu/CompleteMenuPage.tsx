'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag, Store, Truck } from 'lucide-react';
import PremiumProductCustomizationModal from '@/components/modals/PremiumProductCustomizationModal';
import OrderTypeModal from '@/components/ordering/OrderTypeModal';
import ProductCard from '@/components/ordering/ProductCard';
import { MENU_DATA, MENU_CATEGORIES, MenuItem } from '@/lib/menuData';
import { useCart } from '@/lib/cartContext';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const DIRECT_ADD_CATEGORY_SLUGS = new Set([
  'dessert-collection',
  'sides-collection',
  'maemes-extras',
  'ice-cream',
  'dips',
  'drinks',
]);

export default function CompleteMenuPage() {
  const { items, selectedBranch, selectedOrderType, addToCart, updateQuantity } = useCart();
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0]);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<MenuItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [canScrollCategoryLeft, setCanScrollCategoryLeft] = useState(false);
  const [canScrollCategoryRight, setCanScrollCategoryRight] = useState(true);
  const categoryRailRef = useRef<HTMLDivElement>(null);

  const productsByCategory = useMemo(() => (
    MENU_CATEGORIES.map((category) => ({
      category,
      products: MENU_DATA.filter((product) => product.category === category),
    }))
  ), []);

  const isDirectAddProduct = (product: MenuItem) => DIRECT_ADD_CATEGORY_SLUGS.has(slugify(product.category));

  const openProductDetail = (product: MenuItem) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const addSimpleProductToCart = (product: MenuItem) => {
    const existingItem = items.find((item) => item.productId === product.id && !item.customization);

    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      addToCart({
        productId: product.id,
        quantity: 1,
        name: product.name,
        price: product.price,
        unitPrice: product.price,
        basePrice: product.price,
        totalPrice: product.price,
        image: product.image,
      });
    }

    handleProductAdded();
  };

  const handleAddProduct = (product: MenuItem) => {
    if (!selectedBranch || !selectedOrderType) {
      setPendingProduct(product);
      setShowOrderModal(true);
      return;
    }

    if (isDirectAddProduct(product)) {
      addSimpleProductToCart(product);
      return;
    }

    openProductDetail(product);
  };

  const handleOrderSetupSelected = () => {
    if (pendingProduct) {
      if (isDirectAddProduct(pendingProduct)) addSimpleProductToCart(pendingProduct);
      else openProductDetail(pendingProduct);
      setPendingProduct(null);
    }
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    document.getElementById(`category-${slugify(category)}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const scrollCategoryRail = (direction: 'left' | 'right') => {
    categoryRailRef.current?.scrollBy({
      left: direction === 'right' ? 320 : -320,
      behavior: 'smooth',
    });
    window.setTimeout(updateCategoryRailState, 260);
  };

  const updateCategoryRailState = () => {
    const rail = categoryRailRef.current;
    if (!rail) return;

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    setCanScrollCategoryLeft(rail.scrollLeft > 6);
    setCanScrollCategoryRight(rail.scrollLeft < maxScrollLeft - 6);
  };

  useEffect(() => {
    const rail = categoryRailRef.current;
    if (!rail) return;

    updateCategoryRailState();
    rail.addEventListener('scroll', updateCategoryRailState, { passive: true });
    window.addEventListener('resize', updateCategoryRailState);

    return () => {
      rail.removeEventListener('scroll', updateCategoryRailState);
      window.removeEventListener('resize', updateCategoryRailState);
    };
  }, []);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        const category = visibleEntry?.target.getAttribute('data-menu-section');
        if (category) setActiveCategory(category);
      },
      { rootMargin: '-190px 0px -55% 0px', threshold: [0.12, 0.28, 0.5] },
    );

    productsByCategory.forEach(({ category }) => {
      const section = document.getElementById(`category-${slugify(category)}`);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [productsByCategory]);

  const handleProductAdded = () => {
    setToast('Added to cart');
    window.setTimeout(() => setToast(null), 2600);
  };

  return (
    <main className="min-h-screen bg-[#fff8ed] pb-24 text-[#1a120f]">
      <section className="bg-[#99041e] py-12 text-white lg:py-16">
        <div className="page-container">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl">Menu</h1>
              <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-white/85 sm:text-lg">
                Freshly grilled, full of flavour, made your way.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[430px]">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Store size={20} className="text-[#ffc257]" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-white/65">Branch</p>
                    <p className="text-sm font-black">{selectedBranch ? selectedBranch.postcode : 'Select Location'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  {selectedOrderType === 'pickup' ? <ShoppingBag size={20} className="text-[#ffc257]" /> : <Truck size={20} className="text-[#ffc257]" />}
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-white/65">Order type</p>
                    <p className="text-sm font-black capitalize">{selectedOrderType || 'Delivery or Pickup'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="menu-category-carousel sticky top-20 z-[60] border-b border-[#f0d59d] bg-white/95 shadow-[0_12px_30px_rgba(50,24,16,0.06)] backdrop-blur">
        <div className="page-container flex items-center gap-3">
          <button
            onClick={() => scrollCategoryRail('left')}
            disabled={!canScrollCategoryLeft}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f0d59d] bg-[#fff8ed] text-[#99041e] transition hover:bg-[#ffc257] disabled:pointer-events-none disabled:opacity-35 md:flex"
            aria-label="Scroll categories left"
          >
            <ArrowLeft size={18} />
          </button>
          <div
            ref={categoryRailRef}
            className="flex flex-1 snap-x snap-mandatory gap-2 overflow-x-auto py-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {MENU_CATEGORIES.map((category) => (
              <button
                key={category}
                data-category={slugify(category)}
                onClick={() => handleCategoryClick(category)}
                className={`shrink-0 snap-start rounded-full border-2 px-4 py-2.5 text-sm font-black transition ${
                  activeCategory === category
                    ? 'border-[#99041e] bg-[#ffc257] text-[#1a120f] shadow-sm'
                    : 'border-[#99041e] bg-white text-[#99041e] hover:bg-[#fff8ed]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <button
            onClick={() => scrollCategoryRail('right')}
            disabled={!canScrollCategoryRight}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f0d59d] bg-[#fff8ed] text-[#99041e] transition hover:bg-[#ffc257] disabled:pointer-events-none disabled:opacity-35 md:flex"
            aria-label="Scroll categories right"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="page-container py-10 lg:py-12">
        <div className="space-y-14">
          {productsByCategory.map(({ category, products }) => (
            <section key={category} id={`category-${slugify(category)}`} data-menu-section={category} className="scroll-mt-40">
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#f0d59d]/70 pb-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-[#1a120f]">{category}</h2>
                  <p className="mt-1 text-sm font-medium text-[#6b5b55]">
                    {products.length} {products.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAdd={handleAddProduct} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[22px] border border-dashed border-[#f0d59d] bg-white px-6 py-8 text-sm font-semibold text-[#6b5b55]">
                  New items coming soon.
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-4 right-4 z-[90] mx-auto max-w-sm rounded-2xl bg-[#99041e] px-5 py-4 text-sm font-black text-white shadow-[0_18px_46px_rgba(153,4,30,0.28)] lg:bottom-8 lg:left-auto lg:right-8 lg:mx-0">
          {toast}
        </div>
      )}

      <PremiumProductCustomizationModal
        isOpen={showProductModal}
        product={selectedProduct}
        onClose={() => {
          setShowProductModal(false);
          setSelectedProduct(null);
        }}
        onAdded={handleProductAdded}
      />
      <OrderTypeModal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setPendingProduct(null);
        }}
        redirectToMenu={false}
        onSelected={handleOrderSetupSelected}
      />
    </main>
  );
}
