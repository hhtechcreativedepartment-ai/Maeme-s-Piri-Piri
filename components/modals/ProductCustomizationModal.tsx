'use client';

import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { MenuItem } from '@/lib/menuData';
import { FLAVOUR_OPTIONS, MEAL_OPTION_GROUPS, MealOptionChoice, MealOptionGroup, MealOptionModifier, categorySlug, getGoLargeOption, getMealSizeOptions, getProductOptionVisibility } from '@/lib/productOptionConfig';

interface ProductCustomizationModalProps {
  isOpen: boolean;
  product: MenuItem | null;
  onClose: () => void;
}

export default function ProductCustomizationModal({ isOpen, product, onClose }: ProductCustomizationModalProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('Regular');
  const [goLarge, setGoLarge] = useState(false);
  const [selectedMealOptions, setSelectedMealOptions] = useState<Record<string, MealOptionChoice | MealOptionChoice[]>>({});
  const [mealOptionErrors, setMealOptionErrors] = useState<string[]>([]);
  const [selectedFlavour, setSelectedFlavour] = useState<string>('Medium');
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [selectedProductModifierIds, setSelectedProductModifierIds] = useState<string[]>([]);

  if (!isOpen || !product) return null;

  const optionVisibility = getProductOptionVisibility(product.category);
  const mealSizeOptions = getMealSizeOptions(product.category, product.mealPrice);
  const goLargeOption = getGoLargeOption(product.category, product.goLargePrice);
  const selectedSizePrice = optionVisibility.showSize
    ? mealSizeOptions.find((option) => option.name === selectedSize)?.price || 0
    : 0;
  const mealSelected = selectedSize === 'Meal';
  const goLargePrice = optionVisibility.showGoLarge && mealSelected && goLarge ? goLargeOption.price : 0;
  const getMealOptionsList = () => mealSelected ? Object.values(selectedMealOptions).flat() : [];
  const selectedProductModifiers = (product.popupModifiers || []).filter((modifier) => selectedProductModifierIds.includes(modifier.id));

  const calculateTotalPrice = () => {
    const basePrice = product.price + selectedSizePrice + goLargePrice;
    const mealOptionsTotal = getMealOptionsList().reduce((sum, option) => (
      sum + option.price + (option.selectedModifiers || []).reduce((modifierTotal, modifier) => modifierTotal + modifier.price, 0)
    ), 0);
    const productModifiersTotal = selectedProductModifiers.reduce((total, modifier) => total + modifier.price, 0);
    return (basePrice + mealOptionsTotal + productModifiersTotal) * quantity;
  };

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

  const toggleMealOptionModifier = (groupId: string, option: MealOptionChoice, modifier: MealOptionModifier) => {
    setSelectedMealOptions((current) => {
      const groupSelection = current[groupId];
      const toggleModifier = (selectedOption: MealOptionChoice) => {
        const selectedModifiers = selectedOption.selectedModifiers || [];
        const modifierSelected = selectedModifiers.some((item) => item.id === modifier.id);
        return {
          ...selectedOption,
          selectedModifiers: modifierSelected
            ? selectedModifiers.filter((item) => item.id !== modifier.id)
            : [...selectedModifiers, modifier],
        };
      };

      if (Array.isArray(groupSelection)) {
        return {
          ...current,
          [groupId]: groupSelection.map((selectedOption) => (
            (selectedOption.id || selectedOption.name) === (option.id || option.name)
              ? toggleModifier(selectedOption)
              : selectedOption
          )),
        };
      }

      if (groupSelection && (groupSelection.id || groupSelection.name) === (option.id || option.name)) {
        return { ...current, [groupId]: toggleModifier(groupSelection) };
      }

      return current;
    });
  };

  const toggleProductModifier = (modifierId: string) => {
    setSelectedProductModifierIds((current) => (
      current.includes(modifierId) ? current.filter((id) => id !== modifierId) : [modifierId]
    ));
  };

  const handleAddToCart = () => {
    if (optionVisibility.requiresSize && !selectedSize) {
      setSizeError(true);
      return;
    }

    const missingRequiredMealOptions = mealSelected
      ? MEAL_OPTION_GROUPS.filter((group) => group.required && !selectedMealOptions[group.id]).map((group) => group.id)
      : [];

    if (missingRequiredMealOptions.length > 0) {
      setMealOptionErrors(missingRequiredMealOptions);
      return;
    }

    const selectedSizeLabel = optionVisibility.showSize
      ? product.mealPrice !== undefined || ['vegetarian-collection', 'fried-collection'].includes(categorySlug(product.category))
        ? `${selectedSize}${selectedSizePrice > 0 ? ` +GBP ${selectedSizePrice.toFixed(2)}` : ''}${goLargePrice > 0 ? `, ${goLargeOption.name} +GBP ${goLargePrice.toFixed(2)}` : ''}`
        : `${selectedSize}${goLargePrice > 0 ? `, ${goLargeOption.name}` : ''}`
      : undefined;
    const mealCartAddOns = getMealOptionsList().map(({ id, name, price, selectedModifiers }) => ({
      id,
      name,
      price,
      modifiers: selectedModifiers,
    }));
    const productModifierAddOns = selectedProductModifiers.map(({ id, name, price }) => ({ id, name, price }));
    const unitPrice = calculateTotalPrice() / quantity;

    const cartItem = {
      productId: product.id,
      quantity,
      name: product.name,
      price: unitPrice,
      unitPrice,
      basePrice: product.price,
      image: product.image,
      customization: {
        selectedSize: selectedSizeLabel,
        selectedFlavour: optionVisibility.showFlavour ? selectedFlavour : undefined,
        selectedSpiceLevel: optionVisibility.showFlavour ? selectedFlavour : undefined,
        selectedAddOns: [...mealCartAddOns, ...productModifierAddOns],
        specialInstructions: optionVisibility.showSpecialInstructions ? specialInstructions : undefined,
      },
      totalPrice: calculateTotalPrice(),
    };

    addToCart(cartItem);
    onClose();
    
    // Reset form
    setSelectedSize('Regular');
    setGoLarge(false);
    setSelectedMealOptions({});
    setMealOptionErrors([]);
    setSelectedFlavour('Medium');
    setQuantity(1);
    setSpecialInstructions('');
    setSizeError(false);
    setSelectedProductModifierIds([]);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors z-10"
            aria-label="Close modal"
          >
            <X size={24} className="text-[#1A1A1A]" />
          </button>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
            {/* Left: Product Image */}
            <div className="flex items-center justify-center bg-[#F9F9F9] rounded-xl overflow-hidden h-96">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Product Details & Customization */}
            <div className="flex flex-col gap-6 overflow-y-auto max-h-96 pr-4">
              {/* Product Info */}
              <div>
                <h2 className="text-3xl font-black text-[#1A1A1A] mb-2">{product.name}</h2>
                <p className="text-[#666666] text-sm mb-4">{product.description}</p>
                <p className="text-2xl font-black text-[#99041e]">From GBP {product.price.toFixed(2)}</p>
              </div>

              {/* Size Selection */}
              {optionVisibility.showSize && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-[15px] font-bold text-[#1A1A1A]">Size</label>
                    <span className="text-xs text-[#99041e] font-bold">Required</span>
                  </div>
                  <div className="flex gap-3">
                    {mealSizeOptions.map(size => (
                      <button
                        key={size.name}
                        onClick={() => {
                          setSelectedSize(size.name);
                          if (size.name !== 'Meal') {
                            setGoLarge(false);
                            setSelectedMealOptions({});
                          }
                          setSizeError(false);
                        }}
                        className={`px-6 py-3 rounded-lg font-normal text-sm border-2 transition-all ${
                          selectedSize === size.name
                            ? 'bg-[#99041e] text-white border-[#99041e]'
                            : 'bg-white text-[#1A1A1A] border-[#F0E5D8] hover:border-[#99041e]'
                        }`}
                      >
                        {size.name}
                        {size.price > 0 && ` +GBP ${size.price.toFixed(2)}`}
                      </button>
                    ))}
                  </div>
                  {mealSelected && (
                    <div className="mt-3 flex flex-col gap-3">
                      <label className="text-[15px] font-bold text-[#1A1A1A]">Meal Option</label>
                      <button
                        onClick={() => setGoLarge((current) => !current)}
                        className={`px-6 py-3 rounded-lg font-normal text-sm border-2 transition-all ${
                          goLarge
                            ? 'bg-[#99041e] text-white border-[#99041e]'
                            : 'bg-white text-[#1A1A1A] border-[#F0E5D8] hover:border-[#99041e]'
                        }`}
                      >
                        {goLargeOption.name} +GBP {goLargeOption.price.toFixed(2)}
                      </button>
                    </div>
                  )}
                  {sizeError && <p className="text-xs text-[#99041e] mt-2">Please select a size</p>}
                </div>
              )}

              {/* Flavour / Heat */}
              {optionVisibility.showFlavour && (
                <div>
                  <label className="text-[15px] font-bold text-[#1A1A1A] block mb-3">Flavour / Heat / Spice Level</label>
                  <div className="flex gap-2 flex-wrap">
                    {FLAVOUR_OPTIONS.map(spice => (
                      <button
                        key={spice}
                        onClick={() => setSelectedFlavour(spice)}
                        className={`px-4 py-2 rounded-full font-normal text-sm border-2 transition-all ${
                          selectedFlavour === spice
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                            : 'bg-white text-[#1A1A1A] border-[#F0E5D8] hover:border-[#99041e]'
                        }`}
                      >
                        {spice}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.popupModifiers && product.popupModifiers.length > 0 && (
                <div>
                  <label className="text-[15px] font-bold text-[#1A1A1A] block mb-3">Extras</label>
                  <div className="flex gap-2 flex-wrap">
                    {product.popupModifiers.map((modifier) => {
                      const selected = selectedProductModifierIds.includes(modifier.id);
                      return (
                        <button
                          key={modifier.id}
                          type="button"
                          onClick={() => toggleProductModifier(modifier.id)}
                          aria-pressed={selected}
                          className={`px-4 py-2 rounded-full font-normal text-sm border-2 transition-all ${
                            selected
                              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                              : 'bg-white text-[#1A1A1A] border-[#F0E5D8] hover:border-[#99041e]'
                          }`}
                        >
                          {modifier.name} +GBP {modifier.price.toFixed(2)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mealSelected && MEAL_OPTION_GROUPS.map((group) => (
                <div key={group.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-[15px] font-bold text-[#1A1A1A]">{group.title}</label>
                    {group.required && <span className="text-xs text-[#99041e] font-bold">Required</span>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {group.options.map((option) => {
                      const groupSelection = selectedMealOptions[group.id];
                      const selectedOption = Array.isArray(groupSelection)
                        ? groupSelection.find((item) => (item.id || item.name) === (option.id || option.name))
                        : (groupSelection?.id || groupSelection?.name) === (option.id || option.name) ? groupSelection : undefined;
                      const selected = Boolean(selectedOption);
                      return (
                        <div key={option.id || option.name} className="flex flex-col items-start gap-1">
                          <button
                            onClick={() => toggleMealOption(group, option)}
                            className={`px-4 py-2 rounded-full font-normal text-sm border-2 transition-all ${
                              selected
                                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                : 'bg-white text-[#1A1A1A] border-[#F0E5D8] hover:border-[#99041e]'
                            }`}
                          >
                            {option.name}{option.price > 0 ? ` +GBP ${option.price.toFixed(2)}` : ''}
                          </button>
                          {selected && option.modifiers?.map((modifier) => {
                            const modifierSelected = selectedOption?.selectedModifiers?.some((item) => item.id === modifier.id) || false;
                            return (
                              <button
                                key={modifier.id}
                                type="button"
                                onClick={() => toggleMealOptionModifier(group.id, option, modifier)}
                                aria-pressed={modifierSelected}
                                className={`px-3 py-1 rounded-full font-bold text-[10px] border transition-all ${
                                  modifierSelected
                                    ? 'bg-[#ffc257] text-[#1A1A1A] border-[#ffc257]'
                                    : 'bg-[#FAF8F5] text-[#99041e] border-[#F0E5D8] hover:border-[#99041e]'
                                }`}
                              >
                                Piri Piri +GBP {modifier.price.toFixed(2)}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                  {mealOptionErrors.includes(group.id) && (
                    <p className="text-xs text-[#99041e] mt-2">Please select an option</p>
                  )}
                </div>
              ))}

              {/* Special Instructions */}
              {optionVisibility.showSpecialInstructions && (
                <div>
                  <label className="text-[15px] font-bold text-[#1A1A1A] block mb-2">
                    Special Instructions <span className="text-xs text-[#999999] font-normal">Optional</span>
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Allergies or preparation notes?"
                    className="w-full p-3 border border-[#F0E5D8] rounded-lg text-sm focus:outline-none focus:border-[#99041e] focus:ring-1 focus:ring-[#99041e] resize-none"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Action Area */}
          <div className="border-t border-[#F0E5D8] bg-[#F9F9F9] p-6 sm:p-8 flex items-center justify-between gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-white border border-[#F0E5D8] rounded-lg p-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-[#F5F5F5] rounded transition-colors"
              >
                <Minus size={18} className="text-[#1A1A1A]" />
              </button>
              <span className="w-8 text-center font-bold text-[#1A1A1A]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-[#F5F5F5] rounded transition-colors"
              >
                <Plus size={18} className="text-[#1A1A1A]" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#ffc257] hover:bg-[#e5a93e] text-[#1A1A1A] px-6 py-3 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Add to cart - GBP {calculateTotalPrice().toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
