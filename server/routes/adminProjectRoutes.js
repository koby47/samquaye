import { Router } from 'express'

import {
  createProject,
  deleteProject,
  getAdminProject,
  listAdminProjects,
  updateProject,
} from '../controllers/projectController.js'
import { requireAdmin } from '../middlewares/authMiddleware.js'
import { requireTrustedOrigin } from '../middlewares/originMiddleware.js'

const router = Router()

router.get(
  '/',
  requireAdmin,
  listAdminProjects,
)

router.get(
  '/:id',
  requireAdmin,
  getAdminProject,
)

router.post(
  '/',
  requireAdmin,
  requireTrustedOrigin,
  createProject,
)

router.patch(
  '/:id',
  requireAdmin,
  requireTrustedOrigin,
  updateProject,
)

router.delete(
  '/:id',
  requireAdmin,
  requireTrustedOrigin,
  deleteProject,
)

export default router