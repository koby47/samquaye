import {
  getAuditLogById,
  getAuditLogs,
} from '../services/auditService.js'

import {
  mongoIdSchema,
} from '../validators/commonValidator.js'

/* -------------------------------------------------- */
/* ADMIN: LIST AUDIT LOGS                             */
/* -------------------------------------------------- */

export async function listAuditLogs(
  req,
  res,
  next,
) {
  try {
    const filters = {}

    if (req.query.action) {
      filters.action =
        req.query.action.trim()
    }

    if (req.query.resourceType) {
      filters.resourceType =
        req.query.resourceType.trim()
    }

    if (req.query.actor) {
      const actorValidation =
        mongoIdSchema.safeParse(
          req.query.actor,
        )

      if (!actorValidation.success) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid audit actor identifier.',
        })
      }

      filters.actor =
        actorValidation.data
    }

    if (req.query.limit !== undefined) {
      const limit =
        Number(req.query.limit)

      if (
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Audit log limit must be an integer between 1 and 100.',
        })
      }

      filters.limit = limit
    }

    const auditLogs =
      await getAuditLogs(filters)

    return res.status(200).json({
      success: true,
      auditLogs,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: GET AUDIT LOG                               */
/* -------------------------------------------------- */

export async function getAuditLog(
  req,
  res,
  next,
) {
  try {
    const idValidation =
      mongoIdSchema.safeParse(
        req.params.id,
      )

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid audit log identifier.',
      })
    }

    const auditLog =
      await getAuditLogById(
        idValidation.data,
      )

    return res.status(200).json({
      success: true,
      auditLog,
    })
  } catch (error) {
    next(error)
  }
}