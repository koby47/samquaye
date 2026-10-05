import { Router } from 'express'

import {
  getPublicPortfolioSettings,
} from '../controllers/settingsController.js'

const router = Router()

router.get(
  '/',
  getPublicPortfolioSettings,
)

export default router