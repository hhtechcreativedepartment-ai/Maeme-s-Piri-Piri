'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Check, MapPin, Clock, Package } from 'lucide-react';
import { getMockOrderProgress, getOrderStatusSteps, getEstimatedArrivalTime } from '@/lib/orderUtils';
import { useState, useEffect } from 'react';
import { useOrders } from '@/lib/ordersContext';

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;
  const { getOrderByNumber, updateOrderStatus } = useOrders();
  const [order, setOrder] = useState(getMockOrderProgress(orderNumber));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get order from context first
    const contextOrder = getOrderByNumber(orderNumber);
    if (contextOrder) {
      setOrder(contextOrder);
      setIsLoading(false);
    } else {
      // Fallback to mock progress
      const timer = setTimeout(() => {
        const updatedOrder = getMockOrderProgress(orderNumber);
        if (updatedOrder && updatedOrder.orderNumber) {
          setOrder(updatedOrder);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    }

    // Update order progress every 5 seconds
    const interval = setInterval(() => {
      const progressOrder = getMockOrderProgress(orderNumber);
      if (progressOrder && progressOrder.orderNumber) {
        setOrder(progressOrder);
        updateOrderStatus(orderNumber, progressOrder.status, progressOrder.currentStep);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderNumber, getOrderByNumber, updateOrderStatus]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-[#99041e] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#999999] font-semibold">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order || !order.orderNumber) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#99041e] hover:text-[#7f0318] font-semibold mb-8"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-8 text-center">
            <Package size={48} className="text-[#999999] mx-auto mb-4" />
            <h1 className="text-2xl font-black text-[#1A1A1A] mb-2">Order Not Found</h1>
            <p className="text-[#666666] mb-6">
              We couldn't find an order with number <span className="font-mono font-bold">{orderNumber}</span>
            </p>
            <Link href="/menu" className="text-[#99041e] font-semibold hover:text-[#7f0318]">
              Return to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusSteps = getOrderStatusSteps();
  const estimatedTime = getEstimatedArrivalTime(order);
  const elapsedMinutes = Math.floor((Date.now() - order.timestamp) / 60000);
  const remainingMinutes = Math.max(0, order.estimatedTime - elapsedMinutes);

  const getStatusColor = (stepIndex: number) => {
    if (stepIndex < order.currentStep) return 'bg-[#99041e]';
    if (stepIndex === order.currentStep) return 'bg-[#ffc257]';
    return 'bg-[#E8E0D5]';
  };

  const getStatusTextColor = (stepIndex: number) => {
    if (stepIndex <= order.currentStep) return 'text-[#99041e]';
    return 'text-[#999999]';
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#99041e] hover:text-[#7f0318] font-semibold mb-8"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] mb-2">Track Your Order</h1>
          <p className="text-[#666666]">
            Order <span className="font-mono font-bold text-[#1A1A1A]">{order.orderNumber}</span>
          </p>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-6 mb-6">
          <div className="space-y-6">
            {statusSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Timeline Dot and Line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-white transition-all ${getStatusColor(index)}`}
                  >
                    {index < order.currentStep ? (
                      <Check size={20} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`w-1 h-12 my-2 transition-colors ${
                        index < order.currentStep ? 'bg-[#99041e]' : 'bg-[#E8E0D5]'
                      }`}
                    />
                  )}
                </div>

                {/* Status Text */}
                <div className="flex-1 pt-2">
                  <p className={`font-black text-lg transition-colors ${getStatusTextColor(index)}`}>
                    {step}
                  </p>
                  {index === order.currentStep && (
                    <p className="text-sm text-[#99041e] font-semibold mt-1">
                      {order.currentStep === 3
                        ? 'Your order is complete!'
                        : `${remainingMinutes} minutes remaining`}
                    </p>
                  )}
                  {index < order.currentStep && (
                    <p className="text-sm text-[#999999] mt-1">Completed</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Branch */}
          <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-4">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-[#99041e] flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-[#999999] font-semibold uppercase mb-1">
                  {order.orderType === 'delivery' ? 'Delivering To' : 'Collection Location'}
                </p>
                <p className="font-semibold text-[#1A1A1A] text-sm">
                  {order.orderType === 'delivery' ? 'Delivery address' : order.branchName}
                </p>
                <p className="text-xs text-[#666666] mt-1">
                  {order.orderType === 'delivery'
                    ? order.deliveryAddress || order.branchAddress
                    : order.branchAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-4">
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-[#99041e] flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-[#999999] font-semibold uppercase mb-1">
                  {order.orderType === 'delivery' ? 'Estimated Delivery' : 'Ready for Collection'}
                </p>
                <p className="font-semibold text-[#1A1A1A] text-sm">{estimatedTime}</p>
                <p className="text-xs text-[#666666] mt-1">
                  {remainingMinutes > 0
                    ? `${remainingMinutes} min remaining`
                    : 'Should be ready now'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-6 mb-6">
          <h3 className="font-black text-[#1A1A1A] mb-4">Items</h3>
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-[#1A1A1A]">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-[#999999]">£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#F0E5D8] mt-4 pt-4 flex justify-between">
            <span className="font-black text-[#1A1A1A]">Total</span>
            <span className="font-black text-[#99041e] text-lg">£{order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/menu"
            className="block w-full bg-[#99041e] text-white py-4 rounded-lg font-black text-base hover:bg-[#7f0318] transition-colors text-center"
          >
            Order Another
          </Link>
          <Link
            href="/"
            className="block w-full bg-white border-2 border-[#99041e] text-[#99041e] py-4 rounded-lg font-black text-base hover:bg-[#FFF5F5] transition-colors text-center"
          >
            Return Home
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-[#999999] mt-6">
          Real-time tracking would be available with backend integration
        </p>
      </div>
    </div>
  );
}
