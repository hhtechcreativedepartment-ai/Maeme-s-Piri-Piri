'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Clock, Package } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  type: 'delivery' | 'pickup';
  branchName: string;
  total: number;
  status: 'completed' | 'in-progress' | 'pending';
}

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Mock orders
  const [orders] = useState<OrderItem[]>([
    {
      id: '1',
      orderNumber: 'ORD-240318-001',
      date: 'Mar 18, 2024 • 7:30 PM',
      type: 'delivery',
      branchName: 'London - Soho',
      total: 24.99,
      status: 'completed',
    },
    {
      id: '2',
      orderNumber: 'ORD-240315-002',
      date: 'Mar 15, 2024 • 1:15 PM',
      type: 'pickup',
      branchName: 'London - Covent Garden',
      total: 18.99,
      status: 'completed',
    },
    {
      id: '3',
      orderNumber: 'ORD-240310-003',
      date: 'Mar 10, 2024 • 6:45 PM',
      type: 'delivery',
      branchName: 'London - Shoreditch',
      total: 31.50,
      status: 'completed',
    },
  ]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-24">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-[#666666] mb-6">Please login to view your order history.</p>
          <Link
            href="/login"
            className="inline-block bg-[#99041e] text-white px-8 py-3 rounded-full font-bold hover:bg-[#7f0318] transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#99041e] hover:text-[#7f0318] font-semibold mb-4"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <h1 className="text-4xl font-black text-[#1A1A1A]">Order History</h1>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <p className="font-black text-[#1A1A1A]">{order.orderNumber}</p>
                    <p className="text-sm text-[#666666]">{order.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-[#F0E5D8]">
                  <div className="flex items-start gap-2">
                    {order.type === 'delivery' ? (
                      <MapPin size={18} className="text-[#99041e] flex-shrink-0 mt-1" />
                    ) : (
                      <Package size={18} className="text-[#99041e] flex-shrink-0 mt-1" />
                    )}
                    <div>
                      <p className="text-xs text-[#666666] font-semibold">
                        {order.type === 'delivery' ? 'Delivery' : 'Pickup'}
                      </p>
                      <p className="text-sm font-bold text-[#1A1A1A]">{order.branchName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#666666] font-semibold">Total</p>
                    <p className="text-sm font-black text-[#99041e]">£{order.total.toFixed(2)}</p>
                  </div>
                </div>

                <Link
                  href={`/track/${order.orderNumber}`}
                  className="w-full block text-center bg-[#FFF5F5] text-[#99041e] py-2 rounded-lg font-bold hover:bg-[#FFE5E5] transition-colors text-sm"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-12 text-center">
            <p className="text-[#666666] mb-4">No orders yet.</p>
            <Link
              href="/menu"
              className="inline-block bg-[#99041e] text-white px-8 py-3 rounded-full font-bold hover:bg-[#7f0318] transition-colors"
            >
              Start Ordering
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
