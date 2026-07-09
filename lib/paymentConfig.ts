// Payment configuration and utilities
// Ready for Stripe or other payment gateway integration

export interface SavedPaymentMethod {
  id: string;
  type: 'card';
  cardBrand: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  isDefault: boolean;
}

export interface NewPaymentMethodInput {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  saveCard: boolean;
}

// Payment gateway configuration from environment variables
export const PAYMENT_CONFIG = {
  stripeKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  stripeEnabled: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  paymentGateway: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || 'placeholder', // 'stripe' or 'placeholder'
};

/**
 * Validates card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): boolean {
  const sanitized = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(sanitized)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Detects card brand from card number
 */
export function detectCardBrand(
  cardNumber: string
): 'visa' | 'mastercard' | 'amex' | 'discover' | null {
  const sanitized = cardNumber.replace(/\s/g, '');

  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(sanitized)) return 'visa';
  if (/^5[1-5][0-9]{14}$/.test(sanitized)) return 'mastercard';
  if (/^3[47][0-9]{13}$/.test(sanitized)) return 'amex';
  if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(sanitized)) return 'discover';

  return null;
}

/**
 * Formats card number for display (shows only last 4 digits)
 */
export function maskCardNumber(cardNumber: string): string {
  const sanitized = cardNumber.replace(/\s/g, '');
  const last4 = sanitized.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

/**
 * Mock function to process payment - Replace with actual Stripe integration
 */
export async function processPayment(
  _amount: number,
  _paymentMethod: SavedPaymentMethod | NewPaymentMethodInput
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  // This is a placeholder for payment processing
  // In production, this would integrate with Stripe API
  
  if (PAYMENT_CONFIG.paymentGateway === 'stripe' && PAYMENT_CONFIG.stripeEnabled) {
    // Stripe integration would go here
    console.log('[v0] Stripe payment would be processed here');
  }

  // Simulate payment processing
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      resolve({
        success: true,
        transactionId,
      });
    }, 1500);
  });
}

/**
 * Format card expiry year (handles both 2 and 4 digit formats)
 */
export function formatExpiryYear(year: string): string {
  if (year.length === 2) {
    return `20${year}`;
  }
  return year;
}

/**
 * Check if card is expired
 */
export function isCardExpired(expiryMonth: number, expiryYear: number): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (expiryYear < currentYear) return true;
  if (expiryYear === currentYear && expiryMonth < currentMonth) return true;

  return false;
}
