import { MENU_CATEGORY_DATA, MENU_DATA } from '@/lib/menuData';
import PublicMenuCategoryNav from './PublicMenuCategoryNav';

const getEstimatedKcal = (productId: number, category: string) => {
  const categoryRanges: Record<string, [number, number]> = {
    Drinks: [5, 210],
    Dips: [80, 210],
    Milkshakes: [350, 620],
    'Ice Cream': [180, 520],
    'Dessert Collection': [280, 560],
    'Sides & Extras': [120, 520],
    'Kids Meal': [420, 720],
    'Grilled Collection': [320, 920],
    'Vegetarian Collection': [350, 820],
  };
  const [minimum, maximum] = categoryRanges[category] ?? [380, 980];
  const step = 5;
  const availableSteps = Math.floor((maximum - minimum) / step);
  const stableOffset = ((productId * 47) % (availableSteps + 1)) * step;

  return minimum + stableOffset;
};

export default function PublicMenuPage() {
  const categories = MENU_CATEGORY_DATA
    .map(category => ({
      ...category,
      products: MENU_DATA.filter(product => (
        category.id === 'offers' ? product.offer : product.category === category.title
      )),
    }))
    .filter(category => category.products.length > 0);

  return (
    <main className="min-h-screen bg-white text-[#3b211c]">
      <header className="border-b border-[#edddb9] bg-[#fffdf7] px-4 py-5 text-center sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-[#99041e]">
          Maeme&apos;s
        </p>
        <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-[#99041e] sm:text-3xl">
          Menu
        </h1>
      </header>

      <section
        aria-labelledby="menu-hero-title"
        className="relative isolate overflow-hidden bg-[#6d0216]"
      >
        <img
          src="/images/piri-piri-new-background-1.jpg"
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(83,0,14,0.98)_0%,rgba(153,4,30,0.86)_42%,rgba(93,0,16,0.25)_100%)]" />

        <div className="mx-auto grid min-h-[360px] max-w-[1440px] items-center gap-2 px-4 py-8 sm:min-h-[430px] sm:gap-4 sm:px-8 sm:py-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-0">
          <div className="relative z-10 max-w-xl py-5 text-center lg:text-left">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#ffc257]">
              Flame-grilled favourites
            </p>
            <h2
              id="menu-hero-title"
              className="mt-4 text-[clamp(2.45rem,12vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-white"
            >
              Fired up
              <span className="block text-[#ffc257]">with flavour</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm font-semibold leading-6 text-white/90 sm:text-base sm:leading-7 lg:mx-0">
              Discover the full Maeme&apos;s menu, from our signature grilled chicken
              to burgers, wraps, sides and sweet finishes.
            </p>
          </div>

          <div className="relative h-[210px] min-w-0 sm:h-[300px] lg:h-[430px]">
            <img
              src="/images/grilled-composition.png"
              alt="A selection of Maeme's flame-grilled food"
              className="absolute inset-x-1/2 bottom-[-12%] h-[125%] w-[150%] max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_24px_30px_rgba(35,0,7,0.4)] sm:w-[125%] lg:bottom-[-8%] lg:h-[118%] lg:w-[125%]"
            />
          </div>
        </div>
      </section>

      <PublicMenuCategoryNav categories={categories} />

      <div className="mx-auto max-w-[1380px] space-y-16 px-4 py-10 sm:space-y-20 sm:px-8 sm:py-12 lg:space-y-24 lg:px-12 lg:py-16">
        {categories.map(category => (
          <section key={category.id} id={category.anchor} className="scroll-mt-28">
            <div className="mb-7 flex min-w-0 items-center gap-3 sm:mb-8 sm:gap-4">
              <h2 className="min-w-0 text-lg font-black leading-tight tracking-tight text-[#99041e] sm:shrink-0 sm:text-2xl">
                {category.title}
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-[#e8d5ae]" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-10 xl:gap-y-16">
              {category.products.map(product => (
                <article
                  key={`${category.id}-${product.id}`}
                  className="group flex min-h-[152px] min-w-0 flex-row items-stretch gap-4 overflow-hidden rounded-[18px] border border-[#f0e0ca] bg-white p-4 shadow-[0_6px_20px_rgba(50,24,16,0.05)] sm:min-h-0 sm:flex-col sm:gap-0 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none"
                >
                  <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center self-center overflow-hidden rounded-[14px] bg-white sm:h-60 sm:w-full sm:self-auto sm:overflow-visible sm:rounded-none lg:h-64">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-1 transition-transform duration-300 group-hover:scale-[1.04] sm:scale-[1.06] sm:p-0 sm:group-hover:scale-[1.1]"
                    />
                  </div>

                  <div className="flex min-h-[120px] min-w-0 flex-1 flex-col py-0 sm:mt-5 sm:min-h-0">
                    <h3 className="line-clamp-2 text-[15px] font-black leading-[1.18] text-[#99041e] sm:text-base sm:leading-tight">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="mt-1.5 line-clamp-3 text-xs font-semibold leading-[1.45] text-[#6b514a] sm:mt-2 sm:leading-5">
                        {product.description}
                      </p>
                    )}
                    <p className="mt-auto border-t border-[#f0d59d]/70 pt-2 text-left text-[10px] font-black uppercase tracking-[0.1em] text-[#99041e] sm:border-0 sm:pt-3">
                      {typeof product.kcal === 'number'
                        ? `${product.kcal} kcal`
                        : `${getEstimatedKcal(product.id, product.category)} kcal`}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
