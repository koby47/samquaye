import { z } from 'zod'

export const createContactEnquirySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must contain at least 2 characters.')
      .max(100, 'Name must not exceed 100 characters.'),

    email: z
      .string()
      .trim()
      .email('A valid email address is required.')
      .max(254),

    subject: z
      .string()
      .trim()
      .min(3, 'Subject must contain at least 3 characters.')
      .max(200, 'Subject must not exceed 200 characters.'),

    message: z
      .string()
      .trim()
      .min(10, 'Message must contain at least 10 characters.')
      .max(5000, 'Message must not exceed 5000 characters.'),

    turnstileToken: z
      .string()
      .trim()
      .min(1, 'Turnstile verification is required.'),
  })
  .strict()

export const updateContactEnquirySchema = z
  .object({
    status: z.enum([
      'new',
      'read',
      'replied',
      'archived',
    ]),
  })
  .strict()