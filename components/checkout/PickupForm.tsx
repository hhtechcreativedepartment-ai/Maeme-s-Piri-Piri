'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { BRANCHES, formatBranchDisplay } from '@/lib/branchData';
import { NewPaymentMethodInput, SavedPaymentMethod } from '@/lib/paymentConfig';
import { MapPin, CreditCard, Plus } from 'lucide-react';
import SavedPaymentCard from './SavedPaymentCard';
import NewPaymentMethodForm from './NewPaymentMethodForm';

interface PickupFormProps {
  onBack: () => void;
  onPlaceOrder?: (data: { paymentMethod: 'card' | 'cash'; deliveryFee: number }) => void;
}

export default function PickupForm({ onBack, onPlaceOrder }: PickupFormProps) {
  const { selectedBranch, selectBranch, getCartTotal } = useCart();
  
  // Payment state
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>([
    {
      id: 'card_1',
      type: 'card',
      cardBrand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
      cardholderName: 'John Smith',
      isDefault: true,
    },
  ]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>('card_1');
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [isSubmitting] = useState(false);

  const handleRemovePaymentMethod = (paymentId: string) => {
    setSavedPaymentMethods(savedPaymentMethods.filter(p => p.id !== paymentId));
    if (selectedPaymentId === paymentId) {
      setSelectedPaymentId(null);
    }
  };

  const handleAddNewPaymentMethod = (data: NewPaymentMethodInput) => {
    const newPayment: SavedPaymentMethod = {
      id: `card_${Date.now()}`,
      type: 'card',
      cardBrand: 'visa',
      last4: data.cardNumber.slice(-4),
      expiryMonth: parseInt(data.expiryMonth, 10),
      expiryYear: parseInt(data.expiryYear, 10),
      cardholderName: data.cardholderName,
      isDefault: false,
    };

    setSavedPaymentMethods([...savedPaymentMethods, newPayment]);
    if (data.saveCard) {
      setSelectedPaymentId(newPayment.id);
    }
    setShowNewPaymentForm(false);
  };

  const handleSubmit = async () => {
    if (!selectedBranch || !selectedPaymentId) {
      return;
    }
    
    // Call parent handler which will check auth and create order
    // Pickup has no delivery fee
    if (onPlaceOrder) {
      onPlaceOrder({ paymentMethod: 'card', deliveryFee: 0 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Branch Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-6">
        <h3 className="text-lg font-black text-[#1A1A1A] mb-6 flex items-center gap-2">
          <MapPin size={20} className="text-[#99041e]" />
          Select Collection Location
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BRANCHES.map(branch => (
            <button
              key={branch.branchId}
              onClick={() => selectBranch(branch.branchId)}
              className={`p-5 rounded-lg border-2 text-left transition-all ${
                selectedBranch?.branchId === branch.branchId
                  ? 'border-[#99041e] bg-[#FFF5F5]'
                  : 'border-[#E8E0D5] hover:border-[#99041e]'
              }`}
            >
              <p className="font-bold text-[#1A1A1A] mb-1">{branch.branchName}</p>
              <p className="text-xs text-[#666666] mb-2">{formatBranchDisplay(branch)}</p>
              <p className="text-xs text-[#999999]">{branch.address}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Pickup Details */}
      {selectedBranch && (
        <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-6">
          <h3 className="text-lg font-black text-[#1A1A1A] mb-6">Collection Details</h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-[#999999] font-semibold uppercase mb-1">Location</p>
              <p className="text-sm font-bold text-[#1A1A1A]">{selectedBranch.branchName}</p>
              <p className="text-sm text-[#666666]">{selectedBranch.address}</p>
            </div>

            <div className="pt-4 border-t border-[#F0E5D8]">
              <p className="text-xs text-[#999999] font-semibold uppercase mb-1">Opening Hours</p>
              <p className="text-sm font-bold text-[#1A1A1A]">{formatBranchDisplay(selectedBranch)}</p>
            </div>

            <div className="pt-4 border-t border-[#F0E5D8]">
              <p className="text-xs text-[#999999] font-semibold uppercase mb-1">Estimated Time</p>
              <p className="text-sm font-bold text-[#1A1A1A]">Ready in 30-40 minutes</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method - Card Only for Pickup */}
      <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-6">
        <h3 className="text-lg font-black text-[#1A1A1A] mb-6 flex items-center gap-2">
          <CreditCard size={20} className="text-[#99041e]" />
          Payment (Card Required)
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-[#FFF5F5] rounded-lg border border-[#FFE5E5] mb-4">
            <p className="text-sm font-bold text-[#99041e]">💳 Online Card Payment Only</p>
            <p className="text-xs text-[#666666] mt-2">
              For collection orders, payment must be completed online with a card before order preparation.
            </p>
          </div>

          <h4 className="font-semibold text-[#1A1A1A] text-sm">Select or add a card</h4>

          {/* Saved Cards */}
          {savedPaymentMethods.length > 0 && (
            <div className="space-y-3">
              {savedPaymentMethods.map(card => (
                <SavedPaymentCard
                  key={card.id}
                  card={card}
                  isSelected={selectedPaymentId === card.id}
                  onSelect={() => {
                    setSelectedPaymentId(card.id);
                    setShowNewPaymentForm(false);
                  }}
                  onRemove={handleRemovePaymentMethod}
                />
              ))}
            </div>
          )}

          {/* Add New Card Button or Form */}
          {!showNewPaymentForm ? (
            <button
              onClick={() => setShowNewPaymentForm(true)}
              className="w-full p-3 rounded-lg border-2 border-dashed border-[#99041e] text-[#99041e] font-semibold hover:bg-[#FFF5F5] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add New Card
            </button>
          ) : (
            <NewPaymentMethodForm
              onSubmit={handleAddNewPaymentMethod}
              onCancel={() => setShowNewPaymentForm(false)}
            />
          )}

          {/* Security Note */}
          <p className="text-xs text-[#999999] flex items-start gap-2 pt-2">
            <span>🔒</span>
            <span>Your payment information is secure and encrypted</span>
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedBranch || !selectedPaymentId || isSubmitting}
        className="w-full bg-[#99041e] text-white py-4 rounded-lg font-black text-lg hover:bg-[#7f0318] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Processing...' : `Place Order • £${getCartTotal().toFixed(2)}`}
      </button>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full text-[#99041e] hover:text-[#7f0318] font-semibold py-3 transition-colors"
      >
        Choose Different Order Type
      </button>
    </div>
  );
}
