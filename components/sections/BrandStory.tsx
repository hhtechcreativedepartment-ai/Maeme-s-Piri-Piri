import Link from 'next/link';

export default function BrandStory() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto">
        {/* Top Section - Button and Description */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4 mb-8 sm:mb-10 lg:mb-12">
          {/* ORDER NOW Button */}
          <Link href="/menu">
            <button className="px-9 sm:px-12 py-3 sm:py-3 bg-[#99041e] text-[#ffc257] font-black text-base sm:text-lg rounded-full hover:bg-[#8f1318] transition-colors duration-300 shadow-md hover:shadow-lg">
              ORDER NOW
            </button>
          </Link>

          {/* Brand Description */}
          <p className="text-sm sm:text-base text-[#1A1A1A] font-semibold leading-relaxed text-center max-w-2xl">
            We love chicken. We love it so much that we want all our customers to experience fresh grilled piri piri chicken which is freshly prepared to eat in or for you to take home. Our menu is freshly cooked and infuses the taste and flavours which are specially created for Maeme&apos;s.
          </p>
        </div>

        {/* Main Flavours Section - Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch lg:items-center">
          {/* Left Side - Title */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-6 justify-center">
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#99041e] tracking-tight leading-tight">
                Choose Your Heat.<br />Build Your Meal.
              </h2>
              <p className="text-base sm:text-lg text-[#666666] font-normal leading-relaxed">
                Pick from 9 signature flavours and get ready to order your favourite.
              </p>
            </div>
          </div>

          {/* Right Side - Video Container */}
          <div className="w-full lg:w-3/5 flex justify-center lg:justify-end">
            <div className="w-full max-w-3xl lg:max-w-6xl aspect-video rounded-2xl overflow-hidden bg-white">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              >
                <source src="/videos/flavour-new-animation.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
