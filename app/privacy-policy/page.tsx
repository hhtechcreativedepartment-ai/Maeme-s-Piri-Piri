const sections = [
  {
    title: 'Information we use in this prototype',
    body: 'This Maeme\'s ordering prototype stores your cart, selected branch, order type, mock login session, saved addresses, saved cards, favourites, promos and order history in your browser localStorage. This lets the demo behave like a real ordering website without sending personal data to a live backend.',
  },
  {
    title: 'Ordering and account data',
    body: 'When you place a mock order, the order number, branch, items, payment method and order status are saved locally so My Account, order history and tracking pages can show realistic information. Prototype card details are mock data only and should not be treated as real payment processing.',
  },
  {
    title: 'How production privacy would work',
    body: 'A production Maeme\'s platform would use secure backend services, encrypted payment provider tokenisation, consent controls, fraud prevention, order fulfilment integrations and clear customer support routes for data access or deletion requests.',
  },
  {
    title: 'Your choices',
    body: 'You can clear this prototype data at any time by clearing your browser storage for this site. Logging out removes the local mock user session but does not automatically delete every saved prototype record unless browser storage is cleared.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fff8ed] px-4 py-10 text-[#1a120f] sm:px-6 lg:px-8 lg:py-14">
      <article className="mx-auto max-w-4xl rounded-[28px] border border-[#f0d59d] bg-white p-6 shadow-[0_18px_50px_rgba(50,24,16,0.08)] sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#99041e]">Legal</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-base leading-7 text-[#6b5b55]">
          This page explains how the Maeme&apos;s Piri Piri ordering prototype handles information while demonstrating guest browsing, account login and checkout.
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
