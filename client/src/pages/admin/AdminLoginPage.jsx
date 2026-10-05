import {
  useEffect,
  useState,
} from 'react'

import {
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import ThemeToggle from '../../components/ui/ThemeToggle.jsx'

import {
  useAuth,
} from '../../hooks/useAuth.js'

function AdminLoginPage() {
  const {
    isAuthenticated,
    loading,
    login,
  } = useAuth()

  const navigate =
    useNavigate()

  const location =
    useLocation()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)

  const [error, setError] =
    useState('')

  useEffect(() => {
    setError('')
  }, [email, password])

  if (loading) {
    return (
      <div
        className="
          flex min-h-screen
          items-center
          justify-center
          bg-slate-50
          dark:bg-slate-950
        "
      >
        <p
          className="
            text-sm
            text-slate-600
            dark:text-slate-400
          "
        >
          Checking session...
        </p>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    )
  }

  async function handleSubmit(
    event,
  ) {
    event.preventDefault()

    if (
      !email.trim() ||
      !password
    ) {
      setError(
        'Email and password are required.',
      )

      return
    }

    try {
      setSubmitting(true)
      setError('')

      await login({
        email: email.trim(),
        password,
      })

      const destination =
        location.state?.from
          ?.pathname ||
        '/admin'

      navigate(
        destination,
        {
          replace: true,
        },
      )
    } catch (requestError) {
      setError(
        requestError.message ||
          'Unable to sign in.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main
      className="
        min-h-screen
        bg-slate-50
        px-6 py-10
        text-slate-950
        dark:bg-slate-950
        dark:text-white
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-6xl
          justify-end
        "
      >
        <ThemeToggle />
      </div>

      <div
        className="
          mx-auto
          flex
          min-h-[75vh]
          max-w-md
          items-center
        "
      >
        <div className="w-full">
          <div className="mb-8">
            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.2em]
                text-cyan-600
                dark:text-cyan-400
              "
            >
              Portfolio Administration
            </p>

            <h1
              className="
                mt-3
                text-3xl
                font-bold
                tracking-tight
                text-slate-950
                dark:text-white
              "
            >
              Admin sign in
            </h1>

            <p
              className="
                mt-3
                text-slate-600
                dark:text-slate-400
              "
            >
              Sign in to manage
              projects, media and
              portfolio settings.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              sm:p-8
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            {error && (
              <div
                role="alert"
                className="
                  mb-6
                  rounded-lg
                  border
                  border-red-200
                  bg-red-50
                  px-4 py-3
                  text-sm
                  text-red-700
                  dark:border-red-900
                  dark:bg-red-950/30
                  dark:text-red-300
                "
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="
                  block
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                disabled={submitting}
                className="
                  mt-2
                  block
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-4 py-3
                  text-slate-950
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-cyan-500
                  focus:ring-2
                  focus:ring-cyan-500/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
                placeholder="admin@example.com"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="password"
                className="
                  block
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                disabled={submitting}
                className="
                  mt-2
                  block
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-4 py-3
                  text-slate-950
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-cyan-500
                  focus:ring-2
                  focus:ring-cyan-500/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="
                mt-7
                inline-flex
                min-h-12
                w-full
                items-center
                justify-center
                rounded-lg
                bg-cyan-600
                px-5 py-3
                font-semibold
                text-white
                transition
                hover:bg-cyan-700
                focus:outline-none
                focus:ring-2
                focus:ring-cyan-500
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60
                dark:bg-cyan-400
                dark:text-slate-950
                dark:hover:bg-cyan-300
                dark:focus:ring-offset-slate-900
              "
            >
              {submitting
                ? 'Signing in...'
                : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default AdminLoginPage