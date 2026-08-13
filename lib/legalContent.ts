export const privacyPolicyContent = {
  title: 'Privacy Policy',
  introduction: "This page explains how the Maeme's Piri Piri ordering prototype handles information while demonstrating guest browsing, account login and checkout.",
  sections: [
    {
      title: 'Information we use in this prototype',
      body: "This Maeme's ordering prototype stores your cart, selected branch, order type, mock login session, saved addresses, saved cards, favourites, promos and order history in your browser localStorage. This lets the demo behave like a real ordering website without sending personal data to a live backend.",
    },
    {
      title: 'Ordering and account data',
      body: 'When you place a mock order, the order number, branch, items, payment method and order status are saved locally so My Account, order history and tracking pages can show realistic information. Prototype card details are mock data only and should not be treated as real payment processing.',
    },
    {
      title: 'How production privacy would work',
      body: "A production Maeme's platform would use secure backend services, encrypted payment provider tokenisation, consent controls, fraud prevention, order fulfilment integrations and clear customer support routes for data access or deletion requests.",
    },
    {
      title: 'Your choices',
      body: 'You can clear this prototype data at any time by clearing your browser storage for this site. Logging out removes the local mock user session but does not automatically delete every saved prototype record unless browser storage is cleared.',
    },
  ],
};

export const termsContent = {
  title: 'Terms & Conditions',
  introduction: "These terms describe how this Maeme's Piri Piri prototype ordering experience should be understood while it is being reviewed and developed.",
  sections: [
    {
      title: 'Using the ordering website',
      body: "Customers can browse the Maeme's website, view menus, choose a branch and add items to the cart as guests. Login is only required when confirming an order at checkout so order history and tracking can be attached to an account.",
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
      body: "Customers should contact the branch directly for ingredient, allergen or dietary information before ordering. Production ordering should include verified allergen content and preparation guidance from Maeme's operations team.",
    },
  ],
};
