'use client';

import { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';

interface Promo {
  id: string;
  label: string;
  title: string;
  description: string;
  code: string;
  minOrder?: string;
  validity: string;
  icon?: string;
}

// Mock promo data
const MOCK_PROMOS: Promo[] = [
  {
    id: '1',
    label: 'WELCOME OFFER',
    title: '£3 off your next order',
    description: 'Use code FRESH3 on orders over £18.',
    code: 'FRESH3',
    minOrder: '£18',
    validity: 'Valid 14 days',
    icon: '🎁',
  },
  {
    id: '2',
    label: 'LOYALTY REWARD',
    title: '£5 off for you',
    description: 'Use code LOYAL5 on orders over £25.',
    code: 'LOYAL5',
    minOrder: '£25',
    validity: 'Valid 30 days',
    icon: '⭐',
  },
  {
    id: '3',
    label: 'WEEKEND SPECIAL',
    title: 'Free sides on orders over £30',
    description: 'Use code WEEKEND30 for free sides.',
    code: 'WEEKEND30',
    minOrder: '£30',
    validity: 'Valid 7 days',
    icon: '🎉',
  },
];

export default function PromosSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [promos] = useState<Promo[]>(MOCK_PROMOS);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (promos.length === 0) {
    return (
      <div>
        {/* Header */}
        <div className="mb-6 pb-6 border-b border-[#E8E0D5]">
          <h3 className="text-2xl font-black text-[#1A1A1A] mb-1">Your promos</h3>
          <p className="text-sm text-[#999999]">Offers picked for your next order.</p>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <Gift size={56} className="text-[#D4B896] mb-6" />
          <h4 className="text-lg font-bold text-[#1A1A1A] mb-2">No offers available</h4>
          <p className="text-sm text-[#999999]">
            Check back later for exclusive promos and offers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-[#E8E0D5]">
        <h3 className="text-2xl font-black text-[#1A1A1A] mb-1">Your promos</h3>
        <p className="text-sm text-[#999999]">Offers picked for your next order.</p>
      </div>

      {/* Promos Grid */}
      <div className="space-y-4">
        {promos.map(promo => (
          <div
            key={promo.id}
            className="bg-gradient-to-r from-[#FFF9E6] to-[#FFFCF0] border-2 border-[#FFC107] rounded-xl p-5 sm:p-6"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              {promo.icon && (
                <div className="text-4xl flex-shrink-0">{promo.icon}</div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <p className="text-xs font-black text-[#8B5A00] uppercase tracking-wider mb-1">
                      {promo.label}
                    </p>
                    <h4 className="text-lg sm:text-xl font-black text-[#1A1A1A]">
                      {promo.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#8B5A00] whitespace-nowrap">
                    {promo.validity}
                  </p>
                </div>

                <p className="text-sm text-[#666666] mb-4">{promo.description}</p>

                {/* Code Copy Button */}
                <div className="flex items-center gap-2">
                  <code className="bg-white border border-[#D4B896] px-3 py-2 rounded-lg font-bold text-[#1A1A1A] text-sm">
                    {promo.code}
                  </code>
                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    className="p-2 bg-white border border-[#D4B896] rounded-lg hover:bg-[#FFF5F5] transition-colors flex items-center gap-1.5"
                    title="Copy code"
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <Check size={16} className="text-green-600" />
                        <span className="text-xs font-bold text-green-600 hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="text-[#99041e]" />
                        <span className="text-xs font-bold text-[#99041e] hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-[#FFF5F5] border border-[#FFE5E5] rounded-lg">
        <p className="text-xs text-[#666666]">
          💡 Promo codes can be applied at checkout. Minimum order values and terms apply. Check terms for each offer.
        </p>
      </div>
    </div>
  );
}
