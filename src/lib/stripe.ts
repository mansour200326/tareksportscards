import Stripe from "stripe";

let stripeClient: Stripe | null = null;

// Lazily instantiate so a missing key doesn't crash the whole app at import
// time (e.g. during static analysis of unrelated routes).
export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("Missing environment variable: STRIPE_SECRET_KEY");
    }
    stripeClient = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return stripeClient;
}
