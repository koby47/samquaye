import { Router } from 'express'

import {
  deleteContactEnquiry,
  getContactEnquiry,
  listContactEnquiries,
  updateContactEnquiry,
} from '../controllers/contactController.js'

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
  listContactEnquiries,
)

router.get(
  '/:id',
  requireAdmin,
  getContactEnquiry,
)

router.patch(
  '/:id',
  requireAdmin,
  requireTrustedOrigin,
  updateContactEnquiry,
)

router.delete(
  '/:id',
  requireAdmin,
  requireTrustedOrigin,
  deleteContactEnquiry,
)

export default router