'use client';

import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { MenuItem } from '@/lib/menuData';
import { FLAVOUR_OPTIONS, GO_LARGE_OPTION, MEAL_OPTION_GROUPS, MEAL_SIZE_OPTIONS, MealOptionChoice, MealOptionGroup, getProductOptionVisibility } from '@/lib/productOptionConfig';

interface PremiumProductCustomizationModalProps {
  isOpen: boolean;
  product: MenuItem | null;
  onClose: () => void;
  onAdded?: (product: MenuItem) => void;
}

export default function PremiumProductCustomizationModal({
  isOpen,
  product,
  onClose,
  onAdded,
}: PremiumProductCustomizationModalProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [goLarge, setGoLarge] = useState(false);
  const [selectedMealOptions, setSelectedMealOptions] = useState<Record<string, MealOptionChoice | MealOptionChoice[]>>({});
  const [mealOptionErrors, setMealOptionErrors] = useState<string[]>([]);
  const [selectedFlavour, setSelectedFlavour] = useState('Medium');
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setSelectedSize('Regular');
    setGoLarge(false);
    setSelectedMealOptions({});
    setMealOptionErrors([]);
    setSelectedFlavour('Medium');
    setQuantity(1);
    setSpecialInstructions('');
  }, [isOpen, product?.id]);

  const optionVisibility = useMemo(
    () => getProductOptionVisibility(product?.category || ''),
    [product?.category],
  );
  const selectedSizeOption = optionVisibility.showSize
    ? MEAL_SIZE_OPTIONS.find((option) => option.name === selectedSize) || MEAL_SIZE_OPTIONS[0]
    : { name: '', price: 0 };
  const mealSelected = selectedSize === 'Meal';
  const goLargePrice = optionVisibility.showGoLarge && mealSelected && goLarge ? GO_LARGE_OPTION.price : 0;
  const mealOptionsList = useMemo(() => Object.values(selectedMealOptions).flat(), [selectedMealOptions]);
  const mealOptionsTotal = mealSelected ? mealOptionsList.reduce((sum, option) => sum + option.price, 0) : 0;
  const unitPrice = product ? product.price + selectedSizeOption.price + goLargePrice + mealOptionsTotal : 0;
  const calculatedTotal = unitPrice * quantity;

  if (!isOpen || !product) return null;

  const toggleMealOption = (group: MealOptionGroup, option: MealOptionChoice) => {
    const groupId = group.id;
    setMealOptionErrors((current) => current.filter((id) => id !== groupId));
    setSelectedMealOptions((current) => {
      const next = { ...current };
      if (group.multiple) {
        const selectedOptions = Array.isArray(current[groupId]) ? current[groupId] : [];
        const selected = selectedOptions.some((item) => item.name === option.name);
        const updatedOptions = selected
          ? selectedOptions.filter((item) => item.name !== option.name)
          : [...selectedOptions, option];

        if (updatedOptions.length) next[groupId] = updatedOptions;
        else delete next[groupId];
      } else {
        const selectedOption = !Array.isArray(current[groupId]) ? current[groupId] : undefined;
        if (selectedOption?.name === option.name) delete next[groupId];
        else next[groupId] = option;
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    const missingRequiredMealOptions = mealSelected
      ? MEAL_OPTION_GROUPS.filter((group) => group.required && !selectedMealOptions[group.id]).map((group) => group.id)
      : [];

    if (missingRequiredMealOptions.length > 0) {
      setMealOptionErrors(missingRequiredMealOptions);
      return;
    }

    const selectedSizeLabel = optionVisibility.showSize
      ? `${selectedSize}${goLargePrice > 0 ? `, ${GO_LARGE_OPTION.name}` : ''}`
      : undefined;

    const cartItem = {
      productId: product.id,
      name: product.name,
      image: product.image,
      basePrice: product.price,
      selectedSize: selectedSizeLabel,
      selectedFlavour: optionVisibility.showFlavour ? selectedFlavour : undefined,
      selectedSpiceLevel: optionVisibility.showFlavour ? selectedFlavour : undefined,
      selectedAddOns: mealSelected ? mealOptionsList : [],
      specialInstructions: optionVisibility.showSpecialInstructions ? specialInstructions : undefined,
      quantity,
      unitPrice,
      totalPrice: calculatedTotal,
      price: unitPrice,
      customization: {
        selectedSize: selectedSizeLabel,
        selectedFlavour: optionVisibility.showFlavour ? selectedFlavour : undefined,
        selectedSpiceLevel: optionVisibility.showFlavour ? selectedFlavour : undefined,
        selectedAddOns: mealSelected ? mealOptionsList : [],
        specialInstructions: optionVisibility.showSpecialInstructions ? specialInstructions : undefined,
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

                {optionVisibility.showSize && (
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Size</h3>
                      <span className="rounded-full bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">Required</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {MEAL_SIZE_OPTIONS.map((size) => (
                        <button
                          key={size.name}
                          onClick={() => {
                            setSelectedSize(size.name);
                            if (size.name !== 'Meal') {
                              setGoLarge(false);
                              setSelectedMealOptions({});
                            }
                          }}
                          className={`rounded-2xl border px-4 py-3 text-left transition ${
                            selectedSize === size.name
                              ? 'border-[#99041e] bg-[#99041e] text-white shadow-[0_14px_32px_rgba(153,4,30,0.20)]'
                              : 'border-[#ead8c6] bg-[#fff8ed] text-[#1a120f] hover:border-[#99041e]'
                          }`}
                        >
                          <span className="block text-sm font-medium">{size.name}</span>
                          <span className={`mt-1 block text-xs font-semibold ${selectedSize === size.name ? 'text-white/75' : 'text-[#6b5b55]'}`}>
                            {size.price > 0 ? `+£${size.price.toFixed(2)}` : 'Included'}
                          </span>
                        </button>
                      ))}
                    </div>
                    {mealSelected && (
                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Meal Option</h3>
                        <button
                          onClick={() => setGoLarge((current) => !current)}
                          className={`rounded-2xl border px-4 py-3 text-left transition ${
                            goLarge
                              ? 'border-[#99041e] bg-[#99041e] text-white shadow-[0_14px_32px_rgba(153,4,30,0.20)]'
                              : 'border-[#ead8c6] bg-[#fff8ed] text-[#1a120f] hover:border-[#99041e]'
                          }`}
                        >
                          <span className="block text-sm font-medium">{GO_LARGE_OPTION.name}</span>
                          <span className={`mt-1 block text-xs font-semibold ${goLarge ? 'text-white/75' : 'text-[#6b5b55]'}`}>
                            +£{GO_LARGE_OPTION.price.toFixed(2)}
                          </span>
                        </button>
                      </div>
                    )}
                  </section>
                )}

                {optionVisibility.showFlavour && (
                  <section>
                    <h3 className="mb-3 text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Flavour / Heat / Spice Level</h3>
                    <div className="flex flex-wrap gap-2">
                      {FLAVOUR_OPTIONS.map((flavour) => (
                        <button
                          key={flavour}
                          onClick={() => setSelectedFlavour(flavour)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
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
                )}

                {mealSelected && MEAL_OPTION_GROUPS.map((group) => (
                  <section key={group.id}>
                    <div className="mb-3 flex items-center gap-2">
                      <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">{group.title}</h3>
                      {group.required && <span className="rounded-full bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">Required</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((option) => {
                        const groupSelection = selectedMealOptions[group.id];
                        const selected = Array.isArray(groupSelection)
                          ? groupSelection.some((item) => item.name === option.name)
                          : groupSelection?.name === option.name;
                        return (
                          <button
                            key={option.name}
                            onClick={() => toggleMealOption(group, option)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                              selected
                                ? 'border-[#99041e] bg-[#99041e] text-white'
                                : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'
                            }`}
                          >
                            {option.name}{option.price > 0 ? ` +£${option.price.toFixed(2)}` : ''}
                          </button>
                        );
                      })}
                    </div>
                    {mealOptionErrors.includes(group.id) && (
                      <p className="mt-2 text-xs font-bold text-[#99041e]">Please select an option</p>
                    )}
                  </section>
                ))}

                {optionVisibility.showSpecialInstructions && (
                  <section>
                    <h3 className="mb-3 text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Special Instructions</h3>
                    <textarea
                      value={specialInstructions}
                      onChange={(event) => setSpecialInstructions(event.target.value)}
                      placeholder="Allergies or preparation notes?"
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-[#ead8c6] bg-[#fff8ed] p-4 text-sm font-medium text-[#1a120f] outline-none transition placeholder:text-[#8b7a73] focus:border-[#99041e] focus:ring-4 focus:ring-[#ffc257]/25"
                    />
                  </section>
                )}
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
