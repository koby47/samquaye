import { apiRequest } from './api.js'

export function getPublicSettings() {
  return apiRequest('/settings')
}

export function getAdminSettings() {
  return apiRequest('/admin/settings')
}

export function updateAdminSettings(data) {
  return apiRequest('/admin/settings', {
    method: 'PATCH',
    body: data,
  })
}