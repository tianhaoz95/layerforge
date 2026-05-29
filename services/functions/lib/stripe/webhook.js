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
exports.stripeWebhook = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
const stripeSecretKey = (0, params_1.defineSecret)('STRIPE_SECRET_KEY');
const stripeWebhookSecret = (0, params_1.defineSecret)('STRIPE_WEBHOOK_SECRET');
exports.stripeWebhook = (0, https_1.onRequest)({ secrets: [stripeSecretKey, stripeWebhookSecret] }, async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const stripe = new stripe_1.default(stripeSecretKey.value(), { apiVersion: '2026-05-27.dahlia' });
    const db = admin.firestore();
    // Verify Stripe signature. Firebase Functions exposes rawBody for this.
    let event;
    try {
        const rawBody = req.rawBody;
        event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret.value());
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err);
        res.status(400).send(`Webhook Error: ${err}`);
        return;
    }
    // Resolve Firebase UID from Stripe customer ID.
    // Tries Firestore reverse map first; falls back to customer metadata.
    const getUidForCustomer = async (customerId) => {
        const snap = await db.collection('stripeCustomers').doc(customerId).get();
        if (snap.data()?.uid)
            return snap.data().uid;
        const customer = await stripe.customers.retrieve(customerId);
        if ('deleted' in customer && customer.deleted)
            return null;
        return customer.metadata?.firebaseUid ?? null;
    };
    // Stripe 2026+ API returns timestamps as ISO strings; older versions used Unix ints.
    // This helper normalises both to a Firestore Timestamp.
    const toTimestamp = (value) => {
        if (value === null || value === undefined)
            return null;
        const ms = typeof value === 'string' ? new Date(value).getTime() : value * 1000;
        if (!Number.isFinite(ms))
            return null;
        return admin.firestore.Timestamp.fromMillis(ms);
    };
    // Write subscription state to Firestore for a given subscription object.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const syncSubscription = async (sub) => {
        const customerId = typeof sub['customer'] === 'string' ? sub['customer'] : sub['customer']?.id;
        const uid = await getUidForCustomer(customerId);
        if (!uid) {
            console.warn(`syncSubscription: no UID for customer ${customerId}`);
            return;
        }
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
    };
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj = event.data.object;
        switch (event.type) {
            case 'checkout.session.completed': {
                const uid = obj['client_reference_id'];
                const customerId = typeof obj['customer'] === 'string' ? obj['customer'] : obj['customer']?.id;
                if (uid && customerId) {
                    await db.collection('stripeCustomers').doc(customerId).set({ uid }, { merge: true });
                    await db.collection('users').doc(uid).set({ stripeCustomerId: customerId }, { merge: true });
                }
                break;
            }
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await syncSubscription(obj);
                break;
            case 'customer.subscription.deleted': {
                const customerId = typeof obj['customer'] === 'string' ? obj['customer'] : obj['customer']?.id;
                const uid = await getUidForCustomer(customerId);
                if (uid) {
                    await db.collection('users').doc(uid).set({ subscription: { id: obj['id'], status: 'canceled' } }, { merge: true });
                }
                break;
            }
            case 'invoice.payment_succeeded': {
                const subId = typeof obj['subscription'] === 'string' ? obj['subscription'] : obj['subscription']?.id;
                if (subId) {
                    const sub = await stripe.subscriptions.retrieve(subId);
                    await syncSubscription(sub);
                }
                break;
            }
            case 'invoice.payment_failed': {
                const customerId = typeof obj['customer'] === 'string' ? obj['customer'] : obj['customer']?.id;
                const uid = await getUidForCustomer(customerId);
                if (uid) {
                    await db.collection('users').doc(uid).set({ subscription: { status: 'past_due' } }, { merge: true });
                }
                break;
            }
            default:
                break;
        }
    }
    catch (err) {
        console.error(`Error processing event ${event.type}:`, err);
        res.status(500).send('Internal error');
        return;
    }
    res.json({ received: true });
});
//# sourceMappingURL=webhook.js.map