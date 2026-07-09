import { SavedPaymentMethod } from '@/lib/paymentConfig';
import { Check, Trash2 } from 'lucide-react';

interface SavedPaymentCardProps {
  card: SavedPaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: (cardId: string) => void;
}

const CARD_BRAND_COLORS: Record<SavedPaymentMethod['cardBrand'], string> = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  amex: '#006FCF',
  discover: '#FF6000',
};

export default function SavedPaymentCard({
  card,
  isSelected,
  onSelect,
  onRemove,
}: SavedPaymentCardProps) {
  const brandColor = CARD_BRAND_COLORS[card.cardBrand];

  return (
    <button
      onClick={onSelect}
      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
        isSelected
          ? 'border-[#99041e] bg-[#FFF5F5]'
          : 'border-[#E8E0D5] hover:border-[#99041e]'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Card Brand and Last 4 */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-8 rounded flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: brandColor }}
            >
              {card.cardBrand.toUpperCase().slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-[#1A1A1A] capitalize">
                {card.cardBrand} •••• {card.last4}
              </p>
              <p className="text-xs text-[#666666]">
                Expires {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
              </p>
            </div>
          </div>

          {/* Cardholder Name */}
          <p className="text-xs text-[#999999] mt-2">{card.cardholderName}</p>

          {/* Default Badge */}
          {card.isDefault && (
            <div className="mt-2 inline-block px-2 py-1 bg-[#99041e] text-white rounded text-xs font-semibold">
              Default
            </div>
          )}
        </div>

        {/* Selection Indicator */}
        <div className="flex items-center gap-2">
          {isSelected && (
            <div className="w-5 h-5 bg-[#99041e] rounded-full flex items-center justify-center flex-shrink-0">
              <Check size={16} className="text-white" strokeWidth={3} />
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(card.id);
            }}
            className="text-[#99041e] hover:text-[#7f0318] p-1 flex-shrink-0"
            aria-label="Remove card"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </button>
  );
}
