import { Router } from 'express'

import {
  getAuditLog,
  listAuditLogs,
} from '../controllers/auditController.js'

import {
  requireAdmin,
} from '../middlewares/authMiddleware.js'

const router = Router()

router.get(
  '/',
  requireAdmin,
  listAuditLogs,
)

router.get(
  '/:id',
  requireAdmin,
  getAuditLog,
)

export default router