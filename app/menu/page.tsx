'use client';

import CompleteMenuPage from '@/components/menu/CompleteMenuPage';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CartDrawer from '@/components/CartDrawer';
import ProductCustomizationModal from '@/components/modals/ProductCustomizationModal';
import OrderTypeModal from '@/components/ordering/OrderTypeModal';
import { MENU_DATA, MENU_CATEGORIES, MenuItem } from '@/lib/menuData';
import { useCart } from '@/lib/cartContext';

function MenuPageContent() {
  const [selectedCategory, setSelectedCategory] = useState('Grilled Collection');
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; productName: string } | null>(null);
  const { selectedBranch, selectedOrderType } = useCart();

  const filteredProducts = MENU_DATA.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: typeof MENU_DATA[0]) => {
    if (!selectedBranch || !selectedOrderType) {
      setShowOrderModal(true);
      return;
    }
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
    // Show success toast when item is added
    if (selectedProduct) {
      setToast({ message: 'Added to cart', productName: selectedProduct.name });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <>
      <div className="bg-[#FAF8F5] min-h-screen">
        {/* Hero Banner - Premium & Balanced */}
        <section className="bg-[#99041e] px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-black text-white mb-3 tracking-tight">
              MENU
            </h1>
            <p className="text-base sm:text-lg text-[#FFF5E1] font-medium">
              Freshly grilled, full of flavour, made your way.
            </p>
          </div>
        </section>

        {/* Category Tabs - Sticky & Premium */}
        <div className="sticky top-24 bg-white/95 backdrop-blur-sm border-b border-[#ffc257] z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-4 scroll-smooth">
              {MENU_CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 rounded-full whitespace-nowrap font-semibold text-sm transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-[#ffc257] text-[#1A1A1A] border-2 border-[#99041e]'
                      : 'bg-[#FAF8F5] text-[#1A1A1A] border-2 border-[#99041e] hover:bg-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Premium Restaurant Menu Grid */}
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 max-w-full">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#F0E5D8] group"
              >
                {/* Product Image */}
                <div className="w-full h-56 bg-[#E8E0D5] flex items-center justify-center overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-[#99041e] leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#555555] leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-[#F0E5D8]">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-[#999999] font-medium">
                        {product.kcal} kcal
                      </span>
                      <span className="text-xl font-black text-[#99041e]">
                        GBP {product.price.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-[#99041e] hover:bg-[#7f0318] text-white p-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <Plus size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-8 left-4 right-4 sm:left-auto sm:right-8 sm:bottom-8 sm:w-80 bg-[#99041e] text-white p-4 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
            <p className="font-semibold text-sm">{toast.message}</p>
            <p className="text-xs text-white/90 mt-1">{toast.productName}</p>
          </div>
        )}
      </div>

      {/* Product Customization Modal */}
      <ProductCustomizationModal
        isOpen={showModal}
        product={selectedProduct}
        onClose={handleModalClose}
      />
      <OrderTypeModal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}

export default function MenuPage() {
  return <CompleteMenuPage />;

  return <MenuPageContent />;
}

