import FlavourStrip from '@/components/sections/FlavourStrip';

export default function FoodPage() {
  return (
    <div className="bg-[#f5f1e8] min-h-screen">
      {/* Header */}
      <section className="bg-[#ffc61e] py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#2a1818] mb-6">
            OUR FOOD & FLAVOUR
          </h1>
          <p className="text-lg text-[#2a1818] max-w-3xl mx-auto">
            Enjoy fresh, flamingly good food with a choice of 6 delicious flavours. Our flame-grilled piri piri chicken is infused with the taste and flavours specially created for Maeme&apos;s.
          </p>
        </div>
      </section>

      {/* Flavour Strip Section */}
      <FlavourStrip />

      {/* Main Content Sections */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* PIRI PIRI Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-lg p-8">
            <div>
              <h2 className="text-4xl font-bold text-[#c41e3a] mb-4">
                PIRI PIRI
              </h2>
              <p className="text-[#ffc61e] font-bold italic mb-4">
                Flamingly Good
              </p>
              <p className="text-[#2a1818] mb-6 leading-relaxed">
                Our flame-grilled piri piri chicken is marinated for 24 hours in our secret blend of piri piri spices. Each piece is carefully prepared to deliver authentic, mouth-watering flavour. Choose your heat level from Mango Lime to Extreme and experience the difference quality makes.
              </p>
              <p className="text-[#6b5f55]">
                Available in 6 delicious flavour options to suit every palate.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                <img
                  src="https://via.placeholder.com/400x300?text=Piri+Piri+Chicken"
                  alt="Piri Piri Chicken"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* Iconic Dishes */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-lg p-8">
            <div className="flex items-center justify-center lg:order-2">
              <div className="w-full max-w-sm h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                <img
                  src="https://via.placeholder.com/400x300?text=Iconic+Dishes"
                  alt="Iconic Dishes"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="lg:order-1">
              <h2 className="text-4xl font-bold text-[#2a1818] mb-4">
                ICONIC DISHES
              </h2>
              <p className="text-[#2a1818] mb-6 leading-relaxed">
                Beyond our signature piri piri, we offer a selection of iconic dishes crafted with the same attention to quality and flavour. From flame-grilled burgers to succulent wings, every item on our menu is prepared with premium ingredients and our signature spice blends.
              </p>
              <p className="text-[#6b5f55]">
                Hand-prepared to perfection, every dish is a testament to our commitment to excellence.
              </p>
            </div>
          </section>

          {/* Quality Section */}
          <section className="bg-white rounded-lg p-8 text-center">
            <h2 className="text-4xl font-bold text-[#2a1818] mb-6">
              QUALITY & STANDARDS
            </h2>
            <p className="text-[#2a1818] max-w-3xl mx-auto mb-8 leading-relaxed">
              Our processes ensure our international guidelines are strictly adhered to. We source only the finest ingredients from trusted suppliers and maintain the highest standards of quality, hygiene, and food safety in everything we prepare. Every customer deserves the very best.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-[#f5f1e8] rounded-lg">
                <div className="text-3xl font-bold text-[#c41e3a] mb-2">✓</div>
                <h3 className="font-bold text-[#2a1818] mb-2">Premium Ingredients</h3>
                <p className="text-sm text-[#6b5f55]">Only the finest, freshest ingredients</p>
              </div>
              <div className="p-6 bg-[#f5f1e8] rounded-lg">
                <div className="text-3xl font-bold text-[#c41e3a] mb-2">✓</div>
                <h3 className="font-bold text-[#2a1818] mb-2">Strict Standards</h3>
                <p className="text-sm text-[#6b5f55]">International quality and safety standards</p>
              </div>
              <div className="p-6 bg-[#f5f1e8] rounded-lg">
                <div className="text-3xl font-bold text-[#c41e3a] mb-2">✓</div>
                <h3 className="font-bold text-[#2a1818] mb-2">Expert Preparation</h3>
                <p className="text-sm text-[#6b5f55]">Crafted by skilled food professionals</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-[#c41e3a] text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            READY TO EXPERIENCE MAEME&apos;S?
          </h2>
          <p className="text-lg mb-8">
            Order now and discover why we&apos;re one of the fastest-growing piri piri brands.
          </p>
          <a href="/menu">
            <button className="bg-[#ffc61e] text-[#2a1818] px-8 py-3 rounded-full font-bold text-lg hover:bg-[#ffb800] transition-colors">
              VIEW MENU
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
