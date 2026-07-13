'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin, ReceiptText, Truck } from 'lucide-react';
import { useOrders } from '@/lib/ordersContext';
import { getLastOrder } from '@/lib/orderUtils';

export default function PremiumOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const { currentOrder, getOrderByNumber } = useOrders();
  const order =
    getOrderByNumber(params.orderId) ||
    (currentOrder?.orderNumber === params.orderId ? currentOrder : null) ||
    (typeof window !== 'undefined' ? getLastOrder() : null);

  if (!order) {
    return (
      <main className="min-h-screen bg-[#fff8ed] px-4 py-16 text-center">
        <h1 className="text-4xl font-black">Order not found</h1>
        <Link href="/menu" className="mt-6 inline-flex rounded-2xl bg-[#ffc257] px-6 py-3 font-black">Browse Menu</Link>
      </main>
    );
  }

  const active = order.status !== 'completed' && order.status !== 'cancelled';
  const serviceCharge = 0.79;
  const discount = Math.max(order.subtotal + order.deliveryFee + serviceCharge - order.total, 0);
  const subtotal = order.subtotal;
  const destinationLabel = order.orderType === 'delivery' ? 'Delivery address' : 'Collection branch';

  return (
    <main className="min-h-screen bg-[#fff8ed] px-4 py-10 text-[#1a120f] sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1100px]">
        <Link href="/account?tab=orders" className="inline-flex items-center gap-2 text-sm font-black text-[#99041e]">
          <ArrowLeft size={18} />
          Back to Order History
        </Link>

        <section className="mt-6 rounded-[28px] border border-[#f0d59d] bg-white p-5 shadow-[0_18px_50px_rgba(50,24,16,0.08)] sm:p-7">
          <div className="flex flex-col gap-4 border-b border-[#f0d59d] pb-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#99041e]">Order details</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">{order.orderNumber}</h1>
              <p className="mt-2 text-sm font-semibold text-[#6b5b55]">{new Date(order.timestamp).toLocaleString('en-GB')}</p>
            </div>
            <span className="w-max rounded-full bg-[#fff8ed] px-4 py-2 text-sm font-black capitalize text-[#99041e]">{order.status}</span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoCard icon={<Truck size={20} />} label="Order type" value={order.orderType} />
            <InfoCard icon={<MapPin size={20} />} label={destinationLabel} value={order.branchAddress || order.branchName} />
            <InfoCard icon={<ReceiptText size={20} />} label="Payment method" value={order.paymentMethod === 'card' ? 'Debit/Credit Card' : 'Cash'} />
          </div>

          <div className="mt-6 rounded-2xl border border-[#f0d59d] bg-[#fff8ed] p-5">
            <p className="text-sm font-black text-[#99041e]">Ordered from branch</p>
            <h2 className="mt-2 text-2xl font-black">{order.branchName}</h2>
            <p className="mt-1 text-sm leading-6 text-[#6b5b55]">{order.branchAddress}</p>
            <p className="mt-2 text-sm font-black">Payment status: {order.paymentMethod === 'card' ? 'Paid' : 'Pending'}</p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section>
              <h2 className="text-2xl font-black">Items list</h2>
              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between rounded-2xl border border-[#f0d59d] bg-white p-4">
                    <div>
                      <p className="font-black">{item.name}</p>
                      <p className="mt-1 text-sm text-[#6b5b55]">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-black text-[#99041e]">£{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="rounded-2xl border border-[#f0d59d] bg-[#fff8ed] p-5">
              <h2 className="text-2xl font-black">Summary</h2>
              <div className="mt-5 space-y-3 text-sm">
                <SummaryRow label="Subtotal" value={`£${subtotal.toFixed(2)}`} />
                <SummaryRow label="Delivery fee" value={`£${order.deliveryFee.toFixed(2)}`} />
                <SummaryRow label="Service charge" value={`£${serviceCharge.toFixed(2)}`} />
                <SummaryRow label="Discount" value={`-£${discount.toFixed(2)}`} />
                <div className="border-t border-[#f0d59d] pt-4">
                  <SummaryRow label="Total paid" value={`£${order.total.toFixed(2)}`} strong />
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/menu" className="rounded-2xl bg-[#ffc257] px-6 py-3 text-center text-sm font-black">Browse Menu</Link>
            {active && <Link href={`/track/${order.orderNumber}`} className="rounded-2xl bg-[#99041e] px-6 py-3 text-center text-sm font-black text-white">Track Order</Link>}
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#f0d59d] bg-white p-4">
      <div className="flex items-center gap-2 text-[#99041e]">{icon}<span className="text-xs font-black uppercase tracking-[0.16em]">{label}</span></div>
      <p className="mt-3 text-sm font-black capitalize leading-6">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <div className={`flex justify-between ${strong ? 'text-lg font-black text-[#99041e]' : 'font-semibold'}`}><span>{label}</span><span>{value}</span></div>;
}
