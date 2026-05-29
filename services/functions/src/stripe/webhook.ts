import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');

export const stripeWebhook = onRequest(
  { secrets: [stripeSecretKey, stripeWebhookSecret] },
  async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const stripe = new Stripe(stripeSecretKey.value(), { apiVersion: '2026-05-27.dahlia' });
    const db = admin.firestore();

    // Verify Stripe signature. Firebase Functions exposes rawBody for this.
    let event: ReturnType<typeof stripe.webhooks.constructEvent>;
    try {
      const rawBody = (req as unknown as { rawBody: Buffer }).rawBody;
      event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret.value());
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      res.status(400).send(`Webhook Error: ${err}`);
      return;
    }

    // Resolve Firebase UID from Stripe customer ID.
    // Tries Firestore reverse map first; falls back to customer metadata.
    const getUidForCustomer = async (customerId: string): Promise<string | null> => {
      const snap = await db.collection('stripeCustomers').doc(customerId).get();
      if (snap.data()?.uid) return snap.data()!.uid as string;

      const customer = await stripe.customers.retrieve(customerId);
      if ('deleted' in customer && customer.deleted) return null;
      return (customer.metadata?.firebaseUid as string) ?? null;
    };

    // Stripe 2026+ API returns timestamps as ISO strings; older versions used Unix ints.
    // This helper normalises both to a Firestore Timestamp.
    const toTimestamp = (value: string | number | null | undefined): admin.firestore.Timestamp | null => {
      if (value === null || value === undefined) return null;
      const ms = typeof value === 'string' ? new Date(value).getTime() : value * 1000;
      if (!Number.isFinite(ms)) return null;
      return admin.firestore.Timestamp.fromMillis(ms);
    };

    // Write subscription state to Firestore for a given subscription object.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const syncSubscription = async (sub: Record<string, any>): Promise<void> => {
      const customerId = typeof sub['customer'] === 'string' ? sub['customer'] : sub['customer']?.id;
      const uid = await getUidForCustomer(customerId);
      if (!uid) {
        console.warn(`syncSubscription: no UID for customer ${customerId}`);
        return;
      }
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
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj = event.data.object as Record<string, any>;

      switch (event.type) {
        case 'checkout.session.completed': {
          const uid = obj['client_reference_id'] as string | null;
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
            await db.collection('users').doc(uid).set(
              { subscription: { id: obj['id'], status: 'canceled' } },
              { merge: true },
            );
          }
          break;
        }

        case 'invoice.payment_succeeded': {
          const subId = typeof obj['subscription'] === 'string' ? obj['subscription'] : obj['subscription']?.id;
          if (subId) {
            const sub = await stripe.subscriptions.retrieve(subId);
            await syncSubscription(sub as unknown as Record<string, unknown>);
          }
          break;
        }

        case 'invoice.payment_failed': {
          const customerId = typeof obj['customer'] === 'string' ? obj['customer'] : obj['customer']?.id;
          const uid = await getUidForCustomer(customerId);
          if (uid) {
            await db.collection('users').doc(uid).set(
              { subscription: { status: 'past_due' } },
              { merge: true },
            );
          }
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error(`Error processing event ${event.type}:`, err);
      res.status(500).send('Internal error');
      return;
    }

    res.json({ received: true });
  },
);
