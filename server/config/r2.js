import { S3Client } from '@aws-sdk/client-s3'

import { env } from './env.js'

export function assertR2Configured() {
  const missing = []

  if (!env.r2.accountId) {
    missing.push('R2_ACCOUNT_ID')
  }

  if (!env.r2.accessKeyId) {
    missing.push('R2_ACCESS_KEY_ID')
  }

  if (!env.r2.secretAccessKey) {
    missing.push('R2_SECRET_ACCESS_KEY')
  }

  if (!env.r2.bucketName) {
    missing.push('R2_BUCKET_NAME')
  }

  if (missing.length > 0) {
    const error = new Error(
      `R2 is not configured. Missing: ${missing.join(', ')}`,
    )

    error.status = 503

    throw error
  }
}

export const r2Client = new S3Client({
  region: 'auto',

  endpoint: env.r2.accountId
    ? `https://${env.r2.accountId}.r2.cloudflarestorage.com`
    : undefined,

  credentials:
    env.r2.accessKeyId &&
    env.r2.secretAccessKey
      ? {
          accessKeyId:
            env.r2.accessKeyId,
          secretAccessKey:
            env.r2.secretAccessKey,
        }
      : undefined,
})