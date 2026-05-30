import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');

// Normalises Stripe timestamps (ISO string in v2026 API, Unix int in older versions).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTimestamp(value: any): admin.firestore.Timestamp | null {
  if (!value) return null;
  const ms = typeof value === 'string' ? new Date(value).getTime() : (value as number) * 1000;
  return Number.isFinite(ms) ? admin.firestore.Timestamp.fromMillis(ms) : null;
}

export const syncCheckoutSession = onCall(
  { secrets: [stripeSecretKey], cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in.');
    }

    const { sessionId } = request.data as { sessionId?: string };
    if (!sessionId) throw new HttpsError('invalid-argument', 'sessionId is required.');

    const stripe = new Stripe(stripeSecretKey.value(), { apiVersion: '2026-05-27.dahlia' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify ownership — prevents one user syncing another user's session.
    if (session.client_reference_id !== request.auth.uid) {
      throw new HttpsError('permission-denied', 'Session does not belong to this user.');
    }

    const uid = request.auth.uid;
    const db = admin.firestore();

    // Ensure customer → UID reverse map exists (mirrors what the webhook does).
    const customerId = typeof session.customer === 'string'
      ? session.customer
      : (session.customer as { id: string } | null)?.id;

    if (customerId) {
      await db.collection('stripeCustomers').doc(customerId).set({ uid }, { merge: true });
      await db.collection('users').doc(uid).set({ stripeCustomerId: customerId }, { merge: true });
    }

    // Fetch and sync subscription.
    const subId = typeof session.subscription === 'string'
      ? session.subscription
      : (session.subscription as { id: string } | null)?.id;

    if (subId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sub = await stripe.subscriptions.retrieve(subId) as Record<string, any>;
      await db.collection('users').doc(uid).set(
        {
          subscription: {
            id: sub['id'],
            status: sub['status'],
            priceId: sub['items']?.data?.[0]?.price?.id ?? null,
            currentPeriodEnd: toTimestamp(sub['current_period_end']),
            cancelAtPeriodEnd: sub['cancel_at_period_end'],
            trialEnd: toTimestamp(sub['trial_end']),
          },
        },
        { merge: true },
      );
    }

    return { synced: true };
  },
);
