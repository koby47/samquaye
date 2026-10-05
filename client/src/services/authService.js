import { apiRequest } from './api.js'

export function loginAdmin(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export function getCurrentAdmin() {
  return apiRequest('/auth/me')
}

export function logoutAdmin() {
  return apiRequest('/auth/logout', {
    method: 'POST',
  })
}