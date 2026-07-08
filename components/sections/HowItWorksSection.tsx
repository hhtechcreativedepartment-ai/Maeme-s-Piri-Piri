export default function HowItWorksSection() {
  const steps = [
    { step: 1, title: 'Choose Your Flavour', description: 'Select from 6 delicious piri flavours' },
    { step: 2, title: 'Pick Your Protein', description: 'Fresh chicken, wings, or try our burger' },
    { step: 3, title: 'Add Sides', description: 'Pair with our spicy fries and sauces' },
    { step: 4, title: 'Enjoy!', description: 'Flamingly good food at its best' },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-[#2a1818] mb-12">
          HOW TO ENJOY MAEME&apos;S
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              {/* Step Circle */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#c41e3a] flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-white">{item.step}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-[#2a1818] mb-3">
                {item.title}
              </h3>
              <p className="text-[#6b5f55] text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Divider Line */}
        <div className="flex items-center justify-center mt-12 gap-2">
          <div className="h-1 w-8 bg-[#c41e3a]"></div>
          <div className="h-1 w-8 bg-[#ffc61e]"></div>
          <div className="h-1 w-8 bg-[#c41e3a]"></div>
        </div>
      </div>
    </section>
  );
}
