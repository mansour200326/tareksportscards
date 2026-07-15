"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { site } from "@/data/site";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=poster", label: "Posters" },
  { href: "/shop?category=card", label: "Cards" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-charcoal-950/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold tracking-wide text-cream sm:text-xl">
            {site.name}
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
          href="/shop"
          className="btn-gold !px-5 !py-2 text-xs sm:!px-6"
        >
          Shop now
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
