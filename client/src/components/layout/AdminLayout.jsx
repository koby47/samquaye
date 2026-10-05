import {
  useState,
} from 'react'

import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom'

import ThemeToggle from '../ui/ThemeToggle.jsx'

import {
  useAuth,
} from '../../hooks/useAuth.js'

const navigationItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    end: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="14"
          y="14"
          width="7"
          height="7"
          rx="1"
        />
      </svg>
    ),
  },
  {
    label: 'Projects',
    to: '/admin/projects',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M4 5h16v14H4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    to: '/admin/categories',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M4 6h6v6H4z" />
        <path d="M14 6h6v6h-6z" />
        <path d="M4 16h6v4H4z" />
        <path d="M14 16h6v4h-6z" />
      </svg>
    ),
  },
  {
    label: 'Media',
    to: '/admin/media',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
        />
        <circle
          cx="9"
          cy="10"
          r="2"
        />
        <path d="m21 15-5-5L5 20" />
      </svg>
    ),
  },
  {
    label: 'Enquiries',
    to: '/admin/enquiries',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M4 5h16v14H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    to: '/admin/settings',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="3"
        />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </svg>
    ),
  },
  {
    label: 'Audit Logs',
    to: '/admin/audit',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M5 4h14v16H5z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    ),
  },
]

function AdminLayout() {
  const {
    admin,
    logout,
  } = useAuth()

  const navigate =
    useNavigate()

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false)

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false)

  async function handleLogout() {
    if (loggingOut) {
      return
    }

    try {
      setLoggingOut(true)

      await logout()

      navigate(
        '/admin/login',
        {
          replace: true,
        },
      )
    } catch (error) {
      console.error(
        'Unable to sign out:',
        error,
      )
    } finally {
      setLoggingOut(false)
    }
  }

  const adminName =
    admin?.name ||
    admin?.fullName ||
    'Administrator'

  const adminEmail =
    admin?.email || ''

  const initials = adminName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join('')

  function closeSidebar() {
    setSidebarOpen(false)
  }

  const sidebarContent = (
    <>
      {/* Brand */}
      <div
        className="
          flex min-h-20
          items-center
          border-b
          border-slate-200
          px-6
          dark:border-slate-800
        "
      >
        <Link
          to="/admin"
          onClick={closeSidebar}
          className="
            min-w-0
          "
        >
          <p
            className="
              truncate
              text-base
              font-bold
              text-slate-950
              dark:text-white
            "
          >
            Samuel Mensah Quaye
          </p>

          <p
            className="
              mt-0.5
              text-xs
              font-medium
              uppercase
              tracking-[0.16em]
              text-cyan-600
              dark:text-cyan-400
            "
          >
            Administration
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <div
        className="
          flex-1
          overflow-y-auto
          px-3
          py-5
        "
      >
        <p
          className="
            mb-3
            px-3
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-slate-400
            dark:text-slate-500
          "
        >
          Management
        </p>

        <nav
          className="space-y-1"
          aria-label="Admin navigation"
        >
          {navigationItems.map(
            (item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={
                  closeSidebar
                }
                className={({
                  isActive,
                }) =>
                  `
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3 py-2.5
                    text-sm
                    font-medium
                    transition
                    ${
                      isActive
                        ? `
                          bg-cyan-50
                          text-cyan-700
                          dark:bg-cyan-950/40
                          dark:text-cyan-400
                        `
                        : `
                          text-slate-600
                          hover:bg-slate-100
                          hover:text-slate-950
                          dark:text-slate-400
                          dark:hover:bg-slate-800
                          dark:hover:text-white
                        `
                    }
                  `
                }
              >
                <span
                  className="
                    h-5 w-5
                    shrink-0
                  "
                >
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>
              </NavLink>
            ),
          )}
        </nav>
      </div>

      {/* Sidebar footer */}
      <div
        className="
          border-t
          border-slate-200
          p-4
          dark:border-slate-800
        "
      >
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="
            flex
            items-center
            justify-between
            rounded-xl
            px-3 py-2.5
            text-sm
            font-medium
            text-slate-600
            transition
            hover:bg-slate-100
            hover:text-slate-950
            dark:text-slate-400
            dark:hover:bg-slate-800
            dark:hover:text-white
          "
        >
          <span>
            View portfolio
          </span>

          <span aria-hidden="true">
            ↗
          </span>
        </Link>
      </div>
    </>
  )

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-950
        dark:bg-slate-950
        dark:text-white
      "
    >
      {/* Desktop sidebar */}
      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          w-72
          flex-col
          border-r
          border-slate-200
          bg-white
          lg:flex
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        {sidebarContent}
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={closeSidebar}
          className="
            fixed inset-0
            z-40
            bg-slate-950/50
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-72
          flex-col
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-200
          lg:hidden
          dark:border-slate-800
          dark:bg-slate-900
          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        <div
          className="
            absolute
            right-3 top-5
          "
        >
          <button
            type="button"
            onClick={closeSidebar}
            className="
              flex h-10 w-10
              items-center
              justify-center
              rounded-lg
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-950
              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
            aria-label="Close navigation"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        {sidebarContent}
      </aside>

      {/* Main admin area */}
      <div className="lg:pl-72">
        {/* Topbar */}
        <header
          className="
            sticky top-0
            z-30
            flex
            min-h-20
            items-center
            border-b
            border-slate-200
            bg-white/95
            px-4
            backdrop-blur
            sm:px-6
            lg:px-8
            dark:border-slate-800
            dark:bg-slate-950/95
          "
        >
          <div
            className="
              flex
              w-full
              items-center
              justify-between
              gap-4
            "
          >
            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >
              {/* Mobile menu */}
              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(
                    true,
                  )
                }
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  text-slate-700
                  transition
                  hover:bg-slate-100
                  lg:hidden
                  dark:border-slate-700
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                "
                aria-label="Open admin navigation"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
              </button>

              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-slate-950
                    dark:text-white
                  "
                >
                  Portfolio Admin
                </p>

                <p
                  className="
                    hidden
                    text-xs
                    text-slate-500
                    sm:block
                    dark:text-slate-400
                  "
                >
                  Manage your portfolio
                  content
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <ThemeToggle />

              <div
                className="
                  hidden
                  h-8
                  w-px
                  bg-slate-200
                  sm:block
                  dark:bg-slate-800
                "
              />

              {/* Admin identity */}
              <div
                className="
                  hidden
                  items-center
                  gap-3
                  sm:flex
                "
              >
                <div
                  className="
                    flex h-9 w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-cyan-100
                    text-xs
                    font-bold
                    text-cyan-700
                    dark:bg-cyan-950
                    dark:text-cyan-400
                  "
                >
                  {initials || 'A'}
                </div>

                <div
                  className="
                    hidden
                    max-w-40
                    lg:block
                  "
                >
                  <p
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-slate-950
                      dark:text-white
                    "
                  >
                    {adminName}
                  </p>

                  {adminEmail && (
                    <p
                      className="
                        truncate
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {adminEmail}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                disabled={
                  loggingOut
                }
                className="
                  inline-flex
                  min-h-10
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:border-red-300
                  hover:bg-red-50
                  hover:text-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-slate-300
                  dark:hover:border-red-900
                  dark:hover:bg-red-950/30
                  dark:hover:text-red-400
                "
              >
                {loggingOut
                  ? 'Signing out...'
                  : 'Sign out'}
              </button>
            </div>
          </div>
        </header>

        {/* Routed admin page */}
        <main
          className="
            min-h-[calc(100vh-5rem)]
            px-4
            py-8
            sm:px-6
            lg:px-8
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout