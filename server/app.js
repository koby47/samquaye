import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import { corsOptions } from './config/corsOptions.js'
import { errorHandler } from './middlewares/errorMiddleware.js'
import { notFound } from './middlewares/notFoundMiddleware.js'
import { apiLimiter } from './middlewares/rateLimitMiddleware.js'
import apiRoutes from './routes/index.js'

const app = express()

// Security headers
app.use(helmet())

// Cross-origin resource sharing
app.use(cors(corsOptions))

// Request parsing
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

// Cookie parsing
app.use(cookieParser())

// General API rate limiting
app.use('/api', apiLimiter)

// Versioned API routes
app.use('/api/v1', apiRoutes)

// Handle unmatched routes
app.use(notFound)

// Central error handling
app.use(errorHandler)

export default app