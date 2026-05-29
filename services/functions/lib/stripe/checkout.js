"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
const client_1 = require("./client");
const stripeSecretKey = (0, params_1.defineSecret)('STRIPE_SECRET_KEY');
exports.createCheckoutSession = (0, https_1.onCall)({ secrets: [stripeSecretKey] }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be signed in.');
    }
    const { priceId, successUrl, cancelUrl } = request.data;
    if (!client_1.ALLOWED_PRICES.has(priceId)) {
        throw new https_1.HttpsError('invalid-argument', 'Invalid price ID.');
    }
    if (!successUrl || !cancelUrl) {
        throw new https_1.HttpsError('invalid-argument', 'successUrl and cancelUrl are required.');
    }
    const stripe = new stripe_1.default(stripeSecretKey.value(), { apiVersion: '2026-05-27.dahlia' });
    const uid = request.auth.uid;
    const db = admin.firestore();
    // Get or create Stripe customer tied to this Firebase UID.
    let customerId;
    const userDoc = await db.collection('users').doc(uid).get();
    const existingCustomerId = userDoc.data()?.stripeCustomerId;
    if (existingCustomerId) {
        customerId = existingCustomerId;
    }
    else {
        const customer = await stripe.customers.create({
            email: request.auth.token.email,
            metadata: { firebaseUid: uid },
        });
        customerId = customer.id;
        await db.collection('users').doc(uid).set({ stripeCustomerId: customerId }, { merge: true });
        await db.collection('stripeCustomers').doc(customerId).set({ uid });
    }
    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: uid,
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: {
            trial_period_days: 7,
            trial_settings: { end_behavior: { missing_payment_method: 'cancel' } },
        },
        payment_method_collection: 'always',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
    });
    return { url: session.url };
});
//# sourceMappingURL=checkout.js.map