import { Router } from 'express'

import adminCategoryRoutes from './adminCategoryRoutes.js'
import adminContactRoutes from './adminContactRoutes.js'
import adminMediaRoutes from './adminMediaRoutes.js'
import adminProjectRoutes from './adminProjectRoutes.js'
import adminSettingsRoutes from './adminSettingsRoutes.js'
import adminDashboardRoutes from './adminDashboardRoutes.js'


import authRoutes from './authRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import contactRoutes from './contactRoutes.js'
import healthRoutes from './healthRoutes.js'
import projectRoutes from './projectRoutes.js'
import settingsRoutes from './settingsRoutes.js'
import adminAuditRoutes from './adminAuditRoutes.js'

const router = Router()

/* -------------------------------------------------- */
/* SYSTEM / AUTH                                      */
/* -------------------------------------------------- */

router.use(
  '/health',
  healthRoutes,
)

router.use(
  '/auth',
  authRoutes,
)

/* -------------------------------------------------- */
/* PUBLIC                                             */
/* -------------------------------------------------- */

router.use(
  '/categories',
  categoryRoutes,
)

router.use(
  '/projects',
  projectRoutes,
)

router.use(
  '/settings',
  settingsRoutes,
)

router.use(
  '/contact',
  contactRoutes,
)

/* -------------------------------------------------- */
/* ADMIN                                              */
/* -------------------------------------------------- */

router.use(
  '/admin/categories',
  adminCategoryRoutes,
)

router.use(
  '/admin/projects',
  adminProjectRoutes,
)

router.use(
  '/admin/media',
  adminMediaRoutes,
)

router.use(
  '/admin/settings',
  adminSettingsRoutes,
)

router.use(
  '/admin/contact',
  adminContactRoutes,
)

router.use(
  '/admin/dashboard',
  adminDashboardRoutes,
)

router.use(
  '/admin/audit-logs',
  adminAuditRoutes,
)

export default router