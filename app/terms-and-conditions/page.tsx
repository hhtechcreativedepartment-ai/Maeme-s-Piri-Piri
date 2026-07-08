const sections = [
  {
    title: 'Using the ordering website',
    body: 'Customers can browse the Maeme\'s website, view menus, choose a branch and add items to the cart as guests. Login is only required when confirming an order at checkout so order history and tracking can be attached to an account.',
  },
  {
    title: 'Menu, prices and availability',
    body: 'Menu items, prices, branch opening status, delivery times and collection times in this prototype are realistic sample content. A live Maeme\'s service would confirm availability, pricing and fulfilment times from production systems before accepting an order.',
  },
  {
    title: 'Payments and vouchers',
    body: 'Cash, card and wallet options shown here are mock checkout choices. No real payment is taken by this prototype. Voucher codes demonstrate discount behaviour and would need validation against a real promotions service in production.',
  },
  {
    title: 'Orders and cancellations',
    body: 'The prototype allows order tracking and cancellation before the preparing stage to demonstrate the expected customer experience. In production, cancellation eligibility may depend on kitchen status, delivery partner status and branch policy.',
  },
  {
    title: 'Allergens and food information',
    body: 'Customers should contact the branch directly for ingredient, allergen or dietary information before ordering. Production ordering should include verified allergen content and preparation guidance from Maeme\'s operations team.',
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fff8ed] px-4 py-10 text-[#1a120f] sm:px-6 lg:px-8 lg:py-14">
      <article className="mx-auto max-w-4xl rounded-[28px] border border-[#f0d59d] bg-white p-6 shadow-[0_18px_50px_rgba(50,24,16,0.08)] sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#99041e]">Legal</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Terms & Conditions</h1>
        <p className="mt-4 text-base leading-7 text-[#6b5b55]">
          These terms describe how this Maeme&apos;s Piri Piri prototype ordering experience should be understood while it is being reviewed and developed.
        </p>
        <div className="mt-9 space-y-7">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl bg-[#fff8ed] p-5">
              <h2 className="text-2xl font-black">{section.title}</h2>
              <p className="mt-3 leading-7 text-[#6b5b55]">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
