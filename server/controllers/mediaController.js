import {
  confirmMediaUpload as confirmMediaUploadService,
  createMediaUploadUrl,
  deleteMediaAsset as deleteMediaAssetService,
  getMediaAssetById,
  getMediaAssets,
} from '../services/mediaService.js'

import { createAuditLog } from '../services/auditService.js'

import {
  confirmMediaUploadSchema,
  requestMediaUploadSchema,
} from '../validators/mediaValidator.js'

import { mongoIdSchema } from '../validators/commonValidator.js'

/* -------------------------------------------------- */
/* ADMIN: REQUEST MEDIA UPLOAD URL                    */
/* -------------------------------------------------- */

export async function requestMediaUpload(
  req,
  res,
  next,
) {
  try {
    const validation =
      requestMediaUploadSchema.safeParse(
        req.body,
      )

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid media upload data.',
      })
    }

    const upload =
      await createMediaUploadUrl(
        validation.data,
        req.admin._id,
      )

    await createAuditLog({
      actor: req.admin._id,
      action:
        'media.upload_requested',
      resourceType: 'MediaAsset',
      metadata: {
        objectKey:
          upload.objectKey,

        filename:
          validation.data.filename,

        mediaType:
          validation.data.mediaType,

        mimeType:
          validation.data.mimeType,

        size:
          validation.data.size,
      },
    })

    return res.status(200).json({
      success: true,
      upload,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: CONFIRM MEDIA UPLOAD                        */
/* -------------------------------------------------- */

export async function confirmMediaUpload(
  req,
  res,
  next,
) {
  try {
    const validation =
      confirmMediaUploadSchema.safeParse(
        req.body,
      )

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid media confirmation data.',
      })
    }

    const asset =
      await confirmMediaUploadService(
        validation.data,
        req.admin._id,
      )

    await createAuditLog({
      actor: req.admin._id,
      action:
        'media.upload_completed',
      resourceType: 'MediaAsset',
      resourceId: asset._id,
      metadata: {
        filename:
          asset.filename,

        originalFilename:
          asset.originalFilename,

        objectKey:
          asset.objectKey,

        mediaType:
          asset.mediaType,

        mimeType:
          asset.mimeType,

        size:
          asset.size,
      },
    })

    return res.status(201).json({
      success: true,
      message:
        'Media upload confirmed successfully.',
      asset,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: LIST MEDIA ASSETS                           */
/* -------------------------------------------------- */

export async function listMediaAssets(
  req,
  res,
  next,
) {
  try {
    const filters = {}

    if (req.query.mediaType) {
      if (
        req.query.mediaType !==
          'image' &&
        req.query.mediaType !==
          'document'
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Media type must be image or document.',
        })
      }

      filters.mediaType =
        req.query.mediaType
    }

    const assets =
      await getMediaAssets(filters)

    return res.status(200).json({
      success: true,
      assets,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: GET MEDIA ASSET                             */
/* -------------------------------------------------- */

export async function getMediaAsset(
  req,
  res,
  next,
) {
  try {
    const idValidation =
      mongoIdSchema.safeParse(
        req.params.id,
      )

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid media asset identifier.',
      })
    }

    const asset =
      await getMediaAssetById(
        idValidation.data,
      )

    return res.status(200).json({
      success: true,
      asset,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: DELETE MEDIA ASSET                          */
/* -------------------------------------------------- */

export async function deleteMediaAsset(
  req,
  res,
  next,
) {
  try {
    const idValidation =
      mongoIdSchema.safeParse(
        req.params.id,
      )

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid media asset identifier.',
      })
    }

    const asset =
      await deleteMediaAssetService(
        idValidation.data,
      )

    await createAuditLog({
      actor: req.admin._id,
      action:
        'media.deleted',
      resourceType: 'MediaAsset',
      resourceId: asset._id,
      metadata: {
        filename:
          asset.filename,

        originalFilename:
          asset.originalFilename,

        objectKey:
          asset.objectKey,

        mediaType:
          asset.mediaType,
      },
    })

    return res.status(200).json({
      success: true,
      message:
        'Media asset deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}