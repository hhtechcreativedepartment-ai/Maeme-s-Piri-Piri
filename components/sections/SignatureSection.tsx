import BrandButton from '@/components/common/BrandButton';

export default function SignatureSection() {
  const dishes = [
    {
      id: 1,
      name: 'PIRI PIRI',
      label: 'Flamingly Good',
      description: 'Our flame-grilled piri piri chicken is marinated for 24 hours and infused with the taste and flavours which are specially created for Maeme\'s.',
      image: 'https://via.placeholder.com/300x300?text=Piri+Piri'
    },
    {
      id: 2,
      name: 'ICONIC DISHES',
      description: 'Choose from our most premium items, hand-prepared with premium meat flavoured with our spice mixes.',
      image: 'https://via.placeholder.com/300x300?text=Iconic+Dishes'
    },
    {
      id: 3,
      name: 'DIPS',
      description: 'Freshly prepared paring original secret recipes in some spicy, giving our premium dishes.',
      image: 'https://via.placeholder.com/300x300?text=Dips'
    },
  ];

  return (
    <section className="py-16 px-4 bg-[#ffc61e]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dishes.map((dish) => (
            <div key={dish.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
              {/* Image */}
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#c41e3a] mb-2">
                  {dish.name}
                </h3>
                {dish.label && (
                  <p className="text-[#ffc61e] font-bold italic mb-3">
                    {dish.label}
                  </p>
                )}
                <p className="text-[#2a1818] text-sm mb-6">
                  {dish.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <BrandButton variant="primary" size="lg">
            EXPLORE MENU
          </BrandButton>
        </div>
      </div>
    </section>
  );
}
