'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Minus, Plus, X } from 'lucide-react';
import { CartItem, CartItemAddOn, useCart } from '@/lib/cartContext';
import { MENU_DATA, MenuItem } from '@/lib/menuData';
import {
  FLAVOUR_OPTIONS,
  MEAL_OPTION_GROUPS,
  MealOptionChoice,
  MealOptionGroup,
  MealOptionModifier,
  ProductConfigurationStepId,
  categorySlug,
  getBaseCategorySlug,
  getGoLargeOption,
  getMealCharge,
  getProductConfigurationSteps,
} from '@/lib/productOptionConfig';

interface Props {
  isOpen: boolean;
  product: MenuItem | null;
  onClose: () => void;
  onAdded?: (product: MenuItem) => void;
  editingItem?: CartItem | null;
  embedded?: boolean;
}

interface OptionRowProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  price?: number;
  detail?: string;
  radio?: boolean;
  disabled?: boolean;
}

function OptionRow({ label, selected, onClick, price, detail, radio, disabled }: OptionRowProps) {
  return (
    <button
      type="button"
      role={radio ? 'radio' : 'checkbox'}
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/45 disabled:cursor-not-allowed disabled:opacity-45 ${selected ? 'border-[#99041e] bg-[#fff3df] shadow-sm' : 'border-[#ead8c6] bg-white hover:border-[#99041e]'}`}
    >
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 border-[#99041e] ${radio ? 'rounded-full' : 'rounded-md'} ${selected ? 'bg-[#99041e] text-white' : 'bg-white'}`}>
        {selected && <Check size={15} strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-black text-[#2e1c18]">{label}</span>
        {detail && <span className="mt-0.5 block text-xs font-semibold text-[#7b6861]">{detail}</span>}
      </span>
      {price !== undefined && <span className="shrink-0 text-sm font-black text-[#99041e]">{price > 0 ? `+£${price.toFixed(2)}` : 'Included'}</span>}
    </button>
  );
}

function getSummaryMetrics(scrollElement: HTMLElement, embedded: boolean) {
  const mobile = embedded || window.innerWidth < 768;
  if (!mobile) {
    return {
      mobile,
      expandedHeight: Math.min(445, Math.max(430, Math.round(scrollElement.clientHeight * 0.46))),
      imageHeight: 280,
      compactHeight: 164,
      compactImageSize: 108,
    };
  }

  const shortViewport = window.innerHeight <= 700 || scrollElement.clientHeight <= 650;
  const expandedHeight = shortViewport ? 300 : window.innerWidth <= 390 ? 330 : 340;
  return {
    mobile,
    expandedHeight,
    imageHeight: shortViewport ? 118 : window.innerWidth <= 390 ? 138 : 145,
    compactHeight: shortViewport ? 112 : 124,
    compactImageSize: shortViewport ? 68 : 78,
  };
}

export default function PremiumProductCustomizationModal({ isOpen, product, onClose, onAdded, editingItem, embedded = false }: Props) {
  const { addToCart, removeFromCart } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const imageTransitionRef = useRef(false);
  const lastProductScrollTopRef = useRef(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCollapsed, setCollapsedState] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const [mealType, setMealType] = useState<'Regular' | 'Meal' | ''>('');
  const [goLarge, setGoLarge] = useState<boolean | null>(null);
  const [selectedFlavour, setSelectedFlavour] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedMealOptions, setSelectedMealOptions] = useState<Record<string, MealOptionChoice | MealOptionChoice[]>>({});
  const [skippedSteps, setSkippedSteps] = useState<string[]>([]);
  const [selectedProductModifierIds, setSelectedProductModifierIds] = useState<string[]>([]);
  const [selectedFreeToppingIds, setSelectedFreeToppingIds] = useState<string[]>([]);
  const [platterSidesEnabled, setPlatterSidesEnabled] = useState(false);
  const [selectedPlatterSideIds, setSelectedPlatterSideIds] = useState<string[]>([]);
  const [piriPiriSideIds, setPiriPiriSideIds] = useState<string[]>([]);
  const [selectedPlatterDrinkId, setSelectedPlatterDrinkId] = useState<string | null>(null);
  const [selectedPlatterCakeId, setSelectedPlatterCakeId] = useState<string | null>(null);
  const [selectedFruitShootId, setSelectedFruitShootId] = useState<string | null>(null);
  const [selectedBoxMealDrinkId, setSelectedBoxMealDrinkId] = useState<string | null>(null);
  const [selectedSharingDipIds, setSelectedSharingDipIds] = useState<string[]>([]);
  const [selectedFriedDrinkId, setSelectedFriedDrinkId] = useState<string | null>(null);
  const [selectedFriedDipId, setSelectedFriedDipId] = useState<string | null>(null);
  const [selectedFriedFriesModifierId, setSelectedFriedFriesModifierId] = useState<string | null>(null);

  const baseCategory = getBaseCategorySlug(product?.category || '');
  const isFried = ['fried-wings', 'fried-chicken', 'fried-boneless'].includes(baseCategory);
  const isPlatter = baseCategory === 'maemes-platter';
  const isKidsMeal = baseCategory === 'kids-meal';
  const isBoxMeal = baseCategory === 'box-meals';
  const isSharingMeal = baseCategory === 'sharing-meal';
  const resolvedMealType = mealType || 'Regular';
  const steps = useMemo(() => product ? getProductConfigurationSteps(product, resolvedMealType) : [], [product, resolvedMealType]);
  const activeStep = steps[Math.min(stepIndex, Math.max(0, steps.length - 1))];
  const mealSelected = mealType === 'Meal';
  const mealCharge = product && mealSelected ? getMealCharge(product) : 0;
  const goLargeOption = getGoLargeOption(product?.category || '', product?.goLargePrice);

  const eligiblePlatterSides = useMemo(() => MENU_DATA.filter((item) => categorySlug(item.category) === 'sides-and-extras' && !/(?:tender strips|wings)/i.test(item.name)), []);
  const platterDrinks = useMemo(() => MENU_DATA.filter((item) => categorySlug(item.category) === 'drinks' && /1\.75l bottle$/i.test(item.name)), []);
  const platterCakes = useMemo(() => MENU_DATA.filter((item) => categorySlug(item.category) === 'dessert-collection'), []);
  const regularDrinks = useMemo(() => MENU_DATA.filter((item) => categorySlug(item.category) === 'drinks' && !/1\.75l bottle$/i.test(item.name)), []);
  const dipOptions = useMemo(() => MEAL_OPTION_GROUPS.find((group) => group.id === 'dip')?.options || [], []);
  const fruitShootOptions = useMemo(() => MEAL_OPTION_GROUPS.find((group) => group.id === 'drink')?.options.filter((item) => /fruit ?shoot/i.test(item.name)) || [], []);
  const regularFries = useMemo(() => MENU_DATA.find((item) => item.slug === 'regular-fries'), []);
  const friesModifier = regularFries?.quickAddOptions?.find((item) => item.id === 'piri-piri-seasoning');

  useEffect(() => {
    if (!isOpen || !product) return;
    const addOns = editingItem?.customization?.selectedAddOns || editingItem?.selectedAddOns || [];
    const friedConfiguration = editingItem?.customization?.friedMealConfiguration || editingItem?.customization?.friedWingsConfiguration;
    const savedSize = editingItem?.customization?.selectedSize || editingItem?.selectedSize || '';
    const restoredMealType = friedConfiguration?.option === 'Meal' || /meal/i.test(savedSize) || addOns.some((item) => item.id === 'meal-type' && item.name === 'Meal') ? 'Meal' : editingItem ? 'Regular' : '';
    setMealType(restoredMealType);
    setGoLarge(/go large/i.test(savedSize) ? true : editingItem ? false : null);
    setSelectedFlavour(editingItem?.customization?.selectedFlavour || editingItem?.selectedFlavour || '');
    setQuantity(editingItem?.quantity || 1);
    setSpecialInstructions(editingItem?.customization?.specialInstructions || editingItem?.specialInstructions || '');
    const restoredOptions: Record<string, MealOptionChoice | MealOptionChoice[]> = {};
    MEAL_OPTION_GROUPS.forEach((group) => {
      const found = group.options.flatMap((option) => {
        const saved = addOns.find((item) => (option.id && item.id === option.id) || item.name === option.name);
        return saved ? [{ ...option, selectedModifiers: saved.modifiers }] : [];
      });
      if (found.length) restoredOptions[group.id] = group.multiple ? found : found[0];
    });
    setSelectedMealOptions(restoredOptions);
    setSelectedProductModifierIds((product.popupModifiers || []).filter((option) => addOns.some((item) => item.id === option.id)).map((option) => option.id));
    setSelectedFreeToppingIds((editingItem?.customization?.selectedFreeToppings || []).map((item) => item.id));
    setSelectedFruitShootId(editingItem?.customization?.kidsMealIncluded?.fruitShoot?.id || null);
    setSelectedBoxMealDrinkId(editingItem?.customization?.boxMealIncluded?.drink?.id || null);
    setSelectedSharingDipIds((editingItem?.customization?.sharingMealIncluded?.dips || []).flatMap((dip) => Array.from({ length: dip.quantity }, () => dip.id)));
    setSelectedPlatterSideIds((editingItem?.customization?.platterSides || []).map((item) => item.id));
    setPiriPiriSideIds((editingItem?.customization?.platterSides || []).filter((item) => item.modifier).map((item) => item.id));
    setPlatterSidesEnabled(Boolean(editingItem?.customization?.sidesBundlePrice));
    setSelectedPlatterDrinkId(editingItem?.customization?.platterDrink?.id || null);
    setSelectedPlatterCakeId(editingItem?.customization?.platterCake?.id || null);
    setSelectedFriedDrinkId(friedConfiguration?.drink?.id || null);
    setSelectedFriedDipId(friedConfiguration?.dip?.id || null);
    setSelectedFriedFriesModifierId(friedConfiguration?.fries?.modifier?.id || null);
    setSkippedSteps([]);
    setStepIndex(0);
    setError('');
    setCollapsedState(false);
    lastProductScrollTopRef.current = 0;
    setIsSubmitting(false);
  }, [editingItem, isOpen, product]);

  useEffect(() => {
    if (!isOpen) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const body = document.body;
    const previousBodyStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      left: body.style.left,
      right: body.style.right,
    };
    const pageScrollY = window.scrollY;
    if (!embedded) {
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${pageScrollY}px`;
      body.style.width = '100%';
      body.style.left = '0';
      body.style.right = '0';
    }
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return onClose();
      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>('button:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus(); }
      if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
    };
    document.addEventListener('keydown', keydown);
    requestAnimationFrame(() => modalRef.current?.querySelector<HTMLElement>('[data-close]')?.focus());
    return () => {
      if (!embedded) {
        body.style.overflow = previousBodyStyles.overflow;
        body.style.position = previousBodyStyles.position;
        body.style.top = previousBodyStyles.top;
        body.style.width = previousBodyStyles.width;
        body.style.left = previousBodyStyles.left;
        body.style.right = previousBodyStyles.right;
        window.scrollTo(0, pageScrollY);
      }
      document.removeEventListener('keydown', keydown);
      restoreFocusRef.current?.focus();
    };
  }, [embedded, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !modalRef.current || !footerRef.current) return;
    const modal = modalRef.current;
    const footer = footerRef.current;
    const updateFooterHeight = () => modal.style.setProperty('--product-footer-height', `${Math.ceil(footer.getBoundingClientRect().height)}px`);
    updateFooterHeight();
    const observer = new ResizeObserver(updateFooterHeight);
    observer.observe(footer);
    return () => {
      observer.disconnect();
      modal.style.removeProperty('--product-footer-height');
    };
  }, [isOpen, stepIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const scrollElement = scrollRef.current;
    const hero = scrollElement?.querySelector<HTMLElement>('header');
    if (!scrollElement || !hero) return;

    const resizeHero = () => {
      const heroImage = hero.querySelector<HTMLElement>('img');
      const heroContent = hero.firstElementChild as HTMLElement | null;
      const metrics = getSummaryMetrics(scrollElement, embedded);
      if (isCollapsed) {
        hero.style.height = `${metrics.compactHeight}px`;
        if (heroImage) {
          heroImage.style.height = `${metrics.compactImageSize}px`;
          heroImage.style.width = `${metrics.compactImageSize}px`;
        }
        if (heroContent && metrics.mobile) {
          heroContent.style.paddingTop = '12px';
          heroContent.style.paddingBottom = '12px';
        }
        return;
      }
      if (heroImage && metrics.mobile) {
        heroImage.style.height = `${metrics.imageHeight}px`;
        heroImage.style.width = '100%';
      } else if (heroImage) {
        heroImage.style.removeProperty('height');
        heroImage.style.removeProperty('width');
      }
      if (heroContent && metrics.mobile) {
        heroContent.style.paddingTop = '28px';
        heroContent.style.paddingBottom = '22px';
      } else if (heroContent) {
        heroContent.style.removeProperty('padding-top');
        heroContent.style.removeProperty('padding-bottom');
      }
      hero.style.height = `${metrics.expandedHeight}px`;
    };

    resizeHero();
    const observer = new ResizeObserver(resizeHero);
    observer.observe(scrollElement);
    return () => observer.disconnect();
  }, [embedded, isCollapsed, isOpen]);

  useEffect(() => {
    setStepIndex((current) => Math.min(current, Math.max(0, steps.length - 1)));
  }, [steps.length]);

  const mealOptionsList = Object.values(selectedMealOptions).flat();
  const mealOptionsTotal = mealSelected ? mealOptionsList.reduce((sum, item) => sum + item.price + (item.selectedModifiers || []).reduce((total, modifier) => total + modifier.price, 0), 0) : 0;
  const selectedModifiers = (product?.popupModifiers || []).filter((item) => selectedProductModifierIds.includes(item.id));
  const selectedFreeToppings = (product?.freeToppings || []).filter((item) => selectedFreeToppingIds.includes(item.id));
  const selectedPlatterSides = eligiblePlatterSides.filter((item) => selectedPlatterSideIds.includes(String(item.id)));
  const platterPrice = isPlatter ? (platterSidesEnabled ? 6 + piriPiriSideIds.length * 0.3 : 0) + (selectedPlatterDrinkId ? 1.99 : 0) + (selectedPlatterCakeId ? 2.99 : 0) : 0;
  const friedModifierPrice = mealSelected && selectedFriedFriesModifierId === friesModifier?.id ? friesModifier.price : 0;
  const unitPrice = (product?.price || 0) + mealCharge + (mealSelected && goLarge ? goLargeOption.price : 0) + mealOptionsTotal + selectedModifiers.reduce((sum, item) => sum + item.price, 0) + platterPrice + friedModifierPrice;
  const total = unitPrice * quantity;

  if (!isOpen || !product || !activeStep) return null;

  const setSkipped = (stepId: string, skipped: boolean) => setSkippedSteps((current) => skipped ? [...new Set([...current, stepId])] : current.filter((id) => id !== stepId));
  const toggleMealOption = (group: MealOptionGroup, option: MealOptionChoice) => {
    setSkipped(group.id, false); setError('');
    setSelectedMealOptions((current) => {
      const selected = current[group.id];
      if (group.multiple) {
        const values = Array.isArray(selected) ? selected : [];
        const exists = values.some((item) => (item.id || item.name) === (option.id || option.name));
        const next = exists ? values.filter((item) => (item.id || item.name) !== (option.id || option.name)) : [...values, option];
        if (!next.length) { const copy = { ...current }; delete copy[group.id]; return copy; }
        return { ...current, [group.id]: next };
      }
      return { ...current, [group.id]: option };
    });
  };
  const toggleModifier = (groupId: string, option: MealOptionChoice, modifier: MealOptionModifier) => setSelectedMealOptions((current) => {
    const selection = current[groupId];
    const change = (item: MealOptionChoice) => ({ ...item, selectedModifiers: (item.selectedModifiers || []).some((value) => value.id === modifier.id) ? (item.selectedModifiers || []).filter((value) => value.id !== modifier.id) : [...(item.selectedModifiers || []), modifier] });
    return { ...current, [groupId]: Array.isArray(selection) ? selection.map((item) => (item.id || item.name) === (option.id || option.name) ? change(item) : item) : selection ? change(selection) : selection };
  });

  const validateStep = (id: ProductConfigurationStepId) => {
    if (id === 'flavour' && !selectedFlavour) return 'Please choose one flavour.';
    if (id === 'meal-type' && !mealType) return 'Please choose Regular or Meal.';
    if (id === 'go-large' && goLarge === null) return 'Please choose Regular Meal or Go Large.';
    if (id.startsWith('meal-')) {
      const groupId = id.replace('meal-', '');
      const group = MEAL_OPTION_GROUPS.find((item) => item.id === groupId);
      if (group && !selectedMealOptions[groupId] && !skippedSteps.includes(groupId)) return group.required ? 'Please select an option.' : 'Choose an option or select Not Now.';
    }
    if (id === 'kids-drink' && fruitShootOptions.length && !selectedFruitShootId) return 'Please choose one Fruit Shoot.';
    if (id === 'box-drink' && regularDrinks.length && !selectedBoxMealDrinkId) return 'Please choose one drink.';
    if (id === 'sharing-dips' && selectedSharingDipIds.length !== (product.requiredDipCount || 0)) return `Please select exactly ${product.requiredDipCount || 0} dips.`;
    if (id === 'fried-drink' && !selectedFriedDrinkId) return 'Please choose one drink.';
    if (id === 'fried-dip' && !selectedFriedDipId) return 'Please choose one dip.';
    if (id === 'platter-sides' && !skippedSteps.includes(id) && (!platterSidesEnabled || selectedPlatterSideIds.length !== 3)) return 'Select exactly 3 sides or choose Not Now.';
    if (['platter-drink', 'platter-cake', 'extras', 'free-toppings', 'special-instructions'].includes(id) && !skippedSteps.includes(id)) {
      const hasValue = id === 'platter-drink' ? selectedPlatterDrinkId : id === 'platter-cake' ? selectedPlatterCakeId : id === 'extras' ? selectedProductModifierIds.length : id === 'free-toppings' ? selectedFreeToppingIds.length : specialInstructions.trim();
      if (!hasValue) return 'Make a selection or choose Not Now.';
    }
    return '';
  };

  const goToStep = (index: number) => {
    setError('');
    setStepIndex(index);
    setCollapsedState(false);
    imageTransitionRef.current = true;
    requestAnimationFrame(() => {
      const scrollElement = scrollRef.current;
      const hero = scrollElement?.querySelector<HTMLElement>('header');
      const heroImage = hero?.querySelector<HTMLElement>('img');
      const heroContent = hero?.firstElementChild as HTMLElement | null;
      if (hero && scrollElement) {
        const metrics = getSummaryMetrics(scrollElement, embedded);
        hero.style.height = `${metrics.expandedHeight}px`;
        if (heroImage && metrics.mobile) {
          heroImage.style.height = `${metrics.imageHeight}px`;
          heroImage.style.width = '100%';
        } else {
          heroImage?.style.removeProperty('height');
          heroImage?.style.removeProperty('width');
        }
        if (heroContent && metrics.mobile) {
          heroContent.style.paddingTop = '28px';
          heroContent.style.paddingBottom = '22px';
        }
      }
      scrollElement?.scrollTo({ top: 0, behavior: 'smooth' });
      window.setTimeout(() => {
        lastProductScrollTopRef.current = 0;
        imageTransitionRef.current = false;
        modalRef.current?.querySelector<HTMLElement>('[data-first-option]')?.focus({ preventScroll: true });
      }, 380);
    });
  };
  const setIsCollapsed = (_requestedCollapsed: boolean) => {
    if (imageTransitionRef.current) return;
    const scrollTop = scrollRef.current?.scrollTop || 0;
    const scrollingUp = scrollTop < lastProductScrollTopRef.current;
    const scrollingDown = scrollTop > lastProductScrollTopRef.current;
    const metrics = scrollRef.current ? getSummaryMetrics(scrollRef.current, embedded) : null;
    const expandedHeaderHeight = metrics?.expandedHeight || 430;
    const compactHeaderHeight = metrics?.compactHeight || 164;
    const contentBoundary = expandedHeaderHeight - compactHeaderHeight;
    lastProductScrollTopRef.current = scrollTop;
    setCollapsedState((current) => {
      const nextCollapsed = current
        ? !(scrollingUp && scrollTop <= contentBoundary)
        : scrollingDown && scrollTop >= contentBoundary;
      if (current === nextCollapsed) return current;
      imageTransitionRef.current = true;
      window.setTimeout(() => {
        lastProductScrollTopRef.current = scrollRef.current?.scrollTop || 0;
        imageTransitionRef.current = false;
      }, 360);
      return nextCollapsed;
    });
  };
  const handleContinue = () => {
    const message = validateStep(activeStep.id);
    if (message) {
      setError(message);
      setCollapsedState(true);
      imageTransitionRef.current = true;
      requestAnimationFrame(() => {
        const hero = scrollRef.current?.querySelector<HTMLElement>('header');
        const heroImage = hero?.querySelector<HTMLElement>('img');
        const metrics = scrollRef.current ? getSummaryMetrics(scrollRef.current, embedded) : null;
        const compactHeight = metrics?.compactHeight || 164;
        if (hero) hero.style.height = `${compactHeight}px`;
        if (heroImage) {
          const imageSize = metrics?.compactImageSize || 108;
          heroImage.style.height = `${imageSize}px`;
          heroImage.style.width = `${imageSize}px`;
        }
        window.setTimeout(() => {
          const invalidSection = modalRef.current?.querySelector<HTMLElement>('[data-invalid="true"]');
          invalidSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          scrollRef.current?.scrollBy({ top: -(compactHeight + 16), behavior: 'smooth' });
          invalidSection?.querySelector<HTMLElement>('[data-first-option]')?.focus({ preventScroll: true });
          lastProductScrollTopRef.current = scrollRef.current?.scrollTop || 0;
          imageTransitionRef.current = false;
        }, 380);
      });
      return;
    }
    if (activeStep.id !== 'confirmation') return goToStep(stepIndex + 1);
    const invalidIndex = steps.findIndex((step) => step.id !== 'confirmation' && validateStep(step.id));
    if (invalidIndex >= 0) { goToStep(invalidIndex); setError(validateStep(steps[invalidIndex].id)); return; }
    submit();
  };

  const submit = () => {
    if (isSubmitting) return;
    const selectedDrink = platterDrinks.find((item) => String(item.id) === selectedPlatterDrinkId);
    const selectedCake = platterCakes.find((item) => String(item.id) === selectedPlatterCakeId);
    const selectedFruitShoot = fruitShootOptions.find((item) => item.id === selectedFruitShootId);
    const selectedBoxDrink = regularDrinks.find((item) => String(item.id) === selectedBoxMealDrinkId);
    const selectedFriedDrink = regularDrinks.find((item) => String(item.id) === selectedFriedDrinkId);
    const selectedFriedDip = dipOptions.find((item) => item.id === selectedFriedDipId);
    const platterSides = selectedPlatterSides.map((item) => ({ id: String(item.id), name: item.name, modifier: piriPiriSideIds.includes(String(item.id)) ? { id: 'piri-piri-seasoning', name: 'Piri Piri seasoning', price: 0.3 } : undefined }));
    const mealAddOns: CartItemAddOn[] = mealSelected ? mealOptionsList.map((item) => ({ id: item.id, name: item.name, price: item.price, modifiers: item.selectedModifiers })) : [];
    const friedConfiguration = isFried ? { option: (mealSelected ? 'Meal' : 'Single') as 'Single' | 'Meal', mealCharge, fries: mealSelected && regularFries ? { id: String(regularFries.id), name: regularFries.name, price: 0, modifier: selectedFriedFriesModifierId === friesModifier?.id ? friesModifier : undefined } : undefined, drink: mealSelected && selectedFriedDrink ? { id: String(selectedFriedDrink.id), name: selectedFriedDrink.name } : undefined, dip: mealSelected && selectedFriedDip?.id ? { id: selectedFriedDip.id, name: selectedFriedDip.name } : undefined } : undefined;
    const sharingDips = dipOptions.flatMap((item) => { const count = selectedSharingDipIds.filter((id) => id === item.id).length; return count && item.id ? [{ id: item.id, name: item.name, quantity: count }] : []; });
    const configuredAddOns: CartItemAddOn[] = [
      { id: 'meal-type', name: mealSelected ? 'Meal' : 'Regular', price: mealCharge },
      ...mealAddOns,
      ...selectedModifiers.map((item) => ({ id: item.id, name: item.name, price: item.price })),
      ...(selectedFreeToppings.length ? [{ id: 'free-toppings', name: `Toppings: ${selectedFreeToppings.map((item) => item.name).join(', ')}`, price: 0 }] : []),
    ];
    const selectedSize = `${mealSelected ? 'Meal' : 'Regular'}${mealSelected && goLarge ? ` · ${goLargeOption.name} +£${goLargeOption.price.toFixed(2)}` : ''}`;
    const cartItem: CartItem = {
      productId: product.id, name: product.name, image: product.image, basePrice: product.price, price: unitPrice, unitPrice, totalPrice: total, quantity, selectedSize,
      selectedFlavour: selectedFlavour || undefined, selectedSpiceLevel: selectedFlavour || undefined, selectedAddOns: configuredAddOns, specialInstructions: specialInstructions || undefined,
      customization: {
        selectedSize, selectedFlavour: selectedFlavour || undefined, selectedSpiceLevel: selectedFlavour || undefined, selectedAddOns: configuredAddOns, specialInstructions: specialInstructions || undefined,
        platterSides: platterSidesEnabled ? platterSides : undefined, sidesBundlePrice: platterSidesEnabled ? 6 : undefined,
        platterDrink: selectedDrink ? { id: String(selectedDrink.id), name: selectedDrink.name } : undefined, drinkAddOnPrice: selectedDrink ? 1.99 : undefined,
        platterCake: selectedCake ? { id: String(selectedCake.id), name: selectedCake.name } : undefined, cakeAddOnPrice: selectedCake ? 2.99 : undefined,
        kidsMealIncluded: isKidsMeal ? { mainItem: product.includedItems?.[0] || product.description, fries: product.includedItems?.[1] || 'Fries', fruitShoot: selectedFruitShoot?.id ? { id: selectedFruitShoot.id, name: selectedFruitShoot.name } : undefined } : undefined,
        boxMealIncluded: isBoxMeal ? { items: product.includedItems || [], drink: selectedBoxDrink ? { id: String(selectedBoxDrink.id), name: selectedBoxDrink.name } : undefined } : undefined,
        sharingMealIncluded: isSharingMeal ? { items: product.includedItems || [], dips: sharingDips } : undefined,
        friedMealConfiguration: friedConfiguration, friedWingsConfiguration: baseCategory === 'fried-wings' ? friedConfiguration : undefined,
        selectedFreeToppings: selectedFreeToppings.map((item) => ({ id: item.id, name: item.name })),
      },
    };
    setIsSubmitting(true);
    if (editingItem) removeFromCart(editingItem.productId, editingItem.customization);
    addToCart(cartItem); onAdded?.(product); onClose();
  };

  const renderMealGroup = (group: MealOptionGroup) => {
    const value = selectedMealOptions[group.id];
    const values = Array.isArray(value) ? value : value ? [value] : [];
    return <div className="space-y-2" role={group.multiple ? 'group' : 'radiogroup'}>{!group.required && <OptionRow label="Not Now" selected={skippedSteps.includes(group.id)} onClick={() => { setSelectedMealOptions((current) => { const next = { ...current }; delete next[group.id]; return next; }); setSkipped(group.id, true); setError(''); }} radio={!group.multiple} />}{group.options.map((option) => { const selected = values.some((item) => (item.id || item.name) === (option.id || option.name)); const selectedValue = values.find((item) => (item.id || item.name) === (option.id || option.name)); return <div key={option.id || option.name}><OptionRow label={option.name} selected={selected} onClick={() => toggleMealOption(group, option)} price={option.price} radio={!group.multiple} />{selected && option.modifiers?.map((modifier) => <div className="ml-9 mt-2" key={modifier.id}><OptionRow label={modifier.name} selected={Boolean(selectedValue?.selectedModifiers?.some((item) => item.id === modifier.id))} onClick={() => toggleModifier(group.id, option, modifier)} price={modifier.price} /></div>)}</div>; })}</div>;
  };

  const renderStep = () => {
    const id = activeStep.id;
    if (id === 'flavour') return <div className="space-y-2" role="radiogroup">{(baseCategory === 'fried-wings' ? ['Normal', 'Spicy'] : FLAVOUR_OPTIONS).map((item) => <OptionRow key={item} label={item} selected={selectedFlavour === item} onClick={() => { setSelectedFlavour(item); setError(''); }} radio />)}</div>;
    if (id === 'meal-type') return <div className="space-y-2" role="radiogroup"><OptionRow label="Regular" detail={`£${product.price.toFixed(2)}`} selected={mealType === 'Regular'} onClick={() => { setMealType('Regular'); setGoLarge(null); setSelectedMealOptions({}); setSelectedFriedDrinkId(null); setSelectedFriedDipId(null); setSelectedFriedFriesModifierId(null); setError(''); }} radio /><OptionRow label="Meal" detail={`£${(product.price + getMealCharge(product)).toFixed(2)}`} selected={mealType === 'Meal'} onClick={() => { setMealType('Meal'); setError(''); }} radio /></div>;
    if (id === 'go-large') return <div className="space-y-2" role="radiogroup"><OptionRow label="Regular Meal" selected={goLarge === false} onClick={() => { setGoLarge(false); setError(''); }} price={0} radio /><OptionRow label={goLargeOption.name} selected={goLarge === true} onClick={() => { setGoLarge(true); setError(''); }} price={goLargeOption.price} radio /></div>;
    if (id.startsWith('meal-')) { const group = MEAL_OPTION_GROUPS.find((item) => item.id === id.replace('meal-', '')); return group ? renderMealGroup(group) : null; }
    if (id === 'kids-drink') return <div className="space-y-2" role="radiogroup">{fruitShootOptions.map((item) => <OptionRow key={item.id || item.name} label={item.name} selected={selectedFruitShootId === item.id} onClick={() => { setSelectedFruitShootId(item.id || item.name); setError(''); }} price={0} radio />)}</div>;
    if (id === 'box-drink' || id === 'fried-drink') { const selected = id === 'box-drink' ? selectedBoxMealDrinkId : selectedFriedDrinkId; return <div className="space-y-2" role="radiogroup">{regularDrinks.map((item) => <OptionRow key={item.id} label={item.name} selected={selected === String(item.id)} onClick={() => { if (id === 'box-drink') setSelectedBoxMealDrinkId(String(item.id)); else setSelectedFriedDrinkId(String(item.id)); setError(''); }} price={0} radio />)}</div>; }
    if (id === 'fried-fries') return <div className="space-y-2"><OptionRow label={regularFries?.name || 'Regular Fries'} selected onClick={() => undefined} price={0} radio />{friesModifier && <OptionRow label={friesModifier.name} selected={selectedFriedFriesModifierId === friesModifier.id} onClick={() => setSelectedFriedFriesModifierId((current) => current === friesModifier.id ? null : friesModifier.id)} price={friesModifier.price} />}</div>;
    if (id === 'fried-dip') return <div className="space-y-2" role="radiogroup">{dipOptions.map((item) => <OptionRow key={item.id || item.name} label={item.name} selected={selectedFriedDipId === item.id} onClick={() => { setSelectedFriedDipId(item.id || item.name); setError(''); }} price={0} radio />)}</div>;
    if (id === 'sharing-dips') return <div className="space-y-2">{dipOptions.map((item) => { const count = selectedSharingDipIds.filter((value) => value === item.id).length; return <div key={item.id || item.name} className="flex items-center justify-between rounded-2xl border border-[#ead8c6] bg-white p-3"><span className="font-bold">{item.name} · Included</span><div className="flex items-center gap-2"><button aria-label={`Remove ${item.name}`} onClick={() => setSelectedSharingDipIds((current) => { const index = current.lastIndexOf(item.id || item.name); return index < 0 ? current : current.filter((_, i) => i !== index); })} className="h-9 w-9 rounded-xl border text-[#99041e]"><Minus size={15} className="mx-auto" /></button><b>{count}</b><button aria-label={`Add ${item.name}`} disabled={selectedSharingDipIds.length >= (product.requiredDipCount || 0)} onClick={() => { setSelectedSharingDipIds((current) => [...current, item.id || item.name]); setError(''); }} className="h-9 w-9 rounded-xl border text-[#99041e] disabled:opacity-40"><Plus size={15} className="mx-auto" /></button></div></div>; })}</div>;
    if (id === 'platter-sides') return <div className="space-y-2"><OptionRow label="Not Now" selected={skippedSteps.includes(id)} onClick={() => { setSkipped(id, true); setPlatterSidesEnabled(false); setSelectedPlatterSideIds([]); setError(''); }} radio /><p className="text-sm font-bold text-[#6b5b55]">{selectedPlatterSideIds.length} of 3 selected</p>{eligiblePlatterSides.map((item) => { const itemId = String(item.id); const selected = selectedPlatterSideIds.includes(itemId); return <div key={item.id}><OptionRow label={item.name} selected={selected} onClick={() => { setSkipped(id, false); setPlatterSidesEnabled(true); setSelectedPlatterSideIds((current) => selected ? current.filter((value) => value !== itemId) : current.length < 3 ? [...current, itemId] : current); setError(''); }} />{selected && item.quickAddOptions?.map((modifier) => <div className="ml-9 mt-2" key={modifier.id}><OptionRow label={modifier.name} selected={piriPiriSideIds.includes(itemId)} onClick={() => setPiriPiriSideIds((current) => current.includes(itemId) ? current.filter((value) => value !== itemId) : [...current, itemId])} price={modifier.price} /></div>)}</div>; })}</div>;
    if (id === 'platter-drink' || id === 'platter-cake') { const items = id === 'platter-drink' ? platterDrinks : platterCakes; const selected = id === 'platter-drink' ? selectedPlatterDrinkId : selectedPlatterCakeId; return <div className="space-y-2" role="radiogroup"><OptionRow label="Not Now" selected={skippedSteps.includes(id)} onClick={() => { setSkipped(id, true); if (id === 'platter-drink') setSelectedPlatterDrinkId(null); else setSelectedPlatterCakeId(null); setError(''); }} radio />{items.map((item) => <OptionRow key={item.id} label={item.name} selected={selected === String(item.id)} onClick={() => { setSkipped(id, false); if (id === 'platter-drink') setSelectedPlatterDrinkId(String(item.id)); else setSelectedPlatterCakeId(String(item.id)); setError(''); }} price={id === 'platter-drink' ? 1.99 : 2.99} radio />)}</div>; }
    if (id === 'extras' || id === 'free-toppings') { const items = id === 'extras' ? product.popupModifiers || [] : product.freeToppings || []; const selected = id === 'extras' ? selectedProductModifierIds : selectedFreeToppingIds; const setter = id === 'extras' ? setSelectedProductModifierIds : setSelectedFreeToppingIds; return <div className="space-y-2"><OptionRow label="Not Now" selected={skippedSteps.includes(id)} onClick={() => { setSkipped(id, true); setter([]); setError(''); }} />{items.map((item) => <OptionRow key={item.id} label={item.name} selected={selected.includes(item.id)} onClick={() => { setSkipped(id, false); setter((current) => current.includes(item.id) ? current.filter((value) => value !== item.id) : item.maxSelections === 1 ? [item.id] : [...current, item.id]); setError(''); }} price={item.price} />)}</div>; }
    if (id === 'special-instructions') return <div><textarea value={specialInstructions} onChange={(event) => { setSpecialInstructions(event.target.value); setSkipped(id, false); setError(''); }} onFocus={(event) => window.setTimeout(() => event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' }), 180)} maxLength={240} rows={4} placeholder="Allergies or preparation notes?" className="w-full resize-none rounded-2xl border border-[#ead8c6] bg-white p-4 outline-none focus:border-[#99041e] focus:ring-4 focus:ring-[#ffc257]/30" /><OptionRow label="Not Now" selected={skippedSteps.includes(id)} onClick={() => { setSpecialInstructions(''); setSkipped(id, true); setError(''); }} /></div>;
    return <div className="space-y-3 rounded-2xl border border-[#ead8c6] bg-white p-5"><p className="font-black text-[#99041e]">{product.name}</p><p className="text-sm text-[#6b5b55]">{selectedFlavour && `Flavour: ${selectedFlavour}`}{mealType && ` · ${mealType}`}{mealSelected && goLarge ? ` · ${goLargeOption.name}` : ''}</p><p className="text-2xl font-black text-[#99041e]">£{total.toFixed(2)}</p></div>;
  };

  return <>{!embedded && <div className="fixed inset-0 z-[70] bg-[#2b0710]/60" onClick={onClose} />}<div className={embedded ? "relative w-full" : "fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4"}><div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="product-detail-title" className={embedded ? "product-config-modal relative flex h-[min(72dvh,720px)] min-h-[560px] w-full flex-col overflow-hidden rounded-[22px] border border-[#f0d59d] bg-[#fffaf2] shadow-sm" : "product-config-modal relative flex h-[calc(100svh-1rem)] max-h-[calc(100svh-1rem)] w-full max-w-none flex-col overflow-hidden rounded-[26px] border border-[#f0d59d] bg-[#fffaf2] shadow-[0_30px_90px_rgba(26,18,15,.35)] supports-[height:100dvh]:h-[calc(100dvh-1rem)] supports-[height:100dvh]:max-h-[calc(100dvh-1rem)] sm:h-[min(94dvh,900px)] sm:max-h-[94dvh] sm:max-w-[620px]"}><button data-close onClick={onClose} aria-label="Close product details" className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex h-12 w-12 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#99041e] text-white focus-visible:ring-4 focus-visible:ring-[#ffc257]"><X size={22} /></button><div ref={scrollRef} onScroll={(event) => setIsCollapsed(event.currentTarget.scrollTop > 56)} className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain pb-[calc(var(--product-footer-height,140px)+1rem)] [scrollbar-color:#99041e_transparent] [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]"><header className={`sticky top-0 z-20 overflow-hidden border-b border-[#f0d59d] bg-white/95 backdrop-blur transition-all duration-300 motion-reduce:transition-none ${isCollapsed ? 'h-[92px]' : 'h-[360px] sm:h-[420px]'}`}><div className={`flex h-full transition-all duration-300 motion-reduce:transition-none ${isCollapsed ? 'items-center gap-3 px-4 pr-16' : 'flex-col items-center justify-center px-8 pb-5 pt-12 text-center'}`}><img src={product.image} alt={product.name} className={`shrink-0 object-contain transition-all duration-300 motion-reduce:transition-none ${isCollapsed ? 'h-16 w-16' : 'h-[230px] w-full sm:h-[280px]'}`} /><div className={isCollapsed ? 'min-w-0' : ''}><h2 id="product-detail-title" className={`${isCollapsed ? 'truncate text-base' : 'mt-2 line-clamp-2 text-[clamp(1.625rem,7vw,2.125rem)] leading-tight sm:text-3xl'} font-black text-[#99041e]`}>{product.name}</h2>{!isCollapsed && product.description && <p className="mx-auto mt-2 line-clamp-3 max-w-lg px-1 text-sm leading-5 text-[#6b5b55]">{product.description}</p>}<p className={`${isCollapsed ? 'text-sm' : 'mt-2 text-xl'} font-black text-[#99041e]`}>£{total.toFixed(2)} {isCollapsed && <span className="ml-2 text-xs text-[#7b6861]">Step {stepIndex + 1} of {steps.length}</span>}</p></div></div></header><main className="px-4 pt-4 sm:px-7 sm:pt-5"><div aria-live="polite" className="mb-4 flex items-center justify-between gap-3"><span className="text-xs font-black uppercase tracking-[.16em] text-[#99041e]">Step {stepIndex + 1} of {steps.length}</span><span className="rounded-full bg-[#fff0d5] px-3 py-1 text-xs font-black text-[#99041e]">{activeStep.optional ? 'Optional' : 'Required'}</span></div><section data-invalid={Boolean(error)} className={`rounded-[22px] border bg-[#fffaf2] p-4 transition sm:p-5 ${error ? 'border-[#99041e] ring-2 ring-[#99041e]/15' : 'border-[#f0d59d]'}`}><h3 className="text-xl font-black text-[#2e1c18]">{activeStep.title}</h3><p className="mt-1 text-sm font-semibold text-[#78645d]">{activeStep.optional ? 'Choose one or more options, or select Not Now.' : 'Complete this selection to continue.'}</p><div data-first-option tabIndex={-1} className="mt-4">{renderStep()}</div>{error && <p role="alert" className="mt-3 text-sm font-black text-[#99041e]">{error}</p>}</section></main></div><footer ref={footerRef} className="absolute inset-x-0 bottom-0 z-30 border-t border-[#e5a93e] bg-[#ffc257] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_34px_rgba(50,24,16,.13)]"><div className={`mb-3 flex items-center gap-3 ${stepIndex > 0 ? 'justify-between' : 'justify-center'}`}>{stepIndex > 0 ? <button onClick={() => goToStep(stepIndex - 1)} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 font-black text-[#99041e] focus-visible:ring-4 focus-visible:ring-white"><ArrowLeft size={18} /> Back</button> : <span />}<div className="flex h-11 items-center rounded-full bg-white/55 p-1"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1} aria-label="Decrease quantity" className="h-9 w-9 rounded-full text-[#99041e] disabled:opacity-40"><Minus size={17} className="mx-auto" /></button><b className="min-w-8 text-center">{quantity}</b><button onClick={() => setQuantity((value) => Math.min(99, value + 1))} aria-label="Increase quantity" className="h-9 w-9 rounded-full text-[#99041e]"><Plus size={17} className="mx-auto" /></button></div></div><button onClick={handleContinue} disabled={isSubmitting} aria-busy={isSubmitting} className="min-h-14 w-full rounded-full bg-[#99041e] px-5 text-base font-black text-white shadow-[0_7px_0_#5f0213] focus-visible:ring-4 focus-visible:ring-white disabled:opacity-60">{isSubmitting ? (editingItem ? 'Updating…' : 'Adding…') : `${editingItem && activeStep.id === 'confirmation' ? 'Update' : 'Add'} · £${total.toFixed(2)}`}</button></footer></div></div></>;
}
