'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isOrderFlowRoute } from '@/lib/orderFlowRoutes';

const orderingShellRoutes = new Set(['/account']);
const orderingLegalRoutes = new Map([
  ['/privacy-policy', '/order/privacy-policy'],
  ['/terms-and-conditions', '/order/terms-and-conditions'],
]);

export default function OrderingLegalNavigationGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isOrderFlowRoute(pathname) && !orderingShellRoutes.has(pathname)) return;

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const orderingHref = orderingLegalRoutes.get(url.pathname);
      if (!orderingHref) return;

      event.preventDefault();
      router.push(orderingHref);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname, router]);

  return null;
}
