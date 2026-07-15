import type { Metadata } from "next";
import Link from "next/link";

import { ClearCartOnMount } from "@/components/ClearCartOnMount";

export const metadata: Metadata = {
  title: "Order confirmed",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-20">
      <ClearCartOnMount />
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-3xl text-gold">
          ✓
        </div>
        <h1 className="font-display text-3xl text-cream sm:text-4xl">
          Thank you for your order
        </h1>
        <p className="mt-4 text-cream/70">
          Your payment was successful. We&apos;ll be in touch shortly with
          shipping details. A confirmation has been sent by Stripe to your
          email.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/shop" className="btn-gold">
            Continue shopping
          </Link>
          <Link href="/" className="btn-outline">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
