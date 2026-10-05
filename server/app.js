import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import { corsOptions } from './config/corsOptions.js'
import { env } from './config/env.js'

import { errorHandler } from './middlewares/errorMiddleware.js'
import { notFound } from './middlewares/notFoundMiddleware.js'
import { apiLimiter } from './middlewares/rateLimitMiddleware.js'

import apiRoutes from './routes/index.js'

const app = express()

// --------------------------------------------------
// TRUST PROXY
// --------------------------------------------------
// Render runs the application behind a reverse proxy.
// Trust the first proxy hop in production so Express
// and express-rate-limit can correctly determine the
// original client's IP address.
if (env.isProduction) {
  app.set('trust proxy', 1)
}

// --------------------------------------------------
// SECURITY HEADERS
// --------------------------------------------------
app.use(helmet())

// --------------------------------------------------
// CORS
// --------------------------------------------------
app.use(cors(corsOptions))

// --------------------------------------------------
// REQUEST PARSING
// --------------------------------------------------
app.use(
  express.json({
    limit: '100kb',
  }),
)

app.use(
  express.urlencoded({
    extended: false,
    limit: '100kb',
  }),
)

// --------------------------------------------------
// COOKIE PARSING
// --------------------------------------------------
app.use(cookieParser())

// --------------------------------------------------
// GENERAL API RATE LIMITING
// --------------------------------------------------
app.use('/api', apiLimiter)

// --------------------------------------------------
// VERSIONED API ROUTES
// --------------------------------------------------
app.use('/api/v1', apiRoutes)

// --------------------------------------------------
// 404 HANDLER
// --------------------------------------------------
app.use(notFound)

// --------------------------------------------------
// CENTRAL ERROR HANDLER
// --------------------------------------------------
app.use(errorHandler)

export default app