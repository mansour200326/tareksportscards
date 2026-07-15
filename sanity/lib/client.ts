import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Read-only client used for fetching content in the app.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // never cache: quantity/sold state must be live
  perspective: "published",
});

// Server-only write client. Used by the Stripe webhook to decrement stock.
// The write token must never be exposed to the browser.
export function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error("Missing environment variable: SANITY_API_WRITE_TOKEN");
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
}
