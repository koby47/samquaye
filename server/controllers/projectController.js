import {
  createProject as createProjectService,
  deleteProject as deleteProjectService,
  getAllProjects,
  getProjectById,
  getPublishedProjectBySlug,
  getPublishedProjects,
  updateProject as updateProjectService,
} from '../services/projectService.js'

import { createAuditLog } from '../services/auditService.js'

import {
  createProjectSchema,
  updateProjectSchema,
} from '../validators/projectValidator.js'

import { mongoIdSchema } from '../validators/commonValidator.js'

/* -------------------------------------------------- */
/* PUBLIC: LIST PUBLISHED PROJECTS                    */
/* -------------------------------------------------- */

export async function listPublicProjects(
  req,
  res,
  next,
) {
  try {
    const filters = {}

    if (req.query.featured !== undefined) {
      if (
        req.query.featured !== 'true' &&
        req.query.featured !== 'false'
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Featured filter must be true or false.',
        })
      }

      filters.featured =
        req.query.featured === 'true'
    }

    if (req.query.category) {
      const categoryValidation =
        mongoIdSchema.safeParse(
          req.query.category,
        )

      if (!categoryValidation.success) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid category identifier.',
        })
      }

      filters.category =
        categoryValidation.data
    }

    const projects =
      await getPublishedProjects(filters)

    return res.status(200).json({
      success: true,
      projects,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* PUBLIC: GET PUBLISHED PROJECT BY SLUG              */
/* -------------------------------------------------- */

export async function getPublicProject(
  req,
  res,
  next,
) {
  try {
    const slug = req.params.slug
      ?.trim()
      .toLowerCase()

    if (
      !slug ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        slug,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project slug.',
      })
    }

    const project =
      await getPublishedProjectBySlug(slug)

    return res.status(200).json({
      success: true,
      project,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: LIST ALL PROJECTS                           */
/* -------------------------------------------------- */

export async function listAdminProjects(
  req,
  res,
  next,
) {
  try {
    const projects =
      await getAllProjects()

    return res.status(200).json({
      success: true,
      projects,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: GET PROJECT BY ID                           */
/* -------------------------------------------------- */

export async function getAdminProject(
  req,
  res,
  next,
) {
  try {
    const idValidation =
      mongoIdSchema.safeParse(req.params.id)

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid project identifier.',
      })
    }

    const project =
      await getProjectById(
        idValidation.data,
      )

    return res.status(200).json({
      success: true,
      project,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: CREATE PROJECT                              */
/* -------------------------------------------------- */

export async function createProject(
  req,
  res,
  next,
) {
  try {
    const validation =
      createProjectSchema.safeParse(
        req.body,
      )

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project data.',
      })
    }

    const project =
      await createProjectService(
        validation.data,
      )

    await createAuditLog({
      actor: req.admin._id,
      action:
        project.status === 'published'
          ? 'project.published'
          : 'project.created',
      resourceType: 'Project',
      resourceId: project._id,
      metadata: {
        title: project.title,
        slug: project.slug,
        status: project.status,
      },
    })

    return res.status(201).json({
      success: true,
      message:
        'Project created successfully.',
      project,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: UPDATE PROJECT                              */
/* -------------------------------------------------- */

export async function updateProject(
  req,
  res,
  next,
) {
  try {
    const idValidation =
      mongoIdSchema.safeParse(req.params.id)

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid project identifier.',
      })
    }

    const validation =
      updateProjectSchema.safeParse(
        req.body,
      )

    if (!validation.success) {
      console.error(
        'Project update validation failed:',
      
      )

      return res.status(400).json({
        success: false,
        message:
          'Invalid project data.',
        
      })
    }

    const existingProject =
      await getProjectById(
        idValidation.data,
      )

    const previousStatus =
      existingProject.status

    const project =
      await updateProjectService(
        idValidation.data,
        validation.data,
      )

    let action = 'project.updated'

    if (
      previousStatus !== 'published' &&
      project.status === 'published'
    ) {
      action = 'project.published'
    } else if (
      previousStatus !== 'archived' &&
      project.status === 'archived'
    ) {
      action = 'project.archived'
    }

    await createAuditLog({
      actor: req.admin._id,
      action,
      resourceType: 'Project',
      resourceId: project._id,
      metadata: {
        updatedFields:
          Object.keys(validation.data),

        previousStatus,

        currentStatus:
          project.status,
      },
    })

    return res.status(200).json({
      success: true,
      message:
        'Project updated successfully.',
      project,
    })
  } catch (error) {
    next(error)
  }
}
/* -------------------------------------------------- */
/* ADMIN: DELETE PROJECT                              */
/* -------------------------------------------------- */

export async function deleteProject(
  req,
  res,
  next,
) {
  try {
    const idValidation =
      mongoIdSchema.safeParse(req.params.id)

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid project identifier.',
      })
    }

    const project =
      await deleteProjectService(
        idValidation.data,
      )

    await createAuditLog({
      actor: req.admin._id,
      action: 'project.deleted',
      resourceType: 'Project',
      resourceId: project._id,
      metadata: {
        title: project.title,
        slug: project.slug,
        status: project.status,
      },
    })

    return res.status(200).json({
      success: true,
      message:
        'Project deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}