import type { Metadata } from "next";

import { ProductCard } from "@/components/ProductCard";
import { ShopControls } from "@/components/ShopControls";
import { getAllProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse all posters and sports cards.",
};

type SearchParams = {
  category?: string;
  sort?: string;
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const category =
    searchParams.category === "poster" || searchParams.category === "card"
      ? searchParams.category
      : "all";
  const sort = searchParams.sort ?? "newest";

  let products = getAllProducts();
  if (category !== "all") {
    products = products.filter((p) => p.category === category);
  }

  products = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0; // newest: keep catalog order
  });

  return (
    <div className="container-page py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="font-display text-3xl text-cream sm:text-4xl">Shop</h1>
        <p className="mt-2 text-cream/60">
          {products.length} {products.length === 1 ? "item" : "items"}
          {category !== "all"
            ? ` · ${category === "card" ? "Sports Cards" : "Posters"}`
            : ""}
        </p>
      </header>

      <div className="mb-10">
        <ShopControls category={category} sort={sort} />
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-16 text-center text-cream/40">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
