"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  alt,
  sold,
}: {
  images: string[];
  alt: string;
  sold: boolean;
}) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : ["/placeholders/placeholder.png"];
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-charcoal-800">
        <Image
          src={current}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover ${sold ? "opacity-70" : ""}`}
        />
        {sold && (
          <span className="badge-sold absolute left-4 top-4 text-sm">Sold</span>
        )}
      </div>

      {list.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border transition-colors ${
                i === active
                  ? "border-gold"
                  : "border-white/10 hover:border-white/30"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
