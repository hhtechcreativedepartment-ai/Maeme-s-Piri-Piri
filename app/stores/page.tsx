'use client';

import { useState } from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import BrandButton from '@/components/common/BrandButton';
import { stores } from '@/lib/data';

export default function StoresPage() {
  const [selectedStore, setSelectedStore] = useState(stores[0]);

  return (
    <div className="bg-[#f5f1e8] min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#2a1818] mb-4">
            FIND A MAEME&apos;S
          </h1>
          <p className="text-[#6b5f55] text-lg">
            Visit us at one of our locations across the UK
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stores List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#2a1818] mb-4">
                Our Locations
              </h2>

              <div className="space-y-3">
                {stores.map(store => (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                      selectedStore.id === store.id
                        ? 'border-[#c41e3a] bg-[#f5f1e8]'
                        : 'border-transparent hover:border-[#c41e3a]'
                    }`}
                  >
                    <p className="font-bold text-[#2a1818]">
                      {store.name}
                    </p>
                    <p className="text-sm text-[#6b5f55] mt-1">
                      {store.address}
                    </p>
                    {store.open ? (
                      <span className="inline-block mt-2 text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded">
                        OPEN NOW
                      </span>
                    ) : (
                      <span className="inline-block mt-2 text-xs font-bold bg-gray-200 text-gray-800 px-2 py-1 rounded">
                        COMING SOON
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Store Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Map Placeholder */}
              <div className="w-full h-64 lg:h-96 bg-gray-200 flex items-center justify-center text-[#6b5f55]">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto mb-4 text-[#c41e3a]" />
                  <p>Map View Coming Soon</p>
                </div>
              </div>

              {/* Store Info */}
              <div className="p-8">
                <h2 className="text-4xl font-bold text-[#2a1818] mb-6">
                  {selectedStore.name}
                </h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex gap-4">
                    <MapPin size={24} className="text-[#c41e3a] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-[#2a1818] mb-1">
                        Address
                      </p>
                      <p className="text-[#6b5f55]">
                        {selectedStore.address}
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4">
                    <Clock size={24} className="text-[#c41e3a] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-[#2a1818] mb-1">
                        Opening Hours
                      </p>
                      <p className="text-[#6b5f55]">
                        {selectedStore.hours}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <Phone size={24} className="text-[#c41e3a] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-[#2a1818] mb-1">
                        Phone
                      </p>
                      <p className="text-[#6b5f55]">
                        +44 (0)131 123 4567
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="pt-4 border-t border-[#e8e0d5]">
                    {selectedStore.open ? (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <p className="font-semibold text-green-700">
                          Open Now
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <p className="font-semibold text-gray-600">
                          Coming Soon
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  {selectedStore.open && (
                    <BrandButton variant="primary" size="lg" className="w-full">
                      ORDER NOW
                    </BrandButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
