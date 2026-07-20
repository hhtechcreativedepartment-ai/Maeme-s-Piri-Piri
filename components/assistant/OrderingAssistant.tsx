'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bot,
  Check,
  ChevronDown,
  CreditCard,
  Loader2,
  MapPin,
  Mic,
  Minus,
  Plus,
  RotateCcw,
  Send,
  Square,
  Trash2,
  Truck,
  Volume2,
  X,
} from 'lucide-react';
import PremiumProductCustomizationModal from '@/components/modals/PremiumProductCustomizationModal';
import type { Branch } from '@/lib/branchData';
import { createOrder, saveOrder } from '@/lib/orderUtils';
import type { CartItem } from '@/lib/cartContext';
import type { MenuItem } from '@/lib/menuData';
import { getOrderTypeLabel } from '@/lib/orderTypeDisplay';
import { parseIntent } from './intentParser';
import {
  assistantReducer,
  clearAssistantState,
  initialAssistantState,
  loadAssistantState,
  message,
  saveAssistantState,
} from './state';
import { useAssistantServices } from './services';
import type { AssistantCard, AssistantMessage, DemoAddress, DemoPayment } from './types';

interface SpeechRecognitionEventLike {
  results: ArrayLike<{ 0: { transcript: string; confidence: number }; isFinal: boolean }>;
}

interface SpeechRecognitionErrorLike {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const DEFAULT_ADDRESSES: DemoAddress[] = [
  { id: 'home', label: 'Home', summary: 'Home address · UB1', postcode: 'UB1' },
  { id: 'office', label: 'Office', summary: 'Office address · WD17', postcode: 'WD17' },
  { id: 'work', label: 'Work', summary: 'Work address · E8', postcode: 'E8' },
];

const paymentLabels: Record<DemoPayment, string> = {
  cash: 'Cash on Delivery',
  'visa-4242': 'Demo Visa ending 4242',
  'mastercard-4444': 'Demo Mastercard ending 4444',
};

const welcomeActions = ['Start an Order', 'Order My Favourite', 'Recommend Something', 'Reorder', 'View Menu', 'Change Branch'];

function itemUnitPrice(item: CartItem) {
  return item.unitPrice ?? item.price;
}

function itemOptions(item: CartItem) {
  const customization = item.customization;
  return [
    customization?.selectedSize || item.selectedSize,
    customization?.selectedFlavour || item.selectedFlavour || item.selectedSpiceLevel,
    ...(customization?.selectedAddOns || item.selectedAddOns || []).map((addOn) => addOn.name),
    customization?.friedMealConfiguration?.fries?.name,
    customization?.friedMealConfiguration?.drink?.name,
  ].filter(Boolean).join(' · ');
}

export default function OrderingAssistant() {
  const router = useRouter();
  const services = useAssistantServices();
  const [state, dispatch] = useReducer(assistantReducer, initialAssistantState);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [branchQuery, setBranchQuery] = useState('');
  const [addressText, setAddressText] = useState('');
  const [customisingProduct, setCustomisingProduct] = useState<MenuItem | null>(null);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const responseTimer = useRef<number | null>(null);
  const submittedIds = useRef(new Set<string>());
  const productAddedRef = useRef(false);

  const addAssistantMessage = useCallback((text: string, card?: AssistantCard) => {
    dispatch({ type: 'message', message: message('assistant', text, card) });
  }, []);

  useEffect(() => {
    const stored = loadAssistantState();
    if (stored) dispatch({ type: 'hydrate', state: stored });
    if (new URLSearchParams(window.location.search).get('assistant') === 'open') setIsOpen(true);
  }, []);

  useEffect(() => {
    saveAssistantState(state);
  }, [state]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [isResponding, state.messages]);

  useEffect(() => {
    if (!isOpen) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', listener);
    window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.removeEventListener('keydown', listener);
  }, [isOpen]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    if (responseTimer.current) window.clearTimeout(responseTimer.current);
  }, []);

  useEffect(() => {
    if (!isOpen || !services.auth.authenticated || !state.pendingPrivateIntent) return;
    const intent = state.pendingPrivateIntent;
    dispatch({ type: 'privateIntent', intent: null });
    if (intent === 'favourites') {
      const products = services.favourites.all()
        .map((favourite) => services.menu.all().find((product) => String(product.id) === favourite.id))
        .filter((product): product is MenuItem => Boolean(product))
        .slice(0, 4);
      addAssistantMessage(
        products.length ? 'Welcome back. Here are your locally saved favourites.' : 'You do not have any locally saved favourites yet.',
        products.length ? { type: 'products', products, reason: 'Your locally saved favourite' } : undefined
      );
      dispatch({ type: 'navigate', step: products.length ? 'productSelection' : 'intentSelection' });
    } else {
      showPreviousOrders();
    }
  }, [isOpen, services.auth.authenticated, state.pendingPrivateIntent]);

  const currentBranch = services.branches.current;
  const deliveryFee = services.cart.orderType === 'delivery' ? currentBranch?.deliveryFee ?? 0 : 0;
  const serviceCharge = services.cart.items.length ? 0.79 : 0;
  const subtotal = services.cart.total();
  const total = Math.max(0, subtotal + deliveryFee + serviceCharge - state.discount);
  const estimate = services.cart.orderType === 'pickup'
    ? currentBranch?.pickupTime || '15-20 min'
    : currentBranch?.deliveryTime || '35-45 min';

  const respondLater = useCallback((callback: () => void) => {
    setIsResponding(true);
    if (responseTimer.current) window.clearTimeout(responseTimer.current);
    responseTimer.current = window.setTimeout(() => {
      setIsResponding(false);
      callback();
    }, 420);
  }, []);

  const confirmBranch = useCallback(() => {
    if (!currentBranch) {
      addAssistantMessage('Please choose a static demo branch before we build your order.', { type: 'branches', branches: services.branches.all() });
      dispatch({ type: 'navigate', step: 'branchSelection' });
      return;
    }
    if (currentBranch.isOpen === false) {
      addAssistantMessage(`${currentBranch.branchName} is currently marked closed in this frontend demo. Please choose another branch.`, {
        type: 'branches',
        branches: services.branches.all().filter((branch) => branch.isOpen !== false),
      });
      dispatch({ type: 'navigate', step: 'branchSelection' });
      return;
    }
    addAssistantMessage(
      `You’re currently ordering from ${currentBranch.branchName} for postcode ${currentBranch.postcode}. This status uses static demo data. Would you like to continue or change branch?`
    );
    dispatch({ type: 'navigate', step: 'branchConfirmation' });
  }, [addAssistantMessage, currentBranch, services.branches]);

  const showProducts = useCallback((products: MenuItem[], reason?: string) => {
    dispatch({ type: 'matches', products });
    dispatch({ type: 'navigate', step: products.length ? 'productSelection' : 'productSearch' });
    addAssistantMessage(
      products.length ? 'I found these real products in the current frontend menu.' : 'I could not find a matching product in the current frontend menu. Try a product or category name.',
      products.length ? { type: 'products', products, reason } : undefined
    );
  }, [addAssistantMessage]);

  const showMenuCategories = useCallback(() => {
    const categories = Array.from(new Set(services.menu.all().map((product) => product.category)));
    dispatch({ type: 'navigate', step: 'productSelection' });
    addAssistantMessage('Choose a complete menu category to see its real frontend food and products.', {
      type: 'categories',
      categories,
    });
  }, [addAssistantMessage, services.menu]);

  const showFavourites = useCallback(() => {
    if (!services.auth.authenticated) {
      dispatch({ type: 'privateIntent', intent: 'favourites' });
      dispatch({ type: 'navigate', step: 'authentication' });
      addAssistantMessage('Mock sign-in is required to access local favourites. Your basket and assistant conversation will be kept.');
      return;
    }
    const products = services.favourites.all()
      .map((favourite) => services.menu.all().find((product) => String(product.id) === favourite.id))
      .filter((product): product is MenuItem => Boolean(product))
      .slice(0, 4);
    showProducts(products, 'Your locally saved favourite');
  }, [addAssistantMessage, services, showProducts]);

  const showPreviousOrders = useCallback(() => {
    if (!services.auth.authenticated) {
      dispatch({ type: 'privateIntent', intent: 'reorder' });
      dispatch({ type: 'navigate', step: 'authentication' });
      addAssistantMessage('Mock sign-in is required to view locally stored orders. Your current progress will be kept.');
      return;
    }
    const found = services.orders.all()
      .slice(0, 4)
      .flatMap((order) => order.items)
      .map((item) => services.menu.all().find((product) => product.id === item.productId))
      .filter((product): product is MenuItem => Boolean(product))
      .filter((product, index, products) => products.findIndex((candidate) => candidate.id === product.id) === index)
      .slice(0, 4);
    showProducts(found, 'Found in a locally stored previous order; current frontend prices shown');
  }, [addAssistantMessage, services, showProducts]);

  const startCheckout = useCallback(() => {
    if (!services.cart.items.length) {
      addAssistantMessage('Your basket is empty. Choose a real menu product first.');
      dispatch({ type: 'navigate', step: 'productSearch' });
      return;
    }
    addAssistantMessage('Your basket is ready. Would you like Delivery or Collection?', { type: 'cart' });
    dispatch({ type: 'navigate', step: 'orderType' });
  }, [addAssistantMessage, services.cart.items.length]);

  const selectOrderType = useCallback((type: 'delivery' | 'pickup') => {
    if (!currentBranch) {
      confirmBranch();
      return;
    }
    const available = type === 'delivery' ? currentBranch.deliveryAvailable : currentBranch.pickupAvailable;
    if (!available) {
      const alternative = type === 'delivery' ? 'Collection' : 'Delivery';
      addAssistantMessage(`${getOrderTypeLabel(type)} is marked unavailable for this static branch. You can continue with ${alternative} or choose another branch.`);
      return;
    }
    services.cart.setOrderType(type);
    addAssistantMessage(`${getOrderTypeLabel(type)} selected.`);
    if (type === 'delivery') {
      dispatch({ type: 'navigate', step: 'addressSelection' });
      addAssistantMessage('Choose a safe demo address label or enter a short address summary. No delivery-zone claim will be made.');
    } else {
      dispatch({ type: 'navigate', step: 'paymentSelection' });
      addAssistantMessage(`${currentBranch.branchName}, ${currentBranch.address}. Static collection estimate: ${currentBranch.pickupTime}. Choose a demo card.`);
    }
  }, [addAssistantMessage, confirmBranch, currentBranch, services.cart]);

  const selectAddress = useCallback((address: DemoAddress) => {
    dispatch({ type: 'address', address });
    dispatch({ type: 'navigate', step: 'paymentSelection' });
    addAssistantMessage(`${address.label} selected (${address.postcode}). This prototype does not perform real delivery-zone validation. Choose a demo payment method.`);
  }, [addAssistantMessage]);

  const selectPayment = useCallback((payment: DemoPayment) => {
    dispatch({ type: 'payment', payment });
    if (payment !== 'cash') addAssistantMessage('This is a frontend demonstration. No payment will be charged.');
    if (!services.auth.authenticated) {
      dispatch({ type: 'navigate', step: 'authentication' });
      addAssistantMessage('Please complete the existing mock login before final confirmation. Your assistant state and basket will be restored.');
      return;
    }
    dispatch({ type: 'navigate', step: 'finalConfirmation' });
    addAssistantMessage('Review the complete demo summary below. The order will only be created after explicit confirmation.', { type: 'cart' });
  }, [addAssistantMessage, services.auth.authenticated]);

  const placeDemoOrder = useCallback(() => {
    if (state.isProcessing || !currentBranch || !services.cart.items.length || !state.payment) return;
    if (services.cart.orderType === 'delivery' && !state.selectedAddress) {
      dispatch({ type: 'navigate', step: 'addressSelection' });
      addAssistantMessage('Please select a demo delivery address before confirming.');
      return;
    }
    const submissionId = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    if (submittedIds.current.has(submissionId)) return;
    submittedIds.current.add(submissionId);
    dispatch({ type: 'processing', submissionId });

    responseTimer.current = window.setTimeout(() => {
      try {
        const order = createOrder({
          branchName: currentBranch.branchName,
          branchAddress: currentBranch.address,
          deliveryAddress: state.selectedAddress?.summary,
          orderType: services.cart.orderType || 'delivery',
          items: services.cart.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: itemUnitPrice(item),
            quantity: item.quantity,
          })),
          subtotal,
          deliveryFee,
          total,
          paymentMethod: state.payment === 'cash' ? 'cash' : 'card',
        });
        saveOrder(order);
        services.orders.add(order);
        services.cart.clear();
        dispatch({ type: 'receipt', order });
        dispatch({
          type: 'message',
          message: message('assistant', 'Your frontend demo order is confirmed. No restaurant or payment service was contacted.', {
            type: 'receipt',
            order,
            discount: state.discount,
            address: state.selectedAddress?.summary,
          }),
        });
      } catch {
        dispatch({ type: 'error', error: 'The local demo order could not be created. Your basket has been kept.' });
      }
    }, 900);
  }, [addAssistantMessage, currentBranch, deliveryFee, services.cart, services.orders, state.discount, state.isProcessing, state.payment, state.selectedAddress, subtotal, total]);

  const handleIntent = useCallback((raw: string) => {
    const parsed = parseIntent(raw, services.menu.all());
    switch (parsed.type) {
      case 'restart':
        services.cart.clear();
        clearAssistantState();
        dispatch({ type: 'reset' });
        addAssistantMessage('Started again. No order was placed.');
        return;
      case 'cancel':
        dispatch({ type: 'navigate', step: 'cartReview' });
        addAssistantMessage('Order preparation cancelled. No demo order was placed; your basket is still available.');
        return;
      case 'back':
        dispatch({ type: 'back' });
        return;
      case 'branch':
        addAssistantMessage('Choose from the static demo branches below.', { type: 'branches', branches: services.branches.all() });
        dispatch({ type: 'navigate', step: 'branchSelection' });
        return;
      case 'favourites':
        showFavourites();
        return;
      case 'reorder':
        showPreviousOrders();
        return;
      case 'cart':
        addAssistantMessage('Here is your basket.', { type: 'cart' });
        dispatch({ type: 'navigate', step: 'cartReview' });
        return;
      case 'checkout':
        startCheckout();
        return;
      case 'menu':
        showMenuCategories();
        return;
      case 'delivery':
        selectOrderType('delivery');
        return;
      case 'collection':
        selectOrderType('pickup');
        return;
      case 'address': {
        const address = DEFAULT_ADDRESSES.find((candidate) => candidate.label === parsed.label);
        if (address) selectAddress(address);
        return;
      }
      case 'customise': {
        const item = services.cart.items.at(-1);
        const product = state.selectedProduct || (item && services.menu.all().find((candidate) => candidate.id === item.productId));
        if (!product) {
          addAssistantMessage('Choose a product first, then I can open its real frontend options for that change.');
          return;
        }
        if (item) setEditingItem(item);
        setCustomisingProduct(product);
        dispatch({ type: 'navigate', step: 'productCustomisation' });
        addAssistantMessage(`I understood “${parsed.instruction}”. Use the product’s existing option controls to confirm the exact available choice and price.`);
        return;
      }
      case 'confirm':
        if (state.step === 'finalConfirmation') placeDemoOrder();
        else addAssistantMessage('I will only accept that confirmation on the final review step.');
        return;
      case 'recommend': {
        const products = services.menu.recommend(parsed.appetite, parsed.budget);
        const reason = parsed.budget
          ? `Within your £${parsed.budget.toFixed(2)} frontend budget`
          : parsed.appetite === 'light'
            ? 'Good for a light meal'
            : parsed.appetite === 'hungry'
              ? 'A filling meal option'
              : parsed.appetite === 'vegetarian'
                ? 'From the Vegetarian Collection'
                : 'A popular menu choice';
        showProducts(products, reason);
        return;
      }
      case 'product':
        showProducts(parsed.matches);
        return;
      default:
        addAssistantMessage('I did not recognise that yet. Try a product name, “recommend something,” “show cart,” or use a quick action.');
    }
  }, [addAssistantMessage, placeDemoOrder, selectOrderType, services, showFavourites, showPreviousOrders, showProducts, startCheckout, state.step]);

  const sendText = useCallback((value = input) => {
    const trimmed = value.trim();
    if (!trimmed || isResponding) return;
    setInput('');
    dispatch({ type: 'message', message: message('user', trimmed) });
    respondLater(() => handleIntent(trimmed));
  }, [handleIntent, input, isResponding, respondLater]);

  const handleQuickAction = (action: string) => {
    dispatch({ type: 'message', message: message('user', action) });
    switch (action) {
      case 'Start an Order':
        confirmBranch();
        break;
      case 'Continue with This Branch':
        dispatch({ type: 'navigate', step: 'intentSelection' });
        addAssistantMessage('Great. What would you like to order? You can name a product or ask for a recommendation.');
        break;
      case 'Order My Favourite':
        showFavourites();
        break;
      case 'Recommend Something':
        addAssistantMessage('How hungry are you?');
        dispatch({ type: 'navigate', step: 'intentSelection' });
        break;
      case 'Reorder':
        showPreviousOrders();
        break;
      case 'View Menu':
        showMenuCategories();
        break;
      case 'Change Branch':
      case 'Change Postcode':
      case 'View Nearby Branches':
      case 'View All Branches':
        addAssistantMessage('These are static demo branches; no live distance is claimed.', { type: 'branches', branches: services.branches.all() });
        dispatch({ type: 'navigate', step: 'branchSelection' });
        break;
      case 'Light Bite':
        showProducts(services.menu.recommend('light'), 'Good for a light meal');
        break;
      case 'Normal Hunger':
        showProducts(services.menu.recommend('normal'), 'A balanced menu choice');
        break;
      case 'Very Hungry':
        showProducts(services.menu.recommend('hungry'), 'A filling meal option');
        break;
      case 'Continue to Checkout':
        startCheckout();
        break;
      case 'Delivery':
        selectOrderType('delivery');
        break;
      case 'Collection':
        selectOrderType('pickup');
        break;
      case 'Place Demo Order':
        placeDemoOrder();
        break;
      case 'Start Another Order':
        clearAssistantState();
        dispatch({ type: 'reset' });
        break;
      default:
        handleIntent(action);
    }
  };

  const startVoice = () => {
    setVoiceError('');
    const speechWindow = window as WindowWithSpeech;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceError('Voice recognition is not supported in this browser. Text ordering is fully available.');
      return;
    }
    try {
      const recognition = new Recognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-GB';
      recognition.onresult = (event) => {
        const latest = event.results[event.results.length - 1];
        const transcript = latest?.[0]?.transcript || '';
        setInput(transcript);
        if (latest?.isFinal && latest[0].confidence < 0.55) {
          setVoiceError('The transcript may be unclear. Please edit it before sending.');
        }
      };
      recognition.onerror = (event) => {
        setIsListening(false);
        setVoiceError(event.error === 'not-allowed'
          ? 'Microphone permission was denied. You can continue by typing.'
          : 'Voice input stopped. You can edit the transcript or continue by typing.');
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setVoiceError('Voice input could not start. Text ordering is fully available.');
    }
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const clearConversation = () => {
    clearAssistantState();
    dispatch({ type: 'reset' });
    setInput('');
    setVoiceError('');
  };

  const branchResults = useMemo(
    () => branchQuery.trim() ? services.branches.search(branchQuery) : services.branches.all(),
    [branchQuery, services.branches]
  );

  const quickReplies = (() => {
    if (state.step === 'welcome') return welcomeActions;
    if (state.step === 'branchConfirmation') return ['Continue with This Branch', 'Change Postcode', 'View Nearby Branches', 'View All Branches'];
    if (state.step === 'intentSelection') return ['Light Bite', 'Normal Hunger', 'Very Hungry', 'View Menu'];
    if (state.step === 'cartReview') return ['Continue to Checkout', 'View Menu', 'Change Branch'];
    if (state.step === 'orderType') return ['Delivery', 'Collection'];
    if (state.step === 'finalConfirmation') return ['Place Demo Order'];
    if (state.step === 'receipt') return ['Start Another Order'];
    return [];
  })();

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group fixed bottom-3 right-3 z-[80] flex h-24 w-24 items-center justify-center rounded-full transition duration-300 hover:-translate-y-1 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257] sm:bottom-5 sm:right-5 sm:h-32 sm:w-32"
          aria-label="Open Maeme’s Ordering Assistant"
        >
          <img
            src="/images/maemes-ordering-assistant.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain drop-shadow-[0_14px_24px_rgba(153,4,30,0.28)] transition group-hover:drop-shadow-[0_18px_30px_rgba(153,4,30,0.38)]"
          />
        </button>
      )}

      {isOpen && (
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Maeme’s AI Ordering Assistant frontend prototype"
          className="fixed inset-0 z-[100] flex bg-white sm:inset-auto sm:bottom-5 sm:right-5 sm:top-24 sm:h-[calc(100vh-7.25rem)] sm:w-[min(460px,calc(100vw-2.5rem))] sm:overflow-hidden sm:rounded-[26px] sm:border sm:border-[#ead8c6] sm:shadow-[0_28px_90px_rgba(50,24,16,0.24)]"
        >
          <div className="flex min-h-0 w-full flex-col bg-[#fffaf2]">
            <header className="flex min-h-[76px] shrink-0 items-center gap-3 border-b border-[#ead8c6] bg-[#99041e] px-4 text-white">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ffc257] text-[#99041e]">
                <Bot size={24} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-black">Maeme’s Ordering Assistant</h2>
                <p className="text-xs font-semibold text-white/75">Frontend prototype · static demo data</p>
              </div>
              <button onClick={() => dispatch({ type: 'back' })} disabled={!state.history.length} className="flex h-11 w-11 items-center justify-center rounded-xl text-white transition hover:bg-white/10 disabled:opacity-30" aria-label="Go back">
                <ArrowLeft size={20} />
              </button>
              <button onClick={() => setIsOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-xl text-white transition hover:bg-white/10" aria-label="Minimise assistant">
                <ChevronDown size={22} />
              </button>
              <button onClick={() => setIsOpen(false)} className="hidden h-11 w-11 items-center justify-center rounded-xl text-white transition hover:bg-white/10 sm:flex" aria-label="Close assistant">
                <X size={21} />
              </button>
            </header>

            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4">
              <div className="space-y-4">
                {state.messages.map((entry) => (
                  <MessageBubble
                    key={entry.id}
                    entry={entry}
                    services={services}
                    onProduct={(product) => {
                      dispatch({ type: 'selectProduct', product });
                      dispatch({ type: 'navigate', step: 'productCustomisation' });
                      setCustomisingProduct(product);
                    }}
                    onCategory={(category) => {
                      const products = services.menu.all()
                        .filter((product) => product.category === category)
                        .slice(0, 4);
                      showProducts(products, `From ${category}`);
                    }}
                    onBranch={(branchId) => {
                      const branch = services.branches.all().find((candidate) => candidate.branchId === branchId);
                      if (!branch || branch.isOpen === false) return;
                      services.branches.select(branchId, services.cart.orderType || 'delivery');
                      addAssistantMessage(`${branch.branchName} selected. Its status and service information are static demo data.`);
                      dispatch({ type: 'navigate', step: 'intentSelection' });
                    }}
                    onRemove={services.cart.remove}
                    onQuantity={services.cart.quantity}
                    onEdit={(item) => {
                      const product = services.menu.all().find((candidate) => candidate.id === item.productId);
                      if (product) {
                        setEditingItem(item);
                        setCustomisingProduct(product);
                      }
                    }}
                  />
                ))}

                {state.step === 'branchSelection' && (
                  <div className="rounded-2xl border border-[#ead8c6] bg-white p-3 shadow-sm">
                    <label className="text-xs font-black uppercase tracking-[0.12em] text-[#99041e]" htmlFor="assistant-branch-search">Search static branches</label>
                    <input id="assistant-branch-search" value={branchQuery} onChange={(event) => setBranchQuery(event.target.value)} placeholder="Postcode, branch or area" className="mt-2 min-h-11 w-full rounded-xl border border-[#ead8c6] px-3 text-sm font-semibold outline-none focus:border-[#99041e] focus:ring-4 focus:ring-[#ffc257]/30" />
                    <BranchCards branches={branchResults} onSelect={(branchId) => {
                      const branch = services.branches.all().find((candidate) => candidate.branchId === branchId);
                      if (!branch || branch.isOpen === false) return;
                      services.branches.select(branchId, services.cart.orderType || 'delivery');
                      addAssistantMessage(`${branch.branchName} selected using static frontend data.`);
                      dispatch({ type: 'navigate', step: 'intentSelection' });
                    }} />
                  </div>
                )}

                {state.step === 'addressSelection' && (
                  <div className="space-y-2 rounded-2xl border border-[#ead8c6] bg-white p-3">
                    {DEFAULT_ADDRESSES.map((address) => (
                      <button key={address.id} onClick={() => selectAddress(address)} className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-[#ead8c6] p-3 text-left transition hover:border-[#99041e] hover:bg-[#fff8ed]">
                        <MapPin size={20} className="text-[#99041e]" />
                        <span><strong className="block text-sm">{address.label}</strong><span className="text-xs text-[#6b5b55]">{address.summary}</span></span>
                      </button>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <input value={addressText} onChange={(event) => setAddressText(event.target.value)} placeholder="Short demo address summary" className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#ead8c6] px-3 text-sm outline-none focus:border-[#99041e]" />
                      <button
                        onClick={() => {
                          if (!addressText.trim()) return;
                          selectAddress({ id: `custom-${Date.now()}`, label: 'Home', summary: addressText.trim(), postcode: currentBranch?.postcode || 'Demo' });
                        }}
                        className="min-h-11 rounded-xl bg-[#ffc257] px-4 text-sm font-black text-[#1a120f]"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                )}

                {state.step === 'paymentSelection' && (
                  <div className="space-y-2 rounded-2xl border border-[#ead8c6] bg-white p-3">
                    {services.cart.orderType === 'delivery' && <PaymentChoice label="Cash on Delivery" icon={<Truck size={20} />} onClick={() => selectPayment('cash')} />}
                    <PaymentChoice label="Demo Visa ending 4242" icon={<CreditCard size={20} />} onClick={() => selectPayment('visa-4242')} />
                    <PaymentChoice label="Demo Mastercard ending 4444" icon={<CreditCard size={20} />} onClick={() => selectPayment('mastercard-4444')} />
                    <p className="rounded-xl bg-[#fff8ed] p-3 text-xs font-semibold leading-5 text-[#6b5b55]">Demo methods only. Do not enter real card details. No payment will be charged.</p>
                  </div>
                )}

                {state.step === 'authentication' && !services.auth.authenticated && (
                  <div className="rounded-2xl border border-[#ffc257] bg-white p-4 text-center shadow-sm">
                    <p className="text-sm font-black text-[#1a120f]">Mock login required</p>
                    <p className="mt-1 text-xs leading-5 text-[#6b5b55]">Your assistant state is saved locally and will reopen at this step.</p>
                    <button
                      onClick={() => {
                        saveAssistantState(state);
                        router.push(`/login?redirect=${encodeURIComponent('/?assistant=open')}`);
                      }}
                      className="mt-3 min-h-11 rounded-xl bg-[#99041e] px-5 text-sm font-black text-white"
                    >
                      Continue to Mock Login
                    </button>
                  </div>
                )}

                {state.step === 'finalConfirmation' && (
                  <FinalSummary
                    branchName={currentBranch?.branchName || 'Not selected'}
                    postcode={currentBranch?.postcode || 'Not selected'}
                    orderType={getOrderTypeLabel(services.cart.orderType)}
                    address={state.selectedAddress?.summary}
                    items={services.cart.items}
                    subtotal={subtotal}
                    discount={state.discount}
                    deliveryFee={deliveryFee}
                    serviceCharge={serviceCharge}
                    total={total}
                    payment={state.payment ? paymentLabels[state.payment] : 'Not selected'}
                    estimate={estimate}
                    processing={state.isProcessing}
                    onConfirm={placeDemoOrder}
                  />
                )}

                {state.step === 'orderProcessing' && (
                  <div className="flex items-center gap-3 rounded-2xl border border-[#ead8c6] bg-white p-4 text-sm font-bold text-[#99041e]" role="status">
                    <Loader2 className="animate-spin" size={20} />
                    Creating local demo order…
                  </div>
                )}

                {state.step === 'error' && (
                  <div className="rounded-2xl border border-[#99041e]/30 bg-white p-4">
                    <p className="text-sm font-bold text-[#99041e]">{state.error}</p>
                    <button onClick={() => dispatch({ type: 'navigate', step: 'cartReview' })} className="mt-3 min-h-11 rounded-xl bg-[#ffc257] px-4 text-sm font-black">Return to basket</button>
                  </div>
                )}

                {quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-2" aria-label="Suggested actions">
                    {quickReplies.map((action) => (
                      <button key={action} onClick={() => handleQuickAction(action)} disabled={state.isProcessing} className="min-h-11 rounded-full border border-[#99041e]/25 bg-white px-4 py-2 text-xs font-black text-[#99041e] shadow-sm transition hover:border-[#99041e] hover:bg-[#fff3dc] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/40 disabled:opacity-50">
                        {action}
                      </button>
                    ))}
                  </div>
                )}

                {isResponding && (
                  <div className="flex w-fit items-center gap-2 rounded-2xl rounded-bl-md border border-[#ead8c6] bg-white px-4 py-3 text-xs font-bold text-[#6b5b55]" role="status">
                    <Loader2 size={16} className="animate-spin text-[#99041e]" />
                    Preparing a demo response…
                  </div>
                )}
              </div>
            </div>

            <footer className="shrink-0 border-t border-[#ead8c6] bg-white p-3">
              {(voiceError || isListening) && (
                <div className={`mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${isListening ? 'bg-[#fff3dc] text-[#99041e]' : 'bg-[#fff1f3] text-[#99041e]'}`} role="status" aria-live="polite">
                  <Volume2 size={16} className={isListening ? 'animate-pulse' : ''} />
                  <span className="flex-1">{isListening ? 'Listening… Review and edit the transcript before sending.' : voiceError}</span>
                  {isListening && <button onClick={stopVoice} className="flex min-h-9 items-center gap-1 rounded-lg bg-[#99041e] px-2 text-white"><Square size={13} /> Stop</button>}
                </div>
              )}
              <form onSubmit={(event) => { event.preventDefault(); sendText(); }} className="flex items-end gap-2">
                <button type="button" onClick={clearConversation} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#ead8c6] text-[#99041e] transition hover:bg-[#fff8ed]" aria-label="Clear conversation">
                  <RotateCcw size={19} />
                </button>
                <label className="sr-only" htmlFor="assistant-message">Message the ordering assistant</label>
                <input ref={inputRef} id="assistant-message" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your order…" className="min-h-12 min-w-0 flex-1 rounded-xl border border-[#ead8c6] bg-[#fffaf2] px-4 text-sm font-semibold text-[#1a120f] outline-none placeholder:text-[#8b7a73] focus:border-[#99041e] focus:ring-4 focus:ring-[#ffc257]/30" />
                <button type="button" onClick={isListening ? stopVoice : startVoice} className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/40 ${isListening ? 'border-[#99041e] bg-[#99041e] text-white' : 'border-[#ead8c6] text-[#99041e] hover:bg-[#fff8ed]'}`} aria-label={isListening ? 'Stop listening' : 'Start voice input'} aria-pressed={isListening}>
                  {isListening ? <Square size={18} /> : <Mic size={20} />}
                </button>
                <button type="submit" disabled={!input.trim() || isResponding} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ffc257] text-[#1a120f] transition hover:bg-[#e5a93e] disabled:opacity-40" aria-label="Send message">
                  <Send size={19} />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] font-semibold text-[#8b7a73]">Deterministic frontend parser · not a live AI or ordering service</p>
            </footer>
          </div>
        </section>
      )}

      <PremiumProductCustomizationModal
        isOpen={Boolean(customisingProduct)}
        product={customisingProduct}
        editingItem={editingItem}
        onClose={() => {
          setCustomisingProduct(null);
          setEditingItem(null);
          if (productAddedRef.current) {
            productAddedRef.current = false;
          } else {
            dispatch({ type: 'navigate', step: services.cart.items.length ? 'cartReview' : 'productSelection' });
          }
        }}
        onAdded={(product) => {
          productAddedRef.current = true;
          addAssistantMessage(`${product.name} has been added through the website’s active basket.`, { type: 'cart' });
          dispatch({ type: 'navigate', step: 'cartReview' });
          setCustomisingProduct(null);
          setEditingItem(null);
        }}
      />
    </>
  );
}

function MessageBubble({
  entry,
  services,
  onProduct,
  onCategory,
  onBranch,
  onRemove,
  onQuantity,
  onEdit,
}: {
  entry: AssistantMessage;
  services: ReturnType<typeof useAssistantServices>;
  onProduct: (product: MenuItem) => void;
  onCategory: (category: string) => void;
  onBranch: (branchId: string) => void;
  onRemove: (item: CartItem) => void;
  onQuantity: (item: CartItem, quantity: number) => void;
  onEdit: (item: CartItem) => void;
}) {
  return (
    <div className={entry.role === 'user' ? 'ml-auto max-w-[84%]' : 'mr-auto max-w-[94%]'}>
      <div className={`rounded-2xl px-4 py-3 text-sm font-medium leading-6 shadow-sm ${entry.role === 'user' ? 'rounded-br-md bg-[#99041e] text-white' : 'rounded-bl-md border border-[#ead8c6] bg-white text-[#31201b]'}`}>
        {entry.text}
      </div>
      {entry.card?.type === 'products' && <ProductCards products={entry.card.products} reason={entry.card.reason} onSelect={onProduct} />}
      {entry.card?.type === 'categories' && <CategoryCards categories={entry.card.categories} onSelect={onCategory} />}
      {entry.card?.type === 'branches' && <BranchCards branches={entry.card.branches} onSelect={onBranch} />}
      {entry.card?.type === 'cart' && <CartCard items={services.cart.items} total={services.cart.total()} onRemove={onRemove} onQuantity={onQuantity} onEdit={onEdit} />}
      {entry.card?.type === 'receipt' && <ReceiptCard card={entry.card} />}
    </div>
  );
}

function CategoryCards({ categories, onSelect }: { categories: string[]; onSelect: (category: string) => void }) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl border border-[#ead8c6] bg-white p-3 shadow-sm">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className="min-h-12 rounded-xl border border-[#ead8c6] bg-[#fffaf2] px-3 py-2 text-left text-xs font-black leading-4 text-[#99041e] transition hover:border-[#99041e] hover:bg-[#fff3dc] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257]/40"
        >
          {category}
        </button>
      ))}
    </div>
  );
}

function ProductCards({ products, reason, onSelect }: { products: MenuItem[]; reason?: string; onSelect: (product: MenuItem) => void }) {
  return (
    <div className="mt-2 grid gap-2">
      {products.map((product, index) => (
        <article key={product.id} className="grid grid-cols-[74px_minmax(0,1fr)] gap-3 overflow-hidden rounded-2xl border border-[#ead8c6] bg-white p-2 shadow-sm">
          <img src={product.image} alt={product.name} className="h-[74px] w-[74px] rounded-xl bg-[#fff8ed] object-cover" />
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-black leading-5 text-[#1a120f]">{product.name}</h3>
              <span className="shrink-0 text-sm font-black text-[#99041e]">£{product.price.toFixed(2)}</span>
            </div>
            {reason && <p className="mt-1 text-[11px] font-semibold leading-4 text-[#6b5b55]">{index === 0 ? `${reason} · strongest match` : reason}</p>}
            <button onClick={() => onSelect(product)} className="mt-2 min-h-9 rounded-lg bg-[#ffc257] px-3 text-xs font-black text-[#1a120f]">Add or customise</button>
          </div>
        </article>
      ))}
    </div>
  );
}

function BranchCards({ branches, onSelect }: { branches: Branch[]; onSelect: (branchId: string) => void }) {
  const validBranches = branches;
  return (
    <div className="mt-2 grid gap-2">
      {validBranches.map((branch) => (
        <article key={branch.branchId} className="rounded-2xl border border-[#ead8c6] bg-white p-3 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-[#1a120f]">{branch.branchName}</h3>
              <p className="mt-1 text-xs leading-5 text-[#6b5b55]">{branch.address} · {branch.postcode}</p>
            </div>
            <span className={`rounded-full px-2 py-1 text-[10px] font-black ${branch.isOpen === false ? 'bg-[#f8e8eb] text-[#99041e]' : 'bg-[#e9f6ee] text-[#126336]'}`}>
              {branch.isOpen === false ? 'Marked closed' : 'Marked open'}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] font-semibold text-[#6b5b55]">
            <span>Delivery: {branch.deliveryAvailable ? branch.deliveryTime : 'Unavailable'}</span>
            <span>Collection: {branch.pickupAvailable ? branch.pickupTime : 'Unavailable'}</span>
            <span>Minimum: £{branch.minDeliveryAmount.toFixed(2)}</span>
            <span>Fee: £{branch.deliveryFee.toFixed(2)}</span>
          </div>
          <button onClick={() => onSelect(branch.branchId)} disabled={branch.isOpen === false} className="mt-3 min-h-10 w-full rounded-xl bg-[#ffc257] px-3 text-xs font-black text-[#1a120f] disabled:cursor-not-allowed disabled:bg-[#ead8c6] disabled:text-[#8b7a73]">
            {branch.isOpen === false ? 'Unavailable in demo' : 'Select branch'}
          </button>
        </article>
      ))}
    </div>
  );
}

function CartCard({ items, total, onRemove, onQuantity, onEdit }: { items: CartItem[]; total: number; onRemove: (item: CartItem) => void; onQuantity: (item: CartItem, quantity: number) => void; onEdit: (item: CartItem) => void }) {
  if (!items.length) return <div className="mt-2 rounded-2xl border border-dashed border-[#ead8c6] bg-white p-5 text-center text-xs font-bold text-[#6b5b55]">Your basket is empty.</div>;
  return (
    <div className="mt-2 rounded-2xl border border-[#ead8c6] bg-white p-3 shadow-sm">
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${item.productId}-${index}-${JSON.stringify(item.customization)}`} className="border-b border-[#f0e4d7] pb-3 last:border-0 last:pb-0">
            <div className="flex justify-between gap-3">
              <div><p className="text-sm font-black text-[#1a120f]">{item.name}</p>{itemOptions(item) && <p className="mt-1 text-[11px] leading-4 text-[#6b5b55]">{itemOptions(item)}</p>}</div>
              <span className="shrink-0 text-sm font-black text-[#99041e]">£{(itemUnitPrice(item) * item.quantity).toFixed(2)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex items-center rounded-lg border border-[#ead8c6]">
                <button onClick={() => onQuantity(item, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center text-[#99041e]" aria-label={`Decrease ${item.name}`}><Minus size={14} /></button>
                <span className="min-w-6 text-center text-xs font-black">{item.quantity}</span>
                <button onClick={() => onQuantity(item, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center text-[#99041e]" aria-label={`Increase ${item.name}`}><Plus size={14} /></button>
              </div>
              <div className="flex gap-1">
                <button onClick={() => onEdit(item)} className="min-h-9 rounded-lg px-2 text-[11px] font-black text-[#99041e]">Edit</button>
                <button onClick={() => onRemove(item)} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#99041e]" aria-label={`Remove ${item.name}`}><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between border-t border-[#ead8c6] pt-3 text-sm font-black"><span>Basket subtotal</span><span className="text-[#99041e]">£{total.toFixed(2)}</span></div>
    </div>
  );
}

function PaymentChoice({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-[#ead8c6] p-3 text-left text-sm font-black text-[#1a120f] transition hover:border-[#99041e] hover:bg-[#fff8ed]"><span className="text-[#99041e]">{icon}</span>{label}</button>;
}

function FinalSummary({ branchName, postcode, orderType, address, items, subtotal, discount, deliveryFee, serviceCharge, total, payment, estimate, processing, onConfirm }: {
  branchName: string; postcode: string; orderType: string; address?: string; items: CartItem[]; subtotal: number; discount: number; deliveryFee: number; serviceCharge: number; total: number; payment: string; estimate: string; processing: boolean; onConfirm: () => void;
}) {
  return (
    <section className="rounded-2xl border border-[#ead8c6] bg-white p-4 shadow-sm" aria-label="Final demo order confirmation">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#99041e]">Final demo confirmation</p>
      <div className="mt-3 space-y-1 text-xs leading-5 text-[#6b5b55]">
        <p><strong className="text-[#1a120f]">Branch:</strong> {branchName} · {postcode}</p>
        <p><strong className="text-[#1a120f]">Service:</strong> {orderType}</p>
        {address && <p><strong className="text-[#1a120f]">Address:</strong> {address}</p>}
        <p><strong className="text-[#1a120f]">Payment:</strong> {payment}</p>
        <p><strong className="text-[#1a120f]">Static estimate:</strong> {estimate}</p>
      </div>
      <div className="mt-3 space-y-2 border-y border-[#ead8c6] py-3">
        {items.map((item, index) => <div key={`${item.productId}-${index}`} className="flex justify-between gap-2 text-xs"><span>{item.quantity}× {item.name}{itemOptions(item) ? ` · ${itemOptions(item)}` : ''}</span><strong>£{(itemUnitPrice(item) * item.quantity).toFixed(2)}</strong></div>)}
      </div>
      <div className="mt-3 space-y-1 text-xs">
        <SummaryRow label="Subtotal" value={subtotal} />
        <SummaryRow label="Mock discount" value={-discount} />
        <SummaryRow label="Delivery fee" value={deliveryFee} />
        <SummaryRow label="Service charge" value={serviceCharge} />
        <div className="flex justify-between border-t border-[#ead8c6] pt-2 text-base font-black"><span>Total</span><span className="text-[#99041e]">£{total.toFixed(2)}</span></div>
      </div>
      <button onClick={onConfirm} disabled={processing} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffc257] px-4 text-sm font-black text-[#1a120f] disabled:opacity-50">
        {processing ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
        {processing ? 'Creating demo order…' : 'Place Demo Order'}
      </button>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return <div className="flex justify-between"><span className="text-[#6b5b55]">{label}</span><strong>{value < 0 ? '-' : ''}£{Math.abs(value).toFixed(2)}</strong></div>;
}

function ReceiptCard({ card }: { card: Extract<AssistantCard, { type: 'receipt' }> }) {
  const { order } = card;
  return (
    <section className="mt-2 rounded-2xl border border-[#ffc257] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[#126336]"><Check size={20} /><h3 className="text-sm font-black">Frontend demo order confirmed</h3></div>
      <p className="mt-2 font-mono text-xs font-black text-[#99041e]">{order.orderNumber}</p>
      <div className="mt-3 space-y-1 text-xs leading-5 text-[#6b5b55]">
        <p>{order.branchName}</p>
        <p>{getOrderTypeLabel(order.orderType)}{card.address ? ` · ${card.address}` : ''}</p>
        {order.items.map((item) => <p key={item.productId}>{item.quantity}× {item.name} · £{(item.price * item.quantity).toFixed(2)}</p>)}
        <p>Subtotal £{order.subtotal.toFixed(2)} · Discount £{card.discount.toFixed(2)} · Delivery £{order.deliveryFee.toFixed(2)}</p>
        <p className="text-sm font-black text-[#99041e]">Total £{order.total.toFixed(2)}</p>
        <p>{order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Demo card'} · Static estimate {order.estimatedTime} min</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link href={`/track/${order.orderNumber}`} className="flex min-h-10 items-center justify-center rounded-xl bg-[#99041e] px-2 text-center text-[11px] font-black text-white">Track Demo Order</Link>
        <Link href={`/order-success/${order.orderNumber}`} className="flex min-h-10 items-center justify-center rounded-xl border border-[#99041e] px-2 text-center text-[11px] font-black text-[#99041e]">View Full Receipt</Link>
        <Link href="/account?tab=orders" className="col-span-2 flex min-h-10 items-center justify-center rounded-xl border border-[#ead8c6] px-2 text-center text-[11px] font-black text-[#99041e]">Go to Order History</Link>
      </div>
    </section>
  );
}
