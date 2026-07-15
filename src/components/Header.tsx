"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/lib/cart";
import type { SiteSettings } from "@/sanity/lib/types";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=poster", label: "Posters" },
  { href: "/shop?category=card", label: "Cards" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header({ settings }: { settings: SiteSettings | null }) {
  const { count, isReady } = useCart();
  const pathname = usePathname();
  const siteName = settings?.siteName || "Tarek Sports Cards";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-charcoal-950/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold tracking-wide text-cream sm:text-xl">
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm tracking-wide transition-colors hover:text-gold ${
                pathname === item.href.split("?")[0] && item.href !== "/shop"
                  ? "text-gold"
                  : "text-cream/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="relative inline-flex items-center gap-2 text-sm text-cream/90 hover:text-gold"
          aria-label="Cart"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path
              d="M2.5 3h2l2.4 12.4a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 7H6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="20" r="1.3" />
            <circle cx="18" cy="20" r="1.3" />
          </svg>
          <span className="hidden sm:inline">Cart</span>
          {isReady && count > 0 && (
            <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-charcoal-950">
              {count}
            </span>
          )}
        </Link>
      </div>

      <nav className="flex items-center gap-5 overflow-x-auto border-t border-white/5 px-5 py-2 text-sm md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap text-cream/75 hover:text-gold"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
