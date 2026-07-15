import Link from "next/link";

import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";
import { site } from "@/data/site";

export default function HomePage() {
  const featured = getFeaturedProducts(4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(200,162,74,0.14),_transparent_60%)]" />
        <div className="container-page grid gap-10 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
              Posters · Sports Cards
            </p>
            <h1 className="font-display text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
              {site.heroHeading}
            </h1>
            <p className="mt-6 max-w-md text-lg text-cream/70">
              {site.heroText}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop" className="btn-gold">
                Shop the collection
              </Link>
              <Link href="/shop?category=card" className="btn-outline">
                Browse cards
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featured.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Category links */}
      <section className="container-page grid gap-5 py-16 sm:grid-cols-2">
        <CategoryTile
          href="/shop?category=poster"
          title="Posters"
          copy="Statement prints and rare film & sports art."
        />
        <CategoryTile
          href="/shop?category=card"
          title="Sports Cards"
          copy="Graded, one-of-one cards for the collection."
        />
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container-page pb-24">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl text-cream sm:text-3xl">
              Featured
            </h2>
            <Link href="/shop" className="text-sm text-gold hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CategoryTile({
  href,
  title,
  copy,
}: {
  href: string;
  title: string;
  copy: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-charcoal-900 p-10 transition-colors hover:border-gold/40"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(200,162,74,0.12),_transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />
      <h3 className="font-display text-2xl text-cream">{title}</h3>
      <p className="mt-2 max-w-xs text-cream/60">{copy}</p>
      <span className="mt-6 inline-block text-sm text-gold">Explore →</span>
    </Link>
  );
}
