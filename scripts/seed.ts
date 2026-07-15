/**
 * Seed script: uploads placeholder images and creates 6 demo products
 * (3 posters, 3 cards — one card SOLD) plus site settings.
 *
 * Usage:
 *   1. Fill in .env.local (project id, dataset, SANITY_API_WRITE_TOKEN)
 *   2. npm run seed
 */
import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { config as loadEnv } from "dotenv";
import { createClient } from "@sanity/client";

loadEnv({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const PLACEHOLDER_DIR = path.join(process.cwd(), "public", "placeholders");

async function uploadImage(file: string) {
  const filePath = path.join(PLACEHOLDER_DIR, file);
  const asset = await client.assets.upload(
    "image",
    createReadStream(filePath),
    { filename: file }
  );
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

interface Seed {
  _id: string;
  title: string;
  slugCurrent: string;
  category: "poster" | "card";
  description: string;
  price: number;
  quantity: number;
  image: string;
  extra?: Record<string, unknown>;
}

const SEEDS: Seed[] = [
  {
    _id: "seed-poster-1",
    title: "Legends of the Track — Gold Edition",
    slugCurrent: "legends-of-the-track-gold",
    category: "poster",
    description:
      "A limited fine-art print celebrating motorsport's golden era. Printed on heavyweight matte stock with gold-foil detailing.",
    price: 320,
    quantity: 8,
    image: "poster-1.png",
    extra: { dimensions: "70 x 100 cm", finish: "Matte" },
  },
  {
    _id: "seed-poster-2",
    title: "Derby Night — Crimson Series",
    slugCurrent: "derby-night-crimson",
    category: "poster",
    description:
      "Bold, atmospheric artwork capturing the tension of a floodlit derby. A statement piece for any collection.",
    price: 260,
    quantity: 5,
    image: "poster-2.png",
    extra: { dimensions: "60 x 90 cm", finish: "Glossy" },
  },
  {
    _id: "seed-poster-3",
    title: "Champions Blue — Stadium Print",
    slugCurrent: "champions-blue-stadium",
    category: "poster",
    description:
      "Minimal, architectural tribute to the great stadiums. Cool blue tones, gallery-grade paper.",
    price: 290,
    quantity: 6,
    image: "poster-3.png",
    extra: { dimensions: "50 x 70 cm", finish: "Matte" },
  },
  {
    _id: "seed-card-1",
    title: "2003 Prodigy Rookie — PSA 10",
    slugCurrent: "2003-prodigy-rookie-psa-10",
    category: "card",
    description:
      "A pristine gem-mint rookie card. One of one in this grade for our shelf — when it's gone, it's gone.",
    price: 4500,
    quantity: 1,
    image: "card-1.png",
    extra: {
      player: "A. Prodigy",
      year: "2003",
      set: "Prime Signatures",
      grade: "10",
      gradingCompany: "PSA",
    },
  },
  {
    _id: "seed-card-2",
    title: "2015 Emerald Parallel — BGS 9.5",
    slugCurrent: "2015-emerald-parallel-bgs-95",
    category: "card",
    description:
      "Numbered emerald parallel with sharp corners and a flawless surface. A centerpiece for any modern PC.",
    price: 1850,
    quantity: 1,
    image: "card-2.png",
    extra: {
      player: "M. Vega",
      year: "2015",
      set: "Emerald Refractors",
      grade: "9.5",
      gradingCompany: "BGS",
    },
  },
  {
    _id: "seed-card-3",
    title: "1998 Violet Signature — SGC 9 (SOLD)",
    slugCurrent: "1998-violet-signature-sgc-9",
    category: "card",
    description:
      "On-card autograph from a legend of the game. This one has already found a new home.",
    price: 6200,
    quantity: 0, // sold
    image: "card-3.png",
    extra: {
      player: "R. Sterling",
      year: "1998",
      set: "Violet Ink",
      grade: "9",
      gradingCompany: "SGC",
    },
  },
];

async function run() {
  console.log("Uploading images and creating documents…");

  const tx = client.transaction();

  for (const seed of SEEDS) {
    const image = await uploadImage(seed.image);
    console.log(`  ✓ uploaded ${seed.image}`);
    tx.createOrReplace({
      _id: seed._id,
      _type: "product",
      title: seed.title,
      slug: { _type: "slug", current: seed.slugCurrent },
      category: seed.category,
      description: seed.description,
      price: seed.price,
      currency: "AED",
      quantity: seed.quantity,
      images: [image],
      ...seed.extra,
    });
  }

  // Site settings singleton
  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "Tarek Sports Cards",
    heroHeading: "Rare finds for serious collectors.",
    heroText:
      "A curated shelf of premium posters and one-of-one sports cards. When it's gone, it's gone.",
    whatsappNumber: "971500000000",
    socialLinks: [
      { platform: "Instagram", url: "https://instagram.com" },
      { platform: "X", url: "https://x.com" },
    ],
  });

  await tx.commit();
  console.log("\n✅ Seed complete: 6 products + site settings created.");
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
