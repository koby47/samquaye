import { apiRequest } from './api.js'

/* -------------------------------------------------- */
/* PUBLIC                                              */
/* -------------------------------------------------- */

export function getProjects({
  featured,
  category,
} = {}) {
  const params =
    new URLSearchParams()

  if (
    typeof featured === 'boolean'
  ) {
    params.set(
      'featured',
      String(featured),
    )
  }

  if (category) {
    params.set(
      'category',
      category,
    )
  }

  const query = params.toString()

  return apiRequest(
    `/projects${
      query ? `?${query}` : ''
    }`,
  )
}

export function getProjectBySlug(
  slug,
) {
  return apiRequest(
    `/projects/${encodeURIComponent(
      slug,
    )}`,
  )
}

/* -------------------------------------------------- */
/* ADMIN                                               */
/* -------------------------------------------------- */

export function getAdminProjects() {
  return apiRequest(
    '/admin/projects',
  )
}

export function getAdminProject(
  projectId,
) {
  return apiRequest(
    `/admin/projects/${encodeURIComponent(
      projectId,
    )}`,
  )
}

export function createAdminProject(
  data,
) {
  return apiRequest(
    '/admin/projects',
    {
      method: 'POST',
      body: data,
    },
  )
}

export function updateAdminProject(
  projectId,
  data,
) {
  return apiRequest(
    `/admin/projects/${encodeURIComponent(
      projectId,
    )}`,
    {
      method: 'PATCH',
      body: data,
    },
  )
}

export function deleteAdminProject(
  projectId,
) {
  return apiRequest(
    `/admin/projects/${encodeURIComponent(
      projectId,
    )}`,
    {
      method: 'DELETE',
    },
  )
}