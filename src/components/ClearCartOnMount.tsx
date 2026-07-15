"use client";

import { useEffect } from "react";

import { useCart } from "@/lib/cart";

// Cart is cleared after a successful checkout redirect.
export function ClearCartOnMount() {
  const { clear, isReady } = useCart();
  useEffect(() => {
    if (isReady) clear();
  }, [isReady, clear]);
  return null;
}
