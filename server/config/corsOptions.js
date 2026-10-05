import { env } from './env.js'

export const corsOptions = {
  origin(origin, callback) {
    // Allow requests that do not have a browser Origin header,
    // such as curl, server-to-server requests, and some API tools.
    if (!origin) {
      return callback(null, true)
    }

    // Allow only explicitly configured browser origins.
    if (env.clientUrls.includes(origin)) {
      return callback(null, true)
    }

    const error = new Error('Origin not allowed by CORS')
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