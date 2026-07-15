/**
 * This route mounts the Sanity Studio at `/studio` so the client can log in
 * and edit products directly from the live site.
 */
import { NextStudio } from "next-sanity/studio";

import config from "../../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
