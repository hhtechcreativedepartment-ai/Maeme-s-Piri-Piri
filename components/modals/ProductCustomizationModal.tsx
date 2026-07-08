'use client';

import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { MenuItem } from '@/lib/menuData';

interface ProductCustomizationModalProps {
  isOpen: boolean;
  product: MenuItem | null;
  onClose: () => void;
}

interface SelectedAddOns {
  [key: string]: { name: string; price: number; selected: boolean };
}

const ADDON_OPTIONS = [
  { name: 'Extra cheese', price: 1.50 },
  { name: 'Fries', price: 2.49 },
  { name: 'Drink', price: 1.99 },
  { name: 'Dip', price: 0.75 },
  { name: 'Fresh salad', price: 1.50 },
  { name: 'Extra sauce', price: 0.75 },
];

const SIZE_PRICES: { [key: string]: number } = {
  'Regular': 0,
  'Large': 2.00,
};

export default function ProductCustomizationModal({ isOpen, product, onClose }: ProductCustomizationModalProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('Regular');
  const [selectedFlavour, setSelectedFlavour] = useState<string>('Medium');
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOns>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [sizeError, setSizeError] = useState(false);

  if (!isOpen || !product) return null;

  const handleAddOnChange = (addon: typeof ADDON_OPTIONS[0]) => {
    setSelectedAddOns(prev => ({
      ...prev,
      [addon.name]: {
        name: addon.name,
        price: addon.price,
        selected: !prev[addon.name]?.selected,
      },
    }));
  };

  const getSelectedAddOnsList = () => {
    return Object.values(selectedAddOns).filter(addon => addon.selected);
  };

  const calculateTotalPrice = () => {
    const basePrice = product.price + (SIZE_PRICES[selectedSize] || 0);
    const addOnsTotal = getSelectedAddOnsList().reduce((sum, addon) => sum + addon.price, 0);
    return (basePrice + addOnsTotal) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    const cartItem = {
      productId: product.id,
      quantity,
      name: product.name,
      price: product.price + (SIZE_PRICES[selectedSize] || 0),
      image: product.image,
      customization: {
        selectedSize,
        selectedFlavour,
        selectedSpiceLevel: selectedFlavour,
        selectedAddOns: getSelectedAddOnsList(),
        specialInstructions,
      },
      totalPrice: calculateTotalPrice(),
    };

    addToCart(cartItem);
    onClose();
    
    // Reset form
    setSelectedSize('Regular');
    setSelectedFlavour('Medium');
    setQuantity(1);
    setSelectedAddOns({});
    setSpecialInstructions('');
    setSizeError(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors z-10"
            aria-label="Close modal"
          >
            <X size={24} className="text-[#1A1A1A]" />
          </button>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
            {/* Left: Product Image */}
            <div className="flex items-center justify-center bg-[#F9F9F9] rounded-xl overflow-hidden h-96">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Product Details & Customization */}
            <div className="flex flex-col gap-6 overflow-y-auto max-h-96 pr-4">
              {/* Product Info */}
              <div>
                <h2 className="text-3xl font-black text-[#1A1A1A] mb-2">{product.name}</h2>
                <p className="text-[#666666] text-sm mb-4">{product.description}</p>
                <p className="text-2xl font-black text-[#99041e]">From GBP {product.price.toFixed(2)}</p>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm font-bold text-[#1A1A1A]">Choose a size</label>
                  <span className="text-xs text-[#99041e] font-bold">Required</span>
                </div>
                <div className="flex gap-3">
                  {Object.keys(SIZE_PRICES).map(size => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`px-6 py-3 rounded-lg font-semibold text-sm border-2 transition-all ${
                        selectedSize === size
                          ? 'bg-[#99041e] text-white border-[#99041e]'
                          : 'bg-white text-[#1A1A1A] border-[#F0E5D8] hover:border-[#99041e]'
                      }`}
                    >
                      {size}
                      {SIZE_PRICES[size] > 0 && ` +GBP ${SIZE_PRICES[size].toFixed(2)}`}
                    </button>
                  ))}
                </div>
                {sizeError && <p className="text-xs text-[#99041e] mt-2">Please select a size</p>}
              </div>

              {/* Flavour / Heat */}
              <div>
                <label className="text-sm font-bold text-[#1A1A1A] block mb-3">Flavour / heat</label>
                <div className="flex gap-2 flex-wrap">
                  {['Lemon & Herb', 'Mild', 'Mango & Lime', 'Medium', 'Hot', 'Extra Hot', 'Extra Hot & Sweet', 'BBQ', 'Garlic & Herb'].map(spice => (
                    <button
                      key={spice}
                      onClick={() => setSelectedFlavour(spice)}
                      className={`px-4 py-2 rounded-full font-semibold text-sm border-2 transition-all ${
                        selectedFlavour === spice
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-[#1A1A1A] border-[#F0E5D8] hover:border-[#99041e]'
                      }`}
                    >
                      {spice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <label className="text-sm font-bold text-[#1A1A1A] block mb-3">
                  Add something extra <span className="text-xs text-[#999999] font-normal">Optional</span>
                </label>
                <div className="space-y-2">
                  {ADDON_OPTIONS.map(addon => (
                    <label key={addon.name} className="flex items-center gap-3 p-3 bg-[#F9F9F9] rounded-lg hover:bg-[#F5F5F5] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedAddOns[addon.name]?.selected || false}
                        onChange={() => handleAddOnChange(addon)}
                        className="w-4 h-4 rounded border-[#99041e] accent-[#99041e]"
                      />
                      <span className="text-sm font-semibold text-[#1A1A1A] flex-1">{addon.name}</span>
                      <span className="text-sm font-bold text-[#99041e]">+GBP {addon.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-sm font-bold text-[#1A1A1A] block mb-2">
                  Special instructions <span className="text-xs text-[#999999] font-normal">Optional</span>
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Allergies or preparation notes?"
                  className="w-full p-3 border border-[#F0E5D8] rounded-lg text-sm focus:outline-none focus:border-[#99041e] focus:ring-1 focus:ring-[#99041e] resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action Area */}
          <div className="border-t border-[#F0E5D8] bg-[#F9F9F9] p-6 sm:p-8 flex items-center justify-between gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-white border border-[#F0E5D8] rounded-lg p-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-[#F5F5F5] rounded transition-colors"
              >
                <Minus size={18} className="text-[#1A1A1A]" />
              </button>
              <span className="w-8 text-center font-bold text-[#1A1A1A]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-[#F5F5F5] rounded transition-colors"
              >
                <Plus size={18} className="text-[#1A1A1A]" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#ffc257] hover:bg-[#e5a93e] text-[#1A1A1A] px-6 py-3 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Add to cart - GBP {calculateTotalPrice().toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
