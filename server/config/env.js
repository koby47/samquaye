import 'dotenv/config'

const requiredEnvironmentVariables = [
  'CLIENT_URLS',
  'MONGODB_URI',
  'JWT_SECRET',
]

for (const variable of requiredEnvironmentVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Missing required environment variable: ${variable}`,
    )
  }
}

const clientUrls = process.env.CLIENT_URLS
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean)

if (clientUrls.length === 0) {
  throw new Error(
    'CLIENT_URLS must contain at least one valid origin',
  )
}

const nodeEnv =
  process.env.NODE_ENV || 'development'

if (
  nodeEnv === 'production' &&
  process.env.JWT_SECRET.length < 32
) {
  throw new Error(
    'JWT_SECRET must contain at least 32 characters in production.',
  )
}

export const env = Object.freeze({
  nodeEnv,

  isProduction:
    nodeEnv === 'production',

  port:
    Number(process.env.PORT) || 5000,

  clientUrls,

  mongoUri:
    process.env.MONGODB_URI,

  jwtSecret:
    process.env.JWT_SECRET,

  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN || '1h',

  jwtCookieMaxAgeMs:
    60 * 60 * 1000,

  mediaUploadTokenExpiresIn:
    '5m',

  r2: Object.freeze({
    accountId:
      process.env.R2_ACCOUNT_ID || '',

    accessKeyId:
      process.env.R2_ACCESS_KEY_ID || '',

    secretAccessKey:
      process.env.R2_SECRET_ACCESS_KEY || '',

    bucketName:
      process.env.R2_BUCKET_NAME || '',

    publicBaseUrl:
      (
        process.env.R2_PUBLIC_BASE_URL ||
        ''
      ).replace(/\/+$/, ''),
  }),

  turnstile: Object.freeze({
    secretKey:
      process.env.TURNSTILE_SECRET_KEY ||
      '',
  }),
})