import { Router } from 'express'

import {
  getPublicProject,
  listPublicProjects,
} from '../controllers/projectController.js'

const router = Router()

router.get('/', listPublicProjects)

router.get('/:slug', getPublicProject)

export default router