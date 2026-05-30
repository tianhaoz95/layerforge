// Live price IDs (Stripe production account — used when STRIPE_SECRET_KEY=sk_live_*)
export const PRICE_MONTHLY_LIVE = 'price_1TcbpLJiNqYDPd3otD1Hd4QT';
export const PRICE_ANNUAL_LIVE  = 'price_1TcbpMJiNqYDPd3oWQQKFoG4';

// Test price IDs (Stripe sandbox — used by Functions emulator in local dev)
export const PRICE_MONTHLY_TEST = 'price_1TcXxWR26VFYYHsPPJ0BGphb';
export const PRICE_ANNUAL_TEST  = 'price_1TcXxXR26VFYYHsPwcMhQKkJ';

// Both sets are accepted. Stripe itself enforces key/price mode matching —
// a test price won't work with a live key and vice versa.
export const ALLOWED_PRICES = new Set([
  PRICE_MONTHLY_LIVE,
  PRICE_ANNUAL_LIVE,
  PRICE_MONTHLY_TEST,
  PRICE_ANNUAL_TEST,
]);
