/**
 * Site-wide settings. Edit these values directly — no environment variables.
 *
 * IMPORTANT: replace `whatsappNumber` with the client's real WhatsApp number in
 * full international format, digits only (no +, no spaces). This is the number
 * every "Buy via WhatsApp" button and the Contact page link to.
 */
export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteConfig {
  name: string;
  /** CLIENT_NUMBER — international format, digits only. e.g. 971501234567 */
  whatsappNumber: string;
  email: string;
  heroHeading: string;
  heroText: string;
  socialLinks: SocialLink[];
}

export const site: SiteConfig = {
  name: "Tarek Sports Cards",

  whatsappNumber: "971500000000",

  email: "hello@tareksportscards.com",

  heroHeading: "Rare finds for serious collectors.",
  heroText:
    "A curated shelf of premium posters and one-of-one sports cards. When it's gone, it's gone.",

  socialLinks: [
    { platform: "Instagram", url: "https://instagram.com" },
    { platform: "X", url: "https://x.com" },
  ],
};
