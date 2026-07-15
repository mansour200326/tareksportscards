/**
 * Static product catalog.
 *
 * This is the single source of truth for the shop. To add, edit, or remove a
 * product, change the array below — no database, no CMS, no environment
 * variables. Put product images in `public/products/` (or reuse the
 * placeholders in `public/placeholders/`) and reference them by path.
 *
 * Mark an item as sold by setting `sold: true` — it stays visible with a SOLD
 * badge and its "Buy via WhatsApp" button is disabled.
 */

export type Category = "poster" | "card";

export interface Product {
  /** Stable unique id. */
  id: string;
  /** URL slug — used at /product/[slug]. Keep it unique and URL-safe. */
  slug: string;
  title: string;
  category: Category;
  description: string;
  price: number;
  /** Currency code shown with the price. */
  currency: string;
  /** Image paths under /public. First image is the thumbnail. */
  images: string[];
  /** When true the item shows a SOLD badge and can't be ordered. */
  sold?: boolean;
  /** When true the item appears in the homepage "Featured" section. */
  featured?: boolean;

  // Card-specific (optional)
  player?: string;
  year?: string;
  set?: string;
  grade?: string;
  gradingCompany?: string;

  // Poster-specific (optional)
  dimensions?: string;
  finish?: string;
}

export const products: Product[] = [
  {
    id: "poster-1",
    slug: "legends-of-the-track-gold",
    title: "Legends of the Track — Gold Edition",
    category: "poster",
    description:
      "A limited fine-art print celebrating motorsport's golden era. Printed on heavyweight matte stock with gold-foil detailing.",
    price: 320,
    currency: "AED",
    images: ["/placeholders/poster-1.png"],
    featured: true,
    dimensions: "70 x 100 cm",
    finish: "Matte",
  },
  {
    id: "poster-2",
    slug: "derby-night-crimson",
    title: "Derby Night — Crimson Series",
    category: "poster",
    description:
      "Bold, atmospheric artwork capturing the tension of a floodlit derby. A statement piece for any collection.",
    price: 260,
    currency: "AED",
    images: ["/placeholders/poster-2.png"],
    dimensions: "60 x 90 cm",
    finish: "Glossy",
  },
  {
    id: "poster-3",
    slug: "champions-blue-stadium",
    title: "Champions Blue — Stadium Print",
    category: "poster",
    description:
      "Minimal, architectural tribute to the great stadiums. Cool blue tones, gallery-grade paper.",
    price: 290,
    currency: "AED",
    images: ["/placeholders/poster-3.png"],
    dimensions: "50 x 70 cm",
    finish: "Matte",
  },
  {
    id: "card-1",
    slug: "2003-prodigy-rookie-psa-10",
    title: "2003 Prodigy Rookie — PSA 10",
    category: "card",
    description:
      "A pristine gem-mint rookie card. One of one in this grade for our shelf — when it's gone, it's gone.",
    price: 4500,
    currency: "AED",
    images: ["/placeholders/card-1.png"],
    featured: true,
    player: "A. Prodigy",
    year: "2003",
    set: "Prime Signatures",
    grade: "10",
    gradingCompany: "PSA",
  },
  {
    id: "card-2",
    slug: "2015-emerald-parallel-bgs-95",
    title: "2015 Emerald Parallel — BGS 9.5",
    category: "card",
    description:
      "Numbered emerald parallel with sharp corners and a flawless surface. A centerpiece for any modern PC.",
    price: 1850,
    currency: "AED",
    images: ["/placeholders/card-2.png"],
    featured: true,
    player: "M. Vega",
    year: "2015",
    set: "Emerald Refractors",
    grade: "9.5",
    gradingCompany: "BGS",
  },
  {
    id: "card-3",
    slug: "1998-violet-signature-sgc-9",
    title: "1998 Violet Signature — SGC 9",
    category: "card",
    description:
      "On-card autograph from a legend of the game. This one has already found a new home.",
    price: 6200,
    currency: "AED",
    images: ["/placeholders/card-3.png"],
    sold: true,
    player: "R. Sterling",
    year: "1998",
    set: "Violet Ink",
    grade: "9",
    gradingCompany: "SGC",
  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(limit = 4): Product[] {
  const featured = products.filter((p) => p.featured);
  const list = featured.length ? featured : products;
  return list.slice(0, limit);
}
