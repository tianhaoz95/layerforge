import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import { ALLOWED_PRICES } from './client';

const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');

interface CheckoutRequest {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export const createCheckoutSession = onCall(
  { secrets: [stripeSecretKey], cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in.');
    }

    const { priceId, successUrl, cancelUrl } = request.data as CheckoutRequest;

    if (!ALLOWED_PRICES.has(priceId)) {
      throw new HttpsError('invalid-argument', 'Invalid price ID.');
    }
    if (!successUrl || !cancelUrl) {
      throw new HttpsError('invalid-argument', 'successUrl and cancelUrl are required.');
    }

    const stripe = new Stripe(stripeSecretKey.value(), { apiVersion: '2026-05-27.dahlia' });
    const uid = request.auth.uid;
    const db = admin.firestore();

    // Get or create Stripe customer tied to this Firebase UID.
    let customerId: string;
    const userDoc = await db.collection('users').doc(uid).get();
    const existingCustomerId = userDoc.data()?.stripeCustomerId as string | undefined;

    if (existingCustomerId) {
      customerId = existingCustomerId;
    } else {
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
  },
);
