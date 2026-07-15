import type { Metadata } from "next";

import { site } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Tarek Sports Cards.",
};

export default function ContactPage() {
  const number = site.whatsappNumber.replace(/[^\d]/g, "");
  const waLink = whatsappLink(
    "Hi! I have a question about your posters / sports cards."
  );

  return (
    <div className="container-page max-w-2xl py-16 sm:py-24">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
        Contact
      </p>
      <h1 className="font-display text-4xl text-cream sm:text-5xl">
        Let&apos;s talk collectibles.
      </h1>
      <p className="mt-6 text-cream/70">
        Questions about a listing, condition, or delivery? Message us on
        WhatsApp and we&apos;ll get back to you quickly.
      </p>

      <div className="mt-10 space-y-4">
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl border border-white/10 bg-charcoal-900 p-5 transition-colors hover:border-gold/40"
        >
          <div>
            <p className="font-display text-lg text-cream">WhatsApp</p>
            <p className="text-sm text-cream/60">
              {number ? `+${number}` : "Message us directly"}
            </p>
          </div>
          <span className="text-gold">Chat →</span>
        </a>

        <div className="rounded-xl border border-white/10 bg-charcoal-900 p-5">
          <p className="font-display text-lg text-cream">Email</p>
          <p className="text-sm text-cream/60">{site.email}</p>
        </div>

        {site.socialLinks.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-charcoal-900 p-5">
            <p className="font-display text-lg text-cream">Social</p>
            <ul className="mt-2 space-y-1 text-sm">
              {site.socialLinks.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cream/70 hover:text-gold"
                  >
                    {s.platform || s.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-cream/40">
        Replace the WhatsApp number, email, and social links in{" "}
        <code className="text-cream/60">data/site.ts</code>.
      </p>
    </div>
  );
}
