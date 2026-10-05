import { env } from '../config/env.js'

function createServiceError(
  message,
  status,
) {
  const error = new Error(message)
  error.status = status

  return error
}

export async function verifyTurnstileToken(
  token,
) {
  if (!env.turnstile.secretKey) {
    throw createServiceError(
      'Turnstile verification is not configured.',
      503,
    )
  }

  const formData =
    new URLSearchParams()

  formData.append(
    'secret',
    env.turnstile.secretKey,
  )

  formData.append(
    'response',
    token,
  )

  let response

  try {
    response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded',
        },

        body: formData,
      },
    )
  } catch {
    throw createServiceError(
      'Unable to verify the contact request.',
      503,
    )
  }

  if (!response.ok) {
    throw createServiceError(
      'Unable to verify the contact request.',
      503,
    )
  }

  const result =
    await response.json()

  if (!result.success) {
    throw createServiceError(
      'Contact form verification failed.',
      400,
    )
  }

  return true
}