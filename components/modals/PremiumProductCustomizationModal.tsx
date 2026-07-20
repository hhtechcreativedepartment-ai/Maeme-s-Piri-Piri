'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem, useCart } from '@/lib/cartContext';
import { MENU_DATA, MenuItem } from '@/lib/menuData';
import { FLAVOUR_OPTIONS, MEAL_OPTION_GROUPS, MealOptionChoice, MealOptionGroup, MealOptionModifier, categorySlug, getGoLargeOption, getProductConfiguration } from '@/lib/productOptionConfig';

interface PremiumProductCustomizationModalProps {
  isOpen: boolean;
  product: MenuItem | null;
  onClose: () => void;
  onAdded?: (product: MenuItem) => void;
  editingItem?: CartItem | null;
}

export default function PremiumProductCustomizationModal({
  isOpen,
  product,
  onClose,
  onAdded,
  editingItem,
}: PremiumProductCustomizationModalProps) {
  const { addToCart, removeFromCart } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [goLarge, setGoLarge] = useState(false);
  const [selectedMealOptions, setSelectedMealOptions] = useState<Record<string, MealOptionChoice | MealOptionChoice[]>>({});
  const [mealOptionErrors, setMealOptionErrors] = useState<string[]>([]);
  const [selectedFlavour, setSelectedFlavour] = useState('Medium');
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedProductModifierIds, setSelectedProductModifierIds] = useState<string[]>([]);
  const [platterSidesEnabled, setPlatterSidesEnabled] = useState(false);
  const [selectedPlatterSideIds, setSelectedPlatterSideIds] = useState<string[]>([]);
  const [piriPiriSideIds, setPiriPiriSideIds] = useState<string[]>([]);
  const [selectedPlatterDrinkId, setSelectedPlatterDrinkId] = useState<string | null>(null);
  const [selectedPlatterCakeId, setSelectedPlatterCakeId] = useState<string | null>(null);
  const [selectedFruitShootId, setSelectedFruitShootId] = useState<string | null>(null);
  const [selectedBoxMealDrinkId, setSelectedBoxMealDrinkId] = useState<string | null>(null);
  const [selectedSharingDipIds, setSelectedSharingDipIds] = useState<string[]>([]);
  const [selectedFriedWingsFlavour, setSelectedFriedWingsFlavour] = useState<'Normal' | 'Spicy' | null>(null);
  const [selectedFriedWingsDrinkId, setSelectedFriedWingsDrinkId] = useState<string | null>(null);
  const [selectedFriedWingsDipId, setSelectedFriedWingsDipId] = useState<string | null>(null);
  const [selectedFriedWingsFriesModifierId, setSelectedFriedWingsFriesModifierId] = useState<string | null>(null);
  const [selectedFreeToppingIds, setSelectedFreeToppingIds] = useState<string[]>([]);

  const productConfiguration = useMemo(
    () => getProductConfiguration(product || { category: '', price: 0 }),
    [product],
  );
  const baseCategorySlug = productConfiguration.baseCategorySlug;
  const isPlatter = baseCategorySlug === 'maemes-platter';
  const isKidsMeal = baseCategorySlug === 'kids-meal';
  const isBoxMeal = baseCategorySlug === 'box-meals';
  const isSharingMeal = baseCategorySlug === 'sharing-meal';
  const isFriedWings = baseCategorySlug === 'fried-wings';
  const isFriedChicken = baseCategorySlug === 'fried-chicken';
  const isFriedBoneless = baseCategorySlug === 'fried-boneless';
  const isFriedMealProduct = isFriedWings || isFriedChicken || isFriedBoneless;
  const goLargeOption = getGoLargeOption(product?.category || '', product?.goLargePrice);
  const eligiblePlatterSides = useMemo(() => MENU_DATA.filter((item) => (
    categorySlug(item.category) === 'sides-and-extras'
    && !/(?:tender strips|wings)/i.test(item.name)
  )), []);
  const platterDrinks = useMemo(() => MENU_DATA.filter((item) => (
    categorySlug(item.category) === 'drinks' && /1\.75l bottle$/i.test(item.name)
  )), []);
  const platterCakes = useMemo(() => MENU_DATA
    .filter((item) => categorySlug(item.category) === 'dessert-collection')
    .map((item) => ({ id: String(item.id), name: item.name, image: item.image })), []);
  const fruitShootOptions = useMemo(() => (
    MEAL_OPTION_GROUPS.find((group) => group.id === 'drink')?.options.filter((option) => /fruit ?shoot/i.test(option.name)) || []
  ), []);
  const boxMealDrinkOptions = useMemo(() => MENU_DATA.filter((item) => (
    categorySlug(item.category) === 'drinks' && !/1\.75l bottle$/i.test(item.name)
  )), []);
  const sharingDipOptions = useMemo(() => (
    MEAL_OPTION_GROUPS.find((group) => group.id === 'dip')?.options.filter((option) => option.id) || []
  ), []);
  const friedWingsDrinkOptions = boxMealDrinkOptions;
  const friedWingsDipOptions = sharingDipOptions;
  const friedWingsRegularFries = useMemo(() => MENU_DATA.find((item) => item.slug === 'regular-fries'), []);
  const friedWingsFriesModifier = friedWingsRegularFries?.quickAddOptions?.find((option) => option.id === 'piri-piri-seasoning');

  useEffect(() => {
    if (!isOpen) return;
    setIsSubmitting(false);
    setValidationAttempted(false);
    const savedSize = editingItem?.customization?.selectedSize || editingItem?.selectedSize || '';
    const savedFriedMealConfiguration = editingItem?.customization?.friedMealConfiguration || editingItem?.customization?.friedWingsConfiguration;
    const savedFriedWingsOption = savedFriedMealConfiguration?.option;
    setSelectedSize(productConfiguration.isMealVariant ? 'Meal' : isFriedMealProduct ? savedFriedWingsOption || 'Single' : '');
    setGoLarge(savedSize.includes(goLargeOption.name));
    const savedAddOns = editingItem?.customization?.selectedAddOns || editingItem?.selectedAddOns || [];
    const restoredMealOptions: Record<string, MealOptionChoice | MealOptionChoice[]> = {};
    MEAL_OPTION_GROUPS.forEach((group) => {
      const groupSelections = group.options.flatMap((option) => {
        const savedOption = savedAddOns.find((addOn) => (
          (option.id && addOn.id === option.id) || addOn.name === option.name
        ));
        return savedOption ? [{ ...option, selectedModifiers: savedOption.modifiers || [] }] : [];
      });
      if (groupSelections.length) restoredMealOptions[group.id] = group.multiple ? groupSelections : groupSelections[0];
    });
    setSelectedMealOptions(restoredMealOptions);
    setSelectedProductModifierIds((product?.popupModifiers || [])
      .filter((modifier) => savedAddOns.some((addOn) => addOn.id === modifier.id))
      .map((modifier) => modifier.id));
    setMealOptionErrors([]);
    setSelectedFlavour(baseCategorySlug === 'maemes-burgers'
      ? ''
      : editingItem?.customization?.selectedFlavour || editingItem?.selectedFlavour || 'Medium');
    setQuantity(editingItem?.quantity || 1);
    setSpecialInstructions(editingItem?.customization?.specialInstructions || '');
    const platterSides = editingItem?.customization?.platterSides || [];
    setPlatterSidesEnabled(Boolean(editingItem?.customization?.sidesBundlePrice));
    setSelectedPlatterSideIds(platterSides.map((side) => side.id));
    setPiriPiriSideIds(platterSides.filter((side) => side.modifier?.id === 'piri-piri-seasoning').map((side) => side.id));
    setSelectedPlatterDrinkId(editingItem?.customization?.platterDrink?.id || null);
    setSelectedPlatterCakeId(editingItem?.customization?.platterCake?.id || null);
    setSelectedFruitShootId(editingItem?.customization?.kidsMealIncluded?.fruitShoot?.id || null);
    setSelectedBoxMealDrinkId(editingItem?.customization?.boxMealIncluded?.drink?.id || null);
    setSelectedSharingDipIds((editingItem?.customization?.sharingMealIncluded?.dips || []).flatMap((dip) => (
      Array.from({ length: dip.quantity }, () => dip.id)
    )));
    const savedFriedWingsFlavour = editingItem?.customization?.selectedFlavour || editingItem?.selectedFlavour;
    setSelectedFriedWingsFlavour(savedFriedWingsFlavour === 'Normal' || savedFriedWingsFlavour === 'Spicy' ? savedFriedWingsFlavour : null);
    setSelectedFriedWingsDrinkId(savedFriedMealConfiguration?.drink?.id || null);
    setSelectedFriedWingsDipId(savedFriedMealConfiguration?.dip?.id || null);
    setSelectedFriedWingsFriesModifierId(savedFriedMealConfiguration?.fries?.modifier?.id || null);
    setSelectedFreeToppingIds((editingItem?.customization?.selectedFreeToppings || []).map((topping) => topping.id));
  }, [baseCategorySlug, editingItem, goLargeOption.name, isFriedMealProduct, isOpen, product?.id, productConfiguration.isMealVariant]);

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.requestAnimationFrame(() => modalRef.current?.querySelector<HTMLElement>('button')?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      restoreFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  const optionVisibility = productConfiguration;
  const mealSelected = productConfiguration.isMealVariant;
  const goLargePrice = optionVisibility.showGoLarge && mealSelected && goLarge ? goLargeOption.price : 0;
  const mealOptionsList = useMemo(() => Object.values(selectedMealOptions).flat(), [selectedMealOptions]);
  const mealOptionsTotal = mealSelected
    ? mealOptionsList.reduce((sum, option) => (
      sum + option.price + (option.selectedModifiers || []).reduce((modifierTotal, modifier) => modifierTotal + modifier.price, 0)
    ), 0)
    : 0;
  const selectedPlatterSides = eligiblePlatterSides.filter((side) => selectedPlatterSideIds.includes(String(side.id)));
  const piriPiriTotal = platterSidesEnabled
    ? selectedPlatterSides.filter((side) => piriPiriSideIds.includes(String(side.id))).length * 0.30
    : 0;
  const platterAddOnsTotal = isPlatter
    ? (platterSidesEnabled ? 6 + piriPiriTotal : 0)
      + (selectedPlatterDrinkId ? 1.99 : 0)
      + (selectedPlatterCakeId ? 2.99 : 0)
    : 0;
  const platterSidesComplete = !platterSidesEnabled || selectedPlatterSideIds.length === 3;
  const kidsDrinkComplete = !isKidsMeal || fruitShootOptions.length === 0 || selectedFruitShootId !== null;
  const boxMealDrinkComplete = !isBoxMeal || boxMealDrinkOptions.length === 0 || selectedBoxMealDrinkId !== null;
  const requiredSharingDipCount = product?.requiredDipCount || 0;
  const sharingDipsComplete = !isSharingMeal || selectedSharingDipIds.length === requiredSharingDipCount;
  const friedWingsMealSelected = isFriedMealProduct && selectedSize === 'Meal';
  const friedWingsConfigurationComplete = !isFriedMealProduct || (
    (!isFriedWings || selectedFriedWingsFlavour !== null)
    && (!friedWingsMealSelected || (selectedFriedWingsDrinkId !== null && selectedFriedWingsDipId !== null))
  );
  const selectedProductModifiers = (product?.popupModifiers || []).filter((modifier) => selectedProductModifierIds.includes(modifier.id));
  const selectedFreeToppings = (product?.freeToppings || []).filter((topping) => selectedFreeToppingIds.includes(topping.id));
  const productModifiersTotal = selectedProductModifiers.reduce((total, modifier) => total + modifier.price, 0);
  const friedWingsMealCharge = 0;
  const friedWingsFriesModifierPrice = friedWingsMealSelected && selectedFriedWingsFriesModifierId === friedWingsFriesModifier?.id
    ? friedWingsFriesModifier.price
    : 0;
  const unitPrice = product ? product.price + goLargePrice + mealOptionsTotal + platterAddOnsTotal + productModifiersTotal + friedWingsMealCharge + friedWingsFriesModifierPrice : 0;
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

  const toggleFreeTopping = (toppingId: string) => {
    setSelectedFreeToppingIds((current) => (
      current.includes(toppingId) ? current.filter((id) => id !== toppingId) : [...current, toppingId]
    ));
  };

  const addSharingDip = (dipId: string) => {
    setSelectedSharingDipIds((current) => (
      current.length < requiredSharingDipCount ? [...current, dipId] : current
    ));
  };

  const removeSharingDip = (dipId: string) => {
    setSelectedSharingDipIds((current) => {
      const index = current.lastIndexOf(dipId);
      return index === -1 ? current : current.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const togglePlatterSide = (sideId: string) => {
    setSelectedPlatterSideIds((current) => {
      if (current.includes(sideId)) {
        setPiriPiriSideIds((selected) => selected.filter((id) => id !== sideId));
        return current.filter((id) => id !== sideId);
      }
      return current.length < 3 ? [...current, sideId] : current;
    });
  };

  const togglePiriPiriSide = (sideId: string) => {
    setPiriPiriSideIds((current) => (
      current.includes(sideId) ? current.filter((id) => id !== sideId) : [...current, sideId]
    ));
  };

  const handleAddToCart = () => {
    if (isSubmitting) return;
    const missingRequiredMealOptions = mealSelected
      ? MEAL_OPTION_GROUPS.filter((group) => group.required && !selectedMealOptions[group.id]).map((group) => group.id)
      : [];

    const hasIncompleteRequiredGroup = (
      !platterSidesComplete
      || !kidsDrinkComplete
      || !boxMealDrinkComplete
      || !sharingDipsComplete
      || !friedWingsConfigurationComplete
      || missingRequiredMealOptions.length > 0
    );

    if (hasIncompleteRequiredGroup) {
      setValidationAttempted(true);
      setMealOptionErrors(missingRequiredMealOptions);
      window.requestAnimationFrame(() => {
        const firstInvalid = modalRef.current?.querySelector<HTMLElement>('[data-invalid="true"]');
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid?.focus({ preventScroll: true });
      });
      return;
    }

    const selectedSizeLabel = goLargePrice > 0
      ? `${goLargeOption.name} +£${goLargePrice.toFixed(2)}`
      : undefined;

    const selectedDrink = platterDrinks.find((drink) => String(drink.id) === selectedPlatterDrinkId);
    const selectedCake = platterCakes.find((cake) => cake.id === selectedPlatterCakeId);
    const selectedFruitShoot = fruitShootOptions.find((option) => option.id === selectedFruitShootId);
    const selectedBoxMealDrink = boxMealDrinkOptions.find((drink) => String(drink.id) === selectedBoxMealDrinkId);
    const selectedFriedWingsDrink = friedWingsDrinkOptions.find((drink) => String(drink.id) === selectedFriedWingsDrinkId);
    const selectedFriedWingsDip = friedWingsDipOptions.find((dip) => dip.id === selectedFriedWingsDipId);
    const platterSides = selectedPlatterSides.map((side) => ({
      id: String(side.id),
      name: side.name,
      modifier: piriPiriSideIds.includes(String(side.id))
        ? { id: 'piri-piri-seasoning', name: 'Piri Piri seasoning', price: 0.30 }
        : undefined,
    }));
    const platterAddOns = isPlatter ? [
      ...(platterSidesEnabled ? [{
        name: `3 Sides: ${platterSides.map((side) => `${side.name}${side.modifier ? ` (${side.modifier.name} +£${side.modifier.price.toFixed(2)})` : ''}`).join(', ')}`,
        price: 6 + piriPiriTotal,
      }] : []),
      ...(selectedDrink ? [{ name: `Drink: ${selectedDrink.name}`, price: 1.99 }] : []),
      ...(selectedCake ? [{ name: `Cake Slice: ${selectedCake.name}`, price: 2.99 }] : []),
    ] : [];
    const mealCartAddOns = mealOptionsList.map(({ id, name, price, selectedModifiers }) => ({
      id,
      name,
      price,
      modifiers: selectedModifiers,
    }));
    const productModifierAddOns = selectedProductModifiers.map(({ id, name, price }) => ({ id, name, price }));
    const freeToppingsAddOns = selectedFreeToppings.length > 0 ? [{
      id: 'free-toppings',
      name: `Toppings: ${selectedFreeToppings.map((topping) => topping.name).join(', ')}`,
      price: 0,
    }] : [];
    const includedMainItem = product.includedItems?.[0] || product.description;
    const kidsMealIncluded = isKidsMeal ? {
      mainItem: includedMainItem,
      fries: product.includedItems?.[1] || 'Fries',
      fruitShoot: selectedFruitShoot?.id
        ? { id: selectedFruitShoot.id, name: selectedFruitShoot.name }
        : undefined,
    } : undefined;
    const kidsMealAddOns = kidsMealIncluded ? [{
      id: 'kids-meal-includes',
      name: `Includes: ${kidsMealIncluded.mainItem}, ${kidsMealIncluded.fries}, ${kidsMealIncluded.fruitShoot?.name || 'Fruit Shoot Drink Included'}`,
      price: 0,
    }] : [];
    const boxMealIncluded = isBoxMeal ? {
      items: product.includedItems || [],
      drink: selectedBoxMealDrink
        ? { id: String(selectedBoxMealDrink.id), name: selectedBoxMealDrink.name }
        : undefined,
    } : undefined;
    const boxMealAddOns = boxMealIncluded ? [{
      id: 'box-meal-includes',
      name: `Includes: ${boxMealIncluded.items.join(', ')}${boxMealIncluded.drink ? `, Drink: ${boxMealIncluded.drink.name}` : ', Drink Included'}`,
      price: 0,
    }] : [];
    const sharingMealDips = sharingDipOptions.flatMap((dip) => {
      const quantity = selectedSharingDipIds.filter((dipId) => dipId === dip.id).length;
      return quantity > 0 && dip.id ? [{ id: dip.id, name: dip.name, quantity }] : [];
    });
    const sharingMealIncluded = isSharingMeal ? {
      items: product.includedItems || [],
      dips: sharingMealDips,
    } : undefined;
    const sharingMealAddOns = sharingMealIncluded ? [{
      id: 'sharing-meal-includes',
      name: `Includes: ${sharingMealIncluded.items.join(', ')}; Dips: ${sharingMealIncluded.dips.map((dip) => `${dip.name} ×${dip.quantity}`).join(', ')}`,
      price: 0,
    }] : [];
    const friedWingsConfiguration = isFriedMealProduct ? {
      option: (friedWingsMealSelected ? 'Meal' : 'Single') as 'Single' | 'Meal',
      mealCharge: friedWingsMealCharge,
      fries: friedWingsMealSelected && friedWingsRegularFries ? {
        id: String(friedWingsRegularFries.id),
        name: friedWingsRegularFries.name,
        price: 0,
        modifier: selectedFriedWingsFriesModifierId === friedWingsFriesModifier?.id
          ? friedWingsFriesModifier
          : undefined,
      } : undefined,
      drink: friedWingsMealSelected && selectedFriedWingsDrink
        ? { id: String(selectedFriedWingsDrink.id), name: selectedFriedWingsDrink.name }
        : undefined,
      dip: friedWingsMealSelected && selectedFriedWingsDip?.id
        ? { id: selectedFriedWingsDip.id, name: selectedFriedWingsDip.name }
        : undefined,
    } : undefined;
    const friedWingsAddOns = friedWingsConfiguration ? [
      { id: 'fried-meal-option', name: friedWingsConfiguration.option, price: friedWingsConfiguration.mealCharge },
      ...(friedWingsConfiguration.fries ? [{
        id: friedWingsConfiguration.fries.id,
        name: friedWingsConfiguration.fries.name,
        price: friedWingsConfiguration.fries.price,
        modifiers: friedWingsConfiguration.fries.modifier ? [friedWingsConfiguration.fries.modifier] : undefined,
      }] : []),
      ...(friedWingsConfiguration.drink ? [{ id: friedWingsConfiguration.drink.id, name: `Drink: ${friedWingsConfiguration.drink.name}`, price: 0 }] : []),
      ...(friedWingsConfiguration.dip ? [{ id: friedWingsConfiguration.dip.id, name: `Dip: ${friedWingsConfiguration.dip.name}`, price: 0 }] : []),
    ] : [];
    const configuredAddOns = isPlatter
      ? platterAddOns
      : isKidsMeal
        ? kidsMealAddOns
        : isBoxMeal
          ? boxMealAddOns
          : isSharingMeal
            ? sharingMealAddOns
            : isFriedMealProduct
              ? friedWingsAddOns
              : [...(mealSelected ? mealCartAddOns : []), ...productModifierAddOns, ...freeToppingsAddOns];

    const cartItem = {
      productId: product.id,
      name: product.name,
      image: product.image,
      basePrice: product.price,
      selectedSize: selectedSizeLabel,
      selectedFlavour: isFriedWings ? selectedFriedWingsFlavour || undefined : optionVisibility.showFlavour ? selectedFlavour : undefined,
      selectedSpiceLevel: isFriedWings ? undefined : optionVisibility.showFlavour ? selectedFlavour : undefined,
      selectedAddOns: configuredAddOns,
      specialInstructions: optionVisibility.showSpecialInstructions ? specialInstructions : undefined,
      quantity,
      unitPrice,
      totalPrice: calculatedTotal,
      price: unitPrice,
      customization: {
        selectedSize: selectedSizeLabel,
        selectedFlavour: isFriedWings ? selectedFriedWingsFlavour || undefined : optionVisibility.showFlavour ? selectedFlavour : undefined,
        selectedSpiceLevel: isFriedWings ? undefined : optionVisibility.showFlavour ? selectedFlavour : undefined,
        selectedAddOns: configuredAddOns,
        specialInstructions: optionVisibility.showSpecialInstructions ? specialInstructions : undefined,
        platterSides: platterSidesEnabled ? platterSides : undefined,
        sidesBundlePrice: platterSidesEnabled ? 6 : undefined,
        platterDrink: selectedDrink ? { id: String(selectedDrink.id), name: selectedDrink.name } : undefined,
        drinkAddOnPrice: selectedDrink ? 1.99 : undefined,
        platterCake: selectedCake ? { id: selectedCake.id, name: selectedCake.name } : undefined,
        cakeAddOnPrice: selectedCake ? 2.99 : undefined,
        kidsMealIncluded,
        boxMealIncluded,
        sharingMealIncluded,
        friedMealConfiguration: friedWingsConfiguration,
        friedWingsConfiguration: isFriedWings ? friedWingsConfiguration : undefined,
        selectedFreeToppings: selectedFreeToppings.map(({ id, name }) => ({ id, name })),
      },
    };

    setIsSubmitting(true);
    if (editingItem) removeFromCart(editingItem.productId, editingItem.customization);
    addToCart(cartItem);
    onAdded?.(product);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-[#2b0710]/60" onClick={onClose} />
      <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden p-2 sm:p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
          className="product-config-modal relative flex h-[calc(100dvh-1rem)] max-h-[94dvh] w-full max-w-[620px] flex-col overflow-hidden rounded-[24px] border border-[#f0d59d] bg-[#f7f4f1] shadow-[0_30px_90px_rgba(26,18,15,0.32)] sm:h-[min(94dvh,900px)]"
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-[#99041e] text-white shadow-lg transition hover:bg-[#7f0318] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/60 sm:right-4 sm:top-4"
            aria-label="Close product details"
          >
            <X size={22} />
          </button>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex h-[190px] shrink-0 items-center justify-center overflow-hidden bg-white px-14 py-4 sm:h-[240px] sm:px-20">
              <div className="h-full w-full overflow-hidden bg-white">
                <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="product-config-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-8 pt-5 [scrollbar-color:#99041e_transparent] [scrollbar-width:thin] sm:px-7">
                <div className="product-config-options space-y-4">
                <div className="rounded-2xl bg-white p-5 text-center shadow-[0_8px_24px_rgba(50,24,16,0.06)]">
                  <h2 id="product-detail-title" className="text-2xl font-black leading-tight text-[#99041e] sm:text-3xl">
                    {product.name}
                  </h2>
                  {product.description && <p className="mt-3 text-sm leading-6 text-[#6b5b55]">{product.description}</p>}
                  {product.kcal != null && <p className="mt-2 text-xs font-semibold text-[#8b7a73]">{product.kcal} kcal</p>}
                  <p className="mt-3 text-2xl font-black text-[#99041e]">
                    {product.startingPrice ? 'From ' : ''}£{product.price.toFixed(2)}
                  </p>
                </div>

                {isKidsMeal && (
                  <section
                    data-invalid={validationAttempted && !kidsDrinkComplete}
                    tabIndex={validationAttempted && !kidsDrinkComplete ? -1 : undefined}
                  >
                    <h3 className="mb-3 text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Choose Your Fruit Shoot</h3>
                    {fruitShootOptions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {fruitShootOptions.map((option) => {
                          const selected = selectedFruitShootId === option.id;
                          return (
                            <button
                              key={option.id || option.name}
                              type="button"
                              onClick={() => setSelectedFruitShootId(option.id || option.name)}
                              aria-pressed={selected}
                              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                selected
                                  ? 'border-[#99041e] bg-[#99041e] text-white'
                                  : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'
                              }`}
                            >
                              {option.name} · Included
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-[#ead8c6] bg-[#fff8ed] px-4 py-3 text-sm font-semibold text-[#6b5b55]">
                        Fruit Shoot Drink Included
                      </div>
                    )}
                    {validationAttempted && !kidsDrinkComplete && (
                      <p className="mt-2 text-xs font-bold text-[#99041e]">Please choose one Fruit Shoot.</p>
                    )}
                  </section>
                )}

                {isBoxMeal && product.requiresIncludedDrink && (
                  <section
                    data-invalid={validationAttempted && !boxMealDrinkComplete}
                    tabIndex={validationAttempted && !boxMealDrinkComplete ? -1 : undefined}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Choose Your Drink</h3>
                      {boxMealDrinkOptions.length > 0 && <span className="rounded-full bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">Required</span>}
                    </div>
                    {boxMealDrinkOptions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {boxMealDrinkOptions.map((drink) => {
                          const drinkId = String(drink.id);
                          const selected = selectedBoxMealDrinkId === drinkId;
                          return (
                            <button
                              key={drink.id}
                              type="button"
                              onClick={() => setSelectedBoxMealDrinkId(drinkId)}
                              aria-pressed={selected}
                              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                selected
                                  ? 'border-[#99041e] bg-[#99041e] text-white'
                                  : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'
                              }`}
                            >
                              {drink.name} · Included
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-[#ead8c6] bg-[#fff8ed] px-4 py-3 text-sm font-semibold text-[#6b5b55]">
                        Drink Included
                      </div>
                    )}
                    {validationAttempted && !boxMealDrinkComplete && (
                      <p className="mt-2 text-xs font-bold text-[#99041e]">Please choose one drink.</p>
                    )}
                  </section>
                )}

                {isSharingMeal && (
                  <section
                    data-invalid={validationAttempted && !sharingDipsComplete}
                    tabIndex={validationAttempted && !sharingDipsComplete ? -1 : undefined}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Choose Your Dips</h3>
                        <span className="rounded-full bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">{requiredSharingDipCount} required</span>
                      </div>
                      <span className="rounded-full bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">
                        {selectedSharingDipIds.length} of {requiredSharingDipCount} selected
                      </span>
                    </div>
                    <div className="space-y-2">
                      {sharingDipOptions.map((dip) => {
                        const dipId = dip.id || '';
                        const selectedQuantity = selectedSharingDipIds.filter((selectedId) => selectedId === dipId).length;
                        return (
                          <div key={dipId} className="flex items-center justify-between gap-3 rounded-2xl border border-[#ead8c6] bg-[#fff8ed] px-4 py-2.5">
                            <span className="text-sm font-medium text-[#1a120f]">{dip.name} · Included</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => removeSharingDip(dipId)}
                                disabled={selectedQuantity === 0}
                                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#ead8c6] bg-white text-[#99041e] transition hover:border-[#99041e] disabled:pointer-events-none disabled:opacity-35"
                                aria-label={`Remove ${dip.name}`}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="min-w-8 text-center text-sm font-black text-[#1a120f]">×{selectedQuantity}</span>
                              <button
                                type="button"
                                onClick={() => addSharingDip(dipId)}
                                disabled={selectedSharingDipIds.length >= requiredSharingDipCount}
                                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#ead8c6] bg-white text-[#99041e] transition hover:border-[#99041e] disabled:pointer-events-none disabled:opacity-35"
                                aria-label={`Add ${dip.name}`}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {validationAttempted && !sharingDipsComplete && (
                      <p className="mt-2 text-xs font-bold text-[#99041e]">Please select exactly {requiredSharingDipCount} dips to continue.</p>
                    )}
                  </section>
                )}

                {isFriedMealProduct && (
                  <>
                    {isFriedWings && (
                      <section
                        data-invalid={validationAttempted && selectedFriedWingsFlavour === null}
                        tabIndex={validationAttempted && selectedFriedWingsFlavour === null ? -1 : undefined}
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Choose Your Flavour</h3>
                          <span className="rounded-full bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">Required</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {(['Normal', 'Spicy'] as const).map((flavour) => (
                            <button
                              key={flavour}
                              type="button"
                              onClick={() => setSelectedFriedWingsFlavour(flavour)}
                              aria-pressed={selectedFriedWingsFlavour === flavour}
                              className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                                selectedFriedWingsFlavour === flavour
                                  ? 'border-[#99041e] bg-[#99041e] text-white shadow-[0_14px_32px_rgba(153,4,30,0.20)]'
                                  : 'border-[#ead8c6] bg-[#fff8ed] text-[#1a120f] hover:border-[#99041e]'
                              }`}
                            >
                              {flavour}
                            </button>
                          ))}
                        </div>
                        {validationAttempted && selectedFriedWingsFlavour === null && (
                          <p className="mt-2 text-xs font-bold text-[#99041e]">Please choose one flavour.</p>
                        )}
                      </section>
                    )}

                    {friedWingsMealSelected && (
                      <>
                        <section>
                          <h3 className="mb-3 text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Included Fries</h3>
                          <div className="rounded-2xl border border-[#ead8c6] bg-[#fff8ed] px-4 py-3 text-sm font-semibold text-[#6b5b55]">
                            {friedWingsRegularFries?.name || 'Regular Fries'} — Included
                          </div>
                          {friedWingsFriesModifier && (
                            <button
                              type="button"
                              onClick={() => setSelectedFriedWingsFriesModifierId((current) => (
                                current === friedWingsFriesModifier.id ? null : friedWingsFriesModifier.id
                              ))}
                              aria-pressed={selectedFriedWingsFriesModifierId === friedWingsFriesModifier.id}
                              className={`mt-1.5 rounded-full border px-3 py-1 text-[10px] font-black transition ${
                                selectedFriedWingsFriesModifierId === friedWingsFriesModifier.id
                                  ? 'border-[#ffc257] bg-[#ffc257] text-[#1a120f]'
                                  : 'border-[#ead8c6] bg-[#fff8ed] text-[#99041e] hover:border-[#99041e]'
                              }`}
                            >
                              Piri Piri +£{friedWingsFriesModifier.price.toFixed(2)}
                            </button>
                          )}
                        </section>
                        <section
                          data-invalid={validationAttempted && selectedFriedWingsDrinkId === null}
                          tabIndex={validationAttempted && selectedFriedWingsDrinkId === null ? -1 : undefined}
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Choose Your Drink</h3>
                            <span className="rounded-full bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">Required</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {friedWingsDrinkOptions.map((drink) => {
                              const drinkId = String(drink.id);
                              const selected = selectedFriedWingsDrinkId === drinkId;
                              return (
                                <button
                                  key={drink.id}
                                  type="button"
                                  onClick={() => setSelectedFriedWingsDrinkId(drinkId)}
                                  aria-pressed={selected}
                                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selected ? 'border-[#99041e] bg-[#99041e] text-white' : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'}`}
                                >
                                  {drink.name} · Included
                                </button>
                              );
                            })}
                          </div>
                          {validationAttempted && selectedFriedWingsDrinkId === null && <p className="mt-2 text-xs font-bold text-[#99041e]">Please choose one drink.</p>}
                        </section>
                        <section
                          data-invalid={validationAttempted && selectedFriedWingsDipId === null}
                          tabIndex={validationAttempted && selectedFriedWingsDipId === null ? -1 : undefined}
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Choose Your Dip</h3>
                            <span className="rounded-full bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">Required</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {friedWingsDipOptions.map((dip) => {
                              const dipId = dip.id || '';
                              const selected = selectedFriedWingsDipId === dipId;
                              return (
                                <button
                                  key={dipId}
                                  type="button"
                                  onClick={() => setSelectedFriedWingsDipId(dipId)}
                                  aria-pressed={selected}
                                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selected ? 'border-[#99041e] bg-[#99041e] text-white' : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'}`}
                                >
                                  {dip.name} · Included
                                </button>
                              );
                            })}
                          </div>
                          {validationAttempted && selectedFriedWingsDipId === null && <p className="mt-2 text-xs font-bold text-[#99041e]">Please choose one dip.</p>}
                        </section>
                      </>
                    )}
                  </>
                )}

                {isPlatter && (
                  <>
                    <section
                      data-invalid={validationAttempted && !platterSidesComplete}
                      tabIndex={validationAttempted && !platterSidesComplete ? -1 : undefined}
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Add 3 Sides to any Platter for only £6.00</h3>
                          <p className="mt-1 text-xs font-semibold text-[#6b5b55]">Excludes Tender Strips &amp; Maeme’s Wings</p>
                        </div>
                        <span className="rounded-full bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">
                          {selectedPlatterSideIds.length} of 3 selected
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPlatterSidesEnabled((current) => !current);
                          if (platterSidesEnabled) {
                            setSelectedPlatterSideIds([]);
                            setPiriPiriSideIds([]);
                          }
                        }}
                        aria-pressed={platterSidesEnabled}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                          platterSidesEnabled
                            ? 'border-[#99041e] bg-[#99041e] text-white shadow-[0_14px_32px_rgba(153,4,30,0.20)]'
                            : 'border-[#ead8c6] bg-[#fff8ed] text-[#1a120f] hover:border-[#99041e]'
                        }`}
                      >
                        <span className="text-sm font-black">Add 3 Sides +£6.00</span>
                      </button>

                      {platterSidesEnabled && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {eligiblePlatterSides.map((side) => {
                            const sideId = String(side.id);
                            const selected = selectedPlatterSideIds.includes(sideId);
                            const supportsPiriPiri = Boolean(side.quickAddOptions?.some((option) => option.id === 'piri-piri-seasoning'));
                            const piriPiriSelected = piriPiriSideIds.includes(sideId);
                            return (
                              <div key={side.id} className="flex flex-col gap-1">
                                <button
                                  type="button"
                                  onClick={() => togglePlatterSide(sideId)}
                                  aria-pressed={selected}
                                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                    selected
                                      ? 'border-[#99041e] bg-[#99041e] text-white'
                                      : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'
                                  }`}
                                >
                                  {side.name}
                                </button>
                                {selected && supportsPiriPiri && (
                                  <button
                                    type="button"
                                    onClick={() => togglePiriPiriSide(sideId)}
                                    aria-pressed={piriPiriSelected}
                                    className={`rounded-full border px-3 py-1 text-[10px] font-black transition ${
                                      piriPiriSelected
                                        ? 'border-[#ffc257] bg-[#ffc257] text-[#1a120f]'
                                        : 'border-[#ead8c6] bg-[#fff8ed] text-[#99041e] hover:border-[#99041e]'
                                    }`}
                                  >
                                    Piri Piri +£0.30
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {validationAttempted && platterSidesEnabled && !platterSidesComplete && (
                        <p className="mt-2 text-xs font-bold text-[#99041e]">Please select exactly 3 sides to continue.</p>
                      )}
                    </section>

                    <section>
                      <h3 className="mb-3 text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Add any 1.5L Drink for only £1.99</h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPlatterDrinkId(null)}
                          aria-pressed={selectedPlatterDrinkId === null}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            selectedPlatterDrinkId === null
                              ? 'border-[#99041e] bg-[#99041e] text-white'
                              : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'
                          }`}
                        >
                          No drink
                        </button>
                        {platterDrinks.map((drink) => (
                          <button
                            key={drink.id}
                            type="button"
                            onClick={() => setSelectedPlatterDrinkId(String(drink.id))}
                            aria-pressed={selectedPlatterDrinkId === String(drink.id)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                              selectedPlatterDrinkId === String(drink.id)
                                ? 'border-[#99041e] bg-[#99041e] text-white'
                                : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'
                            }`}
                          >
                            {drink.name.replace(/ 1\.75L Bottle$/i, '')}
                          </button>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="mb-3 text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Add any Cake Slice for only £2.99</h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPlatterCakeId(null)}
                          aria-pressed={selectedPlatterCakeId === null}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            selectedPlatterCakeId === null
                              ? 'border-[#99041e] bg-[#99041e] text-white'
                              : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'
                          }`}
                        >
                          No cake
                        </button>
                        {platterCakes.map((cake) => (
                          <button
                            key={cake.id}
                            type="button"
                            onClick={() => setSelectedPlatterCakeId(cake.id)}
                            aria-pressed={selectedPlatterCakeId === cake.id}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                              selectedPlatterCakeId === cake.id
                                ? 'border-[#99041e] bg-[#99041e] text-white'
                                : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'
                            }`}
                          >
                            {cake.name}
                          </button>
                        ))}
                      </div>
                    </section>
                  </>
                )}

                {optionVisibility.showGoLarge && (
                  <section>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Go Large</h3>
                      <span className="rounded-full border border-[#ffc257] bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">Optional</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGoLarge((current) => !current)}
                      aria-pressed={goLarge}
                      className="border border-[#ead8c6] bg-white px-4 py-3 text-left text-sm font-medium text-[#1a120f]"
                    >
                      <span className="flex flex-1 items-center justify-between gap-4">
                        <span>{goLargeOption.name}</span>
                        <span className="font-black text-[#99041e]">+£{goLargeOption.price.toFixed(2)}</span>
                      </span>
                    </button>
                  </section>
                )}

                {optionVisibility.showFlavour && (
                  <section>
                    <h3 className="mb-3 text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Flavour / Heat / Spice Level</h3>
                    <div className="flex flex-wrap gap-2">
                      {FLAVOUR_OPTIONS.map((flavour) => (
                        <button
                          key={flavour}
                          type="button"
                          onClick={() => setSelectedFlavour(flavour)}
                          aria-pressed={selectedFlavour === flavour}
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

                {product.popupModifiers && product.popupModifiers.length > 0 && (
                  <section>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Extras</h3>
                      <span className="rounded-full border border-[#ffc257] bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">Optional</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.popupModifiers.map((modifier) => {
                        const selected = selectedProductModifierIds.includes(modifier.id);
                        return (
                          <button
                            key={modifier.id}
                            type="button"
                            onClick={() => toggleProductModifier(modifier.id)}
                            aria-pressed={selected}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                              selected
                                ? 'border-[#99041e] bg-[#99041e] text-white'
                                : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'
                            }`}
                          >
                            {modifier.name} +£{modifier.price.toFixed(2)}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {optionVisibility.showMealOptions && MEAL_OPTION_GROUPS.map((group) => (
                    <section
                      key={group.id}
                      data-invalid={mealOptionErrors.includes(group.id)}
                      tabIndex={mealOptionErrors.includes(group.id) ? -1 : undefined}
                    >
                    <div className="mb-3 flex items-center gap-2">
                      <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">{group.title}</h3>
                      {group.required && <span className="rounded-full bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">Required</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((option) => {
                        const groupSelection = selectedMealOptions[group.id];
                        const selectedOption = Array.isArray(groupSelection)
                          ? groupSelection.find((item) => (item.id || item.name) === (option.id || option.name))
                          : (groupSelection?.id || groupSelection?.name) === (option.id || option.name) ? groupSelection : undefined;
                        const selected = Boolean(selectedOption);
                        return (
                          <div key={option.id || option.name} className="flex flex-col items-start gap-1">
                            <button
                              type="button"
                              onClick={() => toggleMealOption(group, option)}
                              aria-pressed={selected}
                              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                selected
                                  ? 'border-[#99041e] bg-[#99041e] text-white'
                                  : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'
                              }`}
                            >
                              {option.name}{option.price > 0 ? ` +£${option.price.toFixed(2)}` : ''}
                            </button>
                            {selected && option.modifiers?.map((modifier) => {
                              const modifierSelected = selectedOption?.selectedModifiers?.some((item) => item.id === modifier.id) || false;
                              return (
                                <button
                                  key={modifier.id}
                                  type="button"
                                  onClick={() => toggleMealOptionModifier(group.id, option, modifier)}
                                  aria-pressed={modifierSelected}
                                  className={`rounded-full border px-3 py-1 text-[10px] font-black transition ${
                                    modifierSelected
                                      ? 'border-[#ffc257] bg-[#ffc257] text-[#1a120f]'
                                      : 'border-[#ead8c6] bg-[#fff8ed] text-[#99041e] hover:border-[#99041e]'
                                  }`}
                                >
                                  Piri Piri +£{modifier.price.toFixed(2)}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                    {mealOptionErrors.includes(group.id) && (
                      <p className="mt-2 text-xs font-bold text-[#99041e]">Please select an option</p>
                    )}
                  </section>
                ))}

                {product.freeToppings && product.freeToppings.length > 0 && (
                  <section>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">19 Free Toppings</h3>
                      <span className="rounded-full border border-[#ffc257] bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">Optional</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.freeToppings.map((topping) => {
                        const selected = selectedFreeToppingIds.includes(topping.id);
                        return (
                          <button
                            key={topping.id}
                            type="button"
                            onClick={() => toggleFreeTopping(topping.id)}
                            aria-pressed={selected}
                            className={`min-h-10 max-w-full whitespace-normal rounded-full border px-4 py-2 text-left text-sm font-medium leading-snug transition ${
                              selected
                                ? 'border-[#99041e] bg-[#99041e] text-white'
                                : 'border-[#ead8c6] bg-white text-[#1a120f] hover:border-[#99041e] hover:bg-[#fff8ed]'
                            }`}
                          >
                            {topping.name}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {optionVisibility.showSpecialInstructions && (
                  <section>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-[15px] font-black uppercase tracking-[0.08em] text-[#1a120f]">Special Instructions</h3>
                      <span className="rounded-full border border-[#ffc257] bg-[#fff8ed] px-2.5 py-1 text-xs font-black text-[#99041e]">Optional</span>
                    </div>
                    <textarea
                      value={specialInstructions}
                      onChange={(event) => setSpecialInstructions(event.target.value)}
                      placeholder="Allergies or preparation notes?"
                      maxLength={240}
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-[#ead8c6] bg-[#fff8ed] p-4 text-sm font-medium text-[#1a120f] outline-none transition placeholder:text-[#8b7a73] focus:border-[#99041e] focus:ring-4 focus:ring-[#ffc257]/25"
                    />
                    <p className="mt-2 text-right text-xs font-semibold text-[#8b7a73]">{240 - specialInstructions.length} characters remaining</p>
                  </section>
                )}
                </div>
              </div>

              <div className="shrink-0 border-t border-[#e5a93e] bg-[#ffc257] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_34px_rgba(50,24,16,0.10)] sm:px-6">
                <div className="flex flex-col gap-3">
                  <div className="mx-auto flex h-12 w-40 items-center justify-between rounded-full border border-[#99041e]/20 bg-white/45 p-1">
                    <button
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      disabled={quantity <= 1}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-[#99041e] transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#99041e]/25 disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="min-w-8 text-center text-base font-black text-[#1a120f]">{quantity}</span>
                    <button
                      onClick={() => setQuantity((current) => current + 1)}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-[#99041e] transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#99041e]/25"
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="min-h-14 w-full rounded-full bg-[#99041e] px-6 py-3 text-base font-black text-white shadow-[0_8px_0_#5f0213] transition hover:bg-[#7f0318] active:translate-y-0.5 active:shadow-[0_5px_0_#5f0213] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Adding…' : `${editingItem ? 'Update Cart' : 'Add to Cart'} · £${calculatedTotal.toFixed(2)}`}
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
