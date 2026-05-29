import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');

interface PortalRequest {
  returnUrl: string;
}

export const createPortalSession = onCall(
  { secrets: [stripeSecretKey], cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in.');
    }

    const { returnUrl } = request.data as PortalRequest;
    if (!returnUrl) {
      throw new HttpsError('invalid-argument', 'returnUrl is required.');
    }

    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(request.auth.uid).get();
    const customerId = userDoc.data()?.stripeCustomerId as string | undefined;

    if (!customerId) {
      throw new HttpsError('not-found', 'No Stripe customer found for this user.');
    }

    const stripe = new Stripe(stripeSecretKey.value(), { apiVersion: '2026-05-27.dahlia' });
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  },
);
