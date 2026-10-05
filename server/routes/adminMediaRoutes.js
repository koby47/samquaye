import { Router } from 'express'

import {
  confirmMediaUpload,
  deleteMediaAsset,
  getMediaAsset,
  listMediaAssets,
  requestMediaUpload,
} from '../controllers/mediaController.js'

import { requireAdmin } from '../middlewares/authMiddleware.js'
import { requireTrustedOrigin } from '../middlewares/originMiddleware.js'

const router = Router()

/* -------------------------------------------------- */
/* READ                                               */
/* -------------------------------------------------- */

router.get(
  '/',
  requireAdmin,
  listMediaAssets,
)

router.get(
  '/:id',
  requireAdmin,
  getMediaAsset,
)

/* -------------------------------------------------- */
/* UPLOAD                                             */
/* -------------------------------------------------- */

router.post(
  '/upload-url',
  requireAdmin,
  requireTrustedOrigin,
  requestMediaUpload,
)

router.post(
  '/confirm',
  requireAdmin,
  requireTrustedOrigin,
  confirmMediaUpload,
)

/* -------------------------------------------------- */
/* DELETE                                             */
/* -------------------------------------------------- */

router.delete(
  '/:id',
  requireAdmin,
  requireTrustedOrigin,
  deleteMediaAsset,
)

export default router