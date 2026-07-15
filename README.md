# Tarek Sports Cards

A premium static catalog site for **posters** and **one-of-one sports cards**.
Browsers view the collection and tap **Buy via WhatsApp** to order directly —
no cart, no payment processor, no database, and **no environment variables**.

Built with Next.js (App Router), TypeScript, and Tailwind CSS. Products live in
a single TypeScript file, so the site is trivial to host anywhere static Next.js
runs.

Premium collector aesthetic — dark charcoal, off-white type, gold accent, mobile-first.

## Features

- **Home** — hero, featured products, Posters / Sports Cards category links
- **Shop** (`/shop`) — category filter (posters vs cards), sort by price/newest; sold items shown with a **SOLD** badge (never hidden)
- **Product detail** (`/product/[slug]`) — image gallery, description, price, **Buy via WhatsApp** (disabled when sold)
- **About** and **Contact** (WhatsApp link + details)
- Every product card and product page has a **Buy via WhatsApp** button that opens `wa.me/<number>` with a pre-filled message containing the product name and price.

## Tech stack

| Concern    | Choice                               |
| ---------- | ------------------------------------ |
| Framework  | Next.js 14 (App Router) + TypeScript |
| Styling    | Tailwind CSS                         |
| Data       | `data/products.ts` (static file)     |
| Ordering   | WhatsApp deep links (`wa.me`)        |
| Hosting    | Any static/Next host (Vercel, etc.)  |

There are **no environment variables** and no external services to configure.

---

## Local setup

```bash
git clone https://github.com/mansour200326/tareksportscards.git
cd tareksportscards
npm install
npm run dev
```

Open http://localhost:3000.

---

## Configure the WhatsApp number

Open **`data/site.ts`** and set `whatsappNumber` to the client's real number in
full international format, **digits only** (no `+`, no spaces):

```ts
export const site: SiteConfig = {
  name: "Tarek Sports Cards",
  whatsappNumber: "971501234567", // <-- the client's WhatsApp number
  email: "hello@tareksportscards.com",
  // ...
};
```

Every "Buy via WhatsApp" button and the Contact page link to this number, with a
message pre-filled like:

> Hi! I'm interested in "2003 Prodigy Rookie — PSA 10" (AED 4,500). Is it still available?

You can also edit the site name, hero text, email, and social links here.

---

## Managing products

All products live in **`data/products.ts`**. To add, edit, or remove an item,
change the `products` array. Each entry looks like:

```ts
{
  id: "card-1",
  slug: "2003-prodigy-rookie-psa-10",   // URL: /product/2003-prodigy-rookie-psa-10
  title: "2003 Prodigy Rookie — PSA 10",
  category: "card",                       // "poster" | "card"
  description: "A pristine gem-mint rookie card...",
  price: 4500,
  currency: "AED",
  images: ["/placeholders/card-1.png"],   // paths under /public
  featured: true,                          // show on the homepage
  sold: false,                             // true => SOLD badge, ordering disabled

  // card-only fields (optional):
  player: "A. Prodigy",
  year: "2003",
  set: "Prime Signatures",
  grade: "10",
  gradingCompany: "PSA",

  // poster-only fields (optional):
  // dimensions: "70 x 100 cm",
  // finish: "Matte",
}
```

### Marking an item as SOLD

Set `sold: true`. The item stays visible with a **SOLD** badge and its
"Buy via WhatsApp" button is disabled everywhere.

### Product images

Put image files in **`public/`** (e.g. `public/products/my-card.jpg`) and
reference them by path: `images: ["/products/my-card.jpg"]`. The first image is
the thumbnail; add more for the detail-page gallery.

The repo ships with generated placeholder images in `public/placeholders/`.
Regenerate them any time with:

```bash
python3 scripts/generate_placeholders.py
```

---

## Deploy

This is a standard Next.js app with no runtime configuration.

1. Push to GitHub and **Import** the repo at https://vercel.com/new (or any host
   that runs Next.js).
2. Deploy. There are **no environment variables** to set.

To update the catalog after launch, edit `data/products.ts` (or `data/site.ts`),
commit, and push — the site rebuilds with the new content.

---

## Project structure

```
data/
  products.ts     The product catalog (single source of truth)
  site.ts         Site name, WhatsApp number, email, socials, hero copy
scripts/
  generate_placeholders.py   Regenerate local placeholder images
src/
  app/(site)/     Storefront: home, shop, product, about, contact
  components/     UI components (cards, gallery, WhatsApp button, controls)
  lib/            formatting + WhatsApp link helpers
public/placeholders/   Local placeholder product images
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |
