import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Tarek Sports Cards.",
};

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-16 sm:py-24">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
        About
      </p>
      <h1 className="font-display text-4xl text-cream sm:text-5xl">
        Collectibles, curated with care.
      </h1>

      <div className="mt-8 space-y-6 leading-relaxed text-cream/70">
        <p>
          Tarek Sports Cards is a small, independent shop for people who take
          their collections seriously. We hand-pick every poster and every card
          we list — no filler, no mass-produced inventory.
        </p>
        <p>
          Sports cards are, more often than not, one-of-one. When a card is
          gone, it&apos;s gone — pieces that sell are marked{" "}
          <span className="text-gold">SOLD</span> so you always see what&apos;s
          genuinely available.
        </p>
        <p>
          Found something you love? Tap{" "}
          <span className="text-gold">Buy via WhatsApp</span> and message us
          directly — we&apos;ll confirm the item, answer any questions, and
          arrange payment and delivery personally.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          { k: "Curated", v: "Every item hand-selected." },
          { k: "One-of-one", v: "Unique pieces, marked SOLD when gone." },
          { k: "Personal", v: "Order directly over WhatsApp." },
        ].map((f) => (
          <div
            key={f.k}
            className="rounded-xl border border-white/10 bg-charcoal-900 p-6"
          >
            <p className="font-display text-lg text-gold">{f.k}</p>
            <p className="mt-2 text-sm text-cream/60">{f.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
