'use client';

import { KeyboardEvent, PointerEvent, WheelEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PremiumProductCustomizationModal from '@/components/modals/PremiumProductCustomizationModal';
import OrderTypeModal from '@/components/ordering/OrderTypeModal';
import ProductCard from '@/components/ordering/ProductCard';
import OrderingHeader from '@/components/ordering/OrderingHeader';
import { MENU_DATA, MENU_CATEGORY_DATA, MenuItem, MenuQuickAddOption } from '@/lib/menuData';
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
  'sides-and-extras',
  'ice-cream',
  'dips',
  'milkshakes',
  'drinks',
]);

export default function CompleteMenuPage() {
  const router = useRouter();
  const {
    items,
    isHydrated,
    selectedBranch,
    selectedOrderType,
    addToCart,
    updateQuantity,
    setOrderType,
  } = useCart();
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORY_DATA[0].id);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<MenuItem | null>(null);
  const [pendingQuickOptions, setPendingQuickOptions] = useState<MenuQuickAddOption[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [canScrollCategoryLeft, setCanScrollCategoryLeft] = useState(false);
  const [canScrollCategoryRight, setCanScrollCategoryRight] = useState(true);
  const categoryRailRef = useRef<HTMLDivElement>(null);
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const categoryDragRef = useRef({ startX: 0, startScrollLeft: 0, dragging: false });
  const didDragCategoryRailRef = useRef(false);

  const productsByCategory = useMemo(() => (
    MENU_CATEGORY_DATA.map((category) => ({
      category,
      products: MENU_DATA.filter((product) => (
        category.id === 'offers' ? product.offer : product.category === category.title
      )),
    }))
  ), []);

  const isDirectAddProduct = (product: MenuItem) => DIRECT_ADD_CATEGORY_SLUGS.has(slugify(product.category));

  const openProductDetail = (product: MenuItem) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const addSimpleProductToCart = (product: MenuItem, selectedOptions: MenuQuickAddOption[] = []) => {
    const selectedAddOns = selectedOptions.map(({ id, name, price }) => ({ id, name, price }));
    const customization = selectedAddOns.length > 0 || product.sizeInfo
      ? { selectedSize: product.sizeInfo, selectedAddOns }
      : undefined;
    const existingItem = items.find((item) => (
      item.productId === product.id
      && JSON.stringify(item.customization) === JSON.stringify(customization)
    ));
    const unitPrice = product.price + selectedAddOns.reduce((total, option) => total + option.price, 0);

    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1, customization);
    } else {
      addToCart({
        productId: product.id,
        quantity: 1,
        name: product.name,
        price: unitPrice,
        unitPrice,
        basePrice: product.price,
        totalPrice: unitPrice,
        image: product.image,
        selectedSize: product.sizeInfo,
        selectedAddOns,
        customization,
      });
    }

    handleProductAdded();
  };

  const handleAddProduct = (product: MenuItem, selectedOptions: MenuQuickAddOption[] = []) => {
    if (!selectedBranch || !selectedOrderType) {
      setPendingProduct(product);
      setPendingQuickOptions(selectedOptions);
      setShowOrderModal(true);
      return;
    }

    if (isDirectAddProduct(product)) {
      addSimpleProductToCart(product, selectedOptions);
      return;
    }

    openProductDetail(product);
  };

  const handleOrderSetupSelected = () => {
    if (pendingProduct) {
      if (isDirectAddProduct(pendingProduct)) addSimpleProductToCart(pendingProduct, pendingQuickOptions);
      else openProductDetail(pendingProduct);
      setPendingProduct(null);
      setPendingQuickOptions([]);
    }
  };

  const handleCategoryClick = (categoryId: string, anchor: string) => {
    setActiveCategory(categoryId);
    document.getElementById(anchor)?.scrollIntoView({
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

  const handleCategoryWheel = (event: WheelEvent<HTMLDivElement>) => {
    const rail = categoryRailRef.current;
    if (!rail || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
    event.preventDefault();
    rail.scrollLeft += event.deltaY;
  };

  const handleCategoryKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button[data-category]'));
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex < 0) return;

    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? buttons.length - 1
        : Math.min(buttons.length - 1, Math.max(0, currentIndex + (event.key === 'ArrowRight' ? 1 : -1)));
    buttons[nextIndex]?.focus();
    buttons[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const handleCategoryPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const rail = categoryRailRef.current;
    if (!rail) return;
    categoryDragRef.current = {
      startX: event.clientX,
      startScrollLeft: rail.scrollLeft,
      dragging: true,
    };
    didDragCategoryRailRef.current = false;
  };

  const handleCategoryPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rail = categoryRailRef.current;
    const drag = categoryDragRef.current;
    if (!rail || !drag.dragging) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 5) didDragCategoryRailRef.current = true;
    rail.scrollLeft = drag.startScrollLeft - distance;
  };

  const handleCategoryPointerEnd = () => {
    if (!categoryRailRef.current || !categoryDragRef.current.dragging) return;
    categoryDragRef.current.dragging = false;
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
    const nav = categoryNavRef.current;
    if (!nav) return;
    const updateHeight = () => document.documentElement.style.setProperty('--menu-nav-height', `${nav.offsetHeight}px`);
    const observer = new ResizeObserver(updateHeight);
    observer.observe(nav);
    updateHeight();
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--menu-nav-height');
    };
  }, []);

  useEffect(() => {
    if (!selectedBranch) return;

    if (selectedOrderType === 'delivery' && !selectedBranch.deliveryAvailable && selectedBranch.pickupAvailable) {
      setOrderType('pickup');
    } else if (selectedOrderType === 'pickup' && !selectedBranch.pickupAvailable && selectedBranch.deliveryAvailable) {
      setOrderType('delivery');
    } else if (!selectedOrderType && selectedBranch.deliveryAvailable !== selectedBranch.pickupAvailable) {
      setOrderType(selectedBranch.deliveryAvailable ? 'delivery' : 'pickup');
    }
  }, [selectedBranch, selectedOrderType, setOrderType]);

  useEffect(() => {
    if (isHydrated && (!selectedBranch || !selectedOrderType)) {
      router.replace('/order');
    }
  }, [isHydrated, router, selectedBranch, selectedOrderType]);

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

        const categoryId = visibleEntry?.target.getAttribute('data-menu-section');
        if (categoryId) setActiveCategory(categoryId);
      },
      { rootMargin: '-190px 0px -55% 0px', threshold: [0.12, 0.28, 0.5] },
    );

    productsByCategory.forEach(({ category }) => {
      const section = document.getElementById(category.anchor);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [productsByCategory]);

  const handleProductAdded = () => {
    setToast('Added to cart');
    window.setTimeout(() => setToast(null), 2600);
  };

  if (!isHydrated || !selectedBranch || !selectedOrderType) {
    return (
      <>
      <OrderingHeader />
      <main className="flex min-h-[100svh] items-center justify-center bg-[#fff8ed] px-4">
        <p className="text-sm font-black text-[#99041e]">Loading your ordering details…</p>
      </main>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8ed] pb-24 text-[#1a120f]">
      <OrderingHeader />

      <div ref={categoryNavRef} className="menu-category-carousel sticky top-[var(--ordering-header-height,0px)] z-[60] border-b border-[#f0d59d] bg-white/95 shadow-[0_12px_30px_rgba(50,24,16,0.06)] backdrop-blur">
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
            onWheel={handleCategoryWheel}
            onKeyDown={handleCategoryKeyDown}
            onPointerDown={handleCategoryPointerDown}
            onPointerMove={handleCategoryPointerMove}
            onPointerUp={handleCategoryPointerEnd}
            onPointerCancel={handleCategoryPointerEnd}
            role="navigation"
            aria-label="Menu categories"
            className="flex flex-1 cursor-grab snap-x snap-mandatory gap-2 overflow-x-auto py-4 scroll-smooth active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {MENU_CATEGORY_DATA.map((category) => (
              <button
                key={category.id}
                data-category={category.slug}
                onClick={(event) => {
                  if (didDragCategoryRailRef.current) {
                    event.preventDefault();
                    didDragCategoryRailRef.current = false;
                    return;
                  }
                  handleCategoryClick(category.id, category.anchor);
                }}
                className={`shrink-0 snap-start rounded-full border-2 px-4 py-2.5 text-sm font-black transition ${
                  activeCategory === category.id
                    ? 'border-[#99041e] bg-[#ffc257] text-[#1a120f] shadow-sm'
                    : 'border-[#99041e] bg-white text-[#99041e] hover:bg-[#fff8ed]'
                }`}
              >
                {category.title}
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

      <div className="site-container-wide py-10 lg:py-12">
        <div className="space-y-14">
          {productsByCategory.map(({ category, products }) => (
            <section
              key={category.id}
              id={category.anchor}
              data-menu-section={category.id}
              style={{ scrollMarginTop: 'calc(var(--site-header-height) + var(--menu-nav-height, 76px) + 1rem)' }}
            >
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#f0d59d]/70 pb-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-[#1a120f]">{category.title}</h2>
                  <p className="mt-1 text-sm font-medium text-[#6b5b55]">
                    {products.length} {products.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={handleAddProduct}
                      isSelected={showProductModal && selectedProduct?.id === product.id}
                    />
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

      <footer className="border-t border-[#f0d59d] bg-white px-4 py-5 text-center">
        <p className="text-sm font-semibold text-[#6b5b55]">
          Menu FAQ: Have questions about ingredients, allergens or customisation? Please speak to our team before ordering.
        </p>
      </footer>

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
          setPendingQuickOptions([]);
        }}
        redirectToMenu={false}
        onSelected={handleOrderSetupSelected}
      />
    </main>
  );
}
