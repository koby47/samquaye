import { Router } from 'express'

import {
  getCurrentAdmin,
  login,
  logout,
} from '../controllers/authController.js'
import { requireAdmin } from '../middlewares/authMiddleware.js'
import { requireTrustedOrigin } from '../middlewares/originMiddleware.js'
import { authLimiter } from '../middlewares/rateLimitMiddleware.js'

const router = Router()

router.post('/login', authLimiter, login)

router.get('/me', requireAdmin, getCurrentAdmin)

router.post(
  '/logout',
  requireAdmin,
  requireTrustedOrigin,
  logout,
)

export default router