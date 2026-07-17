'use client';

import { useState } from 'react';
import BrandButton from '@/components/common/BrandButton';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="bg-[#f5f1e8] min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2a1818] mb-4">
            GET IN TOUCH
          </h1>
          <p className="text-[#6b5f55] text-base sm:text-lg max-w-2xl mx-auto">
            We&apos;d love to hear from you. Drop us a message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phone */}
            <div className="bg-white rounded-2xl p-7 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-[#c41e3a]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#c41e3a] to-[#8b1428] rounded-full flex items-center justify-center shadow-lg">
                  <Phone size={26} className="text-white" />
                </div>
                <h3 className="font-bold text-[#2a1818] text-lg">Phone</h3>
              </div>
              <p className="text-[#2a1818] font-semibold">+44 (0)131 123 4567</p>
              <p className="text-sm text-[#6b5f55] mt-2">Mon - Sun: 11:00 - 00:00</p>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-7 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-[#ffc61e]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#ffc61e] to-[#ffb800] rounded-full flex items-center justify-center shadow-lg">
                  <Mail size={26} className="text-[#2a1818]" />
                </div>
                <h3 className="font-bold text-[#2a1818] text-lg">Email</h3>
              </div>
              <p className="text-[#2a1818] font-semibold">info@maemespirpiri.com</p>
              <p className="text-sm text-[#6b5f55] mt-2">We typically reply within 24 hours</p>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-7 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-[#c41e3a]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#c41e3a] to-[#8b1428] rounded-full flex items-center justify-center shadow-lg">
                  <MapPin size={26} className="text-white" />
                </div>
                <h3 className="font-bold text-[#2a1818] text-lg">Address</h3>
              </div>
              <p className="text-[#2a1818] font-semibold">
                100-104 Lothian Road<br />
                Edinburgh, EH3 9BE<br />
                United Kingdom
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 space-y-6 border-2 border-[#e8e0d5]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block font-semibold text-[#2a1818] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[#e8e0d5] rounded-xl focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a] focus:ring-opacity-20 text-[#2a1818] transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-semibold text-[#2a1818] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[#e8e0d5] rounded-xl focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a] focus:ring-opacity-20 text-[#2a1818] transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block font-semibold text-[#2a1818] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e8e0d5] rounded-xl focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a] focus:ring-opacity-20 text-[#2a1818] transition-all"
                  placeholder="+44 (0)131 123 4567"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block font-semibold text-[#2a1818] mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e8e0d5] rounded-xl focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a] focus:ring-opacity-20 text-[#2a1818] transition-all"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-semibold text-[#2a1818] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e8e0d5] rounded-xl focus:outline-none focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a] focus:ring-opacity-20 text-[#2a1818] min-h-32 resize-none transition-all"
                  placeholder="Your message..."
                  required
                />
              </div>

              {isSubmitted && (
                <p role="status" className="rounded-xl border border-[#b9dfc7] bg-[#f0fbf4] px-4 py-3 text-sm font-semibold text-[#176b3a]">
                  Thanks for getting in touch. We&apos;ll get back to you soon.
                </p>
              )}

              <BrandButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                SEND MESSAGE
              </BrandButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
