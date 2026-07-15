"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/lib/cart";

interface Props {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  category: "poster" | "card";
  image?: string;
  sold: boolean;
}

export function AddToCartButton(props: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "checking" | "added" | "sold">(
    "idle"
  );

  if (props.sold) {
    return (
      <button className="btn-outline w-full sm:w-auto" disabled>
        Sold
      </button>
    );
  }

  async function handleAdd() {
    setState("checking");
    try {
      // Re-check live quantity from Sanity — never trust cached page data.
      const res = await fetch(`/api/stock?ids=${encodeURIComponent(props.id)}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as {
        stock: { _id: string; quantity: number }[];
      };
      const live = data.stock?.find((s) => s._id === props.id);
      const available = live?.quantity ?? 0;

      if (available <= 0) {
        setState("sold");
        router.refresh();
        return;
      }

      addItem(
        {
          id: props.id,
          slug: props.slug,
          title: props.title,
          price: props.price,
          currency: props.currency,
          category: props.category,
          image: props.image,
          maxQuantity: available,
        },
        1
      );
      setState("added");
      setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("idle");
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <button
        className="btn-gold w-full sm:w-auto"
        onClick={handleAdd}
        disabled={state === "checking"}
      >
        {state === "checking"
          ? "Checking…"
          : state === "added"
            ? "Added ✓"
            : "Add to Cart"}
      </button>
      {state === "sold" && (
        <p className="text-sm text-red-400">
          Just sold — this item is no longer available.
        </p>
      )}
    </div>
  );
}
