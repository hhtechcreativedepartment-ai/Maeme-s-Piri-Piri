'use client';

import Link from 'next/link';
import { useOrders } from '@/lib/ordersContext';
import { Truck, MapPin, Clock, Check } from 'lucide-react';

export default function CurrentOrderTrackingSection() {
  const { currentOrder } = useOrders();

  if (!currentOrder || currentOrder.status === 'completed' || currentOrder.status === 'cancelled') {
    return (
      <div>
        <h3 className="text-2xl font-black text-[#1A1A1A] mb-2">Current Order</h3>
        <p className="text-sm text-[#999999] mb-8">
          Track your active orders in real-time.
        </p>
        <div className="border-2 border-dashed border-[#F0E5D8] rounded-xl p-8 text-center">
          <Truck size={48} className="text-[#D4B896] mx-auto mb-4" />
          <p className="text-[#999999] font-semibold mb-2">No active order right now</p>
          <p className="text-sm text-[#999999] mb-6">
            Your current orders will appear here as you place them
          </p>
          <Link
            href="/menu"
            className="inline-block px-6 py-3 bg-[#99041e] text-white font-bold rounded-lg hover:bg-[#7f0318] transition-colors"
          >
            Go to menu
          </Link>
        </div>
      </div>
    );
  }

  const steps = currentOrder.orderType === 'delivery'
    ? [
        { label: 'Confirmed', completed: currentOrder.currentStep >= 0 },
        { label: 'Preparing', completed: currentOrder.currentStep >= 1 },
        { label: 'On the Way', completed: currentOrder.currentStep >= 2 },
        { label: 'Delivered', completed: currentOrder.currentStep >= 3 },
      ]
    : [
        { label: 'Confirmed', completed: currentOrder.currentStep >= 0 },
        { label: 'Preparing', completed: currentOrder.currentStep >= 1 },
        { label: 'Ready for Pickup', completed: currentOrder.currentStep >= 2 },
        { label: 'Completed', completed: currentOrder.currentStep >= 3 },
      ];

  return (
    <div>
      <h3 className="text-2xl font-black text-[#1A1A1A] mb-2">Current Order</h3>
      <p className="text-sm text-[#999999] mb-8">
        Order #{currentOrder.orderNumber} • {currentOrder.branchName}
      </p>

      {/* Order Summary */}
      <div className="bg-[#FFF9F0] border border-[#F0E5D8] rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-[#999999] font-bold mb-1">ORDER TYPE</p>
            <p className="font-bold text-[#1A1A1A]">
              {currentOrder.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#999999] font-bold mb-1">TOTAL</p>
            <p className="font-black text-[#99041e] text-lg">
              £{currentOrder.total.toFixed(2)}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-[#999999] font-bold mb-1">ITEMS</p>
          <p className="text-sm text-[#1A1A1A]">
            {currentOrder.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
          </p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="mb-8">
        <h4 className="font-bold text-[#1A1A1A] mb-6">Order Progress</h4>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step.completed
                      ? 'bg-green-600 text-white'
                      : index === currentOrder.currentStep
                      ? 'bg-[#99041e] text-white'
                      : 'bg-[#E8E0D5] text-[#999999]'
                  }`}
                >
                  {step.completed ? <Check size={16} /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-1 h-12 mt-2 ${
                      step.completed ? 'bg-green-600' : 'bg-[#E8E0D5]'
                    }`}
                  />
                )}
              </div>
              <div className="pt-1">
                <p className={`font-bold ${step.completed ? 'text-[#1A1A1A]' : 'text-[#999999]'}`}>
                  {step.label}
                </p>
                {index === currentOrder.currentStep && (
                  <p className="text-sm text-[#99041e] font-semibold">In progress</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Button */}
      <Link
        href={`/track/${currentOrder.orderNumber}`}
        className="block text-center px-6 py-3 bg-[#99041e] text-white font-bold rounded-lg hover:bg-[#7f0318] transition-colors"
      >
        View order details
      </Link>
    </div>
  );
}
