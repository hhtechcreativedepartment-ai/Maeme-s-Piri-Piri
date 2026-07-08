import { useState } from 'react';
import { validateCardNumber, detectCardBrand, maskCardNumber, formatExpiryYear } from '@/lib/paymentConfig';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface NewPaymentMethodFormProps {
  onSubmit: (data: {
    cardholderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    saveCard: boolean;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function NewPaymentMethodForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: NewPaymentMethodFormProps) {
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCvv, setShowCvv] = useState(false);

  const cardBrand = detectCardBrand(formData.cardNumber);
  const isValidCard = formData.cardNumber.trim() && validateCardNumber(formData.cardNumber);

  const handleCardNumberChange = (e: string) => {
    // Remove non-digits
    const sanitized = e.replace(/\D/g, '');
    // Format with spaces every 4 digits
    const formatted = sanitized.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData({ ...formData, cardNumber: formatted });
    
    // Clear card number error if card becomes valid
    if (errors.cardNumber && validateCardNumber(sanitized)) {
      setErrors({ ...errors, cardNumber: '' });
    }
  };

  const handleExpiryMonthChange = (value: string) => {
    const num = parseInt(value, 10);
    if (num > 12) {
      setFormData({ ...formData, expiryMonth: '12' });
    } else {
      setFormData({ ...formData, expiryMonth: value });
    }
  };

  const handleExpiryYearChange = (value: string) => {
    if (value.length <= 4) {
      setFormData({ ...formData, expiryYear: value });
    }
  };

  const handleCvvChange = (value: string) => {
    // Allow only 3-4 digits
    const sanitized = value.replace(/\D/g, '').slice(0, 4);
    setFormData({ ...formData, cvv: sanitized });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!isValidCard) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiry = 'Expiry date is required';
    } else {
      const year = parseInt(formatExpiryYear(formData.expiryYear), 10);
      const month = parseInt(formData.expiryMonth, 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-[#FAF8F5] rounded-lg border border-[#F0E5D8]">
      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          placeholder="John Smith"
          value={formData.cardholderName}
          onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors text-sm ${
            errors.cardholderName
              ? 'border-[#99041e] focus:border-[#99041e] bg-[#FFF5F5]'
              : 'border-[#E8E0D5] focus:border-[#99041e]'
          }`}
          disabled={isLoading}
        />
        {errors.cardholderName && (
          <p className="text-xs text-[#99041e] mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.cardholderName}
          </p>
        )}
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Card Number</label>
        <div className="relative">
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            maxLength={19}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors text-sm ${
              errors.cardNumber
                ? 'border-[#99041e] focus:border-[#99041e] bg-[#FFF5F5]'
                : 'border-[#E8E0D5] focus:border-[#99041e]'
            }`}
            disabled={isLoading}
          />
          {cardBrand && isValidCard && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-1 rounded bg-[#99041e] text-white">
              {cardBrand.toUpperCase()}
            </div>
          )}
        </div>
        {errors.cardNumber && (
          <p className="text-xs text-[#99041e] mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.cardNumber}
          </p>
        )}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Expiry Date</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="MM"
              min="1"
              max="12"
              value={formData.expiryMonth}
              onChange={(e) => handleExpiryMonthChange(e.target.value)}
              maxLength={2}
              className={`flex-1 px-3 py-3 border rounded-lg focus:outline-none transition-colors text-sm ${
                errors.expiry
                  ? 'border-[#99041e] focus:border-[#99041e] bg-[#FFF5F5]'
                  : 'border-[#E8E0D5] focus:border-[#99041e]'
              }`}
              disabled={isLoading}
            />
            <span className="flex items-center text-[#999999] font-bold">/</span>
            <input
              type="number"
              placeholder="YY"
              value={formData.expiryYear}
              onChange={(e) => handleExpiryYearChange(e.target.value)}
              maxLength={4}
              className={`flex-1 px-3 py-3 border rounded-lg focus:outline-none transition-colors text-sm ${
                errors.expiry
                  ? 'border-[#99041e] focus:border-[#99041e] bg-[#FFF5F5]'
                  : 'border-[#E8E0D5] focus:border-[#99041e]'
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.expiry && (
            <p className="text-xs text-[#99041e] mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.expiry}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">CVV</label>
          <div className="relative">
            <input
              type={showCvv ? 'text' : 'password'}
              placeholder="123"
              value={formData.cvv}
              onChange={(e) => handleCvvChange(e.target.value)}
              maxLength={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors text-sm ${
                errors.cvv
                  ? 'border-[#99041e] focus:border-[#99041e] bg-[#FFF5F5]'
                  : 'border-[#E8E0D5] focus:border-[#99041e]'
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowCvv(!showCvv)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#1A1A1A]"
              tabIndex={-1}
            >
              {showCvv ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.cvv && (
            <p className="text-xs text-[#99041e] mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.cvv}
            </p>
          )}
        </div>
      </div>

      {/* Save Card Checkbox */}
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="saveCard"
          checked={formData.saveCard}
          onChange={(e) => setFormData({ ...formData, saveCard: e.target.checked })}
          className="w-4 h-4 rounded border-[#E8E0D5] text-[#99041e] cursor-pointer"
          disabled={isLoading}
        />
        <label htmlFor="saveCard" className="text-sm text-[#666666] cursor-pointer">
          Save this card for future orders
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-[#F0E5D8]">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-[#99041e] text-white py-3 rounded-lg font-semibold hover:bg-[#7f0318] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Adding...' : 'Add Card'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 border border-[#E8E0D5] rounded-lg font-semibold hover:bg-[#FAF8F5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
