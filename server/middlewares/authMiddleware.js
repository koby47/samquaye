import jwt from 'jsonwebtoken'

import { AUTH_COOKIE_NAME } from '../config/authCookie.js'
import { env } from '../config/env.js'
import Admin from '../models/Admin.js'

export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies[AUTH_COOKIE_NAME]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

    let decoded

    try {
      decoded = jwt.verify(
        token,
        env.jwtSecret,
        {
          algorithms: ['HS256'],
          issuer: 'portfolio-api',
          audience: 'portfolio-admin',
        },
      )
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication.',
      })
    }

    const admin = await Admin.findOne({
      _id: decoded.sub,
      isActive: true,
    })

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

    if (
      admin.passwordChangedAt &&
      decoded.iat * 1000 <
        admin.passwordChangedAt.getTime()
    ) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

    req.admin = admin

    next()
  } catch (error) {
    next(error)
  }
}