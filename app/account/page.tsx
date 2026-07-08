'use client';

import { Suspense } from 'react';
import PremiumAccountPage from '@/components/account/PremiumAccountPage';

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fff8ed]" />}>
      <PremiumAccountPage />
    </Suspense>
  );
}
