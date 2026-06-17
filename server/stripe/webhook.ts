import type { Request, Response } from "express";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { appointments, providerSubscriptions, patientPackages } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

function getStripe() {
  return new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" });
}

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("[stripe/webhook] signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const db = getDb();

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const appointmentId = pi.metadata?.appointmentId
          ? parseInt(pi.metadata.appointmentId)
          : null;
        if (appointmentId) {
          await db
            .update(appointments)
            .set({
              paymentStatus: "paid",
              stripeReceiptUrl: pi.latest_charge as string ?? null,
            })
            .where(eq(appointments.stripePaymentIntentId, pi.id));
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const appointmentId = pi.metadata?.appointmentId
          ? parseInt(pi.metadata.appointmentId)
          : null;
        if (appointmentId) {
          await db
            .update(appointments)
            .set({ paymentStatus: "unpaid" })
            .where(eq(appointments.stripePaymentIntentId, pi.id));
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const status = event.type === "customer.subscription.deleted" ? "cancelled" : sub.status as any;
        // In Stripe API >= 2026-02-25, period dates live on the subscription items
        const item = sub.items?.data?.[0];
        const periodStart = item?.current_period_start ?? null;
        const periodEnd = item?.current_period_end ?? null;
        await db
          .update(providerSubscriptions)
          .set({
            status,
            currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          })
          .where(eq(providerSubscriptions.stripeSubscriptionId, sub.id));
        break;
      }

      default:
        // Unhandled event type — not an error
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error("[stripe/webhook] handler error:", err);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}
