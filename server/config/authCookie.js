import { env } from './env.js'

export const AUTH_COOKIE_NAME = 'portfolio_auth'

const baseCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'none' : 'lax',
  path: '/',
}

export const authCookieOptions = {
  ...baseCookieOptions,
  maxAge: env.jwtCookieMaxAgeMs,
}

export const clearAuthCookieOptions = {
  ...baseCookieOptions,
}