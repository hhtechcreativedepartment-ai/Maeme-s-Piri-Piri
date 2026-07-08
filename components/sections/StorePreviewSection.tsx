import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import BrandButton from '@/components/common/BrandButton';
import { stores } from '@/lib/data';

export default function StorePreviewSection() {
  const featuredStores = stores.slice(0, 3);

  return (
    <section className="py-16 px-4 bg-[#f5f1e8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2a1818] mb-4">
            FIND A MAEME&apos;S NEAR YOU
          </h2>
          <p className="text-[#6b5f55] text-lg">
            Now open at multiple locations across the UK
          </p>
        </div>

        {/* Store Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featuredStores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Store Image Placeholder */}
              <div className="w-full h-40 bg-gradient-to-br from-[#c41e3a] to-[#8b1428] flex items-center justify-center">
                <MapPin size={40} className="text-white" />
              </div>

              {/* Store Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2a1818] mb-3">
                  {store.name}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-sm text-[#2a1818]">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#c41e3a]" />
                    <p>{store.address}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#2a1818]">
                    <Clock size={16} className="text-[#c41e3a]" />
                    <p>{store.hours}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  store.open
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  {store.open ? 'OPEN NOW' : 'COMING SOON'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Stores CTA */}
        <div className="text-center">
          <Link href="/stores">
            <BrandButton variant="primary" size="lg">
              VIEW ALL STORES
            </BrandButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
