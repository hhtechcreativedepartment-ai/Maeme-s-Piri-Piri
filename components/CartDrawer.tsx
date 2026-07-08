'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cartContext';
import { BRANCHES, formatBranchDisplay } from '@/lib/branchData';
import { X, Minus, Plus, Trash2, MapPin, Search } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    selectedBranch,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    selectBranchByPostcode,
    selectBranch,
  } = useCart();
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [searchError, setSearchError] = useState('');

  if (!isOpen) return null;

  const handlePostcodeSearch = () => {
    if (!postcode.trim()) {
      setSearchError('Please enter a postcode');
      return;
    }
    try {
      selectBranchByPostcode(postcode);
      setPostcode('');
      setSearchError('');
      setShowBranchSelector(false);
    } catch {
      setSearchError('Invalid postcode format');
    }
  };

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-24 bottom-0 w-full sm:w-96 bg-white shadow-2xl flex flex-col slide-in-from-right animate-in duration-300 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F0E5D8]">
          <h2 className="text-xl font-black text-[#99041e]">ORDER SUMMARY</h2>
          <button
            onClick={onClose}
            className="text-[#999999] hover:text-[#1A1A1A] transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Branch Selection */}
          {selectedBranch && (
            <div className="p-6 border-b border-[#F0E5D8] bg-[#FAF8F5]">
              <div
                onClick={() => setShowBranchSelector(!showBranchSelector)}
                className="flex items-center justify-between cursor-pointer hover:bg-white p-3 rounded-lg transition-colors"
              >
                <div>
                  <p className="text-xs text-[#999999] font-semibold uppercase">Selected Branch</p>
                  <p className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2 mt-1">
                    <MapPin size={16} className="text-[#99041e]" />
                    {selectedBranch.branchName}
                  </p>
                  <p className="text-xs text-[#666666] mt-1">{formatBranchDisplay(selectedBranch)}</p>
                  <p className="text-xs text-[#999999] mt-2">{selectedBranch.address}</p>
                </div>
                <span className="text-[#99041e] text-lg">▼</span>
              </div>

              {/* Branch Selector Dropdown */}
              {showBranchSelector && (
                <div className="mt-4 space-y-3 pt-4 border-t border-[#E8E0D5]">
                  {/* Postcode Search */}
                  <div>
                    <label className="text-xs text-[#666666] font-semibold block mb-2">Search by postcode:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g., SW1A 1AA"
                        value={postcode}
                        onChange={(e) => {
                          setPostcode(e.target.value.toUpperCase());
                          setSearchError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handlePostcodeSearch();
                        }}
                        className="flex-1 px-3 py-2 border border-[#E8E0D5] rounded-lg text-sm focus:outline-none focus:border-[#99041e]"
                        aria-label="Enter postcode"
                      />
                      <button
                        onClick={handlePostcodeSearch}
                        className="bg-[#99041e] text-white p-2 rounded-lg hover:bg-[#7f0318] transition-colors"
                        aria-label="Search postcode"
                      >
                        <Search size={18} />
                      </button>
                    </div>
                    {searchError && (
                      <p className="text-xs text-[#99041e] mt-1">{searchError}</p>
                    )}
                  </div>

                  {/* All Branches */}
                  <div>
                    <p className="text-xs text-[#666666] font-semibold mb-2">Or select a branch:</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {BRANCHES.map(branch => (
                        <button
                          key={branch.branchId}
                          onClick={() => {
                            selectBranch(branch.branchId);
                            setShowBranchSelector(false);
                            setPostcode('');
                          }}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${
                            selectedBranch.branchId === branch.branchId
                              ? 'bg-[#99041e] text-white'
                              : 'bg-white border border-[#E8E0D5] text-[#1A1A1A] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <p className="text-sm font-bold">{branch.branchName}</p>
                          <p className="text-xs opacity-90">{formatBranchDisplay(branch)}</p>
                          <p className="text-xs opacity-75 mt-1">{branch.address}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <p className="text-[#999999] text-sm">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-6 bg-[#99041e] text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-[#7f0318] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {items.map(item => (
                <div
                  key={item.productId}
                  className="border border-[#F0E5D8] rounded-lg p-4 bg-white hover:border-[#99041e] transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-[#1A1A1A] text-sm">{item.name}</p>
                      <p className="text-[#99041e] font-bold text-sm mt-1">
                        £{item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-[#999999] hover:text-[#99041e] transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-[#FAF8F5] rounded-lg p-2 w-fit">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="text-[#99041e] p-1 hover:bg-white rounded transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 font-bold text-[#1A1A1A] min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="text-[#99041e] p-1 hover:bg-white rounded transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="text-right text-sm font-bold text-[#99041e] mt-3">
                    Total: £{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#F0E5D8] p-6 bg-[#FAF8F5] space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-[#E8E0D5]">
              <span className="font-bold text-[#1A1A1A]">Subtotal:</span>
              <span className="text-2xl font-black text-[#99041e]">
                £{getCartTotal().toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-[#99041e] text-white py-3 rounded-lg font-black text-base hover:bg-[#7f0318] transition-colors shadow-lg text-center"
            >
              CONTINUE TO CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
