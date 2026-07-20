'use client';

import dynamic from 'next/dynamic';

const Assistant = dynamic(() => import('./OrderingAssistant'), { ssr: false });

export default function AssistantLoader() {
  return <Assistant />;
}
