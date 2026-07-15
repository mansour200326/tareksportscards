import type { Image } from "sanity";

export type Category = "poster" | "card";

export interface Product {
  _id: string;
  _createdAt: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  category: Category;
  quantity: number;
  sold: boolean;
  images?: Image[];
  // card
  player?: string;
  year?: string;
  set?: string;
  grade?: string;
  gradingCompany?: string;
  // poster
  dimensions?: string;
  finish?: string;
}

export interface SocialLink {
  platform?: string;
  url?: string;
}

export interface SiteSettings {
  siteName?: string;
  logo?: Image;
  heroHeading?: string;
  heroText?: string;
  whatsappNumber?: string;
  socialLinks?: SocialLink[];
}
