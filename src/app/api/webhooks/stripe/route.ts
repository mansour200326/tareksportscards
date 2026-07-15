import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getWriteClient } from "@/sanity/lib/client";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

interface CartEntry {
  id: string;
  q: number;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await fulfillOrder(session);
    } catch (err) {
      // Return 500 so Stripe retries — stock decrement is critical.
      console.error("Order fulfillment failed:", err);
      return NextResponse.json(
        { error: "Fulfillment failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  const cartRaw = session.metadata?.cart;
  if (!cartRaw) return;

  let cart: CartEntry[];
  try {
    cart = JSON.parse(cartRaw);
  } catch {
    console.error("Could not parse cart metadata");
    return;
  }
  if (!Array.isArray(cart) || cart.length === 0) return;

  const write = getWriteClient();
  const ids = cart.map((c) => c.id);

  // Read current quantities + slugs so we can clamp at 0 and revalidate pages.
  const current: { _id: string; quantity: number; slug?: string }[] =
    await write.fetch(
      `*[_type == "product" && _id in $ids]{ _id, "quantity": coalesce(quantity, 0), "slug": slug.current }`,
      { ids }
    );
  const byId = new Map(current.map((c) => [c._id, c]));

  const tx = write.transaction();
  for (const entry of cart) {
    const row = byId.get(entry.id);
    if (!row) continue;
    const next = Math.max(0, row.quantity - Math.max(0, Math.floor(entry.q)));
    tx.patch(entry.id, (p) => p.set({ quantity: next }));
  }
  await tx.commit();

  // Revalidate so SOLD state appears everywhere within seconds.
  revalidatePath("/");
  revalidatePath("/shop");
  for (const row of current) {
    if (row.slug) revalidatePath(`/product/${row.slug}`);
  }
}
