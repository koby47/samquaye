import { Router } from 'express'

import {
  submitContactEnquiry,
} from '../controllers/contactController.js'

import {
  contactLimiter,
} from '../middlewares/rateLimitMiddleware.js'

const router = Router()

router.post(
  '/',
  contactLimiter,
  submitContactEnquiry,
)

export default router