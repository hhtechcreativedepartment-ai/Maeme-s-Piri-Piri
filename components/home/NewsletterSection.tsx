'use client';

import { FormEvent, useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1320px] items-center gap-5 rounded-[20px] bg-[var(--maeme-red)] px-5 py-5 text-white shadow-[0_18px_46px_rgba(var(--maeme-red-rgb),0.18)] md:grid-cols-[1fr_minmax(360px,0.92fr)] lg:px-8">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Get Exclusive Deals &amp; Updates</h2>
          <p className="mt-1 text-sm font-medium text-white/80">Join our newsletter and never miss an offer!</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-0">
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setIsSubmitted(false);
            }}
            placeholder="Enter your email address"
            aria-label="Email address"
            className="min-h-12 flex-1 rounded-xl border-0 bg-white px-4 text-sm font-semibold text-[#1f1210] outline-none placeholder:text-[#8c7a74] sm:rounded-r-none"
            required
          />
          <button type="submit" className="min-h-12 rounded-xl bg-[var(--maeme-yellow)] px-7 text-sm font-black text-[#1f1210] transition hover:bg-[var(--maeme-yellow-dark)] sm:rounded-l-none">
            {isSubmitted ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
}
