# Maeme's Project Instructions

## Workflow

- Analyse the complete existing project before changing code.
- Do not install packages before completing the analysis.
- Reuse existing APIs, services, hooks, components and types.
- Do not duplicate existing authentication, cart, checkout, payment or order logic.
- Work only on the feature/ai-ordering-assistant branch.
- Run tests and production build after implementation.

## Existing Website Protection

- Do not redesign unrelated pages or sections.
- Do not modify the header, footer or newsletter.
- Do not change product names, prices, images or categories.
- Do not hardcode branch, menu, product, option or pricing data.
- Always use “Collection”, not “Pickup”.
- Preserve existing functionality and responsive behaviour.

## Maeme's Design System

- Red: #99041E
- Yellow: #FFC257
- White backgrounds
- Do not use black as the primary design colour.
- Keep the interface premium, professional, minimal and accessible.

## Ordering Rules

- Guest users can browse, customise products and build a cart.
- Login or OTP is required before final order placement.
- Preserve the complete cart and conversation during login.
- Follow existing branch, postcode, delivery and collection rules.
- Prices and totals must be calculated and validated by the backend.
- AI must never invent products, prices, options or branch statuses.
- Require explicit confirmation before payment and order placement.

## Security

- Never expose API keys or environment variables.
- Do not place private API keys in client-side code.
- Never send full card information to the AI.
- Validate every AI-generated action on the server.
- Prevent duplicate payments and duplicate orders.