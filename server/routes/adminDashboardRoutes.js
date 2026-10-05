import { Router } from 'express'

import {
  getAdminDashboard,
} from '../controllers/dashboardController.js'

import {
  requireAdmin,
} from '../middlewares/authMiddleware.js'

const router = Router()

router.get(
  '/',
  requireAdmin,
  getAdminDashboard,
)

export default router