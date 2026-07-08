import Link from 'next/link';

export default function MainCTA() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* CTA Button */}
        <Link href="/menu">
          <button className="inline-block bg-[#99041e] text-white px-12 py-4 font-black text-lg rounded-full hover:bg-[#7f0318] transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl">
            ORDER NOW
          </button>
        </Link>

        {/* Brand Statement */}
        <p className="text-lg sm:text-xl text-[#1A1A1A] font-semibold leading-relaxed max-w-2xl mx-auto">
          We love chicken. We love it so much that we want all our customers to experience fresh grilled piri piri chicken which is freshly prepared to eat in or for you to take home. Our menu is freshly cooked and infuses the taste and flavours which are specially created for Maeme&apos;s.
        </p>
      </div>
    </section>
  );
}
