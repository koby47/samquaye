import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  clearAuthCookieOptions,
} from '../config/authCookie.js'
import {
  authenticateAdmin,
  createAuthToken,
} from '../services/authService.js'
import { createAuditLog } from '../services/auditService.js'
import { loginSchema } from '../validators/authValidator.js'

export async function login(req, res, next) {
  try {
    const validation = loginSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid login data.',
      })
    }

    const { email, password } = validation.data

    const admin = await authenticateAdmin(
      email,
      password,
    )

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    const token = createAuthToken(admin)

    res.cookie(
      AUTH_COOKIE_NAME,
      token,
      authCookieOptions,
    )

    admin.lastLoginAt = new Date()
    await admin.save()

    await createAuditLog({
      actor: admin._id,
      action: 'admin.login',
      resourceType: 'Admin',
      resourceId: admin._id,
    })

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

export function getCurrentAdmin(req, res) {
  return res.status(200).json({
    success: true,
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  })
}

export async function logout(req, res, next) {
  try {
    await createAuditLog({
      actor: req.admin._id,
      action: 'admin.logout',
      resourceType: 'Admin',
      resourceId: req.admin._id,
    })

    res.clearCookie(
      AUTH_COOKIE_NAME,
      clearAuthCookieOptions,
    )

    return res.status(200).json({
      success: true,
      message: 'Logout successful.',
    })
  } catch (error) {
    next(error)
  }
}