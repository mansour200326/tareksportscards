import { NextResponse } from "next/server";

import { client } from "@/sanity/lib/client";
import { productStockByIdsQuery } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

// Live stock snapshot used by the client before adding to cart. This is a
// convenience check only — the authoritative re-check happens in /api/checkout.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");
  if (!idsParam) {
    return NextResponse.json({ stock: [] });
  }

  const ids = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 100);

  try {
    const stock = await client.fetch(
      productStockByIdsQuery,
      { ids },
      { cache: "no-store" }
    );
    return NextResponse.json({ stock });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 });
  }
}
