import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/format";
import { imageUrl } from "@/lib/productImage";
import type { Product } from "@/sanity/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const src = imageUrl(product.images?.[0], 700, 700);
  const isCard = product.category === "card";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-charcoal-900 transition-colors hover:border-gold/40"
    >
      <div className="relative aspect-square overflow-hidden bg-charcoal-800">
        <Image
          src={src}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            product.sold ? "opacity-60" : ""
          }`}
        />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.sold && <span className="badge-sold">Sold</span>}
          {isCard && product.grade && (
            <span className="badge-gold">
              {product.gradingCompany ? `${product.gradingCompany} ` : ""}
              {product.grade}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[11px] uppercase tracking-widest text-gold/80">
          {isCard ? "Sports Card" : "Poster"}
        </p>
        <h3 className="font-display text-base leading-snug text-cream">
          {product.title}
        </h3>
        {isCard && product.player && (
          <p className="text-xs text-cream/50">
            {product.player}
            {product.year ? ` · ${product.year}` : ""}
          </p>
        )}
        <p className="mt-2 text-sm font-medium text-cream/90">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
