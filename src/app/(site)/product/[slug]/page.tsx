import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductGallery } from "@/components/ProductGallery";
import { formatPrice } from "@/lib/format";
import { imageUrl } from "@/lib/productImage";
import { client } from "@/sanity/lib/client";
import {
  productBySlugQuery,
  productSlugsQuery,
} from "@/sanity/lib/queries";
import type { Product } from "@/sanity/lib/types";

// Short revalidation so a sold-out card flips to SOLD within a minute even if
// the on-demand webhook revalidation is missed.
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(productSlugsQuery);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    return await client.fetch(productBySlugQuery, { slug });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description?.slice(0, 155),
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const images = (product.images ?? []).map((img) => imageUrl(img, 1000, 1000));
  const isCard = product.category === "card";
  const firstImage = images[0];

  const specs: { label: string; value?: string }[] = isCard
    ? [
        { label: "Player", value: product.player },
        { label: "Year", value: product.year },
        { label: "Set", value: product.set },
        {
          label: "Grade",
          value:
            product.grade &&
            `${product.gradingCompany ? `${product.gradingCompany} ` : ""}${product.grade}`,
        },
      ]
    : [
        { label: "Dimensions", value: product.dimensions },
        { label: "Finish", value: product.finish },
      ];
  const shownSpecs = specs.filter((s) => s.value);

  return (
    <div className="container-page py-8 sm:py-12">
      <nav className="mb-6 text-sm text-cream/50">
        <Link href="/shop" className="hover:text-gold">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream/70">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={images}
          alt={product.title}
          sold={product.sold}
        />

        <div className="lg:pt-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.25em] text-gold">
              {isCard ? "Sports Card" : "Poster"}
            </span>
            {product.sold && <span className="badge-sold">Sold</span>}
            {isCard && product.grade && (
              <span className="badge-gold">
                {product.gradingCompany ? `${product.gradingCompany} ` : ""}
                {product.grade}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl text-cream sm:text-4xl">
            {product.title}
          </h1>

          <p className="mt-4 text-2xl text-cream">
            {formatPrice(product.price, product.currency)}
          </p>

          {product.description && (
            <p className="mt-6 whitespace-pre-line leading-relaxed text-cream/70">
              {product.description}
            </p>
          )}

          {shownSpecs.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-6">
              {shownSpecs.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-widest text-cream/40">
                    {s.label}
                  </dt>
                  <dd className="mt-1 text-cream/90">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-10">
            <AddToCartButton
              id={product._id}
              slug={product.slug}
              title={product.title}
              price={product.price}
              currency={product.currency}
              category={product.category}
              image={firstImage}
              sold={product.sold}
            />
            {!product.sold && product.quantity <= 1 && (
              <p className="mt-3 text-sm text-cream/50">
                One of one — only a single piece available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
