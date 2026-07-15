import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "card", title: "Card details" },
    { name: "poster", title: "Poster details" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "general",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "general",
      options: {
        list: [
          { title: "Poster", value: "poster" },
          { title: "Sports Card", value: "card" },
        ],
        layout: "radio",
      },
      initialValue: "poster",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "general",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      group: "general",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      group: "general",
      initialValue: "AED",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quantity",
      title: "Quantity in stock",
      description:
        "Sports cards are usually one-of-one. When this reaches 0 the item shows as SOLD everywhere.",
      type: "number",
      group: "general",
      initialValue: 1,
      validation: (rule) => rule.required().min(0).integer(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      group: "general",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.min(1),
    }),

    // Card-specific
    defineField({
      name: "player",
      title: "Player",
      type: "string",
      group: "card",
      hidden: ({ document }) => document?.category !== "card",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      group: "card",
      hidden: ({ document }) => document?.category !== "card",
    }),
    defineField({
      name: "set",
      title: "Set",
      type: "string",
      group: "card",
      hidden: ({ document }) => document?.category !== "card",
    }),
    defineField({
      name: "grade",
      title: "Grade",
      type: "string",
      description: 'e.g. "10", "9.5", "Raw"',
      group: "card",
      hidden: ({ document }) => document?.category !== "card",
    }),
    defineField({
      name: "gradingCompany",
      title: "Grading company",
      type: "string",
      description: "e.g. PSA, BGS, SGC",
      group: "card",
      hidden: ({ document }) => document?.category !== "card",
    }),

    // Poster-specific
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
      description: 'e.g. "70 x 100 cm"',
      group: "poster",
      hidden: ({ document }) => document?.category !== "poster",
    }),
    defineField({
      name: "finish",
      title: "Finish",
      type: "string",
      description: 'e.g. "Matte", "Glossy"',
      group: "poster",
      hidden: ({ document }) => document?.category !== "poster",
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      quantity: "quantity",
      media: "images.0",
    },
    prepare({ title, category, quantity, media }) {
      const sold = (quantity ?? 0) <= 0;
      const label = category === "card" ? "Card" : "Poster";
      return {
        title,
        subtitle: `${label}${sold ? " · SOLD" : ` · ${quantity} in stock`}`,
        media,
      };
    },
  },
});
