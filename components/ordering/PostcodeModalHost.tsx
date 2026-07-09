'use client';

import { useEffect, useState } from 'react';
import OrderTypeModal from '@/components/ordering/OrderTypeModal';

export default function PostcodeModalHost() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenRequest = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('[data-open-postcode-modal]')) return;

      event.preventDefault();
      setIsOpen(true);
    };

    const handleCustomOpenRequest = () => setIsOpen(true);

    document.addEventListener('click', handleOpenRequest);
    window.addEventListener('maemes:open-postcode-modal', handleCustomOpenRequest);

    return () => {
      document.removeEventListener('click', handleOpenRequest);
      window.removeEventListener('maemes:open-postcode-modal', handleCustomOpenRequest);
    };
  }, []);

  return <OrderTypeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}
