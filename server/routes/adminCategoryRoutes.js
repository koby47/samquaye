import { Router } from 'express'

import {
  createCategory,
  deleteCategory,
  listAdminCategories,
  updateCategory,
} from '../controllers/categoryController.js'
import { requireAdmin } from '../middlewares/authMiddleware.js'
import { requireTrustedOrigin } from '../middlewares/originMiddleware.js'

const router = Router()

router.get(
  '/',
  requireAdmin,
  listAdminCategories,
)

router.post(
  '/',
  requireAdmin,
  requireTrustedOrigin,
  createCategory,
)

router.patch(
  '/:id',
  requireAdmin,
  requireTrustedOrigin,
  updateCategory,
)

router.delete(
  '/:id',
  requireAdmin,
  requireTrustedOrigin,
  deleteCategory,
)

export default router