'use client';

import { Suspense } from 'react';
import PremiumCheckoutPage from '@/components/checkout/PremiumCheckoutPage';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fff8ed]" />}>
      <PremiumCheckoutPage />
    </Suspense>
  );
}
