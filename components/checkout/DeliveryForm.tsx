'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { formatBranchDisplay } from '@/lib/branchData';
import { SavedPaymentMethod } from '@/lib/paymentConfig';
import { MapPin, CreditCard, Plus, X } from 'lucide-react';
import SavedPaymentCard from './SavedPaymentCard';
import NewPaymentMethodForm from './NewPaymentMethodForm';

interface Address {
  id: string;
  type: 'home' | 'office' | 'work' | 'other';
  street: string;
  postcode: string;
}

interface DeliveryFormProps {
  onBack: () => void;
  onPlaceOrder?: (data: { paymentMethod: 'card' | 'cash'; deliveryFee: number }) => void;
}

const ADDRESS_TYPES = [
  { value: 'home', label: 'Home' },
  { value: 'office', label: 'Office' },
  { value: 'work', label: 'Work' },
  { value: 'other', label: 'Other' },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: 'card', label: 'Online Card Payment', icon: '💳' },
  { value: 'cash', label: 'Cash on Delivery', icon: '💵' },
];

export default function DeliveryForm({ onBack, onPlaceOrder }: DeliveryFormProps) {
  const { selectedBranch, getCartTotal } = useCart();
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    type: 'home',
    street: '',
    postcode: '',
  });
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAddress = () => {
    if (!newAddress.street.trim() || !newAddress.postcode.trim()) {
      return;
    }

    const address: Address = {
      id: Date.now().toString(),
      type: newAddress.type,
      street: newAddress.street,
      postcode: newAddress.postcode,
    };

    setSavedAddresses([...savedAddresses, address]);
    setSelectedAddressId(address.id);
    setNewAddress({ type: 'home', street: '', postcode: '' });
    setShowAddForm(false);
  };

  const handleRemoveAddress = (id: string) => {
    setSavedAddresses(savedAddresses.filter(addr => addr.id !== id));
    if (selectedAddressId === id) {
      setSelectedAddressId(null);
    }
  };

  const handleRemovePaymentMethod = (paymentId: string) => {
    setSavedPaymentMethods(savedPaymentMethods.filter(p => p.id !== paymentId));
    if (selectedPaymentId === paymentId) {
      setSelectedPaymentId(null);
    }
  };

  const handleAddNewPaymentMethod = (data: any) => {
    const newPayment: SavedPaymentMethod = {
      id: `card_${Date.now()}`,
      type: 'card',
      cardBrand: 'visa', // Would be detected from input
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
    if (!selectedAddressId && !showAddForm) {
      return;
    }
    if (paymentMethod === 'card' && !selectedPaymentId && !showNewPaymentForm) {
      return;
    }
    
    // Call parent handler which will check auth and create order
    if (onPlaceOrder) {
      const deliveryFee = paymentMethod === 'card' ? 2.99 : 2.99;
      onPlaceOrder({ paymentMethod, deliveryFee });
    }
  };

  const selectedAddr = savedAddresses.find(addr => addr.id === selectedAddressId);

  return (
    <div className="space-y-6">
      {/* Branch Info */}
      <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-6">
        <h3 className="text-sm font-semibold text-[#999999] uppercase mb-3">Delivery to</h3>
        <p className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2 mb-2">
          <MapPin size={16} className="text-[#99041e]" />
          {selectedBranch?.branchName}
        </p>
        <p className="text-xs text-[#666666] ml-6">{formatBranchDisplay(selectedBranch!)}</p>
      </div>

      {/* Address Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-[#1A1A1A]">Delivery Address</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 text-[#99041e] hover:text-[#7f0318] font-semibold text-sm"
          >
            <Plus size={18} />
            {savedAddresses.length === 0 ? 'Add Address' : 'Add Another'}
          </button>
        </div>

        {/* Add New Address Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-[#FAF8F5] rounded-lg border border-[#F0E5D8]">
            <div className="space-y-4">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {ADDRESS_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setNewAddress({ ...newAddress, type: type.value as Address['type'] })}
                      className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        newAddress.type === type.value
                          ? 'bg-[#99041e] text-white'
                          : 'bg-white border border-[#E8E0D5] text-[#1A1A1A] hover:border-[#99041e]'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Street Address</label>
                <input
                  type="text"
                  placeholder="Enter your street address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#99041e] text-sm"
                />
              </div>

              {/* Postcode */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Postcode</label>
                <input
                  type="text"
                  placeholder="e.g., SW1A 1AA"
                  value={newAddress.postcode}
                  onChange={(e) => setNewAddress({ ...newAddress, postcode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#99041e] text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddAddress}
                  disabled={!newAddress.street.trim() || !newAddress.postcode.trim()}
                  className="flex-1 bg-[#99041e] text-white py-2.5 rounded-lg font-semibold hover:bg-[#7f0318] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Address
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 border border-[#E8E0D5] rounded-lg font-semibold hover:bg-[#FAF8F5] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Addresses */}
        {savedAddresses.length > 0 && (
          <div className="space-y-3 mb-6">
            {savedAddresses.map(address => (
              <button
                key={address.id}
                onClick={() => setSelectedAddressId(address.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedAddressId === address.id
                    ? 'border-[#99041e] bg-[#FFF5F5]'
                    : 'border-[#E8E0D5] hover:border-[#99041e]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-[#1A1A1A] capitalize">{address.type}</p>
                    <p className="text-sm text-[#666666]">{address.street}</p>
                    <p className="text-sm text-[#999999]">{address.postcode}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAddress(address.id);
                    }}
                    className="text-[#99041e] hover:text-[#7f0318] p-1"
                    aria-label="Remove address"
                  >
                    <X size={18} />
                  </button>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-6">
        <h3 className="text-lg font-black text-[#1A1A1A] mb-6 flex items-center gap-2">
          <CreditCard size={20} className="text-[#99041e]" />
          Payment Method
        </h3>

        {/* Payment Type Selection */}
        <div className="space-y-3 mb-6">
          {PAYMENT_METHOD_OPTIONS.map(method => (
            <button
              key={method.value}
              onClick={() => {
                setPaymentMethod(method.value as 'card' | 'cash');
                setShowNewPaymentForm(false);
              }}
              className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                paymentMethod === method.value
                  ? 'border-[#99041e] bg-[#FFF5F5]'
                  : 'border-[#E8E0D5] hover:border-[#99041e]'
              }`}
            >
              <p className="font-semibold text-[#1A1A1A]">
                <span className="mr-2">{method.icon}</span>
                {method.label}
              </p>
            </button>
          ))}
        </div>

        {/* Card Payment Options */}
        {paymentMethod === 'card' && (
          <div className="space-y-4 pt-4 border-t border-[#F0E5D8]">
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
        )}

        {/* Cash on Delivery Info */}
        {paymentMethod === 'cash' && (
          <div className="p-4 bg-[#FFF5F5] rounded-lg border border-[#FFE5E5]">
            <p className="text-sm font-bold text-[#99041e]">💵 Pay When Order Arrives</p>
            <p className="text-xs text-[#666666] mt-2">
              You'll pay the delivery driver when your order arrives. No payment needed now.
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedAddr || isSubmitting}
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
