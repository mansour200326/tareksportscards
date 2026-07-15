import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout cancelled",
};

export default function CheckoutCancelledPage() {
  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-20">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl text-cream/70">
          ×
        </div>
        <h1 className="font-display text-3xl text-cream sm:text-4xl">
          Checkout cancelled
        </h1>
        <p className="mt-4 text-cream/70">
          No payment was taken. Your cart is still saved — pick up where you
          left off whenever you&apos;re ready.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/cart" className="btn-gold">
            Back to cart
          </Link>
          <Link href="/shop" className="btn-outline">
            Keep browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
