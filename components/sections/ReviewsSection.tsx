import { Star } from 'lucide-react';
import { reviews } from '@/lib/data';

export default function ReviewsSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2a1818] mb-4">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <p className="text-[#6b5f55] text-lg">
            Loved by food enthusiasts across the UK
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#f5f1e8] rounded-lg p-6 border-l-4 border-[#c41e3a] hover:shadow-lg transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-[#ffc61e] text-[#ffc61e]"
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-[#2a1818] mb-4 italic">
                &quot;{review.comment}&quot;
              </p>

              {/* Author */}
              <p className="font-semibold text-[#c41e3a]">
                — {review.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
