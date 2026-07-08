'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, ShoppingBag, ShoppingCart, Store, Truck } from 'lucide-react';
import PremiumProductCustomizationModal from '@/components/modals/PremiumProductCustomizationModal';
import OrderTypeModal from '@/components/ordering/OrderTypeModal';
import ProductCard from '@/components/ordering/ProductCard';
import { MENU_DATA, MENU_CATEGORIES, MenuItem } from '@/lib/menuData';
import { useCart } from '@/lib/cartContext';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function CompleteMenuPage() {
  const { selectedBranch, selectedOrderType, getCartCount, getCartTotal } = useCart();
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0]);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<MenuItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const categoryRailRef = useRef<HTMLDivElement>(null);

  const productsByCategory = useMemo(() => (
    MENU_CATEGORIES.map((category) => ({
      category,
      products: MENU_DATA.filter((product) => product.category === category),
    })).filter((section) => section.products.length > 0)
  ), []);

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  const openProductDetail = (product: MenuItem) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleAddProduct = (product: MenuItem) => {
    if (!selectedBranch || !selectedOrderType) {
      setPendingProduct(product);
      setShowOrderModal(true);
      return;
    }

    openProductDetail(product);
  };

  const handleOrderSetupSelected = () => {
    if (pendingProduct) {
      openProductDetail(pendingProduct);
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
  };

  const handleProductAdded = () => {
    setToast('Added to cart');
    window.setTimeout(() => setToast(null), 2600);
  };

  return (
    <main className="min-h-screen bg-[#fff8ed] pb-24 text-[#1a120f] lg:pb-0">
      <section className="bg-[#99041e] px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1320px]">
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

      <div className="sticky top-[72px] z-30 border-b border-[#f0d59d] bg-white/95 shadow-[0_12px_30px_rgba(50,24,16,0.06)] backdrop-blur md:top-[86px]">
        <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => scrollCategoryRail('left')}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f0d59d] bg-[#fff8ed] text-[#99041e] transition hover:bg-[#ffc257] lg:flex"
            aria-label="Scroll categories left"
          >
            <ArrowLeft size={18} />
          </button>
          <div
            ref={categoryRailRef}
            className="flex flex-1 gap-2 overflow-x-auto py-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {MENU_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`shrink-0 rounded-full border-2 px-4 py-2.5 text-sm font-black transition ${
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
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f0d59d] bg-[#fff8ed] text-[#99041e] transition hover:bg-[#ffc257] lg:flex"
            aria-label="Scroll categories right"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-12">
        <div className="space-y-14">
          {productsByCategory.map(({ category, products }) => (
            <section key={category} id={`category-${slugify(category)}`} className="scroll-mt-40">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-[#1a120f]">{category}</h2>
                  <p className="mt-1 text-sm font-medium text-[#6b5b55]">
                    {products.length} {products.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={handleAddProduct} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-[170px] rounded-[24px] border border-[#f0d59d] bg-white p-5 shadow-[0_18px_50px_rgba(50,24,16,0.10)]">
            <div className="flex items-center justify-between gap-4 border-b border-[#f0d59d]/70 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#99041e]">Your order</p>
                <h2 className="mt-1 text-2xl font-black text-[#1a120f]">Cart</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff8ed] text-[#99041e]">
                <ShoppingCart size={23} />
              </div>
            </div>

            <div className="space-y-3 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#6b5b55]">Items</span>
                <span className="font-black text-[#1a120f]">{cartCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#6b5b55]">Subtotal</span>
                <span className="font-black text-[#99041e]">£{cartTotal.toFixed(2)}</span>
              </div>
              {selectedBranch && (
                <div className="rounded-2xl bg-[#fff8ed] p-3 text-xs font-bold leading-5 text-[#6b5b55]">
                  <p className="text-[#1a120f]">{selectedBranch.branchName}</p>
                  <p className="mt-1 flex items-center gap-1">
                    <Clock size={14} className="text-[#99041e]" />
                    {selectedOrderType === 'pickup' ? selectedBranch.pickupTime : selectedBranch.deliveryTime}
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/cart"
              className={`block rounded-2xl px-5 py-3 text-center text-sm font-black transition ${
                cartCount > 0
                  ? 'bg-[#ffc257] text-[#1a120f] hover:bg-[#e5a93e]'
                  : 'bg-[#ead8c6] text-[#8b7a73]'
              }`}
            >
              View cart
            </Link>
          </div>
        </aside>
      </div>

      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#f0d59d] bg-white p-3 shadow-[0_-12px_32px_rgba(50,24,16,0.12)] lg:hidden">
          <Link href="/cart" className="mx-auto flex max-w-xl items-center justify-between rounded-2xl bg-[#99041e] px-4 py-3 text-white">
            <span className="flex items-center gap-3 text-sm font-black">
              <ShoppingCart size={20} />
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
            <span className="text-sm font-black">£{cartTotal.toFixed(2)}</span>
          </Link>
        </div>
      )}

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
