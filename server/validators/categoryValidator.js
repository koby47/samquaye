import { z } from 'zod'

const categoryNameSchema = z
  .string()
  .trim()
  .min(1, 'Category name is required.')
  .max(80, 'Category name must not exceed 80 characters.')

const categorySlugSchema = z
  .string()
  .trim()
  .min(1, 'Category slug is required.')
  .max(100, 'Category slug must not exceed 100 characters.')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Category slug must contain lowercase letters, numbers, and hyphens only.',
  )

export const createCategorySchema = z
  .object({
    name: categoryNameSchema,

    slug: categorySlugSchema,

    description: z
      .string()
      .trim()
      .max(
        500,
        'Description must not exceed 500 characters.',
      )
      .default(''),

    isActive: z.boolean().default(true),

    sortOrder: z
      .number()
      .int()
      .min(0)
      .default(0),
  })
  .strict()

export const updateCategorySchema = z
  .object({
    name: categoryNameSchema.optional(),

    slug: categorySlugSchema.optional(),

    description: z
      .string()
      .trim()
      .max(
        500,
        'Description must not exceed 500 characters.',
      )
      .optional(),

    isActive: z.boolean().optional(),

    sortOrder: z
      .number()
      .int()
      .min(0)
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        'At least one category field must be provided.',
    },
  )