import Link from "next/link";

import { site } from "@/data/site";

export function Footer() {
  const year = 2026;
  const socials = site.socialLinks ?? [];

  return (
    <footer className="border-t border-white/10 bg-charcoal-950">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-lg text-cream">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm text-cream/60">
            Premium posters and one-of-one collectible sports cards.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-cream/40">
            Shop
          </p>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>
              <Link href="/shop" className="hover:text-gold">
                All products
              </Link>
            </li>
            <li>
              <Link href="/shop?category=poster" className="hover:text-gold">
                Posters
              </Link>
            </li>
            <li>
              <Link href="/shop?category=card" className="hover:text-gold">
                Sports Cards
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-cream/40">
            Company
          </p>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>
              <Link href="/about" className="hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {socials.length > 0 && (
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-cream/40">
              Follow
            </p>
            <ul className="space-y-2 text-sm text-cream/70">
              {socials.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gold"
                  >
                    {s.platform || s.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-white/5 py-6">
        <p className="container-page text-xs text-cream/40">
          © {year} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
