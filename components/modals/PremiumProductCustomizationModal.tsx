'use client';

import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { MenuItem } from '@/lib/menuData';

interface PremiumProductCustomizationModalProps {
  isOpen: boolean;
  product: MenuItem | null;
  onClose: () => void;
  onAdded?: (product: MenuItem) => void;
}

interface AddOnOption {
  name: string;
  price: number;
}

const ADDON_OPTIONS: AddOnOption[] = [
  { name: 'Extra cheese', price: 1.5 },
  { name: 'Fries', price: 2.49 },
  { name: 'Drink', price: 1.99 },
  { name: 'Dip', price: 0.75 },
  { name: 'Extra sauce', price: 0.75 },
  { name: 'Fresh salad', price: 1.5 },
];

const SIZE_OPTIONS = [
  { name: 'Regular', price: 0 },
  { name: 'Large', price: 2 },
];

const FLAVOUR_OPTIONS = [
  'Lemon & Herb',
  'Mild',
  'Mango & Lime',
  'Medium',
  'Hot',
  'Extra Hot',
  'Extra Hot & Sweet',
  'BBQ',
  'Garlic & Herb',
];

export default function PremiumProductCustomizationModal({
  isOpen,
  product,
  onClose,
  onAdded,
}: PremiumProductCustomizationModalProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedFlavour, setSelectedFlavour] = useState('Medium');
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, AddOnOption>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setSelectedSize('Regular');
    setSelectedFlavour('Medium');
    setQuantity(1);
    setSelectedAddOns({});
    setSpecialInstructions('');
  }, [isOpen, product?.id]);

  const selectedSizeOption = SIZE_OPTIONS.find((option) => option.name === selectedSize) || SIZE_OPTIONS[0];
  const selectedAddOnsList = useMemo(() => Object.values(selectedAddOns), [selectedAddOns]);
  const addOnsTotal = selectedAddOnsList.reduce((sum, addon) => sum + addon.price, 0);
  const unitPrice = product ? product.price + selectedSizeOption.price + addOnsTotal : 0;
  const calculatedTotal = unitPrice * quantity;

  if (!isOpen || !product) return null;

  const toggleAddOn = (addon: AddOnOption) => {
    setSelectedAddOns((current) => {
      const next = { ...current };
      if (next[addon.name]) delete next[addon.name];
      else next[addon.name] = addon;
      return next;
    });
  };

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      image: product.image,
      basePrice: product.price,
      selectedSize,
      selectedFlavour,
      selectedSpiceLevel: selectedFlavour,
      selectedAddOns: selectedAddOnsList,
      specialInstructions,
      quantity,
      unitPrice,
      totalPrice: calculatedTotal,
      price: unitPrice,
      customization: {
        selectedSize,
        selectedFlavour,
        selectedSpiceLevel: selectedFlavour,
        selectedAddOns: selectedAddOnsList,
        specialInstructions,
      },
    };

    addToCart(cartItem);
    onAdded?.(product);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
          className="relative my-8 w-full max-w-5xl overflow-hidden rounded-[24px] border border-[#f0d59d] bg-white shadow-[0_30px_90px_rgba(26,18,15,0.32)]"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 rounded-xl border border-[#ead8c6] bg-white/95 p-2 text-[#1a120f] shadow-sm transition hover:bg-[#ffc257]"
            aria-label="Close product details"
          >
            <X size={22} />
          </button>

          <div className="grid max-h-[90vh] grid-cols-1 overflow-y-auto lg:grid-cols-[0.92fr_1.08fr]">
            <div className="bg-[#fff8ed] p-4 sm:p-6 lg:p-7">
              <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_18px_55px_rgba(50,24,16,0.12)] lg:sticky lg:top-0">
                <img src={product.image} alt={product.name} className="h-72 w-full object-cover sm:h-96 lg:h-[560px]" />
              </div>
            </div>

            <div className="flex min-h-0 flex-col bg-white">
              <div className="space-y-6 p-5 sm:p-7 lg:p-8">
                <div className="pr-10">
                  <h2 id="product-detail-title" className="text-3xl font-black leading-tight text-[#1a120f] sm:text-4xl">
                    {product.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#6b5b55] sm:text-base">{product.description}</p>
                  <p className="mt-4 text-2xl font-black text-[#99041e]">
                    {product.startingPrice ? 'From ' : ''}£{product.price.toFixed(2)}
                  </p>
                </div>

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[#1a120f]">Size</h3>
                    <span className="rounded-full bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">Required</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {SIZE_OPTIONS.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size.name)}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          selectedSize === size.name
                            ? 'border-[#99041e] bg-[#99041e] text-white shadow-[0_14px_32px_rgba(153,4,30,0.20)]'
                            : 'border-[#ead8c6] bg-[#fff8ed] text-[#1a120f] hover:border-[#99041e]'
                        }`}
                      >
                        <span className="block text-sm font-black">{size.name}</span>
                        <span className={`mt-1 block text-xs font-bold ${selectedSize === size.name ? 'text-white/75' : 'text-[#6b5b55]'}`}>
                          {size.price > 0 ? `+£${size.price.toFixed(2)}` : 'Included'}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-[#1a120f]">Flavour / heat / spice level</h3>
                  <div className="flex flex-wrap gap-2">
                    {FLAVOUR_OPTIONS.map((flavour) => (
                      <button
                        key={flavour}
                        onClick={() => setSelectedFlavour(flavour)}
                        className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                          selectedFlavour === flavour
                            ? 'border-[#99041e] bg-[#99041e] text-white'
                            : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'
                        }`}
                      >
                        {flavour}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-[#1a120f]">Optional extras</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ADDON_OPTIONS.map((addon) => {
                      const checked = Boolean(selectedAddOns[addon.name]);
                      return (
                        <button
                          key={addon.name}
                          onClick={() => toggleAddOn(addon)}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                            checked
                              ? 'border-[#99041e] bg-[#fff4f6]'
                              : 'border-[#ead8c6] bg-[#fff8ed] hover:border-[#99041e]'
                          }`}
                        >
                          <span className="text-sm font-black text-[#1a120f]">{addon.name}</span>
                          <span className="text-sm font-black text-[#99041e]">+£{addon.price.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-[#1a120f]">Special instructions</h3>
                  <textarea
                    value={specialInstructions}
                    onChange={(event) => setSpecialInstructions(event.target.value)}
                    placeholder="Allergies or preparation notes?"
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-[#ead8c6] bg-[#fff8ed] p-4 text-sm font-medium text-[#1a120f] outline-none transition placeholder:text-[#8b7a73] focus:border-[#99041e] focus:ring-4 focus:ring-[#ffc257]/25"
                  />
                </section>
              </div>

              <div className="sticky bottom-0 mt-auto border-t border-[#ead8c6] bg-white/96 p-4 shadow-[0_-12px_34px_rgba(50,24,16,0.08)] backdrop-blur sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex h-12 items-center justify-between rounded-2xl border border-[#ead8c6] bg-[#fff8ed] p-1 sm:w-36">
                    <button
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-[#99041e] transition hover:bg-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="min-w-8 text-center text-base font-black text-[#1a120f]">{quantity}</span>
                    <button
                      onClick={() => setQuantity((current) => current + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-[#99041e] transition hover:bg-white"
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="min-h-12 flex-1 rounded-2xl bg-[#ffc257] px-6 py-3 text-base font-black text-[#1a120f] shadow-[0_14px_34px_rgba(255,194,87,0.24)] transition hover:bg-[#e5a93e]"
                  >
                    Add to cart · £{calculatedTotal.toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
