import AuditLog from '../models/AuditLog.js'

export async function createAuditLog({
  actor,
  action,
  resourceType,
  resourceId = null,
  metadata = {},
}) {
  try {
    return await AuditLog.create({
      actor,
      action,
      resourceType,
      resourceId,
      metadata,
    })
  } catch (error) {
    console.error(
      `Audit log creation failed for ${action}:`,
      error,
    )

    return null
  }
}

/* -------------------------------------------------- */
/* GET AUDIT LOGS                                     */
/* -------------------------------------------------- */

export async function getAuditLogs({
  action,
  resourceType,
  actor,
  limit = 50,
} = {}) {
  const query = {}

  if (action) {
    query.action = action
  }

  if (resourceType) {
    query.resourceType = resourceType
  }

  if (actor) {
    query.actor = actor
  }

  return AuditLog.find(query)
    .populate(
      'actor',
      'name email',
    )
    .sort({
      createdAt: -1,
    })
    .limit(limit)
    .lean()
}

/* -------------------------------------------------- */
/* GET AUDIT LOG BY ID                                */
/* -------------------------------------------------- */

export async function getAuditLogById(
  auditLogId,
) {
  const auditLog =
    await AuditLog.findById(
      auditLogId,
    )
      .populate(
        'actor',
        'name email',
      )
      .lean()

  if (!auditLog) {
    const error = new Error(
      'Audit log not found.',
    )

    error.status = 404

    throw error
  }

  return auditLog
}