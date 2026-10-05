import { env } from '../config/env.js'

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)

    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export async function apiRequest(
  endpoint,
  {
    method = 'GET',
    body,
    headers = {},
    signal,
  } = {},
) {
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  let response

  try {
    response = await fetch(
      `${env.apiBaseUrl}${endpoint}`,
      {
        method,
        credentials: 'include',
        headers: requestHeaders,
        body:
          body !== undefined
            ? JSON.stringify(body)
            : undefined,
        signal,
      },
    )
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    throw new ApiError(
      'Unable to connect to the server.',
      0,
    )
  }

  const contentType =
    response.headers.get('content-type') || ''

  let data = null

  if (
    contentType.includes('application/json')
  ) {
    data = await response.json()
  } else if (response.status !== 204) {
    const text = await response.text()

    data = text || null
  }

  if (!response.ok) {
    const message =
      data &&
      typeof data === 'object' &&
      data.message
        ? data.message
        : `Request failed with status ${response.status}.`

    throw new ApiError(
      message,
      response.status,
      data,
    )
  }

  return data
}