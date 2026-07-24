'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { isOrderFlowRoute } from '@/lib/orderFlowRoutes';

const Assistant = dynamic(() => import('./OrderingAssistant'), { ssr: false });

export default function AssistantLoader() {
  const pathname = usePathname();

  if (!isOrderFlowRoute(pathname)) {
    return null;
  }

  return <Assistant />;
}
