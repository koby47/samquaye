import { env } from './env.js'

const localOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

export const corsOptions = {
  origin(origin, callback) {
    // Allow requests that do not have a browser Origin header,
    // such as curl, server-to-server requests, and some API tools.
    if (!origin) {
      return callback(null, true)
    }

    // Allow the local Vite development frontend by default.
    if (localOrigins.includes(origin)) {
      return callback(null, true)
    }

    // Allow deployed frontend origins configured through CLIENT_URLS.
    if (env.clientUrls.includes(origin)) {
      return callback(null, true)
    }

    const error = new Error(
      'Origin not allowed by CORS',
    )

    error.status = 403

    return callback(error)
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],
}