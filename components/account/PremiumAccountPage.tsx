'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Check, Copy, FileText, Gift, Heart, History, LogIn, LogOut, MapPin, Plus, Store, Trash2, Truck, User, Utensils } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { useOrders } from '@/lib/ordersContext';
import { Order } from '@/lib/orderUtils';
import { useFavourites } from '@/lib/favouritesContext';
import { MENU_DATA, MenuItem } from '@/lib/menuData';
import ProductCard from '@/components/ordering/ProductCard';

type AccountTab = 'profile' | 'history' | 'tracking' | 'favourites' | 'addresses' | 'promos';
type AddressType = 'Home' | 'Office' | 'Work' | 'Other';

interface SavedAddress {
  id: string;
  type: AddressType;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  isDefault?: boolean;
}

const tabs = [
  { id: 'profile' as AccountTab, label: 'My Account / Edit Profile', icon: User },
  { id: 'history' as AccountTab, label: 'Order History', icon: History },
  { id: 'tracking' as AccountTab, label: 'Current Order Tracking', icon: Truck },
  { id: 'favourites' as AccountTab, label: 'Favourites', icon: Heart },
  { id: 'addresses' as AccountTab, label: 'Saved Addresses', icon: MapPin },
  { id: 'promos' as AccountTab, label: 'Promos', icon: Gift },
];

const profileLinks = [
  { label: 'Explore Menu', href: '/menu', icon: Utensils },
  { label: 'Branch Locator', href: '/branches', icon: Store },
  { label: 'Privacy Policy', href: '/privacy-policy', icon: FileText },
  { label: 'Terms & Conditions', href: '/terms-and-conditions', icon: FileText },
];

const promoCards = [
  { code: 'MAEMES10', title: '10% off your next order', description: "Enjoy 10% off your next Maeme's order." },
  { code: 'FRESH3', title: 'Fresh favourite', description: 'Save £3 on orders over £18.' },
  { code: 'LOYAL5', title: 'Loyalty reward', description: 'Use on your next grilled feast over £25.' },
];

const inputClass = 'min-h-12 w-full rounded-2xl border border-[#ead8c6] bg-white px-4 text-sm font-semibold outline-none focus:border-[#99041e] focus:ring-4 focus:ring-[#99041e]/10';

export default function PremiumAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, logout } = useAuth();
  const { orders, currentOrder, updateOrderStatus } = useOrders();
  const { favourites, removeFavourite } = useFavourites();
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');
  const [profile, setProfile] = useState({ name: '', phone: '', email: '', dob: '' });
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [addressForm, setAddressForm] = useState<SavedAddress>({
    id: '',
    type: 'Home',
    recipientName: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
  });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user) {
      setProfile({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        dob: localStorage.getItem('maemes.account.dob') || '',
      });
    } else {
      setProfile({ name: '', phone: '', email: '', dob: '' });
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'orders') setActiveTab('history');
    if (tab === 'tracking') setActiveTab('tracking');
    if (tab === 'favourites' || tab === 'addresses' || tab === 'promos') setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    const saved = localStorage.getItem('maemes.checkout.savedAddresses');
    if (!saved) return;
    try {
      setAddresses(JSON.parse(saved));
    } catch {
      setAddresses([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('maemes.checkout.savedAddresses', JSON.stringify(addresses));
  }, [addresses]);

  const allOrders = useMemo(() => {
    const merged = currentOrder ? [currentOrder, ...orders] : orders;
    return Array.from(new Map(merged.map((order) => [order.orderNumber, order])).values())
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [currentOrder, orders]);

  const liveOrder = allOrders.find((order) => order.status !== 'completed' && order.status !== 'cancelled');
  const pastOrders = allOrders.filter((order) => order.orderNumber !== liveOrder?.orderNumber);
  const initial = (profile.name || profile.phone || 'M').charAt(0).toUpperCase();

  const favouriteProducts = favourites
    .map((fav) => MENU_DATA.find((product) => String(product.id) === fav.id || product.name === fav.name) || ({
      id: Number(fav.id) || Date.now(),
      name: fav.title || fav.name,
      category: fav.category || 'Favourites',
      description: fav.description,
      price: fav.price,
      kcal: Number(fav.kcal) || 0,
      image: fav.image,
    } satisfies MenuItem))
    .slice(0, 12);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const handleProfileUpdate = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        localStorage.setItem('currentUser', JSON.stringify({ ...JSON.parse(savedUser), name: profile.name, email: profile.email }));
      } catch {
        // Keep the prototype resilient if stored user data is malformed.
      }
    }
    localStorage.setItem('maemes.account.dob', profile.dob);
    showToast('Profile updated');
  };

  const saveAddress = () => {
    if (!addressForm.recipientName || !addressForm.phone || !addressForm.address || !addressForm.city || !addressForm.postcode) {
      showToast('Complete the address fields first');
      return;
    }

    if (editingAddressId) {
      setAddresses((current) => current.map((item) => item.id === editingAddressId ? { ...addressForm, id: editingAddressId } : item));
      setEditingAddressId(null);
    } else {
      setAddresses((current) => [{ ...addressForm, id: `addr-${Date.now()}`, isDefault: current.length === 0 }, ...current]);
    }
    setAddressForm({ id: '', type: 'Home', recipientName: '', phone: '', address: '', city: '', postcode: '' });
  };

  const editAddress = (address: SavedAddress) => {
    setEditingAddressId(address.id);
    setAddressForm(address);
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((current) => current.map((address) => ({ ...address, isDefault: address.id === id })));
  };

  const cancelOrder = (order: Order) => {
    if (order.currentStep > 0) return;
    updateOrderStatus(order.orderNumber, 'cancelled' as Order['status'], order.currentStep);
    showToast('Order cancelled');
  };

  const handleLogin = () => {
    router.push('/login?redirect=/account');
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out');
  };

  if (isLoading) {
    return <main className="min-h-screen bg-[#fff8ed]" />;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fff8ed] px-4 py-10 text-[#1a120f] sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1320px] min-w-0">
        <header className="mb-8 min-w-0 overflow-hidden rounded-[28px] border border-[#f0d59d] bg-white p-6 shadow-[0_18px_50px_rgba(50,24,16,0.08)]">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#99041e] text-3xl font-black text-[#ffc257] shadow-[0_16px_40px_rgba(153,4,30,0.22)]">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#99041e]">MY ACCOUNT</p>
              <h1 className="mt-2 max-w-[280px] break-words text-[1.7rem] font-black leading-tight tracking-tight sm:max-w-none sm:text-5xl">
                Welcome back, {profile.name || "Maeme's guest"}
              </h1>
              <p className="mt-2 text-sm font-semibold text-[#6b5b55]">{user ? profile.phone : 'Login to manage your Maeme’s account.'}</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="min-w-0">
            <nav className="sticky top-28 flex gap-2 overflow-x-auto rounded-[24px] border border-[#f0d59d] bg-white p-3 shadow-[0_14px_38px_rgba(50,24,16,0.08)] lg:block lg:space-y-2 lg:overflow-visible">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition lg:w-full ${
                      activeTab === tab.id ? 'bg-[#99041e] text-white' : 'text-[#1a120f] hover:bg-[#fff8ed]'
                    }`}
                  >
                    <Icon size={18} className={activeTab === tab.id ? 'text-[#ffc257]' : 'text-[#99041e]'} />
                    {tab.label}
                  </button>
                );
              })}
              <div className="hidden border-t border-[#f0d59d] pt-2 lg:block" />
              {profileLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    className="flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-[#1a120f] transition hover:bg-[#fff8ed] lg:w-full"
                  >
                    <Icon size={18} className="text-[#99041e]" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={user ? handleLogout : handleLogin}
                className={`flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition lg:w-full ${
                  user ? 'bg-[#99041e] text-white hover:bg-[#7f0318]' : 'bg-[#ffc257] text-[#1a120f] hover:bg-[#e5a93e]'
                }`}
              >
                {user ? <LogOut size={18} className="text-[#ffc257]" /> : <LogIn size={18} className="text-[#99041e]" />}
                {user ? 'Logout' : 'Login'}
              </button>
            </nav>
          </aside>

          <section className="min-w-0 rounded-[28px] border border-[#f0d59d] bg-white p-5 shadow-[0_18px_50px_rgba(50,24,16,0.08)] sm:p-7">
            {!user && (
              <LoginPrompt onLogin={handleLogin} />
            )}

            {user && activeTab === 'profile' && (
              <div>
                <PanelTitle title="Edit Profile" subtitle="Keep your Maeme's account details up to date." />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Full name"><input className={inputClass} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></Field>
                  <Field label="Phone number verified"><input className={inputClass} value={profile.phone} disabled /></Field>
                  <Field label="Email"><input className={inputClass} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></Field>
                  <Field label="Date of birth"><input className={inputClass} type="date" value={profile.dob} onChange={(e) => setProfile({ ...profile, dob: e.target.value })} /></Field>
                </div>
                <button onClick={handleProfileUpdate} className="mt-6 rounded-2xl bg-[#99041e] px-6 py-3 text-sm font-black text-white">Update</button>
              </div>
            )}

            {user && activeTab === 'history' && (
              <OrderHistoryPanel liveOrder={liveOrder} pastOrders={pastOrders} onCancel={cancelOrder} />
            )}

            {user && activeTab === 'tracking' && (
              <CurrentTrackingPanel liveOrder={liveOrder} />
            )}

            {user && activeTab === 'favourites' && (
              <div>
                <PanelTitle title="Favourites" subtitle="Your saved Maeme's dishes, ready for next time." />
                {favouriteProducts.length ? (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {favouriteProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAdd={() => router.push('/menu')}
                        onFavourite={() => removeFavourite(String(product.id))}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<Heart size={42} />} title="No favourites yet" text="Tap the heart on menu items to save your favourites." />
                )}
              </div>
            )}

            {user && activeTab === 'addresses' && (
              <div>
                <PanelTitle title="Saved Addresses" subtitle="Manage delivery addresses for faster checkout." />
                <div className="grid gap-4 lg:grid-cols-2">
                  {addresses.map((address) => (
                    <article key={address.id} className="rounded-2xl border border-[#f0d59d] bg-[#fff8ed] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#99041e]">{address.type}</p>
                          <h3 className="mt-2 font-black">{address.recipientName}</h3>
                          <p className="mt-1 text-sm leading-6 text-[#6b5b55]">{address.address}, {address.city}, {address.postcode}</p>
                        </div>
                        {address.isDefault && <span className="rounded-full bg-[#126336] px-3 py-1 text-xs font-black text-white">Default</span>}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button onClick={() => editAddress(address)} className="rounded-xl border border-[#f0d59d] bg-white px-3 py-2 text-xs font-black text-[#99041e]">Edit</button>
                        <button onClick={() => setAddresses((current) => current.filter((item) => item.id !== address.id))} className="inline-flex items-center gap-1 rounded-xl border border-[#f0d59d] bg-white px-3 py-2 text-xs font-black text-[#99041e]"><Trash2 size={14} /> Remove</button>
                        <button onClick={() => setDefaultAddress(address.id)} className="rounded-xl bg-[#ffc257] px-3 py-2 text-xs font-black">Set default</button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-[#f0d59d] bg-white p-4">
                  <h3 className="text-xl font-black">{editingAddressId ? 'Edit address' : 'Add new address'}</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <select className={inputClass} value={addressForm.type} onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value as AddressType })}>
                      {['Home', 'Office', 'Work', 'Other'].map((type) => <option key={type}>{type}</option>)}
                    </select>
                    <input className={inputClass} placeholder="Recipient name" value={addressForm.recipientName} onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })} />
                    <input className={inputClass} placeholder="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} />
                    <input className={inputClass} placeholder="Address" value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} />
                    <input className={inputClass} placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} />
                    <input className={inputClass} placeholder="Postcode" value={addressForm.postcode} onChange={(e) => setAddressForm({ ...addressForm, postcode: e.target.value })} />
                  </div>
                  <button onClick={saveAddress} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#99041e] px-5 py-3 text-sm font-black text-white"><Plus size={17} /> {editingAddressId ? 'Save changes' : 'Add new address'}</button>
                </div>
              </div>
            )}

            {user && activeTab === 'promos' && (
              <div>
                <PanelTitle title="Promos" subtitle="Copy or apply your available Maeme's promo codes." />
                {promoCards.length ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {promoCards.map((promo) => (
                      <article key={promo.code} className="rounded-2xl border border-[#f0d59d] bg-[#fff8ed] p-5">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#99041e]">{promo.code}</p>
                        <h3 className="mt-2 text-xl font-black">{promo.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#6b5b55]">{promo.description}</p>
                        <button onClick={() => { navigator.clipboard?.writeText(promo.code); showToast('Promo copied'); }} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#ffc257] px-4 py-2 text-sm font-black"><Copy size={16} /> Copy/apply promo code</button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<Gift size={42} />} title="No promos available" text="Your promo offers will appear here." />
                )}
              </div>
            )}
          </section>
        </div>
      </div>
      {toast && <div className="fixed bottom-8 left-4 right-4 z-[90] mx-auto max-w-sm rounded-2xl bg-[#99041e] px-5 py-4 text-sm font-black text-white shadow-xl lg:left-auto lg:right-8 lg:mx-0">{toast}</div>}
    </main>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-black tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#6b5b55]">{subtitle}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-black text-[#1a120f]"><span className="mb-2 block">{label}</span>{children}</label>;
}

function EmptyState({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#f0d59d] bg-[#fff8ed] p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#99041e]">{icon}</div>
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm text-[#6b5b55]">{text}</p>
    </div>
  );
}

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  return (
    <div>
      <PanelTitle title="My Account" subtitle="Login to manage your profile, orders, favourites, addresses and promos." />
      <div className="rounded-2xl border border-[#f0d59d] bg-[#fff8ed] p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#99041e]">
          <User size={36} />
        </div>
        <h3 className="mt-4 text-xl font-black">Login to continue</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6b5b55]">
          Access your profile, saved addresses, favourites, promos and order history from one place.
        </p>
        <button onClick={onLogin} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#ffc257] px-6 py-3 text-sm font-black text-[#1a120f]">
          <LogIn size={17} /> Login
        </button>
      </div>
    </div>
  );
}

function CurrentTrackingPanel({ liveOrder }: { liveOrder?: Order }) {
  return (
    <div>
      <PanelTitle title="Current Order Tracking" subtitle="Track your latest active Maeme's order." />
      {liveOrder ? (
        <LiveOrderCard order={liveOrder} />
      ) : (
        <EmptyState icon={<Truck size={42} />} title="No active order" text="Your current order tracking will appear here after checkout." />
      )}
    </div>
  );
}

function OrderHistoryPanel({ liveOrder, pastOrders, onCancel }: { liveOrder?: Order; pastOrders: Order[]; onCancel: (order: Order) => void }) {
  const orders = liveOrder ? [liveOrder, ...pastOrders] : pastOrders;

  return (
    <div>
      <PanelTitle title="Order History" subtitle="Live and past orders from your Maeme's account." />
      {orders.length === 0 && <EmptyState icon={<History size={42} />} title="No orders yet" text="Your order history will appear after checkout." />}
      {liveOrder && <LiveOrderCard order={liveOrder} onCancel={onCancel} />}
      <div className="mt-5 space-y-4">
        {pastOrders.map((order) => <OrderCard key={order.orderNumber} order={order} />)}
      </div>
    </div>
  );
}

function LiveOrderCard({ order, onCancel }: { order: Order; onCancel?: (order: Order) => void }) {
  const steps = order.orderType === 'delivery'
    ? ['Confirmed', 'Preparing', 'On the way', 'Delivered']
    : ['Confirmed', 'Preparing', 'Ready for collection', 'Completed'];

  return (
    <article className="rounded-[24px] border-2 border-[#ffc257] bg-[#fff8ed] p-5 shadow-[0_14px_38px_rgba(50,24,16,0.08)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="rounded-full bg-[#ffc257] px-3 py-1 text-xs font-black text-[#1a120f]">LIVE ORDER</span>
          <h3 className="mt-3 text-2xl font-black">{order.orderNumber}</h3>
          <p className="mt-1 text-sm text-[#6b5b55]">{order.branchName} · {new Date(order.timestamp).toLocaleString('en-GB')}</p>
          <p className="mt-2 text-sm font-semibold text-[#6b5b55]">{itemsSummary(order)}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-black capitalize">{order.orderType}</p>
          <p className="mt-1 text-sm font-semibold">Payment: {order.paymentMethod === 'card' ? 'Paid' : 'Pending'}</p>
          <p className="mt-1 text-2xl font-black text-[#99041e]">£{order.total.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step} className={`rounded-2xl p-3 text-center text-xs font-black ${index <= order.currentStep ? 'bg-[#99041e] text-white' : 'bg-white text-[#6b5b55]'}`}>
            {index <= order.currentStep && <Check size={16} className="mx-auto mb-1 text-[#ffc257]" />}
            {step}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link href={`/account/orders/${order.orderNumber}`} className="rounded-2xl bg-[#99041e] px-5 py-3 text-center text-sm font-black text-white">View details</Link>
        <Link href={`/track/${order.orderNumber}`} className="rounded-2xl border border-[#f0d59d] bg-white px-5 py-3 text-center text-sm font-black text-[#99041e]">Track Order</Link>
        {onCancel && order.currentStep === 0 && <button onClick={() => onCancel(order)} className="rounded-2xl border border-[#f0d59d] bg-white px-5 py-3 text-sm font-black text-[#99041e]">Cancel order</button>}
      </div>
    </article>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Link href={`/account/orders/${order.orderNumber}`} className="block rounded-2xl border border-[#f0d59d] bg-white p-5 transition hover:border-[#99041e] hover:shadow-[0_14px_38px_rgba(50,24,16,0.08)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-black">{order.orderNumber}</h3>
          <p className="mt-1 text-sm text-[#6b5b55]">{new Date(order.timestamp).toLocaleString('en-GB')} · {order.branchName}</p>
          <p className="mt-2 text-sm font-semibold text-[#6b5b55]">{itemsSummary(order)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <Badge>{order.orderType}</Badge>
          <Badge>{order.paymentMethod === 'card' ? 'Paid' : 'Pending'}</Badge>
          <Badge>{order.status}</Badge>
          <span className="text-xl font-black text-[#99041e]">£{order.total.toFixed(2)}</span>
          <ArrowRight size={18} className="text-[#99041e]" />
        </div>
      </div>
    </Link>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-[#fff8ed] px-3 py-1 text-xs font-black capitalize text-[#99041e]">{children}</span>;
}

function itemsSummary(order: Order) {
  return order.items.map((item) => `${item.quantity}x ${item.name}`).join(' · ');
}
