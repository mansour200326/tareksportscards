"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartItem {
  id: string; // Sanity _id
  slug: string;
  title: string;
  price: number;
  currency: string;
  image?: string;
  category: "poster" | "card";
  /** Stock available at time of add — a client-side hint only. The server
   * re-checks live quantity at checkout, so this is never trusted for money. */
  maxQuantity: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  isReady: boolean;
}

const STORAGE_KEY = "tsc.cart.v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter(isValidItem));
        }
      }
    } catch {
      // ignore corrupt storage
    }
    setIsReady(true);
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!isReady) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, isReady]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        const cap = Math.max(1, item.maxQuantity);
        if (existing) {
          const nextQty = Math.min(existing.quantity + quantity, cap);
          return prev.map((i) =>
            i.id === item.id ? { ...i, ...item, quantity: nextQty } : i
          );
        }
        return [...prev, { ...item, quantity: Math.min(quantity, cap) }];
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.id !== id) return [i];
        const capped = Math.min(Math.max(1, quantity), Math.max(1, i.maxQuantity));
        return quantity <= 0 ? [] : [{ ...i, quantity: capped }];
      })
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return {
      items,
      count,
      subtotal,
      addItem,
      removeItem,
      setQuantity,
      clear,
      isReady,
    };
  }, [items, addItem, removeItem, setQuantity, clear, isReady]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

function isValidItem(x: unknown): x is CartItem {
  if (!x || typeof x !== "object") return false;
  const i = x as Record<string, unknown>;
  return (
    typeof i.id === "string" &&
    typeof i.title === "string" &&
    typeof i.price === "number" &&
    typeof i.quantity === "number"
  );
}
