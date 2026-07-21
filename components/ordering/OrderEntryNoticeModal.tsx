'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface OrderEntryNoticeModalProps {
  isOpen: boolean;
  isContinuing: boolean;
  error?: string;
  onClose: () => void;
  onContinue: () => void;
}

export default function OrderEntryNoticeModal({ isOpen, isContinuing, error, onClose, onContinue }: OrderEntryNoticeModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const continuingRef = useRef(isContinuing);
  const [mounted, setMounted] = useState(false);

  closeRef.current = onClose;
  continuingRef.current = isContinuing;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    const focusTimer = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('[data-notice-close]')?.focus(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !continuingRef.current) {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])') || []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[#2b0710]/55 p-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] motion-safe:animate-[fadeIn_.2s_ease-out]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-entry-notice-title"
        aria-describedby="order-entry-notice-body"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[480px] flex-col overflow-hidden rounded-[24px] border border-[#f0d59d] bg-[#fffaf2] shadow-[0_28px_90px_rgba(43,7,16,.32)] motion-safe:animate-[noticeEnter_.2s_ease-out] sm:w-[76vw]"
      >
        <header className="relative flex min-h-16 shrink-0 items-center justify-center bg-[#ffc257] px-16 py-3">
          <h2 id="order-entry-notice-title" className="text-xl font-black text-[#99041e]">Notice</h2>
          <button
            data-notice-close
            type="button"
            onClick={onClose}
            disabled={isContinuing}
            aria-label="Close notice"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#99041e] text-white transition hover:bg-[#7f0318] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white disabled:opacity-60"
          >
            <X size={22} />
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-7">
          <div id="order-entry-notice-body" className="space-y-3 text-[15px] font-medium leading-6 text-[#4f3c36] sm:text-base sm:leading-7">
            <p>Maeme&apos;s may occasionally send customers service updates, order information and promotional messages where permission has been provided.</p>
            <p>Maeme&apos;s will never ask you to share your password, payment PIN, one-time verification code or other sensitive account information through an unexpected message.</p>
            <p>Online orders are prepared and fulfilled by the Maeme&apos;s branch selected for your Collection or Delivery order. Product availability, opening times, preparation times and delivery coverage may vary by location.</p>
            <p>By continuing, you confirm that the branch, order type and details selected during the ordering process are correct.</p>
          </div>

          {error && <p role="alert" className="mt-4 rounded-xl bg-[#99041e]/8 px-4 py-3 text-sm font-bold text-[#99041e]">{error}</p>}

          <button
            type="button"
            onClick={onContinue}
            disabled={isContinuing}
            className="mt-6 min-h-13 w-full rounded-full bg-[#99041e] px-6 py-3 text-base font-black text-white shadow-[0_6px_0_#5f0213] transition hover:bg-[#7f0318] active:translate-y-0.5 active:shadow-[0_3px_0_#5f0213] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffc257] disabled:cursor-wait disabled:opacity-65"
          >
            {isContinuing ? 'Opening ordering…' : 'OK'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
