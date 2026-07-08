'use client';

import Link from 'next/link';
import { Check, Clock, MapPin, Home } from 'lucide-react';
import { Order } from '@/lib/orderUtils';

interface OrderConfirmationProps {
  order: Order;
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  const estimatedTime = order.orderType === 'delivery' ? '35–45 min' : '15–20 min';

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center pt-20 pb-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center relative mb-6">
            {/* Outer golden ring */}
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-[#FFC107] opacity-30"></div>
            {/* Inner dark circle with checkmark */}
            <div className="relative w-24 h-24 bg-[#2C1810] rounded-full flex items-center justify-center">
              <Check size={48} className="text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Labels */}
          <p className="text-xs font-black text-[#999999] tracking-wider mb-2">ORDER CONFIRMED</p>
          <h1 className="text-4xl sm:text-5xl font-black text-[#1A1A1A] mb-3">
            Order placed successfully
          </h1>
          <p className="text-base text-[#666666] max-w-md mx-auto">
            Thanks! The kitchen has received your order and will start preparing it shortly.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white border-2 border-[#D4B896] rounded-2xl p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Order Number */}
            <div className="text-center sm:text-left sm:border-r sm:border-[#E8E0D5] sm:pr-6">
              <p className="text-xs font-black text-[#999999] uppercase tracking-wide mb-2">
                Order number
              </p>
              <p className="text-2xl sm:text-3xl font-black text-[#1A1A1A] font-mono">
                {order.orderNumber}
              </p>
            </div>

            {/* Estimated Time */}
            <div className="text-center sm:border-r sm:border-[#E8E0D5] sm:px-6">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Clock size={16} className="text-[#99041e]" />
                <p className="text-xs font-black text-[#999999] uppercase tracking-wide">
                  Estimated time
                </p>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#1A1A1A]">
                {estimatedTime}
              </p>
            </div>

            {/* Branch */}
            <div className="text-center sm:text-left sm:pl-6">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <MapPin size={16} className="text-[#99041e]" />
                <p className="text-xs font-black text-[#999999] uppercase tracking-wide">
                  Restaurant
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-black text-[#1A1A1A]">
                {order.branchName}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/track/${order.orderNumber}`}
            className="flex-1 bg-[#FFC107] text-[#2C1810] px-8 py-4 rounded-full font-black text-base hover:bg-[#FFB300] transition-colors flex items-center justify-center gap-2"
          >
            <Clock size={20} />
            Track order
          </Link>
          <Link
            href="/"
            className="flex-1 bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] px-8 py-4 rounded-full font-black text-base hover:bg-[#F5F5F5] transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Back to home
          </Link>
        </div>

        {/* Security Badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-sm text-[#999999]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Secure checkout. Your details are protected.
          </div>
        </div>
      </div>
    </div>
  );
}
