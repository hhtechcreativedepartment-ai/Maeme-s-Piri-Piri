import { FLAVOURS } from '@/lib/constants';

export default function FlavourSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2a1818] mb-4">
            WHAT&apos;S YOUR FLAVOUR?
          </h2>
          <p className="text-[#6b5f55] text-lg">
            Pick from 6 tasty choices
          </p>
        </div>

        {/* Flavour Bottles/Display */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {FLAVOURS.map((flavour) => (
            <div key={flavour.id} className="flex flex-col items-center">
              <div
                className="w-16 h-20 rounded-full shadow-lg mb-3 border-4 border-[#2a1818] flex items-center justify-center"
                style={{ backgroundColor: flavour.color }}
              >
                <span className="text-white font-bold text-xs text-center px-2">
                  {flavour.id}
                </span>
              </div>
              <p className="text-[#2a1818] font-semibold text-sm text-center w-20">
                {flavour.name}
              </p>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-[#f5f1e8] border-4 border-[#c41e3a] rounded-lg p-6 text-center">
          <p className="text-[#2a1818] font-semibold">
            From cooling Mango Lime to the fierce Extreme heat – pick your piri strength!
          </p>
        </div>
      </div>
    </section>
  );
}
