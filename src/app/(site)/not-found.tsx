import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl text-gold">404</p>
      <h1 className="mt-4 font-display text-2xl text-cream">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-2 text-cream/60">
        The item may have sold, or the link is out of date.
      </p>
      <Link href="/shop" className="btn-gold mt-8">
        Back to shop
      </Link>
    </div>
  );
}
