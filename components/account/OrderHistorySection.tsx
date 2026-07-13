'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useOrders } from '@/lib/ordersContext';
import { History, ChevronRight, Truck, UtensilsCrossed, MapPin } from 'lucide-react';
import { Order } from '@/lib/orderUtils';

// Mock previous orders for demonstration
const MOCK_PREVIOUS_ORDERS: Order[] = [
  {
    orderNumber: 'ORD-123456-789',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    branchName: 'Maeme\'s King Street',
    branchAddress: '123 King Street, London',
    orderType: 'delivery',
    status: 'completed',
    items: [
      { productId: 1, name: 'Piri Piri Chicken', price: 8.99, quantity: 2 },
      { productId: 2, name: 'Spicy Rice', price: 3.99, quantity: 1 },
      { productId: 3, name: 'Garlic Sauce', price: 1.50, quantity: 1 },
    ],
    subtotal: 23.47,
    deliveryFee: 2.50,
    total: 25.97,
    paymentMethod: 'card',
    estimatedTime: 45,
    currentStep: 3,
  },
  {
    orderNumber: 'ORD-234567-890',
    timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
    branchName: 'Maeme\'s Oxford',
    branchAddress: '456 Oxford Street, London',
    orderType: 'pickup',
    status: 'completed',
    items: [
      { productId: 1, name: 'Piri Piri Chicken', price: 8.99, quantity: 1 },
      { productId: 4, name: 'Fries', price: 3.50, quantity: 2 },
    ],
    subtotal: 15.49,
    deliveryFee: 0,
    total: 15.49,
    paymentMethod: 'cash',
    estimatedTime: 30,
    currentStep: 3,
  },
];

export default function OrderHistorySection() {
  const { orders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Combine context orders with mock previous orders
  const allOrders = useMemo(() => {
    const combined = [...orders, ...MOCK_PREVIOUS_ORDERS];
    // Remove duplicates and sort by timestamp (newest first)
    const unique = Array.from(
      new Map(combined.map(order => [order.orderNumber, order])).values()
    );
    return unique.sort((a, b) => b.timestamp - a.timestamp);
  }, [orders]);

  if (allOrders.length === 0) {
    return (
      <div>
        <h3 className="text-2xl font-black text-[#1A1A1A] mb-2">Order History</h3>
        <p className="text-sm text-[#999999] mb-8">
          Select an order to view its full receipt and fulfillment details.
        </p>
        <div className="border-2 border-dashed border-[#F0E5D8] rounded-xl p-8 text-center">
          <History size={48} className="text-[#D4B896] mx-auto mb-4" />
          <p className="text-[#999999] font-semibold mb-2">No orders yet</p>
          <p className="text-sm text-[#999999] mb-6">Start ordering now to see your order history here</p>
          <Link
            href="/menu"
            className="inline-block px-6 py-3 bg-[#99041e] text-white font-bold rounded-lg hover:bg-[#7f0318] transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  // If an order is selected, show order details
  if (selectedOrder) {
    return (
      <div>
        <button
          onClick={() => setSelectedOrder(null)}
          className="flex items-center gap-2 text-[#99041e] font-bold text-sm mb-6 hover:text-[#7f0318] transition-colors"
        >
          <ChevronRight size={18} className="rotate-180" />
          Back to History
        </button>

        {/* Order Details */}
        <div className="bg-white border border-[#E8E0D5] rounded-xl p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-[#E8E0D5]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-2xl font-black text-[#1A1A1A]">Order {selectedOrder.orderNumber}</h3>
                <p className="text-sm text-[#999999] mt-1">
                  {new Date(selectedOrder.timestamp).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold text-white flex-shrink-0 ${
                  selectedOrder.currentStep === 3
                    ? 'bg-green-600'
                    : 'bg-[#99041e]'
                }`}
              >
                {selectedOrder.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs font-bold text-[#999999] uppercase mb-2">Branch</p>
              <p className="font-bold text-[#1A1A1A] mb-1">{selectedOrder.branchName}</p>
              <p className="text-sm text-[#666666] flex items-start gap-2">
                <MapPin size={16} className="text-[#99041e] flex-shrink-0 mt-0.5" />
                {selectedOrder.branchAddress}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#999999] uppercase mb-2">Order Type</p>
              <p className="font-bold text-[#1A1A1A] flex items-center gap-2">
                {selectedOrder.orderType === 'delivery' ? (
                  <>
                    <Truck size={18} className="text-[#99041e]" />
                    Delivery
                  </>
                ) : (
                  <>
                    <UtensilsCrossed size={18} className="text-[#99041e]" />
                    Collection
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-8 pb-8 border-b border-[#E8E0D5]">
            <h4 className="font-bold text-[#1A1A1A] mb-4">Items Ordered</h4>
            <div className="space-y-3">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[#F9F9F9] rounded-lg">
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">{item.name}</p>
                    <p className="text-sm text-[#999999]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-[#99041e]">£{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[#666666]">Subtotal</span>
              <span className="font-bold text-[#1A1A1A]">£{selectedOrder.subtotal.toFixed(2)}</span>
            </div>
            {selectedOrder.deliveryFee > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Delivery Fee</span>
                <span className="font-bold text-[#1A1A1A]">£{selectedOrder.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-[#E8E0D5] pt-2">
              <span className="font-bold text-[#1A1A1A]">Total</span>
              <span className="text-2xl font-black text-[#99041e]">£{selectedOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-4 bg-[#F5F5F5] rounded-lg">
            <p className="text-sm text-[#999999] mb-1">Payment Method</p>
            <p className="font-bold text-[#1A1A1A]">
              {selectedOrder.paymentMethod === 'card' ? 'Debit/Credit Card' : 'Cash'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Separate current live order from past orders
  const currentLiveOrder = allOrders.find(order => order.status !== 'completed');
  const pastOrders = allOrders.filter(order => order.status === 'completed');

  const trackingSteps = currentLiveOrder?.orderType === 'pickup'
    ? ['Confirmed', 'Preparing', 'Ready for collection', 'Completed']
    : ['Confirmed', 'Preparing', 'On the way', 'Delivered'];

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-black text-[#1A1A1A] mb-2">Order history</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#999999]">
            Select an order to view its full receipt and fulfilment details.
          </p>
          {allOrders.length > 0 && (
            <p className="text-xs font-bold text-[#99041e]">{pastOrders.length} past order{pastOrders.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      {/* Live Order Card */}
      {currentLiveOrder && (
        <button
          onClick={() => setSelectedOrder(currentLiveOrder)}
          className="w-full text-left bg-white border-2 border-[#D4B896] rounded-2xl p-6 hover:shadow-md transition-all duration-200 mb-6"
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            {/* Order Icon & Number */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[#3D2817] rounded-lg flex items-center justify-center">
                {currentLiveOrder.orderType === 'delivery' ? (
                  <Truck size={24} className="text-[#FFC107]" />
                ) : (
                  <UtensilsCrossed size={24} className="text-[#FFC107]" />
                )}
              </div>
              <div>
                <p className="font-bold text-[#1A1A1A]">{currentLiveOrder.orderNumber}</p>
                <p className="text-xs text-[#999999]">
                  {new Date(currentLiveOrder.timestamp).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Live Badge & Status */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#FFC107] text-[#1A1A1A] rounded-full text-xs font-bold">
                LIVE ORDER
              </span>
              <ChevronRight size={20} className="text-[#999999]" />
            </div>
          </div>

          {/* Branch & Items */}
          <div className="mb-6 pb-6 border-b border-[#E8E0D5]">
            <p className="font-bold text-[#1A1A1A] mb-1">{currentLiveOrder.branchName}</p>
            <p className="text-sm text-[#999999]">
              {currentLiveOrder.items.map(item => `${item.quantity}× ${item.name}`).join(' · ')}
            </p>
          </div>

          {/* Status Row */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E8E0D5]">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-[#F5F5F5] rounded text-xs font-bold text-[#1A1A1A]">
                {currentLiveOrder.orderType === 'delivery' ? 'Delivery' : 'Collection'}
              </span>
              <span className="px-3 py-1 bg-[#FFC107] rounded text-xs font-bold text-[#1A1A1A]">
                Pay: {currentLiveOrder.paymentMethod === 'card' ? 'Pending' : 'Pending'}
              </span>
              <span className="px-3 py-1 bg-[#F5F5F5] rounded text-xs font-bold text-[#1A1A1A]">
                Confirmed
              </span>
            </div>
            <p className="text-2xl font-black text-[#99041e]">£{currentLiveOrder.total.toFixed(2)}</p>
          </div>

          {/* Progress Tracker */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              {trackingSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  {/* Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                      idx <= currentLiveOrder.currentStep
                        ? 'bg-[#99041e] text-white'
                        : 'bg-[#E8E0D5] text-[#999999]'
                    }`}
                  >
                    {idx <= currentLiveOrder.currentStep ? '✓' : ''}
                  </div>
                  {/* Label */}
                  <p
                    className={`text-xs font-semibold text-center ${
                      idx <= currentLiveOrder.currentStep ? 'text-[#99041e]' : 'text-[#999999]'
                    }`}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress Line */}
            <div className="flex gap-1 mb-4">
              {Array(4)
                .fill(null)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-1 rounded-full ${
                      idx < currentLiveOrder.currentStep
                        ? 'bg-[#99041e]'
                        : 'bg-[#E8E0D5]'
                    }`}
                  />
                ))}
            </div>
          </div>

          {/* Cancel Order Message */}
          {currentLiveOrder.currentStep === 0 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-[#666666]">
                You can cancel before the kitchen starts preparing your order.
              </p>
              <button
                className="text-[#99041e] font-bold hover:underline text-sm ml-4"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle cancel
                }}
              >
                Cancel order
              </button>
            </div>
          )}
        </button>
      )}

      {/* Past Orders */}
      {pastOrders.length > 0 && (
        <div className="space-y-3">
          {pastOrders.map(order => (
            <button
              key={order.orderNumber}
              onClick={() => setSelectedOrder(order)}
              className="w-full text-left bg-white border border-[#E8E0D5] rounded-lg p-4 hover:border-[#99041e] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Order Icon & Info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {order.orderType === 'delivery' ? (
                      <div className="w-10 h-10 bg-[#FFC107] rounded-lg flex items-center justify-center">
                        <Truck size={20} className="text-[#1A1A1A]" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-[#FFC107] rounded-lg flex items-center justify-center">
                        <UtensilsCrossed size={20} className="text-[#1A1A1A]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1A1A1A] text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-[#999999]">
                      {new Date(order.timestamp).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-[#666666] line-clamp-1 mt-1">
                      {order.items.map(item => `${item.quantity}× ${item.name}`).join(' · ')}
                    </p>
                  </div>
                </div>

                {/* Status & Price */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#999999]">
                      {order.orderType === 'delivery' ? 'Delivery' : 'Collection'}
                    </span>
                    <span className="px-2 py-1 bg-[#FFC107] rounded text-xs font-bold text-[#1A1A1A]">
                      Pay: Paid
                    </span>
                    <span className="px-2 py-1 bg-green-100 rounded text-xs font-bold text-green-700">
                      Delivered
                    </span>
                  </div>
                  <p className="font-black text-[#99041e] text-lg">£{order.total.toFixed(2)}</p>
                </div>

                {/* Chevron */}
                <ChevronRight size={20} className="text-[#999999] flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
