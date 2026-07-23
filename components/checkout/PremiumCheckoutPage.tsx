'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  CreditCard,
  Home,
  MapPin,
  PackageCheck,
  Plus,
  ReceiptText,
  ShoppingBag,
  Tag,
  Truck,
} from 'lucide-react';
import { BRANCHES, Branch, findNearestBranch } from '@/lib/branchData';
import { CartItem, OrderType, useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { createOrder, saveOrder } from '@/lib/orderUtils';
import { useOrders } from '@/lib/ordersContext';
import { MENU_DATA } from '@/lib/menuData';
import { categorySlug } from '@/lib/productOptionConfig';
import { getOrderTypeLabel } from '@/lib/orderTypeDisplay';
import OrderingHeader from '@/components/ordering/OrderingHeader';
import CheckoutLoginModal from '@/components/auth/CheckoutLoginModal';

type AddressType = 'Home' | 'Office' | 'Work' | 'Other';
type PaymentMethod = 'cash' | 'card';

interface SavedAddress {
  id: string;
  type: AddressType;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
}

interface SavedCard {
  id: string;
  nameOnCard: string;
  last4: string;
  expiry: string;
}

const addressTypes: AddressType[] = ['Home', 'Office', 'Work', 'Other'];
const validVoucherCodes = new Map([
  ['FRESH3', 3],
  ['LOYAL5', 5],
  ['MAEMES10', 10],
]);

function itemUnitPrice(item: CartItem) {
  return item.unitPrice ?? item.price;
}

function itemTotal(item: CartItem) {
  return itemUnitPrice(item) * item.quantity;
}

function formatItemOptions(item: CartItem) {
  const size = item.selectedSize || item.customization?.selectedSize;
  const product = MENU_DATA.find((candidate) => candidate.id === item.productId);
  const flavour = product && categorySlug(product.category) === 'maemes-burgers'
    ? undefined
    : item.selectedFlavour || item.selectedSpiceLevel || item.customization?.selectedSpiceLevel;
  const addOns = item.selectedAddOns || item.customization?.selectedAddOns || [];
  const formattedAddOns = addOns.map((addon) => {
    const modifiers = addon.modifiers?.map((modifier) => `${modifier.name} +£${modifier.price.toFixed(2)}`).join(', ');
    return modifiers
      ? `${addon.name} — ${modifiers}`
      : `${addon.name}${addon.price > 0 ? ` +£${addon.price.toFixed(2)}` : ''}`;
  });

  return [size, flavour, formattedAddOns.length ? formattedAddOns.join(', ') : '']
    .filter(Boolean)
    .join(' · ');
}

const fieldClass =
  'min-h-12 w-full rounded-2xl border border-[#ead8c6] bg-white px-4 text-sm font-semibold text-[#1a120f] outline-none transition focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10';

export default function PremiumCheckoutPage() {
  const router = useRouter();
  const {
    items,
    selectedBranch,
    selectedOrderType,
    selectBranch,
    setOrderType,
    getCartTotal,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();

  const [orderType, setLocalOrderType] = useState<OrderType>(selectedOrderType || 'delivery');
  const [branch, setBranch] = useState<Branch | null>(selectedBranch || BRANCHES[0]);
  const [deliverySearch, setDeliverySearch] = useState(selectedBranch?.postcode || '');
  const [pickupSearch, setPickupSearch] = useState(selectedBranch?.postcode || '');
  const [areaResult, setAreaResult] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [addressType, setAddressType] = useState<AddressType>('Home');
  const [addressForm, setAddressForm] = useState({
    recipientName: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(orderType === 'pickup' ? 'card' : 'cash');
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [cardForm, setCardForm] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiry: '',
    securityCode: '',
  });
  const [voucher, setVoucher] = useState('');
  const [voucherFeedback, setVoucherFeedback] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const placeOrderRef = useRef<HTMLButtonElement>(null);
  const orderSubmissionRef = useRef(false);

  useEffect(() => {
    const addresses = localStorage.getItem('maemes.checkout.savedAddresses');
    const cards = localStorage.getItem('maemes.checkout.savedCards');
    const draft = localStorage.getItem('maemes.checkout.draft');

    if (addresses) {
      try {
        const parsed = JSON.parse(addresses) as SavedAddress[];
        setSavedAddresses(parsed);
        setSelectedAddressId(parsed[0]?.id || '');
      } catch {
        setSavedAddresses([]);
      }
    }

    if (cards) {
      try {
        const parsed = JSON.parse(cards) as SavedCard[];
        setSavedCards(parsed);
        setSelectedCardId(parsed[0]?.id || '');
      } catch {
        setSavedCards([]);
      }
    }

    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.orderType === 'delivery' || parsed.orderType === 'pickup') setLocalOrderType(parsed.orderType);
        if (parsed.deliverySearch) setDeliverySearch(parsed.deliverySearch);
        if (parsed.pickupSearch) setPickupSearch(parsed.pickupSearch);
        if (parsed.addressForm) setAddressForm(parsed.addressForm);
        if (parsed.selectedAddressId) setSelectedAddressId(parsed.selectedAddressId);
        if (parsed.paymentMethod === 'cash' || parsed.paymentMethod === 'card') {
          setPaymentMethod(parsed.paymentMethod);
        } else if (parsed.paymentMethod === 'wallet') {
          setPaymentMethod('card');
        }
        if (parsed.voucher) setVoucher(parsed.voucher);
        if (parsed.notes) setNotes(parsed.notes);
      } catch {
        localStorage.removeItem('maemes.checkout.draft');
      }
    }
  }, []);

  useEffect(() => {
    if (selectedOrderType) setLocalOrderType(selectedOrderType);
    if (selectedBranch) setBranch(selectedBranch);
  }, [selectedBranch, selectedOrderType]);

  useEffect(() => {
    if (!branch) return;
    if (orderType === 'delivery' && !branch.deliveryAvailable && branch.pickupAvailable) {
      setLocalOrderType('pickup');
      setOrderType('pickup');
    } else if (orderType === 'pickup' && !branch.pickupAvailable && branch.deliveryAvailable) {
      setLocalOrderType('delivery');
      setOrderType('delivery');
    }
  }, [branch, orderType, setOrderType]);

  useEffect(() => {
    if (orderType === 'pickup' && paymentMethod === 'cash') {
      setPaymentMethod('card');
    }
  }, [orderType, paymentMethod]);

  useEffect(() => {
    localStorage.setItem('maemes.checkout.savedAddresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem('maemes.checkout.savedCards', JSON.stringify(savedCards));
  }, [savedCards]);

  useEffect(() => {
    localStorage.setItem(
      'maemes.checkout.draft',
      JSON.stringify({ orderType, deliverySearch, pickupSearch, selectedAddressId, addressForm, paymentMethod, voucher, notes })
    );
  }, [addressForm, deliverySearch, notes, orderType, paymentMethod, pickupSearch, selectedAddressId, voucher]);

  const productTotal = getCartTotal();
  const deliveryFee = orderType === 'delivery' ? branch?.deliveryFee ?? 2.49 : 0;
  const serviceCharge = items.length ? 0.79 : 0;
  const total = Math.max(productTotal + deliveryFee + serviceCharge - discount, 0);
  const estimate = orderType === 'pickup' ? branch?.pickupTime || '15-20 min' : branch?.deliveryTime || '35-45 min';

  const currentAddress = useMemo(
    () => savedAddresses.find((address) => address.id === selectedAddressId),
    [savedAddresses, selectedAddressId]
  );

  const handleOrderType = (nextType: OrderType) => {
    if (branch && nextType === 'delivery' && !branch.deliveryAvailable) return;
    if (branch && nextType === 'pickup' && !branch.pickupAvailable) return;
    setLocalOrderType(nextType);
    setOrderType(nextType);
    if (branch) selectBranch(branch.branchId, nextType);
  };

  const handleDeliveryCheck = () => {
    const foundBranch = findNearestBranch(deliverySearch || branch?.postcode || '');
    setBranch(foundBranch);
    selectBranch(foundBranch.branchId, 'delivery');
    setOrderType('delivery');
    setAreaResult(`${foundBranch.branchName} will prepare your order from ${foundBranch.address}.`);
  };

  const handlePickupFind = () => {
    const foundBranch = findNearestBranch(pickupSearch || branch?.postcode || '');
    setBranch(foundBranch);
    selectBranch(foundBranch.branchId, 'pickup');
    setOrderType('pickup');
    setAreaResult(`${foundBranch.branchName} is ready for collection in ${foundBranch.pickupTime || '15-20 min'}.`);
  };

  const handleBranchSelect = (branchId: string) => {
    const nextBranch = BRANCHES.find((candidate) => candidate.branchId === branchId) || BRANCHES[0];
    setBranch(nextBranch);
    selectBranch(nextBranch.branchId, orderType);
  };

  const handleSaveAddress = () => {
    if (!addressForm.recipientName || !addressForm.phone || !addressForm.address || !addressForm.city || !addressForm.postcode) {
      setValidationMessage('Please complete the address fields before saving.');
      return;
    }

    const newAddress: SavedAddress = {
      id: `addr-${Date.now()}`,
      type: addressType,
      ...addressForm,
    };

    setSavedAddresses((current) => [newAddress, ...current]);
    setSelectedAddressId(newAddress.id);
    setAddressForm({ recipientName: '', phone: '', address: '', city: '', postcode: '' });
    setValidationMessage('');
  };

  const handleSaveCard = () => {
    if (!cardForm.nameOnCard || !cardForm.cardNumber || !cardForm.expiry || !cardForm.securityCode) {
      setValidationMessage('Please complete the card fields before saving.');
      return;
    }

    const digits = cardForm.cardNumber.replace(/\D/g, '');
    const newCard: SavedCard = {
      id: `card-${Date.now()}`,
      nameOnCard: cardForm.nameOnCard,
      last4: digits.slice(-4) || '0000',
      expiry: cardForm.expiry,
    };

    setSavedCards((current) => [newCard, ...current]);
    setSelectedCardId(newCard.id);
    setCardForm({ nameOnCard: '', cardNumber: '', expiry: '', securityCode: '' });
    setValidationMessage('');
  };

  const handleApplyVoucher = () => {
    const code = voucher.trim().toUpperCase();
    const amount = validVoucherCodes.get(code);

    if (!amount) {
      setDiscount(0);
      setVoucherFeedback('Voucher code is not valid for this order.');
      return;
    }

    setDiscount(amount);
    setVoucherFeedback(`Voucher applied. £${amount.toFixed(2)} discount added.`);
  };

  const validateCheckout = () => {
    if (items.length === 0) return 'Your cart is empty.';
    if (!branch) return 'Please select a branch for this order.';
    if (orderType === 'delivery' && !branch.deliveryAvailable) return 'Delivery is currently unavailable from this branch.';
    if (orderType === 'pickup' && !branch.pickupAvailable) return 'Collection is currently unavailable from this branch.';
    if (orderType === 'delivery' && !selectedAddressId && !addressForm.address) {
      return 'Please select or add a delivery address.';
    }
    if (paymentMethod === 'card' && !selectedCardId && !cardForm.cardNumber) {
      return 'Please select or add a card before placing the order.';
    }
    return '';
  };

  const saveDraftBeforeLogin = () => {
    localStorage.setItem(
      'maemes.checkout.draft',
      JSON.stringify({ orderType, deliverySearch, pickupSearch, selectedAddressId, addressForm, paymentMethod, voucher, notes })
    );
  };

  const completeOrder = () => {
    if (orderSubmissionRef.current) return;
    orderSubmissionRef.current = true;
    const orderItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: itemUnitPrice(item),
      quantity: item.quantity,
    }));
    const deliveryAddress = orderType === 'delivery'
      ? currentAddress
        ? `${currentAddress.recipientName}, ${currentAddress.address}, ${currentAddress.city}, ${currentAddress.postcode}`
        : [addressForm.recipientName, addressForm.address, addressForm.city, addressForm.postcode].filter(Boolean).join(', ')
      : undefined;

    const newOrder = createOrder({
      branchName: branch?.branchName || "Maeme's",
      branchAddress: branch?.address || '',
      deliveryAddress,
      orderType,
      items: orderItems,
      subtotal: productTotal,
      deliveryFee,
      total,
      paymentMethod: paymentMethod === 'cash' ? 'cash' : 'card',
    });

    saveOrder(newOrder);
    addOrder(newOrder);
    clearCart();
    localStorage.removeItem('maemes.checkout.draft');
    router.push(`/order-success/${newOrder.orderNumber}`);
  };

  const handlePlaceOrder = () => {
    if (orderSubmissionRef.current) return;
    const issue = validateCheckout();
    if (issue) {
      setValidationMessage(issue);
      return;
    }

    if (!user) {
      saveDraftBeforeLogin();
      setAuthModalOpen(true);
      return;
    }

    completeOrder();
  };

  if (items.length === 0) {
    return (
      <>
      <OrderingHeader />
      <main className="min-h-screen bg-[#fff8ed] px-4 py-16 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-[900px] rounded-[24px] border border-[#f0d59d] bg-white px-6 py-20 text-center shadow-[0_18px_50px_rgba(50,24,16,0.08)]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#99041e]">ALMOST THERE</p>
          <h1 className="mt-4 text-4xl font-black text-[#1a120f] sm:text-5xl">Checkout</h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#6b5b55]">
            Your cart is empty. Add your favourite Maeme&apos;s dishes before checkout.
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
    <main className="min-h-screen overflow-x-hidden bg-[#fff8ed] px-4 py-10 text-[#1a120f] sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1320px] min-w-0">
        <header className="mb-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#99041e]">ALMOST THERE</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Checkout</h1>
          <p className="mt-2 text-base leading-7 text-[#6b5b55]">
            Confirm the details below to place your order.
          </p>
        </header>

        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="min-w-0 space-y-5">
            {validationMessage && (
              <div className="rounded-2xl border border-[#ffc257] bg-white px-5 py-4 text-sm font-black text-[#99041e]">
                {validationMessage}
              </div>
            )}

            <CheckoutSection icon={<Truck size={20} />} title="Delivery or Collection">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#fff8ed] p-1">
                {(['delivery', 'pickup'] as OrderType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleOrderType(type)}
                    disabled={Boolean(branch && (type === 'delivery' ? !branch.deliveryAvailable : !branch.pickupAvailable))}
                    className={`min-h-12 rounded-xl text-sm font-black capitalize transition ${
                      orderType === type ? 'bg-[#ffc257] text-[#1a120f] shadow-sm' : 'text-[#99041e] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40'
                    }`}
                  >
                    {getOrderTypeLabel(type)}
                  </button>
                ))}
              </div>

              {orderType === 'delivery' ? (
                <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
                  <input
                    value={deliverySearch}
                    onChange={(event) => setDeliverySearch(event.target.value)}
                    placeholder="Postcode / delivery area"
                    className={fieldClass}
                  />
                  <button onClick={handleDeliveryCheck} className="w-full rounded-2xl bg-[#99041e] px-6 py-3 text-sm font-black text-white transition hover:bg-[#7f0318] md:w-auto">
                    Check area
                  </button>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <input
                      value={pickupSearch}
                      onChange={(event) => setPickupSearch(event.target.value)}
                      placeholder="Collection postcode or area"
                      className={fieldClass}
                    />
                    <button onClick={handlePickupFind} className="w-full rounded-2xl bg-[#99041e] px-6 py-3 text-sm font-black text-white transition hover:bg-[#7f0318] md:w-auto">
                      Find branch
                    </button>
                  </div>
                  <select value={branch?.branchId || ''} onChange={(event) => handleBranchSelect(event.target.value)} className={fieldClass}>
                    {BRANCHES.map((candidate) => (
                      <option key={candidate.branchId} value={candidate.branchId}>
                        {candidate.branchName} - {candidate.postcode}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-[#f0d59d] bg-[#fff8ed] p-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 text-[#99041e]" />
                  <div>
                    <p className="font-black">{branch?.branchName || "Maeme's"}</p>
                    <p className="mt-1 text-sm leading-6 text-[#6b5b55]">
                      {branch?.address} {branch?.postcode ? `· ${branch.postcode}` : ''}
                    </p>
                    <p className="mt-1 text-sm font-black text-[#126336]">
                      {areaResult || `${getOrderTypeLabel(orderType)} estimate: ${estimate}`}
                    </p>
                  </div>
                </div>
              </div>
            </CheckoutSection>

            {orderType === 'delivery' && (
              <CheckoutSection icon={<Home size={20} />} title="Delivery Address">
                {savedAddresses.length > 0 && (
                  <div className="grid gap-3 md:grid-cols-2">
                    {savedAddresses.map((address) => (
                      <button
                        key={address.id}
                        onClick={() => setSelectedAddressId(address.id)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          selectedAddressId === address.id
                            ? 'border-[#99041e] bg-[#fff8ed]'
                            : 'border-[#f0d59d] bg-white hover:border-[#ffc257]'
                        }`}
                      >
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#99041e]">{address.type}</p>
                        <p className="mt-2 font-black">{address.recipientName}</p>
                        <p className="mt-1 text-sm leading-6 text-[#6b5b55]">{address.address}, {address.city}, {address.postcode}</p>
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {addressTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setAddressType(type)}
                      className={`rounded-full px-4 py-2 text-sm font-black transition ${
                        addressType === type ? 'bg-[#ffc257] text-[#1a120f]' : 'border border-[#f0d59d] bg-white text-[#99041e]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <input value={addressForm.recipientName} onChange={(event) => setAddressForm((form) => ({ ...form, recipientName: event.target.value }))} placeholder="Recipient name" className={fieldClass} />
                  <input value={addressForm.phone} onChange={(event) => setAddressForm((form) => ({ ...form, phone: event.target.value }))} placeholder="Phone number" className={fieldClass} />
                  <input value={addressForm.address} onChange={(event) => setAddressForm((form) => ({ ...form, address: event.target.value }))} placeholder="Address" className={`${fieldClass} md:col-span-2`} />
                  <input value={addressForm.city} onChange={(event) => setAddressForm((form) => ({ ...form, city: event.target.value }))} placeholder="City" className={fieldClass} />
                  <input value={addressForm.postcode} onChange={(event) => setAddressForm((form) => ({ ...form, postcode: event.target.value }))} placeholder="Postcode" className={fieldClass} />
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => setAddressForm({ recipientName: '', phone: '', address: '', city: '', postcode: '' })} className="rounded-2xl border border-[#f0d59d] bg-white px-5 py-3 text-sm font-black text-[#99041e]">
                    Cancel
                  </button>
                  <button onClick={handleSaveAddress} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#99041e] px-5 py-3 text-sm font-black text-white">
                    <Plus size={17} />
                    Save address
                  </button>
                </div>
              </CheckoutSection>
            )}

            <CheckoutSection icon={<CreditCard size={20} />} title="Payment Method">
              <div className="grid gap-3 md:grid-cols-2">
                {orderType === 'delivery' && (
                  <PaymentButton active={paymentMethod === 'cash'} onClick={() => setPaymentMethod('cash')} title="Cash on Delivery" detail="Pay at your door" />
                )}
                <PaymentButton active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} title="Debit/Credit Card" detail="Use saved or new card" />
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-5 space-y-4">
                  {savedCards.length > 0 && (
                    <div className="grid gap-3 md:grid-cols-2">
                      {savedCards.map((card) => (
                        <button
                          key={card.id}
                          onClick={() => setSelectedCardId(card.id)}
                          className={`rounded-2xl border p-4 text-left transition ${
                            selectedCardId === card.id ? 'border-[#99041e] bg-[#fff8ed]' : 'border-[#f0d59d] bg-white'
                          }`}
                        >
                          <p className="font-black">Card ending {card.last4}</p>
                          <p className="mt-1 text-sm text-[#6b5b55]">{card.nameOnCard} · Expires {card.expiry}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <input value={cardForm.nameOnCard} onChange={(event) => setCardForm((form) => ({ ...form, nameOnCard: event.target.value }))} placeholder="Name on card" className={fieldClass} />
                    <input value={cardForm.cardNumber} onChange={(event) => setCardForm((form) => ({ ...form, cardNumber: event.target.value }))} placeholder="Card number" className={fieldClass} />
                    <input value={cardForm.expiry} onChange={(event) => setCardForm((form) => ({ ...form, expiry: event.target.value }))} placeholder="Expiry" className={fieldClass} />
                    <input value={cardForm.securityCode} onChange={(event) => setCardForm((form) => ({ ...form, securityCode: event.target.value }))} placeholder="Security code" className={fieldClass} />
                  </div>
                  <button onClick={handleSaveCard} className="rounded-2xl bg-[#99041e] px-5 py-3 text-sm font-black text-white">
                    Save card
                  </button>
                </div>
              )}
            </CheckoutSection>

            <CheckoutSection icon={<Tag size={20} />} title="Voucher">
              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                <input value={voucher} onChange={(event) => setVoucher(event.target.value)} placeholder="Enter voucher code" className={fieldClass} />
                <button onClick={handleApplyVoucher} className="rounded-2xl bg-[#ffc257] px-6 py-3 text-sm font-black text-[#1a120f]">
                  Apply
                </button>
              </div>
              {voucherFeedback && (
                <p className={`mt-3 text-sm font-black ${discount > 0 ? 'text-[#126336]' : 'text-[#99041e]'}`}>
                  {voucherFeedback}
                </p>
              )}
            </CheckoutSection>

            <CheckoutSection icon={<ReceiptText size={20} />} title={orderType === 'delivery' ? 'Delivery notes' : 'Collection notes'}>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={orderType === 'delivery' ? 'Delivery notes' : 'Collection notes'}
                className="min-h-28 w-full resize-none rounded-2xl border border-[#ead8c6] bg-white px-4 py-3 text-sm font-semibold text-[#1a120f] outline-none transition focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10"
              />
            </CheckoutSection>
          </section>

          <aside className="min-w-0">
            <div className="sticky top-28 rounded-[24px] border border-[#f0d59d] bg-white p-5 shadow-[0_18px_50px_rgba(50,24,16,0.10)]">
              <div className="rounded-2xl bg-[#fff8ed] p-4">
                <div className="flex items-center gap-3">
                  {orderType === 'pickup' ? <ShoppingBag size={24} className="text-[#99041e]" /> : <Truck size={24} className="text-[#99041e]" />}
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#6b5b55]">
                      Estimated {getOrderTypeLabel(orderType).toLowerCase()}
                    </p>
                    <p className="text-xl font-black">{estimate}</p>
                  </div>
                </div>
              </div>

              <h2 className="mt-6 text-2xl font-black">Order summary</h2>
              <div className="mt-5 space-y-4 border-b border-[#f0d59d] pb-5">
                {items.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex gap-3">
                    {item.image && <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black">{item.quantity}x {item.name}</p>
                      {formatItemOptions(item) && <p className="mt-1 text-xs leading-5 text-[#6b5b55]">{formatItemOptions(item)}</p>}
                    </div>
                    <p className="text-sm font-black text-[#99041e]">£{itemTotal(item).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <SummaryRow label="Product total" value={`£${productTotal.toFixed(2)}`} />
                {orderType === 'delivery' && <SummaryRow label="Delivery fee" value={`£${deliveryFee.toFixed(2)}`} />}
                <SummaryRow label="Service charge" value={`£${serviceCharge.toFixed(2)}`} />
                <SummaryRow label="Discount" value={`-£${discount.toFixed(2)}`} />
              </div>

              <div className="mt-5 border-t border-[#f0d59d] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black">Total</span>
                  <span className="text-2xl font-black text-[#99041e]">£{total.toFixed(2)}</span>
                </div>
              </div>

              {currentAddress && orderType === 'delivery' && (
                <div className="mt-5 rounded-2xl bg-[#fff8ed] p-4 text-sm leading-6 text-[#6b5b55]">
                  Delivering to <span className="font-black text-[#1a120f]">{currentAddress.recipientName}</span>, {currentAddress.postcode}
                </div>
              )}

              <button
                ref={placeOrderRef}
                onClick={handlePlaceOrder}
                disabled={orderSubmissionRef.current}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffc257] px-5 py-3 text-sm font-black text-[#1a120f] shadow-[0_14px_34px_rgba(255,194,87,0.24)] transition hover:bg-[#e5a93e]"
              >
                <PackageCheck size={18} />
                Place Order
              </button>

              <p className="mt-4 flex items-center gap-2 text-xs font-semibold leading-5 text-[#6b5b55]">
                <CheckCircle2 size={15} className="text-[#126336]" />
                Cart and checkout details stay saved while you sign in.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
    <CheckoutLoginModal
      isOpen={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      onAuthenticated={() => {
        setAuthModalOpen(false);
        completeOrder();
      }}
      returnFocusRef={placeOrderRef}
    />
    </>
  );
}

function CheckoutSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 rounded-[24px] border border-[#f0d59d] bg-white p-5 shadow-[0_14px_38px_rgba(50,24,16,0.08)] sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#99041e] text-[#ffc257]">
          {icon}
        </span>
        <h2 className="text-2xl font-black tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function PaymentButton({
  active,
  onClick,
  title,
  detail,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  detail: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active ? 'border-[#99041e] bg-[#fff8ed]' : 'border-[#f0d59d] bg-white hover:border-[#ffc257]'
      }`}
    >
      <p className="font-black">{title}</p>
      <p className="mt-1 text-sm leading-5 text-[#6b5b55]">{detail}</p>
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="font-semibold text-[#6b5b55]">{label}</span>
      <span className="font-black">{value}</span>
    </div>
  );
}
