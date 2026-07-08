import BrandButton from '@/components/common/BrandButton';

export default function AppPromoSection() {
  const benefits = [
    '10% off your first order',
    'Earn 25% off after 6 orders',
    'Chance to win prizes with every order',
    'Quick & easy ordering',
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-[#c41e3a] to-[#8b1428] text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <div>
          <h2 className="text-4xl font-bold mb-6">
            GET THE MAEME&apos;S APP TO
          </h2>
          <h3 className="text-5xl font-black mb-8" style={{ color: '#ffc61e' }}>
            SAVE MONEY. WIN PRIZES.
            <br />
            EARN REWARDS.
          </h3>

          {/* Benefits List */}
          <ul className="space-y-4 mb-8">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ffc61e] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#c41e3a] font-bold text-sm">✓</span>
                </div>
                <span className="text-lg">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#" className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 13.5l-5-5V2h-2v6.5L5 13.5H2l10 10 10-10h-3z" />
              </svg>
              App Store
            </a>
            <a href="#" className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V7h-8v14zm0-16v2h8V5h-8z" />
              </svg>
              Google Play
            </a>
          </div>
        </div>

        {/* Right Side - Image Placeholder */}
        <div className="flex justify-center">
          <div className="w-full max-w-xs h-[500px] bg-white rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
            <img 
              src="https://via.placeholder.com/300x500?text=App+Screenshot" 
              alt="Maeme's app"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
