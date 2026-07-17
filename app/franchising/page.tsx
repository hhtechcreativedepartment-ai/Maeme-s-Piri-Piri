'use client';

import { useState } from 'react';
import BrandButton from '@/components/common/BrandButton';
import AccordionComponent from '@/components/common/Accordion';
import { faqs } from '@/lib/data';
import { TrendingUp, Users, Zap, Award } from 'lucide-react';

export default function FranchisingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    message: '',
  });

  const whyFranchise = [
    { icon: TrendingUp, title: 'Proven System', desc: 'Established brand with proven business model and growth trajectory' },
    { icon: Users, title: 'Full Support', desc: 'Comprehensive training and ongoing operational support' },
    { icon: Zap, title: 'Quick Setup', desc: 'Fast track to opening with turnkey solutions' },
    { icon: Award, title: 'Premium Brand', desc: 'Partner with a rapidly growing premium QSR brand' },
  ];

  const accordionItems = faqs.map((faq) => ({
    id: `faq-${faq.id}`,
    question: faq.question,
    answer: faq.answer,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', location: '', experience: '', message: '' });
  };

  return (
    <div className="bg-[#f5f1e8] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c41e3a] to-[#8b1428] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            FRANCHISING WITH MAEME&apos;S
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Join one of the fastest growing piri piri franchises. We believe in our brand and want every customer to enjoy our food. It is our aim to develop our business by creating win-win relationships in a friendly, productive and supportive environment.
          </p>
        </div>
      </section>

      {/* Why Franchise Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#2a1818] mb-12">
            WHY FRANCHISE WITH MAEME&apos;S?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyFranchise.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white rounded-lg p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-[#c41e3a] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="font-bold text-[#2a1818] mb-3 text-lg">
                    {item.title}
                  </h3>
                  <p className="text-[#6b5f55]">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#2a1818] mb-12">
            THE FRANCHISING JOURNEY
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Inquiry', desc: 'Get in touch and learn about opportunities' },
              { step: '2', title: 'Discussion', desc: 'Meet our team and discuss your potential' },
              { step: '3', title: 'Development', desc: 'Site selection and business planning' },
              { step: '4', title: 'Launch', desc: 'Grand opening and ongoing support' },
            ].map((item, idx) => (
              <div key={idx} className="text-center relative">
                <div className="w-20 h-20 bg-[#c41e3a] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold text-[#2a1818] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#6b5f55] text-sm">
                  {item.desc}
                </p>
                {idx < 3 && (
                  <div className="absolute top-10 -right-4 md:right-auto md:top-24 md:left-full md:-translate-y-1/2 w-8 h-1 bg-[#ffc61e] hidden md:block"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#2a1818] mb-12">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <AccordionComponent items={accordionItems} />
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#2a1818] mb-4">
            FRANCHISE ENQUIRY
          </h2>
          <p className="text-center text-[#6b5f55] mb-12">
            Submit your details and one of our franchise team will get in touch with you shortly
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-4 py-3 border-2 border-[#e8e0d5] rounded-lg focus:outline-none focus:border-[#c41e3a] text-[#2a1818]"
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
                  className="w-full px-4 py-3 border-2 border-[#e8e0d5] rounded-lg focus:outline-none focus:border-[#c41e3a] text-[#2a1818]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block font-semibold text-[#2a1818] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e8e0d5] rounded-lg focus:outline-none focus:border-[#c41e3a] text-[#2a1818]"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block font-semibold text-[#2a1818] mb-2">
                  Interested Location/Region *
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e8e0d5] rounded-lg focus:outline-none focus:border-[#c41e3a] text-[#2a1818]"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="experience" className="block font-semibold text-[#2a1818] mb-2">
                Relevant Experience
              </label>
              <select
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#e8e0d5] rounded-lg focus:outline-none focus:border-[#c41e3a] text-[#2a1818]"
              >
                <option value="">Select...</option>
                <option value="catering">Catering Industry</option>
                <option value="retail">Retail</option>
                <option value="qsr">QSR Experience</option>
                <option value="business">General Business</option>
                <option value="none">No Industry Experience</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block font-semibold text-[#2a1818] mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#e8e0d5] rounded-lg focus:outline-none focus:border-[#c41e3a] text-[#2a1818] min-h-32 resize-none"
                placeholder="Tell us about your franchising goals..."
              />
            </div>

            {isSubmitted && (
              <p role="status" className="rounded-xl border border-[#b9dfc7] bg-[#f0fbf4] px-4 py-3 text-sm font-semibold text-[#176b3a]">
                Thanks for your enquiry. Our franchise team will be in touch soon.
              </p>
            )}

            <BrandButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setIsSubmitted(false)}
            >
              SEND ENQUIRY
            </BrandButton>
          </form>
        </div>
      </section>
    </div>
  );
}
