'use client';

import { Truck, Store } from 'lucide-react';

interface OrderTypeSelectorProps {
  onSelect: (type: 'delivery' | 'pickup') => void;
}

export default function OrderTypeSelector({ onSelect }: OrderTypeSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#F0E5D8] p-8">
      <h2 className="text-2xl font-black text-[#1A1A1A] mb-8">How would you like your order?</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Delivery Option */}
        <button
          onClick={() => onSelect('delivery')}
          className="p-6 border-2 border-[#E8E0D5] rounded-lg hover:border-[#99041e] hover:bg-[#FFF5F5] transition-all group"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-[#FAF8F5] group-hover:bg-[#FFE5E5] rounded-full transition-colors">
              <Truck size={32} className="text-[#99041e]" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-[#1A1A1A] mb-2">Delivery</h3>
              <p className="text-sm text-[#666666]">Get it delivered to your address</p>
            </div>
          </div>
        </button>

        {/* Collection Option */}
        <button
          onClick={() => onSelect('pickup')}
          className="p-6 border-2 border-[#E8E0D5] rounded-lg hover:border-[#99041e] hover:bg-[#FFF5F5] transition-all group"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-[#FAF8F5] group-hover:bg-[#FFE5E5] rounded-full transition-colors">
              <Store size={32} className="text-[#99041e]" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-[#1A1A1A] mb-2">Collection</h3>
              <p className="text-sm text-[#666666]">Collect from a restaurant</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
