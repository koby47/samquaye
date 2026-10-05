import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import {
  useAuth,
} from '../../hooks/useAuth.js'

function ProtectedRoute() {
  const {
    isAuthenticated,
    loading,
  } = useAuth()

  const location = useLocation()

  if (loading) {
    return (
      <div
        className="
          flex min-h-screen
          items-center
          justify-center
          bg-slate-50
          px-6
          dark:bg-slate-950
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              h-8 w-8
              animate-spin
              rounded-full
              border-2
              border-slate-300
              border-t-cyan-600
              dark:border-slate-700
              dark:border-t-cyan-400
            "
          />

          <p
            className="
              mt-4
              text-sm
              text-slate-600
              dark:text-slate-400
            "
          >
            Checking session...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location,
        }}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute