# Tarek Sports Cards

A production-ready e-commerce site for selling **posters** and **one-of-one sports cards**.
Built with Next.js (App Router), TypeScript, Tailwind CSS, an embedded Sanity Studio for
content management, and Stripe hosted Checkout for payments.

Premium collector aesthetic — dark charcoal, off-white type, gold accent, mobile-first.

## Features

- **Home** — hero, featured products, Posters / Sports Cards category links
- **Shop** (`/shop`) — category filter (posters vs cards), sort by price/newest, sold items shown with a **SOLD** badge (never hidden)
- **Product detail** (`/product/[slug]`) — image gallery, description, price, Add to Cart (disabled when sold)
- **Cart** — client-side, persisted in `localStorage`, quantity controls, checkout
- **Checkout success / cancelled** pages
- **About** and **Contact** (contact = details + WhatsApp link, no form backend)
- **Embedded Sanity Studio** at `/studio` — the client logs in and edits products from the live site
- **Stripe hosted Checkout** in **AED**

### One-of-one stock enforcement (critical business rule)

Sports cards are usually unique. Quantity is enforced **end-to-end**:

1. **Add to Cart** re-checks live quantity from Sanity (`/api/stock`) — it never trusts the cached page.
2. **Checkout** (`/api/checkout`) re-fetches **real prices and live quantity** from Sanity server-side, never trusting client prices, and rejects sold-out / over-quantity carts.
3. The **Stripe webhook** (`/api/webhooks/stripe`, `checkout.session.completed`) verifies the signature, then **decrements quantity** in Sanity via a write token and revalidates the affected pages, so an item shows **SOLD everywhere within ~60 seconds**. Product/home/shop pages also use short revalidation (no long ISR caches) as a fallback.

---

## Tech stack

| Concern         | Choice                              |
| --------------- | ----------------------------------- |
| Framework       | Next.js 14 (App Router) + TypeScript |
| Styling         | Tailwind CSS                        |
| CMS             | Sanity (Studio embedded at `/studio`) |
| Payments        | Stripe hosted Checkout (AED)        |
| Hosting         | Vercel (recommended)                |

---

## 1. Local setup

```bash
git clone https://github.com/mansour200326/tareksportscards.git
cd tareksportscards
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev
```

Open http://localhost:3000. The Studio is at http://localhost:3000/studio.

---

## 2. Create the Sanity project & get the IDs / token

1. Create a free account at https://www.sanity.io and a new project at
   https://www.sanity.io/manage.
2. Copy the **Project ID** → `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. Create (or use) a dataset named `production` → `NEXT_PUBLIC_SANITY_DATASET`.
4. Add the local dev URL and your production URL as **CORS origins**
   (project → API → CORS origins): `http://localhost:3000` and your Vercel URL,
   both with **credentials allowed**.
5. Create a **write token**: project → API → Tokens → **Add API token**,
   permission **Editor** → `SANITY_API_WRITE_TOKEN`.
   This token is server-only and is used by the Stripe webhook to decrement stock.
   **Never expose it to the browser.**

### Seed demo data (optional)

With `.env.local` filled in (project id, dataset, write token):

```bash
npm run seed
```

This uploads local placeholder images and creates **6 products** (3 posters,
3 cards — one card marked **SOLD**) plus a `siteSettings` document.

---

## 3. Set up Stripe keys & the webhook

1. Create an account at https://dashboard.stripe.com.
2. From **Developers → API keys** copy:
   - **Secret key** → `STRIPE_SECRET_KEY`
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Create the webhook endpoint (**Developers → Webhooks → Add endpoint**):
   - URL: `https://YOUR_DOMAIN/api/webhooks/stripe`
   - Event: `checkout.session.completed`
   - Copy the **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

### Test the webhook locally

```bash
# https://docs.stripe.com/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copy the printed whsec_... into .env.local as STRIPE_WEBHOOK_SECRET, then restart dev
```

Make a test purchase with card `4242 4242 4242 4242`, any future expiry/CVC.
The card's quantity in Sanity should drop and it should flip to **SOLD**.

---

## 4. Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` |
| `SANITY_API_WRITE_TOKEN` | Server-only Editor token (webhook stock decrement) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `NEXT_PUBLIC_SITE_URL` | Public base URL, no trailing slash (e.g. `https://tareksportscards.com`) |

`.env.local` is gitignored — never commit real secrets.

---

## 5. Deploy to Vercel

1. Push the repo to GitHub and **Import** it at https://vercel.com/new.
2. In **Project → Settings → Environment Variables**, add **every** variable
   from the table above (for Production, Preview, and Development as needed).
   Set `NEXT_PUBLIC_SITE_URL` to your Vercel/production URL.
3. Deploy. After the first deploy:
   - Add your production domain to Sanity **CORS origins** (with credentials).
   - Update the Stripe webhook endpoint URL to
     `https://YOUR_DOMAIN/api/webhooks/stripe` and set the live
     `STRIPE_WEBHOOK_SECRET` in Vercel.
4. Visit `/studio` on the deployed site to manage products.

---

## Project structure

```
sanity/                 Sanity schema, client, queries, image + types
  schemaTypes/          product + siteSettings schemas
sanity.config.ts        Embedded Studio config (mounted at /studio)
scripts/
  seed.ts               Seed 6 demo products + site settings
  generate_placeholders.py   Regenerate local placeholder images
src/
  app/(site)/           Public storefront (own root layout w/ header + footer)
  app/(studio)/studio/  Embedded Sanity Studio (bare root layout)
  app/api/              checkout, stock re-check, stripe webhook
  components/           UI components (cards, gallery, cart, controls)
  lib/                  cart store, stripe, formatting, image helpers
public/placeholders/    Local placeholder product images
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |
| `npm run seed` | Seed demo products + settings into Sanity |

## Content model

**product**: `title`, `slug`, `description`, `price`, `currency` (default `AED`),
`category` (`poster` | `card`), `images[]`, `quantity` (→ `sold` when `0`).
Card fields: `player`, `year`, `set`, `grade`, `gradingCompany`.
Poster fields: `dimensions`, `finish`.

**siteSettings**: `siteName`, `logo`, `heroHeading`, `heroText`, `whatsappNumber`, `socialLinks[]`.
