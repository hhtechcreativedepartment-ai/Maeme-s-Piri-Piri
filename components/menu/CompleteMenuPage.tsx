'use client';

import { KeyboardEvent, WheelEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag, Store, Truck } from 'lucide-react';
import PremiumProductCustomizationModal from '@/components/modals/PremiumProductCustomizationModal';
import OrderTypeModal from '@/components/ordering/OrderTypeModal';
import ProductCard from '@/components/ordering/ProductCard';
import { MENU_DATA, MENU_CATEGORY_DATA, MenuItem, MenuQuickAddOption } from '@/lib/menuData';
import { useCart } from '@/lib/cartContext';
import { formatBranchDisplay } from '@/lib/branchData';
import { getOrderTypeLabel } from '@/lib/orderTypeDisplay';

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
  const { items, selectedBranch, selectedOrderType, addToCart, updateQuantity, setOrderType } = useCart();
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
              <div className="h-full rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-start gap-3">
                  <Store size={20} className="mt-0.5 shrink-0 text-[#ffc257]" />
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-white/65">Branch</p>
                    <p className="mt-1 break-words text-sm font-black">{selectedBranch?.branchName || 'Selected Branch'}</p>
                    {selectedBranch && (
                      <>
                        <p className="mt-0.5 text-xs font-bold text-white/90">{selectedBranch.postcode}</p>
                        {selectedBranch.address && (
                          <p className="mt-1 break-words text-xs leading-5 text-white/75">
                            {selectedBranch.address}{selectedBranch.postcode ? `, ${selectedBranch.postcode}` : ''}
                          </p>
                        )}
                        <p className={`mt-1 text-xs font-bold ${selectedBranch.isOpen === false ? 'text-[#ffc257]' : 'text-white/90'}`}>
                          {formatBranchDisplay(selectedBranch)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="h-full rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-start gap-3">
                  {selectedOrderType === 'pickup' ? <ShoppingBag size={20} className="text-[#ffc257]" /> : <Truck size={20} className="text-[#ffc257]" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-white/65">Order type</p>
                    <p className="mt-1 text-sm font-black">{getOrderTypeLabel(selectedOrderType)}</p>
                    <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl border border-white/15 bg-black/10 p-1">
                      {(['delivery', 'pickup'] as const).map((type) => {
                        const available = !selectedBranch || (type === 'delivery' ? selectedBranch.deliveryAvailable : selectedBranch.pickupAvailable);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => available && selectedBranch && setOrderType(type)}
                            disabled={!selectedBranch || !available}
                            aria-pressed={selectedOrderType === type}
                            className={`min-h-9 rounded-lg px-2 py-1.5 text-xs font-black transition ${
                              selectedOrderType === type
                                ? 'bg-[#ffc257] text-[#1a120f] shadow-sm'
                                : 'text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40'
                            }`}
                          >
                            {getOrderTypeLabel(type)}
                          </button>
                        );
                      })}
                    </div>
                    {selectedBranch && !selectedBranch.deliveryAvailable && (
                      <p className="mt-2 text-[11px] leading-4 text-white/75">Delivery is currently unavailable from this branch.</p>
                    )}
                    {selectedBranch && !selectedBranch.pickupAvailable && (
                      <p className="mt-2 text-[11px] leading-4 text-white/75">Collection is currently unavailable from this branch.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div ref={categoryNavRef} className="menu-category-carousel sticky top-[var(--site-header-height)] z-[60] border-b border-[#f0d59d] bg-white/95 shadow-[0_12px_30px_rgba(50,24,16,0.06)] backdrop-blur">
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
            role="navigation"
            aria-label="Menu categories"
            className="flex flex-1 snap-x snap-mandatory gap-2 overflow-x-auto py-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {MENU_CATEGORY_DATA.map((category) => (
              <button
                key={category.id}
                data-category={category.slug}
                onClick={() => handleCategoryClick(category.id, category.anchor)}
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

      <div className="page-container py-10 lg:py-12">
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
          setPendingQuickOptions([]);
        }}
        redirectToMenu={false}
        onSelected={handleOrderSetupSelected}
      />
    </main>
  );
}
