import { apiRequest } from './api.js'

export function getAdminAuditLogs({
  action,
  resourceType,
  actor,
  limit = 100,
} = {}) {
  const params = new URLSearchParams()

  if (action) {
    params.set('action', action)
  }

  if (resourceType) {
    params.set(
      'resourceType',
      resourceType,
    )
  }

  if (actor) {
    params.set('actor', actor)
  }

  if (limit) {
    params.set(
      'limit',
      String(limit),
    )
  }

  const query = params.toString()

  return apiRequest(
    `/admin/audit-logs${
      query ? `?${query}` : ''
    }`,
  )
}

export function getAdminAuditLog(
  auditLogId,
) {
  return apiRequest(
    `/admin/audit-logs/${encodeURIComponent(
      auditLogId,
    )}`,
  )
}