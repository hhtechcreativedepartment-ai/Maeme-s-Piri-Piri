'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, Minus, Pencil, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react';
import PremiumProductCustomizationModal from '@/components/modals/PremiumProductCustomizationModal';
import OrderingHeader from '@/components/ordering/OrderingHeader';
import { CartItem, useCart } from '@/lib/cartContext';
import { MENU_DATA, MenuItem } from '@/lib/menuData';
import { getProductConfiguration } from '@/lib/productOptionConfig';
import { getOrderTypeLabel } from '@/lib/orderTypeDisplay';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import CheckoutAuthModal from '@/components/auth/CheckoutAuthModal';

const recommendedNames = [
  'Loaded Fries',
  'Burger Sauce',
  'Fries',
  'Mango Lassi',
  'Wings',
  'Chocolate Cake',
  'Oreo Milkshake',
  'Lotus Biscoff Milkshake',
];

function formatOptions(item: CartItem) {
  const size = item.selectedSize || item.customization?.selectedSize;
  const product = MENU_DATA.find((candidate) => candidate.id === item.productId);
  const flavour = product && getProductConfiguration(product).baseCategorySlug === 'maemes-burgers'
    ? undefined
    : item.selectedFlavour || item.selectedSpiceLevel || item.customization?.selectedSpiceLevel;
  const addOns = item.selectedAddOns || item.customization?.selectedAddOns || [];
  const notes = item.specialInstructions || item.customization?.specialInstructions;
  const formattedAddOns = addOns.map((addon) => {
    const modifiers = addon.modifiers?.map((modifier) => `${modifier.name} +£${modifier.price.toFixed(2)}`).join(', ');
    return modifiers
      ? `${addon.name} — ${modifiers}`
      : `${addon.name}${addon.price > 0 ? ` +£${addon.price.toFixed(2)}` : ''}`;
  });

  return [
    size,
    flavour,
    formattedAddOns.length ? formattedAddOns.join(', ') : '',
    notes ? `Note: ${notes}` : '',
  ].filter(Boolean).join(' · ');
}

function getItemTotal(item: CartItem) {
  return (item.unitPrice ?? item.price) * item.quantity;
}

function getEditableProduct(item: CartItem) {
  const product = MENU_DATA.find((candidate) => candidate.id === item.productId);
  if (!product) return null;
  const configuration = getProductConfiguration(product);
  const baseCategory = configuration.baseCategorySlug;
  const isSpecialConfiguration = ['maemes-platter', 'kids-meal', 'box-meals', 'sharing-meal', 'fried-wings', 'fried-chicken', 'fried-boneless'].includes(baseCategory);
  const hasProductOptions = Boolean(product.popupModifiers?.length || product.freeToppings?.length);
  return isSpecialConfiguration || configuration.showFlavour || configuration.showMealOptions || hasProductOptions ? product : null;
}

export default function PremiumCartPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    items,
    selectedBranch,
    selectedOrderType,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const reviewOrderRef = useRef<HTMLButtonElement>(null);
  const checkoutNavigationRef = useRef(false);

  const productTotal = getCartTotal();
  const deliveryFee = selectedOrderType === 'delivery' ? selectedBranch?.deliveryFee ?? 2.49 : 0;
  const serviceCharge = items.length > 0 ? 0.79 : 0;
  const tax = 0;
  const discount = 0;
  const total = productTotal + deliveryFee + serviceCharge + tax - discount;
  const estimate = selectedOrderType === 'pickup'
    ? selectedBranch?.pickupTime || '15-20 min'
    : selectedBranch?.deliveryTime || '35-45 min';

  const recommendedProducts = useMemo(() => {
    const seen = new Set<number>();
    return recommendedNames
      .map((name) => MENU_DATA.find((item) => item.name === name))
      .filter((item): item is MenuItem => Boolean(item))
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
  }, []);

  const handleRemove = (item: CartItem) => {
    removeFromCart(item.productId, item.customization);
  };

  const handleQuantity = (item: CartItem, quantity: number) => {
    updateQuantity(item.productId, quantity, item.customization);
  };

  const handleEdit = (item: CartItem) => {
    const product = getEditableProduct(item);
    if (!product) return;
    setEditingItem(item);
    setSelectedProduct(product);
  };

  const handleAdded = () => {
    setToast('Added to cart');
    window.setTimeout(() => setToast(null), 2600);
  };

  const continueToCheckout = () => {
    if (checkoutNavigationRef.current) return;
    checkoutNavigationRef.current = true;
    setAuthModalOpen(false);
    router.push('/checkout');
  };

  const handleReviewOrder = () => {
    if (isAuthLoading) return;
    if (user) {
      continueToCheckout();
      return;
    }
    checkoutNavigationRef.current = false;
    setAuthModalOpen(true);
  };

  if (items.length === 0) {
    return (
      <>
      <OrderingHeader />
      <main className="min-h-screen bg-[#fff8ed] px-4 py-16 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-[900px] rounded-[24px] border border-[#f0d59d] bg-white px-6 py-20 text-center shadow-[0_18px_50px_rgba(50,24,16,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#99041e]">YOUR ORDER</p>
          <h1 className="mt-4 text-4xl font-black text-[#1a120f] sm:text-5xl">Your cart is empty</h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#6b5b55]">
            Add your favourite Maeme&apos;s dishes to get started.
          </p>
          <Link
            href="/order/menu"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#99041e] px-7 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(153,4,30,0.22)] transition hover:bg-[#7f0318]"
          >
            Explore Menu
          </Link>
        </section>
      </main>
      </>
    );
  }

  return (
    <>
    <OrderingHeader />
    <main className="min-h-screen bg-[#fff8ed] px-4 py-10 text-[#1a120f] sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1320px]">
        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#99041e]">YOUR ORDER</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Cart</h1>
            <p className="mt-2 text-base leading-7 text-[#6b5b55]">Review your order before checkout.</p>
          </div>
          <Link
            href="/order/menu"
            className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full border-2 border-[#99041e] bg-white px-5 text-sm font-black text-[#99041e] transition hover:bg-[#fff0d5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60"
          >
            <ArrowLeft size={18} />
            Back to Menu
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-4">
            {items.map((item, index) => (
              <article
                key={`${item.productId}-${index}-${JSON.stringify(item.customization)}`}
                className="rounded-[22px] border border-[#f0d59d] bg-white p-4 shadow-[0_14px_38px_rgba(50,24,16,0.08)] sm:p-5"
              >
                <div className="grid gap-4 sm:grid-cols-[132px_minmax(0,1fr)]">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-36 w-full rounded-2xl object-cover sm:h-32"
                    />
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-xl font-black leading-tight text-[#1a120f]">{item.name}</h2>
                        {formatOptions(item) && (
                          <p className="mt-2 text-sm leading-6 text-[#6b5b55]">{formatOptions(item)}</p>
                        )}
                      </div>
                      <p className="text-xl font-black text-[#99041e]">£{getItemTotal(item).toFixed(2)}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0d59d]/70 pt-4">
                      <div className="flex h-11 items-center rounded-2xl border border-[#ead8c6] bg-[#fff8ed] p-1">
                        <button
                          onClick={() => handleQuantity(item, item.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#99041e] transition hover:bg-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={17} />
                        </button>
                        <span className="min-w-9 text-center text-sm font-black">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantity(item, item.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#99041e] transition hover:bg-white"
                          aria-label="Increase quantity"
                        >
                          <Plus size={17} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {getEditableProduct(item) ? (
                          <button
                            onClick={() => handleEdit(item)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-[#ead8c6] px-4 py-2 text-sm font-black text-[#99041e] transition hover:bg-[#fff8ed]"
                          >
                            <Pencil size={17} />
                            Edit
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleRemove(item)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-[#ead8c6] px-4 py-2 text-sm font-black text-[#99041e] transition hover:bg-[#fff8ed]"
                        >
                          <Trash2 size={17} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside>
            <div className="sticky top-28 rounded-[24px] border border-[#f0d59d] bg-white p-5 shadow-[0_18px_50px_rgba(50,24,16,0.10)]">
              <div className="rounded-2xl bg-[#fff8ed] p-4">
                <div className="flex items-center gap-3">
                  {selectedOrderType === 'pickup' ? (
                    <ShoppingBag size={24} className="text-[#99041e]" />
                  ) : (
                    <Truck size={24} className="text-[#99041e]" />
                  )}
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#6b5b55]">
                      Estimated {getOrderTypeLabel(selectedOrderType).toLowerCase()}
                    </p>
                    <p className="text-xl font-black text-[#1a120f]">{estimate}</p>
                  </div>
                </div>
              </div>

              <h2 className="mt-6 text-2xl font-black">Bill summary</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#6b5b55]">Product total</span>
                  <span className="font-black">£{productTotal.toFixed(2)}</span>
                </div>
                {selectedOrderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#6b5b55]">Delivery fee</span>
                    <span className="font-black">£{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-semibold text-[#6b5b55]">Service charge</span>
                  <span className="font-black">£{serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#6b5b55]">VAT / tax</span>
                  <span className="font-black">£{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#6b5b55]">Discount</span>
                  <span className="font-black">-£{discount.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-[#f0d59d] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black">Total</span>
                  <span className="text-2xl font-black text-[#99041e]">£{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                ref={reviewOrderRef}
                type="button"
                onClick={handleReviewOrder}
                disabled={isAuthLoading}
                className="mt-6 block min-h-12 w-full rounded-2xl bg-[#ffc257] px-5 py-3 text-center text-sm font-black text-[#1a120f] shadow-[0_14px_34px_rgba(255,194,87,0.24)] transition hover:bg-[#e5a93e] disabled:cursor-wait disabled:opacity-70"
              >
                Review Your Order
              </button>
            </div>
          </aside>
        </div>

        <section className="mt-14">
          <h2 className="text-3xl font-black tracking-tight">Did you leave anything behind?</h2>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {recommendedProducts.map((product) => (
              <article
                key={product.id}
                className="min-w-[230px] overflow-hidden rounded-2xl border border-[#f0d59d] bg-white shadow-[0_14px_38px_rgba(50,24,16,0.08)]"
              >
                <img src={product.image} alt={product.name} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-black">{product.name}</h3>
                  <p className="mt-1 text-sm font-black text-[#99041e]">£{product.price.toFixed(2)}</p>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="mt-4 w-full rounded-xl bg-[#99041e] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#7f0318]"
                  >
                    Add
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-4 right-4 z-[90] mx-auto max-w-sm rounded-2xl bg-[#99041e] px-5 py-4 text-sm font-black text-white shadow-[0_18px_46px_rgba(153,4,30,0.28)] lg:left-auto lg:right-8 lg:mx-0">
          {toast}
        </div>
      )}

      <PremiumProductCustomizationModal
        isOpen={Boolean(selectedProduct)}
        product={selectedProduct}
        editingItem={editingItem}
        onClose={() => {
          setSelectedProduct(null);
          setEditingItem(null);
        }}
        onAdded={handleAdded}
      />
      <CheckoutAuthModal
        isOpen={authModalOpen}
        onClose={() => {
          checkoutNavigationRef.current = false;
          setAuthModalOpen(false);
        }}
        onAuthenticated={continueToCheckout}
        returnFocusRef={reviewOrderRef}
      />
    </main>
    </>
  );
}
