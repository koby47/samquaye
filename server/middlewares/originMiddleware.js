import { env } from '../config/env.js'

export function requireTrustedOrigin(req, res, next) {
  const origin = req.get('origin')

  if (!origin || !env.clientUrls.includes(origin)) {
    return res.status(403).json({
      success: false,
      message: 'Request origin is not allowed.',
    })
  }

  next()
}