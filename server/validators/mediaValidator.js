import { z } from 'zod'

export const requestMediaUploadSchema = z
  .object({
    filename: z
      .string()
      .trim()
      .min(1, 'Filename is required.')
      .max(
        255,
        'Filename must not exceed 255 characters.',
      ),

    mediaType: z.enum([
      'image',
      'document',
    ]),

    mimeType: z
      .string()
      .trim()
      .min(1, 'MIME type is required.'),

    size: z
      .number()
      .int()
      .positive(
        'File size must be greater than zero.',
      ),

    altText: z
      .string()
      .trim()
      .max(
        250,
        'Alt text must not exceed 250 characters.',
      )
      .default(''),
  })
  .strict()

export const confirmMediaUploadSchema = z
  .object({
    uploadToken: z
      .string()
      .trim()
      .min(1, 'Upload token is required.'),

    altText: z
      .string()
      .trim()
      .max(250, 'Alt text cannot exceed 250 characters.')
      .default(''),

    width: z
      .number()
      .int()
      .positive()
      .nullable()
      .default(null),

    height: z
      .number()
      .int()
      .positive()
      .nullable()
      .default(null),
  })
  .strict()