"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "poster", label: "Posters" },
  { value: "card", label: "Cards" },
];

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function ShopControls({
  category,
  sort,
}: {
  category: string;
  sort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value === "all" || (key === "sort" && value === "newest")) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setParam("category", c.value)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              category === c.value
                ? "bg-gold text-charcoal-950"
                : "border border-white/15 text-cream/80 hover:border-gold/50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-cream/70">
        <span className="hidden sm:inline">Sort</span>
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="rounded-lg border border-white/15 bg-charcoal-900 px-3 py-2 text-cream focus:border-gold focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
