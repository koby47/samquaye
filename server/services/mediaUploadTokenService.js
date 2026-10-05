import jwt from 'jsonwebtoken'

import { env } from '../config/env.js'

const MEDIA_UPLOAD_ISSUER =
  'portfolio-api'

const MEDIA_UPLOAD_AUDIENCE =
  'portfolio-media-upload'

const MEDIA_UPLOAD_PURPOSE =
  'media-upload'

export function createMediaUploadToken({
  adminId,
  objectKey,
  originalFilename,
  mediaType,
  mimeType,
  size,
}) {
  return jwt.sign(
    {
      sub: adminId.toString(),

      purpose:
        MEDIA_UPLOAD_PURPOSE,

      objectKey,

      originalFilename,

      mediaType,

      mimeType,

      size,
    },
    env.jwtSecret,
    {
      algorithm: 'HS256',

      expiresIn:
        env.mediaUploadTokenExpiresIn,

      issuer:
        MEDIA_UPLOAD_ISSUER,

      audience:
        MEDIA_UPLOAD_AUDIENCE,
    },
  )
}

export function verifyMediaUploadToken(
  token,
) {
  try {
    const payload = jwt.verify(
      token,
      env.jwtSecret,
      {
        algorithms: ['HS256'],

        issuer:
          MEDIA_UPLOAD_ISSUER,

        audience:
          MEDIA_UPLOAD_AUDIENCE,
      },
    )

    if (
      payload.purpose !==
      MEDIA_UPLOAD_PURPOSE
    ) {
      const error = new Error(
        'Invalid media upload token.',
      )

      error.status = 401

      throw error
    }

    return payload
  } catch (error) {
    if (error.status === 401) {
      throw error
    }

    const serviceError =
      new Error(
        'Media upload token is invalid or expired.',
      )

    serviceError.status = 401

    throw serviceError
  }
}