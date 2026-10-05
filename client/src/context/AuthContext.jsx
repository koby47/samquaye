import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({
  children,
}) {
  const [admin, setAdmin] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const checkSession =
    useCallback(async () => {
      try {
        const response =
          await getCurrentAdmin()

        const adminData =
          response?.admin ??
          response?.data?.admin ??
          response?.data ??
          null

        setAdmin(adminData)

        return adminData
      } catch {
        setAdmin(null)

        return null
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login =
    useCallback(
      async (credentials) => {
        const response =
          await loginAdmin(
            credentials,
          )

        const adminData =
          response?.admin ??
          response?.data?.admin ??
          response?.data ??
          null

        /*
         * Some APIs do not return the
         * complete admin object after
         * login. In that case, verify
         * the new cookie session using
         * /auth/me.
         */
        if (!adminData) {
          return checkSession()
        }

        setAdmin(adminData)

        return adminData
      },
      [checkSession],
    )

  const logout =
    useCallback(async () => {
      try {
        await logoutAdmin()
      } finally {
        setAdmin(null)
      }
    }, [])

  const value = useMemo(
    () => ({
      admin,
      loading,
      isAuthenticated:
        Boolean(admin),
      login,
      logout,
      checkSession,
    }),
    [
      admin,
      loading,
      login,
      logout,
      checkSession,
    ],
  )

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }