import crypto from 'node:crypto'
import path from 'node:path'

import {
  createMediaUploadToken,
  verifyMediaUploadToken,
} from './mediaUploadTokenService.js'

import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import {
  getSignedUrl,
} from '@aws-sdk/s3-request-presigner'

import { env } from '../config/env.js'
import {
  MEDIA_FOLDERS,
  MEDIA_LIMITS,
} from '../config/media.js'
import {
  assertR2Configured,
  r2Client,
} from '../config/r2.js'

import MediaAsset from '../models/MediaAsset.js'
import PortfolioSettings from '../models/PortfolioSettings.js'
import Project from '../models/Project.js'

/* -------------------------------------------------- */
/* SERVICE ERROR                                      */
/* -------------------------------------------------- */

function createServiceError(
  message,
  status,
) {
  const error = new Error(message)
  error.status = status

  return error
}

/* -------------------------------------------------- */
/* MIME TYPE / EXTENSION MAPPING                      */
/* -------------------------------------------------- */

const MIME_EXTENSIONS = Object.freeze({
  'image/jpeg': [
    '.jpg',
    '.jpeg',
  ],

  'image/png': [
    '.png',
  ],

  'image/webp': [
    '.webp',
  ],

  'application/pdf': [
    '.pdf',
  ],
})

/* -------------------------------------------------- */
/* FILE EXTENSION                                     */
/* -------------------------------------------------- */

function getExtension(filename) {
  return path
    .extname(filename)
    .toLowerCase()
}

/* -------------------------------------------------- */
/* VALIDATE MEDIA TYPE AND SIZE                       */
/* -------------------------------------------------- */

function validateMediaUpload({
  mediaType,
  mimeType,
  size,
}) {
  const limits =
    MEDIA_LIMITS[mediaType]

  if (!limits) {
    throw createServiceError(
      'Unsupported media type.',
      400,
    )
  }

  if (
    !limits.allowedMimeTypes.includes(
      mimeType,
    )
  ) {
    throw createServiceError(
      'Unsupported file format.',
      400,
    )
  }

  if (size > limits.maxBytes) {
    throw createServiceError(
      'File exceeds the allowed size limit.',
      400,
    )
  }
}

/* -------------------------------------------------- */
/* VALIDATE FILE EXTENSION                            */
/* -------------------------------------------------- */

function validateExtension(
  filename,
  mimeType,
) {
  const extension =
    getExtension(filename)

  const allowedExtensions =
    MIME_EXTENSIONS[mimeType]

  if (
    !allowedExtensions ||
    !allowedExtensions.includes(
      extension,
    )
  ) {
    throw createServiceError(
      'File extension does not match the declared file type.',
      400,
    )
  }
}

/* -------------------------------------------------- */
/* GENERATE R2 OBJECT KEY                             */
/* -------------------------------------------------- */

function generateObjectKey({
  filename,
  mediaType,
}) {
  const extension =
    getExtension(filename)

  const identifier =
    crypto.randomUUID()

  const folder =
    MEDIA_FOLDERS[mediaType]

  return `${folder}/${identifier}${extension}`
}

/* -------------------------------------------------- */
/* CREATE PRESIGNED UPLOAD URL                        */
/* -------------------------------------------------- */

export async function createMediaUploadUrl(
  {
    filename,
    mediaType,
    mimeType,
    size,
  },
  adminId,
) {
  assertR2Configured()

  validateMediaUpload({
    mediaType,
    mimeType,
    size,
  })

  validateExtension(
    filename,
    mimeType,
  )

  const objectKey =
    generateObjectKey({
      filename,
      mediaType,
    })

  const command =
    new PutObjectCommand({
      Bucket: env.r2.bucketName,
      Key: objectKey,
      ContentType: mimeType,
    })

  const uploadUrl =
    await getSignedUrl(
      r2Client,
      command,
      {
        expiresIn: 300,
      },
    )

  const uploadToken =
    createMediaUploadToken({
      adminId,
      objectKey,
      originalFilename:
        filename,
      mediaType,
      mimeType,
      size,
    })

  return {
    objectKey,
    uploadUrl,
    uploadToken,
    expiresIn: 300,
  }
}

/* -------------------------------------------------- */
/* GET R2 OBJECT METADATA                             */
/* -------------------------------------------------- */

async function getR2ObjectMetadata(
  objectKey,
) {
  assertR2Configured()

  try {
    const result =
      await r2Client.send(
        new HeadObjectCommand({
          Bucket:
            env.r2.bucketName,
          Key: objectKey,
        }),
      )

    return result
  } catch {
    throw createServiceError(
      'Uploaded file could not be verified.',
      400,
    )
  }
}

/* -------------------------------------------------- */
/* BUILD PUBLIC MEDIA URL                             */
/* -------------------------------------------------- */

function buildPublicUrl(
  objectKey,
) {
  if (!env.r2.publicBaseUrl) {
    return ''
  }

  const baseUrl =
    env.r2.publicBaseUrl.replace(
      /\/+$/,
      '',
    )

  return `${baseUrl}/${objectKey}`
}

/* -------------------------------------------------- */
/* CONFIRM MEDIA UPLOAD                               */
/* -------------------------------------------------- */

export async function confirmMediaUpload(
  data,
  adminId,
) {
  assertR2Configured()

  const uploadIntent =
    verifyMediaUploadToken(
      data.uploadToken,
    )

  if (
    uploadIntent.sub !==
    adminId.toString()
  ) {
    throw createServiceError(
      'Media upload token does not belong to this administrator.',
      403,
    )
  }

  const {
    objectKey,
    originalFilename,
    mediaType,
    mimeType,
    size,
  } = uploadIntent

  validateMediaUpload({
    mediaType,
    mimeType,
    size,
  })

  validateExtension(
    originalFilename,
    mimeType,
  )

  const metadata =
    await getR2ObjectMetadata(
      objectKey,
    )

  if (
    metadata.ContentLength !== size
  ) {
    throw createServiceError(
      'Uploaded file size does not match the authorized size.',
      400,
    )
  }

  if (
    metadata.ContentType &&
    metadata.ContentType !==
      mimeType
  ) {
    throw createServiceError(
      'Uploaded file type does not match the authorized type.',
      400,
    )
  }

  const existingAsset =
    await MediaAsset.findOne({
      objectKey,
    })

  if (existingAsset) {
    throw createServiceError(
      'This uploaded file has already been registered.',
      409,
    )
  }

  const asset =
    await MediaAsset.create({
      filename:
        path.basename(
          objectKey,
        ),

      originalFilename,

      objectKey,

      mediaType,

      mimeType,

      size,

      altText:
        data.altText,

      width:
        data.width,

      height:
        data.height,

      storageProvider:
        'cloudflare-r2',

      bucket:
        env.r2.bucketName,

      publicUrl:
        buildPublicUrl(
          objectKey,
        ),

      uploadedBy:
        adminId,
    })

  return asset
}

/* -------------------------------------------------- */
/* LIST MEDIA ASSETS                                  */
/* -------------------------------------------------- */

export async function getMediaAssets({
  mediaType,
} = {}) {
  const query = {
    isActive: true,
  }

  if (mediaType) {
    query.mediaType =
      mediaType
  }

  return MediaAsset.find(query)
    .populate(
      'uploadedBy',
      'name email',
    )
    .sort({
      createdAt: -1,
    })
    .lean()
}

/* -------------------------------------------------- */
/* GET MEDIA ASSET BY ID                              */
/* -------------------------------------------------- */

export async function getMediaAssetById(
  mediaId,
) {
  const asset =
    await MediaAsset.findById(
      mediaId,
    )
      .populate(
        'uploadedBy',
        'name email',
      )
      .lean()

  if (!asset) {
    throw createServiceError(
      'Media asset not found.',
      404,
    )
  }

  return asset
}

/* -------------------------------------------------- */
/* FIND MEDIA USAGE                                   */
/* -------------------------------------------------- */

async function findMediaUsage(
  mediaId,
) {
  const [
    projectCoverUsage,
    projectGalleryUsage,
    settingsCvUsage,
    settingsProfileUsage,
  ] = await Promise.all([
    Project.exists({
      coverImage: mediaId,
    }),

    Project.exists({
      gallery: mediaId,
    }),

    PortfolioSettings.exists({
      cv: mediaId,
    }),

    PortfolioSettings.exists({
      profileImage: mediaId,
    }),
  ])

  return Boolean(
    projectCoverUsage ||
      projectGalleryUsage ||
      settingsCvUsage ||
      settingsProfileUsage,
  )
}

/* -------------------------------------------------- */
/* DELETE MEDIA ASSET                                 */
/* -------------------------------------------------- */

export async function deleteMediaAsset(
  mediaId,
) {
  const asset =
    await MediaAsset.findById(
      mediaId,
    )

  if (!asset) {
    throw createServiceError(
      'Media asset not found.',
      404,
    )
  }

  const isInUse =
    await findMediaUsage(
      asset._id,
    )

  if (isInUse) {
    throw createServiceError(
      'Media asset cannot be deleted while it is in use.',
      409,
    )
  }

  assertR2Configured()

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: asset.bucket,
      Key: asset.objectKey,
    }),
  )

  await asset.deleteOne()

  return asset
}