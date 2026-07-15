import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { client } from "@/sanity/lib/client";
import { productStockByIdsQuery } from "@/sanity/lib/queries";
import { imageUrl } from "@/lib/productImage";
import { getStripe } from "@/lib/stripe";
import { urlForImage } from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

interface IncomingItem {
  id: string;
  quantity: number;
}

interface StockRow {
  _id: string;
  title: string;
  price: number;
  currency: string;
  quantity: number;
  images?: Parameters<typeof urlForImage>[0][];
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function POST(request: Request) {
  let body: { items?: IncomingItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const items = (body.items ?? []).filter(
    (i) => i && typeof i.id === "string" && Number(i.quantity) > 0
  );

  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const ids = Array.from(new Set(items.map((i) => i.id)));

  // --- Re-check price + live stock server-side. Never trust client prices. ---
  let rows: (StockRow & { images?: unknown[] })[];
  try {
    rows = await client.fetch(
      `*[_type == "product" && _id in $ids]{
        _id, title, price, currency, "quantity": coalesce(quantity, 0), images
      }`,
      { ids },
      { cache: "no-store" }
    );
  } catch {
    return NextResponse.json(
      { error: "Could not verify products. Please try again." },
      { status: 500 }
    );
  }

  const byId = new Map(rows.map((r) => [r._id, r]));
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const currency = (rows[0]?.currency || "AED").toLowerCase();

  for (const item of items) {
    const product = byId.get(item.id);
    if (!product) {
      return NextResponse.json(
        { error: "One of the items is no longer available." },
        { status: 409 }
      );
    }

    const requested = Math.floor(Number(item.quantity));
    if (product.quantity <= 0) {
      return NextResponse.json(
        { error: `"${product.title}" is sold out.` },
        { status: 409 }
      );
    }
    if (requested > product.quantity) {
      return NextResponse.json(
        {
          error: `Only ${product.quantity} of "${product.title}" available.`,
        },
        { status: 409 }
      );
    }

    const img = product.images?.[0]
      ? imageUrl(product.images[0] as never, 600, 600)
      : undefined;
    const absoluteImg =
      img && img.startsWith("http") ? img : undefined;

    lineItems.push({
      quantity: requested,
      price_data: {
        currency,
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.title,
          ...(absoluteImg ? { images: [absoluteImg] } : {}),
          metadata: { sanityId: product._id },
        },
      },
    });
  }

  // Compact cart map for the webhook to decrement stock. Metadata values are
  // capped at 500 chars by Stripe; a normal collectibles cart fits easily.
  const cartMeta = JSON.stringify(
    items.map((i) => ({ id: i.id, q: Math.floor(Number(i.quantity)) }))
  );

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${siteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/checkout/cancelled`,
      metadata: { cart: cartMeta },
      // Card can only be bought once — help avoid oversell across tabs.
      client_reference_id: ids.slice(0, 5).join(","),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
