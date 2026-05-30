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
exports.syncCheckoutSession = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
const stripe_1 = __importDefault(require("stripe"));
const stripeSecretKey = (0, params_1.defineSecret)('STRIPE_SECRET_KEY');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTimestamp(value) {
    if (!value)
        return null;
    const ms = typeof value === 'string' ? new Date(value).getTime() : value * 1000;
    return Number.isFinite(ms) ? firestore_1.Timestamp.fromMillis(ms) : null;
}
exports.syncCheckoutSession = (0, https_1.onCall)({ secrets: [stripeSecretKey], cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be signed in.');
    }
    const { sessionId } = request.data;
    if (!sessionId)
        throw new https_1.HttpsError('invalid-argument', 'sessionId is required.');
    // defineSecret.value() works in production; fall back to process.env for the
    // Functions emulator which sometimes doesn't inject secrets the same way.
    const rawKey = stripeSecretKey.value() || process.env['STRIPE_SECRET_KEY'] || '';
    if (!rawKey) {
        throw new https_1.HttpsError('internal', 'Stripe secret key is not configured.');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let stripe;
    try {
        stripe = new stripe_1.default(rawKey, { apiVersion: '2026-05-27.dahlia' });
    }
    catch (err) {
        console.error('Failed to initialise Stripe:', err);
        throw new https_1.HttpsError('internal', 'Failed to initialise Stripe client.');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let session;
    try {
        session = await stripe.checkout.sessions.retrieve(sessionId);
    }
    catch (err) {
        console.error('stripe.checkout.sessions.retrieve failed:', err);
        throw new https_1.HttpsError('not-found', `Could not retrieve checkout session: ${err instanceof Error ? err.message : String(err)}`);
    }
    // Verify ownership — prevents one user syncing another user's session.
    if (session.client_reference_id !== request.auth.uid) {
        console.error(`UID mismatch: session.client_reference_id=${session.client_reference_id} auth.uid=${request.auth.uid}`);
        throw new https_1.HttpsError('permission-denied', 'Session does not belong to this user.');
    }
    const uid = request.auth.uid;
    const db = admin.firestore();
    try {
        const customerId = typeof session.customer === 'string'
            ? session.customer
            : session.customer?.id;
        if (customerId) {
            await db.collection('stripeCustomers').doc(customerId).set({ uid }, { merge: true });
            await db.collection('users').doc(uid).set({ stripeCustomerId: customerId }, { merge: true });
        }
        const subId = typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id;
        if (subId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sub = await stripe.subscriptions.retrieve(subId);
            await db.collection('users').doc(uid).set({
                subscription: {
                    id: sub['id'],
                    status: sub['status'],
                    priceId: sub['items']?.data?.[0]?.price?.id ?? null,
                    currentPeriodEnd: toTimestamp(sub['current_period_end']),
                    cancelAtPeriodEnd: sub['cancel_at_period_end'],
                    trialEnd: toTimestamp(sub['trial_end']),
                },
            }, { merge: true });
        }
        else {
            console.warn('No subscription on session yet — webhook will catch up shortly.');
        }
    }
    catch (err) {
        console.error('Firestore write or subscription fetch failed:', err);
        throw new https_1.HttpsError('internal', `Sync failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    return { synced: true };
});
//# sourceMappingURL=sync.js.map