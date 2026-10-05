import { Router } from 'express'

import {
  getAdminPortfolioSettings,
  updatePortfolioSettings,
} from '../controllers/settingsController.js'

import {
  requireAdmin,
} from '../middlewares/authMiddleware.js'

import {
  requireTrustedOrigin,
} from '../middlewares/originMiddleware.js'

const router = Router()

router.get(
  '/',
  requireAdmin,
  getAdminPortfolioSettings,
)

router.patch(
  '/',
  requireAdmin,
  requireTrustedOrigin,
  updatePortfolioSettings,
)

export default router