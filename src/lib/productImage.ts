import type { Image } from "sanity";

import { urlForImage } from "@/sanity/lib/image";

const PLACEHOLDER = "/placeholders/placeholder.png";

/** Resolve a Sanity image to a CDN URL, falling back to a local placeholder. */
export function imageUrl(
  image: Image | undefined,
  width: number,
  height?: number
): string {
  if (!image || !(image as { asset?: unknown }).asset) return PLACEHOLDER;
  try {
    let builder = urlForImage(image).width(width);
    if (height) builder = builder.height(height);
    return builder.url();
  } catch {
    return PLACEHOLDER;
  }
}
