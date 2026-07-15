import { groq } from "next-sanity";

// `sold` is derived from quantity so the client never computes stock state.
const PRODUCT_FIELDS = groq`
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  description,
  price,
  currency,
  category,
  "quantity": coalesce(quantity, 0),
  "sold": coalesce(quantity, 0) <= 0,
  images,
  player,
  year,
  set,
  grade,
  gradingCompany,
  dimensions,
  finish
`;

export const allProductsQuery = groq`
  *[_type == "product"] | order(_createdAt desc) {
    ${PRODUCT_FIELDS}
  }
`;

export const featuredProductsQuery = groq`
  *[_type == "product"] | order(coalesce(quantity, 0) desc, _createdAt desc)[0...4] {
    ${PRODUCT_FIELDS}
  }
`;

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ${PRODUCT_FIELDS}
  }
`;

export const productSlugsQuery = groq`
  *[_type == "product" && defined(slug.current)].slug.current
`;

// Minimal live snapshot used server-side to re-check price + stock at checkout.
export const productStockByIdsQuery = groq`
  *[_type == "product" && _id in $ids] {
    _id,
    title,
    price,
    currency,
    "quantity": coalesce(quantity, 0)
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    logo,
    heroHeading,
    heroText,
    whatsappNumber,
    socialLinks
  }
`;
