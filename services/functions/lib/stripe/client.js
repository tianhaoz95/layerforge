"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_PRICES = exports.PRICE_ANNUAL_TEST = exports.PRICE_MONTHLY_TEST = exports.PRICE_ANNUAL_LIVE = exports.PRICE_MONTHLY_LIVE = void 0;
// Live price IDs (Stripe production account — used when STRIPE_SECRET_KEY=sk_live_*)
exports.PRICE_MONTHLY_LIVE = 'price_1TcbpLJiNqYDPd3otD1Hd4QT';
exports.PRICE_ANNUAL_LIVE = 'price_1TcbpMJiNqYDPd3oWQQKFoG4';
// Test price IDs (Stripe sandbox — used by Functions emulator in local dev)
exports.PRICE_MONTHLY_TEST = 'price_1TcXxWR26VFYYHsPPJ0BGphb';
exports.PRICE_ANNUAL_TEST = 'price_1TcXxXR26VFYYHsPwcMhQKkJ';
// Both sets are accepted. Stripe itself enforces key/price mode matching —
// a test price won't work with a live key and vice versa.
exports.ALLOWED_PRICES = new Set([
    exports.PRICE_MONTHLY_LIVE,
    exports.PRICE_ANNUAL_LIVE,
    exports.PRICE_MONTHLY_TEST,
    exports.PRICE_ANNUAL_TEST,
]);
//# sourceMappingURL=client.js.map