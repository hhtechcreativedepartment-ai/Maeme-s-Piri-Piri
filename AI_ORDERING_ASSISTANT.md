# Build a Complete AI Voice and Chat Ordering Assistant for the Existing Maeme’s Website

You are working inside the existing Maeme’s website codebase.

Create a production-ready feature called:

# Maeme’s AI Ordering Assistant

The assistant must allow customers to discover products, receive recommendations, customise meals, build a cart and place an order through:

1. Text chat
2. Voice commands
3. Normal interactive buttons and selection cards

Do not create this feature as a disconnected demo.

It must use the website’s existing:

* Menu and product data
* Product customisation rules
* Categories
* Prices
* Discounts and offers
* Cart
* Checkout
* Postcode selection
* Branch selection
* Delivery zones
* Delivery and Collection availability
* Opening hours
* Authentication and OTP system
* Saved addresses
* Favourites
* Order history
* Saved payment methods
* Payment gateway
* Order creation APIs
* Order tracking
* Existing database and backend services

---

# Mandatory Step 1: Analyse the Complete Website First

Before implementing the assistant, inspect and understand the complete existing Maeme’s website.

Analyse at least the following areas:

* Application architecture
* Framework and dependencies
* Current authentication flow
* OTP verification flow
* Guest browsing flow
* Current postcode selector
* Branch selection logic
* Branch opening-status logic
* Delivery and Collection availability rules
* Delivery-radius or delivery-zone validation
* Menu categories
* Product data structure
* Product modifiers and option groups
* Required and optional customisations
* Cart structure
* Price calculation
* Discount calculation
* Checkout steps
* Saved-address system
* Saved-card system
* Payment gateway
* Order creation APIs
* Order tracking
* Favourites
* Previous orders
* Responsive design
* Existing website animations
* Error handling
* API security
* Database relationships

Search the existing codebase for the actual implementation of each feature.

Do not guess endpoint names, database fields, route names, product IDs, branch IDs or payment logic.

Reuse the existing services, hooks, utilities, APIs, components and types wherever possible.

---

# Mandatory Backup

Before making any changes:

1. Create a complete Git backup or commit.
2. Use a descriptive commit name such as:

`backup-before-ai-ordering-assistant`

3. Do not modify or delete the backup.
4. Ensure the complete previous website can be restored exactly.

When I later say “Undo AI Assistant”, restore the website directly from this backup.

Do not recreate the previous state from memory.

---

# Implementation Approach

After analysing the codebase:

1. Create a concise internal implementation plan.
2. Identify all existing APIs and reusable services.
3. Implement the assistant without waiting for additional approval.
4. Preserve all existing functionality.
5. Do not redesign unrelated website sections.
6. Do not break the existing cart or checkout flow.
7. Do not duplicate business logic already available in the backend.
8. Keep price and availability calculations on the server.

---

# Assistant UI Design

Create a premium, professional and minimal AI assistant interface that matches the existing Maeme’s website.

Use the existing Maeme’s design system.

Brand colours:

* Maeme’s Red: `#99041E`
* Maeme’s Yellow: `#FFC257`
* White backgrounds
* Do not introduce black as a primary interface colour

The assistant interface should include:

* Floating assistant launcher
* Chat panel on desktop
* Full-width bottom sheet or full-screen experience on mobile
* Text input
* Send button
* Voice input button
* Voice listening indicator
* Voice transcript preview
* Stop-listening control
* Product suggestion cards
* Branch cards
* Address cards
* Payment-method cards
* Cart-summary cards
* Quick-reply buttons
* Back button
* Clear Conversation option
* Minimise and close controls
* Loading indicators
* Error and retry states

Maintain:

* Balanced spacing
* Consistent border radius
* Subtle shadows
* Strong visual hierarchy
* Accessible font sizes
* Large touch targets
* Keyboard accessibility
* Screen-reader labels
* Smooth but minimal animations
* Proper responsive behaviour

Do not make the assistant childish, overly animated, crowded or visually disconnected from the website.

---

# Assistant Introduction

The assistant can start with a short message such as:

“Hi, I’m the Maeme’s Ordering Assistant. I can help you find food, customise your meal and place your order. You can type or speak to me.”

Display useful starting actions:

* Start an Order
* Order My Favourite
* Recommend Something
* Reorder a Previous Order
* View Menu
* Change Branch

---

# Voice Ordering

Implement voice input using an appropriate browser-compatible speech-recognition solution.

Requirements:

* Ask for microphone permission only when the customer activates voice input.
* Show when the microphone is listening.
* Convert speech into visible text.
* Allow the customer to edit the recognised text before sending.
* Stop listening automatically after detecting the end of speech.
* Provide a manual Stop button.
* Handle denied microphone permission.
* Provide text-chat fallback when speech recognition is unsupported.
* Avoid automatically submitting low-confidence transcripts.
* Confirm important details such as address, payment method and final order.

Structure the voice system so additional languages can be supported later.

The assistant should understand common natural expressions such as:

* “I need chicken and rice as a meal.”
* “Make it large.”
* “Give me Piri Piri fries.”
* “Add a Coke.”
* “Deliver it to my home.”
* “I’ll collect it.”
* “Use my saved card.”
* “Pay cash on delivery.”
* “Order my favourite meal.”
* “Show me something for a light lunch.”
* “I’m very hungry.”
* “Show something under £15.”
* “Change my branch.”
* “Order from another postcode.”

Do not rely only on exact phrase matching.

---

# Structured AI Architecture

Do not allow the language model to directly modify the database or independently calculate prices.

Create a controlled server-side ordering orchestration layer.

The AI should translate customer language into structured intents and then call validated application tools.

Create or reuse structured tools similar to:

* `getSelectedPostcode`
* `getSelectedBranch`
* `getBranchStatus`
* `getBranchServices`
* `searchBranches`
* `getNearbyBranches`
* `searchMenu`
* `getMenuCategories`
* `getProductDetails`
* `getProductOptions`
* `validateProductConfiguration`
* `addItemToCart`
* `updateCartItem`
* `removeCartItem`
* `getCart`
* `validateCart`
* `calculateCartTotals`
* `getAvailableOffers`
* `applyDiscount`
* `getFavouriteProducts`
* `getPreviousOrders`
* `getSavedAddresses`
* `validateDeliveryAddress`
* `getSavedPaymentMethods`
* `startOTPAuthentication`
* `verifyOTP`
* `createPaymentIntent`
* `confirmPayment`
* `placeOrder`
* `getOrderReceipt`
* `getOrderTracking`

Use the actual naming and services found in the project rather than creating unnecessary duplicate functions.

All tool inputs and outputs must use strict schemas and validation.

---

# Conversation State

Create a persistent assistant-session state containing:

* Conversation ID
* Customer authentication state
* Selected postcode
* Selected branch
* Branch service status
* Selected order type
* Product selections
* Product customisations
* Cart
* Delivery address
* Payment method
* Recommendation preferences
* Current conversation step
* Pending required question
* Login-resume state
* Order confirmation state
* Completed order ID

The session should survive:

* Chat panel closing and reopening
* Page navigation
* OTP login
* Authentication redirects
* Payment redirects, where applicable
* Temporary network errors

Do not lose the cart or conversation after login.

Use secure server-side session storage or the project’s existing session architecture for sensitive state.

Do not store payment information in local storage.

---

# Postcode and Branch Confirmation

Before the customer starts adding products, or before confirming the final order, the assistant must verify the selected postcode and branch.

Example message:

“You’re currently ordering from Maeme’s [Branch Name] for postcode [Postcode]. Would you like to continue with this branch or change it?”

Show actions:

* Continue with This Branch
* Change Postcode
* Find Nearby Branches
* View All Branches

This is an important positive confirmation step and should not feel like an unnecessary interruption.

---

# Changing the Branch or Postcode

When the customer wants to change the branch:

1. Allow postcode search.
2. Allow current-location detection after explicit permission.
3. Show nearby branches.
4. Allow browsing all branches.
5. Display real branch information.

Each branch card should show, where available:

* Branch name
* Address
* Distance
* Current status
* Open
* Closed
* Opening Soon
* Closing Soon
* Delivery availability
* Collection availability
* Estimated delivery time
* Estimated collection time
* Minimum order
* Delivery fee

Do not display information that is not available in the backend.

After the customer selects another branch:

1. Confirm the change.
2. Revalidate the existing cart.
3. Check product availability.
4. Check price differences.
5. Check modifier differences.
6. Check offers and discounts.
7. Remove unavailable products only after informing the customer.
8. Ask the customer to select replacements where appropriate.

Never silently change the cart.

---

# Branch Availability Rules

The assistant must respect the current branch status.

## When the Branch Is Open

Offer only the services currently available:

* Delivery
* Collection
* Both

## When Delivery Is Unavailable

Explain:

“Delivery is currently unavailable from this branch, but Collection is available.”

Then offer:

* Continue with Collection
* Choose Another Branch

## When Collection Is Unavailable

Explain:

“Collection is currently unavailable from this branch, but Delivery is available.”

Then offer:

* Continue with Delivery
* Choose Another Branch

## When the Branch Is Closed

Explain the actual branch status and next opening time when available.

Offer:

* Find Nearest Open Branch
* View Other Branches
* Schedule for Later, only when the existing system supports scheduled ordering

## Opening Soon or Closing Soon

Display the exact status from the backend.

Do not allow an order that cannot be fulfilled according to the existing branch rules.

---

# Menu and Product Selection

Use only real products returned by the selected branch.

Never invent:

* Product names
* Product descriptions
* Prices
* Calories
* Images
* Options
* Offers
* Ingredients
* Availability

When a customer mentions a product approximately, search the menu and show the closest real matches.

For example:

Customer:

“I want chicken and rice with a meal.”

The assistant should:

1. Search the selected branch’s menu.
2. Identify matching chicken-and-rice products.
3. Show the closest matches when more than one exists.
4. Ask the customer to select the correct product.
5. Load the product’s real required options.
6. Guide the customer through only the missing required options.

Do not ask for options that the product does not support.

---

# Existing Maeme’s Product Customisation Rules

Reuse the exact option structure found in the website.

For applicable Grilled Collection, Maeme’s Burgers, Vegetarian Collection and Fried Collection products, the assistant may need to handle:

* Regular or Meal
* Go Large when Meal is selected
* Drink selection
* Fries selection
* Regular fries
* Piri Piri fries with the correct surcharge
* Sides
* Cake slice
* Optional extras
* Required product-specific options

For direct-add categories such as desserts, drinks, dips, ice cream and supported sides or extras, add the product directly when no required options exist.

Always load the current product configuration from the backend.

Do not hardcode option availability.

---

# Asking Product Questions

Ask only questions required to complete the selected item.

Prefer grouped, clear questions instead of creating a very long conversation.

Example:

“You selected the Chicken and Rice Meal. Please choose your drink and fries.”

Then show visual options.

When an option is unavailable, disable or hide it based on the existing interface conventions.

Always show additional charges before the customer selects an option.

---

# Cart Behaviour

After adding a product, confirm what was added.

Example:

“I’ve added the Chicken and Rice Meal with Piri Piri fries and Coke to your basket.”

Show:

* Product
* Selected options
* Quantity
* Item price
* Edit
* Remove
* Add Another Item
* Continue to Checkout

The assistant cart and the normal website cart must remain synchronised.

Changes made in either interface should immediately appear in the other.

Use the existing cart as the single source of truth.

---

# Favourite Meal Flow

When the customer says:

“Please order my favourite meal.”

Handle the request as follows:

## Authenticated Customer

1. Load saved favourites.
2. Load relevant previous-order information.
3. Identify the most frequently ordered or recently ordered meals.
4. Show up to four real options.
5. Highlight the strongest match as “Your Most Ordered” or “Recently Ordered”.
6. Ask the customer to select one.
7. Validate that the product is available at the selected branch.
8. Revalidate current prices and modifiers.
9. Ask for any missing required options.

Do not automatically place the order only because the product is a favourite.

## Guest Customer

Because favourites are private account data, explain:

“Sign in is required to access your saved favourites. Your current conversation and basket will be kept.”

Start the existing OTP authentication flow.

After successful login:

* Restore the assistant
* Restore the conversation
* Restore the cart
* Continue directly from the favourite-meal step

When the customer does not want to sign in yet, offer general recommendations instead.

---

# Previous Order and Reorder Flow

When the customer asks to reorder:

1. Authenticate when required.
2. Load recent orders.
3. Show up to four relevant previous orders.
4. Display date, product summary and previous total.
5. Validate every item against the currently selected branch.
6. Use current prices, current options and current availability.
7. Clearly explain any unavailable or changed items.
8. Never reuse outdated totals without recalculation.

---

# AI Meal Recommendations

When the customer says:

“Suggest something I can eat.”

Recommend three or four real products based on available context.

Possible context:

* Current local time
* Lunch or dinner period
* Hunger level
* Light, medium or very hungry
* Budget
* Delivery or Collection
* Spice preference
* Vegetarian preference
* Product popularity
* Current offers
* Previous orders
* Saved favourites
* Selected branch availability

Ask one short question only when essential information is missing.

Example:

“How hungry are you?”

Actions:

* Light Bite
* Normal Meal
* Very Hungry

Recommendation groups can include:

* Light option
* Balanced meal
* Filling meal
* Sharing option

Each recommendation should show:

* Product image
* Product name
* Short real description
* Calories, when available
* Current price
* Why it was suggested
* Add or Customise button

Do not claim health benefits or dietary suitability unless supported by real product data.

---

# Delivery and Collection Flow

After the basket is ready, ask:

“Would you like Delivery or Collection?”

Only show services available at the selected branch.

## Delivery

For Delivery:

1. Request or select an address.
2. Validate the postcode.
3. Validate the delivery area.
4. Validate minimum order.
5. Calculate the actual delivery fee.
6. Calculate the estimated delivery time.
7. Display available payment methods.

## Collection

For Collection:

1. Confirm the branch.
2. Display branch address.
3. Display estimated collection time.
4. Follow the existing Collection payment rules.

Use the existing website terminology:

* Use “Collection”
* Do not replace it with “Pickup”

---

# Saved Addresses

Authenticated customers may select saved addresses such as:

* Home
* Office
* Work

Example customer command:

“Deliver it to my home.”

The assistant should:

1. Retrieve the saved Home address.
2. Display a masked summary.
3. Validate it against the selected branch’s delivery area.
4. Ask for confirmation when required.

When multiple addresses use the same label, show the matching address cards.

When the address is outside the delivery area:

* Explain the issue
* Allow another address
* Suggest a branch that can deliver to the postcode, when possible
* Offer Collection where available

Never expose unnecessary personal-address details in the chat history.

---

# Authentication Rule

Customers must be able to:

* Browse products
* Receive recommendations
* Configure meals
* Build a cart
* Select a branch
* Choose Delivery or Collection

without logging in.

Authentication is required before the final order is placed.

At the final checkout stage, when the customer is not logged in:

1. Preserve the complete assistant state.
2. Start the existing login or OTP flow.
3. Complete verification.
4. Return the customer to the assistant.
5. Restore the exact previous step.
6. Keep all cart items and customisations.
7. Continue checkout without repeating completed questions.

Do not redirect the customer to the homepage after login.

For private features such as favourites, previous orders, saved addresses or saved cards, authentication may be requested earlier because the account data cannot be accessed without it.

The existing cart and conversation must still be preserved.

---

# Payment Methods

Use only payment methods supported by the existing checkout.

Follow the current Maeme’s business rules, including:

* Delivery may support Cash on Delivery and online payment where currently enabled.
* Collection should follow the website’s existing card-payment rule.
* Saved cards should only be available to authenticated customers.
* Never expose complete card details.
* Display only the payment brand and masked last digits.
* Never send card information to the AI model.
* Use tokenised payment methods from the existing payment gateway.

When the customer says:

“Use my saved card.”

Show available masked cards when more than one exists.

Require final confirmation before initiating payment.

Handle:

* Payment success
* Payment failure
* Payment cancellation
* Expired payment method
* Authentication failure
* 3D Secure flow where applicable
* Network timeout

Do not create the order twice after a payment retry.

---

# Final Order Confirmation

Before placing any order, display a complete final summary.

Include:

* Selected branch
* Postcode
* Delivery or Collection
* Delivery address, when applicable
* Products
* Quantities
* Product customisations
* Subtotal
* Discounts
* Delivery fee
* Service charges
* Final total
* Payment method
* Estimated time

Require an explicit action:

* Place Order
* Confirm Order
* A clear voice response such as “Yes, place my order”

Do not interpret unrelated words as payment or order confirmation.

---

# Order Placement Safety

Order creation must be performed through the existing backend.

Implement:

* Server-side validation
* Final branch validation
* Final product availability validation
* Final price calculation
* Final discount validation
* Final delivery-area validation
* Final payment validation
* Idempotency keys
* Duplicate-order prevention
* Transaction-safe order creation
* Detailed error handling
* Audit logging

The AI must never be the source of truth for price, order total or order status.

---

# Receipt in Chat

After a successful order, generate a visual receipt inside the chat.

Display:

* Order confirmed message
* Order number
* Branch name
* Branch address
* Delivery or Collection
* Delivery address summary when applicable
* Ordered products
* Product options
* Quantities
* Subtotal
* Discounts
* Fees
* Total
* Payment method
* Estimated delivery or collection time
* Order date and time

Actions:

* Track Order
* View Full Receipt
* Go to Order History
* Start Another Order

Use the existing order receipt and tracking data.

Do not create a separate fake tracking system.

---

# Order Tracking

After order creation:

1. Provide a Track Order button inside the assistant.
2. Link to the existing live order-tracking page.
3. Pass the real order identifier securely.
4. Optionally show a compact live status inside the assistant.
5. Keep the normal tracking page as the primary source of truth.

Possible statuses should come from the existing backend, such as:

* Order Confirmed
* Preparing
* Ready for Collection
* Out for Delivery
* Delivered
* Collected
* Cancelled

Do not invent statuses.

---

# Conversational Behaviour

The assistant should:

* Use short and clear messages
* Ask one logical question at a time
* Use buttons whenever possible
* Confirm understood selections
* Explain unavailable choices
* Avoid repeating the same question
* Remember previous answers
* Allow the customer to go back
* Allow editing any cart item
* Understand corrections

Examples:

* “No, make that regular.”
* “Change Coke to Diet Coke.”
* “Remove the fries.”
* “Use Collection instead.”
* “Change the branch.”
* “Deliver to my office, not home.”
* “Cancel this order.”
* “Start again.”

The assistant must not place an order after the customer says cancel, stop or start again.

---

# Error Handling

Create clear responses for:

* Product not found
* Product unavailable
* Option unavailable
* Price changed
* Branch closed
* Delivery unavailable
* Collection unavailable
* Address outside delivery area
* Minimum order not reached
* Discount invalid
* Authentication failed
* OTP expired
* Payment failed
* Payment pending
* Order API failed
* Network disconnected
* Speech recognition unavailable
* Microphone permission denied
* Session expired

Preserve the cart whenever recovery is possible.

Never show raw backend errors, stack traces or sensitive information to customers.

---

# Security and Privacy

Implement the feature securely.

Requirements:

* Keep API keys server-side
* Validate every AI tool call
* Validate every product and option ID
* Validate branch IDs
* Validate address ownership
* Validate saved-payment ownership
* Never expose full payment details
* Never store CVV
* Use tokenised payment methods
* Protect against prompt injection
* Do not allow customers to instruct the AI to bypass prices or business rules
* Apply API rate limiting
* Apply authentication checks
* Apply authorisation checks
* Escape customer-generated content
* Protect against duplicate requests
* Add safe logging without sensitive data
* Follow the project’s existing privacy and cookie rules

Customer messages must never be treated as trusted code or database instructions.

---

# Performance Requirements

The assistant must:

* Open quickly
* Stream responses where supported
* Avoid blocking page rendering
* Lazy-load voice and AI dependencies
* Avoid unnecessary API requests
* Cache safe read-only menu information appropriately
* Revalidate branch and product data before checkout
* Work smoothly on mobile devices
* Avoid memory leaks
* Cancel outdated requests
* Prevent repeated messages
* Prevent duplicate cart additions
* Prevent duplicate orders

---

# Analytics

Integrate with the project’s existing analytics solution where available.

Track non-sensitive events such as:

* Assistant opened
* Voice input used
* Product searched
* Recommendation requested
* Product added
* Branch changed
* Checkout started
* Login requested
* Payment selected
* Order completed
* Assistant abandoned
* Error encountered

Do not log speech recordings, full addresses, payment details or sensitive customer messages.

---

# Required Test Scenarios

Create automated tests and manually verify at least the following scenarios.

## Scenario 1: Standard Guest Meal Order

Customer says:

“I want chicken and rice as a meal.”

Verify:

* Correct product matching
* Required product selection
* Drink selection
* Fries selection
* Piri Piri upgrade pricing
* Cart creation
* Delivery or Collection
* Guest login before final placement
* Complete state restoration after login
* Final confirmation
* Order receipt
* Tracking-page redirect

## Scenario 2: Go Large

Customer says:

“Make it large.”

Verify Go Large is applied only when supported.

## Scenario 3: Favourite Meal

Customer says:

“Order my favourite meal.”

Verify:

* Authentication
* Favourites retrieval
* Three or four suitable options
* Highlighting the most relevant favourite
* Current branch availability
* Current pricing
* Required options
* Checkout continuation

## Scenario 4: Saved Home Address

Customer says:

“Deliver it to my home.”

Verify:

* Correct saved address
* Delivery-zone validation
* Address confirmation
* Delivery fee
* Estimated delivery time

## Scenario 5: Recommendation by Hunger

Customer says:

“I’m very hungry. Suggest something.”

Verify:

* Three or four real menu recommendations
* Selected branch availability
* Filling meal suggestions
* Correct current prices

## Scenario 6: Time-Based Recommendation

Customer asks for a light meal at lunchtime.

Verify appropriate real menu suggestions without inventing nutritional claims.

## Scenario 7: Change Branch

Customer says:

“Change my branch.”

Verify:

* Postcode search
* Nearby branch list
* All-branches option
* Status
* Service availability
* Cart revalidation
* Clear communication about unavailable items

## Scenario 8: Branch Closed

Verify the assistant:

* Explains the status
* Shows next opening time where available
* Suggests nearby open branches
* Does not place an invalid order

## Scenario 9: Delivery Unavailable

Verify only Collection is offered and alternative branches can be selected.

## Scenario 10: Collection Unavailable

Verify only Delivery is offered.

## Scenario 11: Out-of-Stock Product

Verify the product is not silently added and suitable real alternatives are offered.

## Scenario 12: Saved Card

Verify:

* Authentication
* Masked card display
* Explicit payment confirmation
* Secure token use
* Successful and failed payment handling

## Scenario 13: Payment Retry

Verify a retry cannot create duplicate orders.

## Scenario 14: OTP Failure

Verify the cart, branch and conversation remain preserved.

## Scenario 15: Voice Failure

Verify text ordering remains fully available.

## Scenario 16: Customer Correction

Customer says:

“Change the drink to Diet Coke.”

Verify the existing cart item is updated rather than duplicated.

## Scenario 17: Mobile Ordering

Verify the full assistant flow on common mobile screen sizes.

---

# Existing Website Protection

Do not modify completed Maeme’s functionality unless required for the assistant integration.

Do not change:

* Header layout
* Footer layout
* Newsletter
* Existing menu design
* Existing product images
* Existing product names
* Existing prices
* Existing category structure
* Existing cart design
* Existing checkout design
* Existing payment behaviour
* Existing tracking functionality
* Existing fonts
* Existing responsive behaviour

Do not stretch, crop, recreate or replace existing product imagery.

Do not change “Collection” back to “Pickup”.

---

# Code Quality

Use:

* Existing project conventions
* TypeScript strict typing where applicable
* Reusable components
* Clear service boundaries
* Server-side business validation
* Centralised error handling
* Accessible HTML
* Secure API routes
* Dependency injection where appropriate
* Testable conversation logic
* Clear comments only where necessary
* No duplicated business logic
* No hardcoded product or branch data

Keep AI intent parsing separate from order-management logic.

The order system must still work even if the AI provider temporarily fails.

---

# Completion Requirements

The task is complete only when:

1. The complete website has been analysed.
2. The backup commit has been created.
3. The assistant matches the Maeme’s design system.
4. Text ordering works.
5. Voice ordering works with a text fallback.
6. Branch and postcode confirmation works.
7. Branch switching works.
8. Product configuration uses real options.
9. Recommendations use real branch menu data.
10. Favourites and previous orders work.
11. Guest ordering works until authentication is required.
12. Login or OTP restores the full previous state.
13. Delivery and Collection rules are enforced.
14. Saved addresses work securely.
15. Saved payment methods work securely.
16. Final order confirmation is required.
17. Duplicate orders are prevented.
18. The receipt appears in the chat.
19. The tracking redirect works.
20. Desktop and mobile flows are fully tested.
21. Existing website functionality remains unchanged.
22. No menu item, price, option or branch status is invented.

After implementation, provide a concise report containing:

* Files created
* Files modified
* Existing services reused
* New APIs or services added
* AI architecture used
* Voice technology used
* Security protections
* Test scenarios completed
* Any backend limitations discovered
* Exact Git backup commit reference
