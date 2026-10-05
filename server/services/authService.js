import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

import { env } from '../config/env.js'
import Admin from '../models/Admin.js'

export async function authenticateAdmin(
  email,
  password,
) {
 const normalizedEmail =
  email.trim().toLowerCase()

const admin = await Admin.findOne({
  email: normalizedEmail,
  isActive: true,
}).select('+passwordHash')

  if (!admin) {
    return null
  }

  const passwordMatches = await argon2.verify(
    admin.passwordHash,
    password,
  )

  if (!passwordMatches) {
    return null
  }

  return admin
}

export function createAuthToken(admin) {
  return jwt.sign(
    {
      sub: admin._id.toString(),
      role: admin.role,
    },
    env.jwtSecret,
    {
      algorithm: 'HS256',
      expiresIn: env.jwtExpiresIn,
      issuer: 'portfolio-api',
      audience: 'portfolio-admin',
    },
  )
}