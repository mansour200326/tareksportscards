import { site } from "@/data/site";
import { formatPrice } from "@/lib/format";

/** Build a wa.me link to the client, optionally pre-filled with a message. */
export function whatsappLink(message?: string): string {
  const number = site.whatsappNumber.replace(/[^\d]/g, "");
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** wa.me link pre-filled with an enquiry about a specific product. */
export function productWhatsappLink(product: {
  title: string;
  price: number;
  currency: string;
}): string {
  const message = `Hi! I'm interested in "${product.title}" (${formatPrice(
    product.price,
    product.currency
  )}). Is it still available?`;
  return whatsappLink(message);
}
