import { apiRequest } from './api.js'

/*
 * Public categories.
 *
 * Returns active categories only.
 */
export function getCategories() {
  return apiRequest('/categories')
}

/*
 * Admin categories.
 *
 * Returns active and inactive
 * categories.
 */
export function getAdminCategories() {
  return apiRequest(
    '/admin/categories',
  )
}

/*
 * Create category.
 */
export function createAdminCategory(
  data,
) {
  return apiRequest(
    '/admin/categories',
    {
      method: 'POST',
      body: data,
    },
  )
}

/*
 * Update category.
 */
export function updateAdminCategory(
  categoryId,
  data,
) {
  return apiRequest(
    `/admin/categories/${encodeURIComponent(
      categoryId,
    )}`,
    {
      method: 'PATCH',
      body: data,
    },
  )
}

/*
 * Delete category.
 *
 * Backend rejects deletion with
 * 409 when projects reference it.
 */
export function deleteAdminCategory(
  categoryId,
) {
  return apiRequest(
    `/admin/categories/${encodeURIComponent(
      categoryId,
    )}`,
    {
      method: 'DELETE',
    },
  )
}