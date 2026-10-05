import { z } from 'zod'

import { mongoIdSchema } from './commonValidator.js'

const optionalUrlSchema = z.union([
  z.literal(''),
  z.string().trim().url('A valid URL is required.'),
])

const socialLinksSchema = z
  .object({
    github: optionalUrlSchema.default(''),

    linkedin: optionalUrlSchema.default(''),
  })
  .strict()

const seoSchema = z
  .object({
    title: z
      .string()
      .trim()
      .max(
        70,
        'SEO title must not exceed 70 characters.',
      )
      .default(''),

    description: z
      .string()
      .trim()
      .max(
        170,
        'SEO description must not exceed 170 characters.',
      )
      .default(''),
  })
  .strict()

export const updatePortfolioSettingsSchema = z
  .object({
    siteName: z
      .string()
      .trim()
      .min(1, 'Site name is required.')
      .max(
        100,
        'Site name must not exceed 100 characters.',
      )
      .optional(),

    headline: z
      .string()
      .trim()
      .min(1, 'Headline is required.')
      .max(
        200,
        'Headline must not exceed 200 characters.',
      )
      .optional(),

    shortBio: z
      .string()
      .trim()
      .max(
        1000,
        'Short bio must not exceed 1000 characters.',
      )
      .optional(),

    email: z
      .union([
        z.literal(''),
        z
          .string()
          .trim()
          .email(
            'A valid email address is required.',
          )
          .max(254),
      ])
      .optional(),

    location: z
      .string()
      .trim()
      .max(
        150,
        'Location must not exceed 150 characters.',
      )
      .optional(),

    socialLinks:
      socialLinksSchema
        .partial()
        .optional(),

    cv: mongoIdSchema
      .nullable()
      .optional(),

    profileImage: mongoIdSchema
      .nullable()
      .optional(),

    seo: seoSchema
      .partial()
      .optional(),
  })
  .strict()
  .refine(
    (data) =>
      Object.keys(data).length > 0,
    {
      message:
        'At least one settings field must be provided.',
    },
  )