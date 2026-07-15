import type { Metadata } from "next";

import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <h1 className="mb-8 font-display text-3xl text-cream sm:text-4xl">
        Your cart
      </h1>
      <CartView />
    </div>
  );
}
