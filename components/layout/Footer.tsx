'use client';

import { usePathname } from 'next/navigation';
import OrderingFooter from '@/components/ordering/OrderingFooter';
import { isOrderFlowRoute } from '@/lib/orderFlowRoutes';
import PublicSiteFooter from './PublicSiteFooter';

export default function Footer() {
  const pathname = usePathname();
  const usesOrderingFooter = pathname === '/order/menu'
    || pathname === '/cart'
    || pathname === '/checkout'
    || pathname === '/account';

  if (usesOrderingFooter) {
    return <OrderingFooter />;
  }

  if (pathname === '/login' || isOrderFlowRoute(pathname)) {
    return null;
  }

  return <PublicSiteFooter />;
}
