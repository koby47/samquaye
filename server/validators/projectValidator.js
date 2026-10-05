import { z } from 'zod'

import { mongoIdSchema } from './commonValidator.js'

/* -------------------------------------------------- */
/* REUSABLE FIELD SCHEMAS                             */
/* -------------------------------------------------- */

const projectTitleSchema = z
  .string()
  .trim()
  .min(1, 'Project title is required.')
  .max(
    150,
    'Project title must not exceed 150 characters.',
  )

const projectSlugSchema = z
  .string()
  .trim()
  .min(1, 'Project slug is required.')
  .max(
    180,
    'Project slug must not exceed 180 characters.',
  )
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Project slug must contain lowercase letters, numbers, and hyphens only.',
  )

const optionalUrlSchema = z.union([
  z.literal(''),
  z
    .string()
    .trim()
    .url('A valid URL is required.'),
])

const technologySchema = z
  .string()
  .trim()
  .min(1)
  .max(50)

const featureSchema = z
  .string()
  .trim()
  .min(1)
  .max(300)

const detailItemSchema = z
  .string()
  .trim()
  .min(1)
  .max(1000)

/* -------------------------------------------------- */
/* SEO                                                */
/* -------------------------------------------------- */

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

/* -------------------------------------------------- */
/* PROJECT FIELD DEFINITIONS                          */
/* -------------------------------------------------- */

/*
 * These definitions intentionally do not contain
 * create-specific defaults.
 *
 * This allows the same validation rules to be reused
 * safely by the PATCH schema without injecting values
 * for fields that were not supplied by the client.
 */

const projectFields = {
  title: projectTitleSchema,

  slug: projectSlugSchema,

  summary: z
    .string()
    .trim()
    .min(
      1,
      'Project summary is required.',
    )
    .max(
      500,
      'Project summary must not exceed 500 characters.',
    ),

  description: z
    .string()
    .trim()
    .min(
      1,
      'Project description is required.',
    )
    .max(
      5000,
      'Project description must not exceed 5000 characters.',
    ),

  problem: z
    .string()
    .trim()
    .max(3000),

  solution: z
    .string()
    .trim()
    .max(5000),

  role: z
    .string()
    .trim()
    .max(200),

  technologies: z
    .array(technologySchema)
    .max(
      30,
      'A project cannot contain more than 30 technologies.',
    ),

  features: z
    .array(featureSchema)
    .max(
      30,
      'A project cannot contain more than 30 features.',
    ),

  architecture: z
    .string()
    .trim()
    .max(5000),

  challenges: z
    .array(detailItemSchema)
    .max(
      20,
      'A project cannot contain more than 20 challenges.',
    ),

  outcomes: z
    .array(detailItemSchema)
    .max(
      20,
      'A project cannot contain more than 20 outcomes.',
    ),

  category: mongoIdSchema,

  coverImage: mongoIdSchema
    .nullable(),

  gallery: z
    .array(mongoIdSchema)
    .max(
      30,
      'A project gallery cannot contain more than 30 media assets.',
    ),

  repositoryUrl: optionalUrlSchema,

  liveUrl: optionalUrlSchema,

  featured: z.boolean(),

  status: z.enum([
    'draft',
    'published',
    'archived',
  ]),

  sortOrder: z
    .number()
    .int()
    .min(
      0,
      'Sort order cannot be negative.',
    ),

  seo: seoSchema,
}

/* -------------------------------------------------- */
/* CREATE PROJECT                                     */
/* -------------------------------------------------- */

/*
 * Creation has sensible defaults.
 *
 * Required:
 * - title
 * - slug
 * - summary
 * - description
 * - category
 *
 * Everything else can be omitted and receives
 * an appropriate default.
 */

export const createProjectSchema = z
  .object({
    ...projectFields,

    problem:
      projectFields.problem.default(''),

    solution:
      projectFields.solution.default(''),

    role:
      projectFields.role.default(''),

    technologies:
      projectFields.technologies.default([]),

    features:
      projectFields.features.default([]),

    architecture:
      projectFields.architecture.default(''),

    challenges:
      projectFields.challenges.default([]),

    outcomes:
      projectFields.outcomes.default([]),

    coverImage:
      projectFields.coverImage.default(null),

    gallery:
      projectFields.gallery.default([]),

    repositoryUrl:
      projectFields.repositoryUrl.default(''),

    liveUrl:
      projectFields.liveUrl.default(''),

    featured:
      projectFields.featured.default(false),

    status:
      projectFields.status.default('draft'),

    sortOrder:
      projectFields.sortOrder.default(0),

    seo:
      projectFields.seo.default({
        title: '',
        description: '',
      }),
  })
  .strict()

/* -------------------------------------------------- */
/* UPDATE PROJECT                                     */
/* -------------------------------------------------- */

/*
 * PATCH must not apply create defaults.
 *
 * Only fields explicitly supplied by the client
 * should appear in validation.data.
 */

export const updateProjectSchema = z
  .object(projectFields)
  .partial()
  .strict()
  .refine(
    (data) =>
      Object.keys(data).length > 0,
    {
      message:
        'At least one project field must be provided.',
    },
  )