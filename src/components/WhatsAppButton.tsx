import { productWhatsappLink } from "@/lib/whatsapp";

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.12-2.9-6.99A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.02 8.02 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.1 8.09a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.11.82.83-3.04-.2-.31a8.03 8.03 0 0 1-1.24-4.3c0-4.46 3.63-8.1 8.09-8.1Zm4.65 10.15c-.25-.13-1.5-.74-1.73-.82-.23-.09-.4-.13-.57.13-.17.25-.66.82-.81.99-.15.17-.3.19-.55.06-.25-.13-1.07-.4-2.04-1.26-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.3.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.87-.2-.49-.41-.42-.57-.43-.15-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.6.13.17 1.77 2.7 4.28 3.79.6.26 1.06.41 1.43.53.6.19 1.14.16 1.57.1.48-.07 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.11-.23-.17-.48-.3Z" />
    </svg>
  );
}

export function WhatsAppButton({
  product,
  className = "",
  label = "Buy via WhatsApp",
}: {
  product: { title: string; price: number; currency: string; sold?: boolean };
  className?: string;
  label?: string;
}) {
  if (product.sold) {
    return (
      <button
        type="button"
        disabled
        className={`btn-outline cursor-not-allowed ${className}`}
      >
        Sold
      </button>
    );
  }

  return (
    <a
      href={productWhatsappLink(product)}
      target="_blank"
      rel="noreferrer"
      className={`btn-gold ${className}`}
    >
      <WhatsAppIcon />
      {label}
    </a>
  );
}
