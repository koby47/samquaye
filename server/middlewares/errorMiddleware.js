import { env } from '../config/env.js'

export function errorHandler(
  err,
  req,
  res,
  next,
) {
  console.error(err)

  if (err?.code === 11000) {
    return res.status(409).json({
      success: false,
      message:
        'A resource with those unique values already exists.',
    })
  }

  const statusCode =
    Number.isInteger(err.status) &&
    err.status >= 400 &&
    err.status < 600
      ? err.status
      : 500

  const isProduction =
    env.nodeEnv === 'production'

  return res.status(statusCode).json({
    success: false,
    message:
      isProduction && statusCode === 500
        ? 'Internal server error'
        : err.message ||
          'Internal server error',
  })
}