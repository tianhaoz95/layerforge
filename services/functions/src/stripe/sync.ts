import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import Stripe from 'stripe';

const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTimestamp(value: any): Timestamp | null {
  if (!value) return null;
  const ms = typeof value === 'string' ? new Date(value).getTime() : (value as number) * 1000;
  return Number.isFinite(ms) ? Timestamp.fromMillis(ms) : null;
}

export const syncCheckoutSession = onCall(
  { secrets: [stripeSecretKey], cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in.');
    }

    const { sessionId } = request.data as { sessionId?: string };
    if (!sessionId) throw new HttpsError('invalid-argument', 'sessionId is required.');

    // defineSecret.value() works in production; fall back to process.env for the
    // Functions emulator which sometimes doesn't inject secrets the same way.
    const rawKey = stripeSecretKey.value() || process.env['STRIPE_SECRET_KEY'] || '';
    if (!rawKey) {
      throw new HttpsError('internal', 'Stripe secret key is not configured.');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let stripe: any;
    try {
      stripe = new Stripe(rawKey, { apiVersion: '2026-05-27.dahlia' });
    } catch (err) {
      console.error('Failed to initialise Stripe:', err);
      throw new HttpsError('internal', 'Failed to initialise Stripe client.');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let session: Record<string, any>;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (err) {
      console.error('stripe.checkout.sessions.retrieve failed:', err);
      throw new HttpsError(
        'not-found',
        `Could not retrieve checkout session: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    // Verify ownership — prevents one user syncing another user's session.
    if (session.client_reference_id !== request.auth.uid) {
      console.error(
        `UID mismatch: session.client_reference_id=${session.client_reference_id} auth.uid=${request.auth.uid}`,
      );
      throw new HttpsError('permission-denied', 'Session does not belong to this user.');
    }

    const uid = request.auth.uid;
    const db = admin.firestore();

    try {
      const customerId = typeof session.customer === 'string'
        ? session.customer
        : (session.customer as { id: string } | null)?.id;

      if (customerId) {
        await db.collection('stripeCustomers').doc(customerId).set({ uid }, { merge: true });
        await db.collection('users').doc(uid).set({ stripeCustomerId: customerId }, { merge: true });
      }

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
      } else {
        console.warn('No subscription on session yet — webhook will catch up shortly.');
      }
    } catch (err) {
      console.error('Firestore write or subscription fetch failed:', err);
      throw new HttpsError(
        'internal',
        `Sync failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    return { synced: true };
  },
);
