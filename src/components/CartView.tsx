"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { items, subtotal, setQuantity, removeItem, isReady } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currency = items[0]?.currency ?? "AED";

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (!isReady) {
    return <p className="text-cream/50">Loading cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-charcoal-900 p-12 text-center">
        <p className="font-display text-xl text-cream">Your cart is empty</p>
        <p className="mt-2 text-cream/60">
          Browse the collection and add something special.
        </p>
        <Link href="/shop" className="btn-gold mt-6">
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <ul className="divide-y divide-white/10">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 py-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-charcoal-800">
              <Image
                src={item.image || "/placeholders/placeholder.png"}
                alt={item.title}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-display text-base text-cream hover:text-gold"
                >
                  {item.title}
                </Link>
                <p className="whitespace-nowrap text-sm text-cream/90">
                  {formatPrice(item.price * item.quantity, item.currency)}
                </p>
              </div>
              <p className="text-xs uppercase tracking-widest text-gold/70">
                {item.category === "card" ? "Sports Card" : "Poster"}
              </p>

              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-white/15">
                    <button
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-cream/70 hover:text-gold"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxQuantity}
                      className="px-3 py-1 text-cream/70 hover:text-gold disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  {item.maxQuantity <= 1 && (
                    <span className="text-[11px] uppercase tracking-wide text-cream/40">
                      One of one
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-cream/50 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-white/10 bg-charcoal-900 p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-lg text-cream">Order summary</h2>
        <div className="mt-4 flex justify-between text-sm text-cream/70">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal, currency)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm text-cream/50">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="my-4 border-t border-white/10" />
        <div className="flex justify-between text-base font-medium text-cream">
          <span>Total</span>
          <span>{formatPrice(subtotal, currency)}</span>
        </div>

        <button
          onClick={checkout}
          disabled={loading}
          className="btn-gold mt-6 w-full"
        >
          {loading ? "Redirecting…" : "Proceed to checkout"}
        </button>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <p className="mt-4 text-center text-xs text-cream/40">
          Secure payment via Stripe · Prices in {currency}
        </p>
      </aside>
    </div>
  );
}
