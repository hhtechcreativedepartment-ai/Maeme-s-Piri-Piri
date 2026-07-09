export default function FlavourStrip() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Grid layout with text on left and chilli image on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <div className="space-y-4">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#99041e] leading-tight tracking-tight">
              Choose Your Heat. Build Your Meal.
            </h2>
            <p className="text-lg sm:text-xl text-[#4A4A4A] font-normal">
              Pick from 9 signature flavours and get ready to order your favourite.
            </p>
          </div>
          
          {/* Right side - Heat scale chilli image */}
          <div className="flex justify-center lg:justify-end">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-W9f3WN4qym2Z8XwvzCzHa3ld6aM79y.png" 
              alt="Heat scale chilli pepper with 9 flavour levels" 
              className="w-full max-w-sm h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
