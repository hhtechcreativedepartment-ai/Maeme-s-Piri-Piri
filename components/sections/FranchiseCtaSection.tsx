import Link from 'next/link';
import BrandButton from '@/components/common/BrandButton';

export default function FranchiseCtaSection() {
  return (
    <section className="py-16 px-4 bg-[#c41e3a] text-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          JOIN ONE OF THE FASTEST GROWING PIRI PIRI FRANCHISES
        </h2>
        <p className="text-lg mb-8 text-white/90">
          Maeme's is an exciting brand that offers great growth potential. We believe in our brand and want every customer to enjoy our food. It is our aim to develop our business by creating win-win relationships in a friendly, productive and supportive environment.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/franchising">
            <BrandButton variant="gold" size="lg">
              LEARN MORE ABOUT FRANCHISING
            </BrandButton>
          </Link>
          <Link href="/contact">
            <BrandButton variant="secondary" size="lg">
              GET IN TOUCH
            </BrandButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
