'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { isOrderFlowRoute } from '@/lib/orderFlowRoutes';

const FloatingEnquiry = dynamic(() => import('./FloatingEnquiry'), { ssr: false });

export default function EnquiryLoader() {
  const pathname = usePathname();
  const isPrivateOrOrderingRoute = pathname === '/login'
    || pathname === '/account'
    || pathname.startsWith('/account/')
    || isOrderFlowRoute(pathname);

  if (isPrivateOrOrderingRoute) return null;
  return <FloatingEnquiry />;
}
