const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL

const turnstileSiteKey =
  import.meta.env
    .VITE_TURNSTILE_SITE_KEY

if (!apiBaseUrl) {
  throw new Error(
    'VITE_API_BASE_URL is not configured.',
  )
}

export const env = Object.freeze({
  apiBaseUrl,
  turnstileSiteKey:
    turnstileSiteKey || '',
})