import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  NavLink,
  useLocation,
} from 'react-router-dom'

import ThemeToggle from '../ui/ThemeToggle.jsx'

import {
  getPublicSettings,
} from '../../services/settingsService.js'

const navItems = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Projects',
    to: '/projects',
  },
  {
    label: 'Contact',
    to: '/contact',
  },
]

function extractSettings(response) {
  if (response?.settings) {
    return response.settings
  }

  if (
    response?.data &&
    !Array.isArray(response.data)
  ) {
    return response.data
  }

  return response || null
}

function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false)

  const [cvUrl, setCvUrl] =
    useState('')

  const location = useLocation()

  /*
   * Close the mobile menu whenever
   * the visitor changes route.
   */
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  /*
   * Load the public portfolio
   * settings so the CV link can be
   * displayed when a CV exists.
   */
  useEffect(() => {
    let active = true

    async function loadSettings() {
      try {
        const response =
          await getPublicSettings()

        if (!active) {
          return
        }

        const settings =
          extractSettings(response)

        setCvUrl(
          settings?.cv?.publicUrl ||
            '',
        )
      } catch (error) {
        /*
         * Failure to load settings
         * should not break the navbar.
         * The CV link simply remains
         * hidden.
         */
        console.error(
          'Unable to load navbar settings:',
          error,
        )
      }
    }

    loadSettings()

    return () => {
      active = false
    }
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header
      className="
        sticky top-0 z-50
        border-b border-slate-200
        bg-white/95
        backdrop-blur
        dark:border-slate-800
        dark:bg-slate-950/95
      "
    >
      <div
        className="
          mx-auto max-w-7xl
          px-6 lg:px-8
        "
      >
        <div
          className="
            flex min-h-20
            items-center
            justify-between
            gap-6
          "
        >
          {/* Brand */}
          <Link
            to="/"
            className="
              min-w-0
              text-lg font-bold
              tracking-tight
              text-slate-950
              transition
              hover:text-cyan-600
              dark:text-white
              dark:hover:text-cyan-400
            "
          >
            Samuel Mensah Quaye
          </Link>

          {/* Desktop navigation */}
          <div
            className="
              hidden items-center
              gap-7 md:flex
            "
          >
            <nav
              className="
                flex items-center
                gap-6
              "
              aria-label="Main navigation"
            >
              {navItems.map(
                (item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={
                      item.to === '/'
                    }
                    className={({
                      isActive,
                    }) =>
                      `
                        text-sm
                        font-medium
                        transition
                        ${
                          isActive
                            ? `
                              text-cyan-600
                              dark:text-cyan-400
                            `
                            : `
                              text-slate-600
                              hover:text-slate-950
                              dark:text-slate-400
                              dark:hover:text-white
                            `
                        }
                      `
                    }
                  >
                    {item.label}
                  </NavLink>
                ),
              )}

              {/* CV */}
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-sm
                    font-medium
                    text-slate-600
                    transition
                    hover:text-cyan-600
                    dark:text-slate-400
                    dark:hover:text-cyan-400
                  "
                >
                  CV

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="
                      h-3.5 w-3.5
                    "
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              )}
            </nav>

            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current,
              )
            }
            className="
              inline-flex h-11 w-11
              items-center justify-center
              rounded-lg
              border border-slate-200
              text-slate-700
              transition
              hover:bg-slate-100
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-500
              focus:ring-offset-2
              md:hidden
              dark:border-slate-700
              dark:text-slate-200
              dark:hover:bg-slate-900
              dark:focus:ring-offset-slate-950
            "
            aria-expanded={
              menuOpen
            }
            aria-controls="mobile-navigation"
            aria-label={
              menuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
          >
            {menuOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="
              border-t
              border-slate-200
              py-5
              md:hidden
              dark:border-slate-800
            "
          >
            <nav
              className="
                flex flex-col
              "
              aria-label="Mobile navigation"
            >
              {navItems.map(
                (item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={
                      item.to === '/'
                    }
                    onClick={
                      closeMenu
                    }
                    className={({
                      isActive,
                    }) =>
                      `
                        rounded-lg
                        px-3 py-3
                        text-base
                        font-medium
                        transition
                        ${
                          isActive
                            ? `
                              bg-cyan-50
                              text-cyan-700
                              dark:bg-cyan-950/30
                              dark:text-cyan-400
                            `
                            : `
                              text-slate-700
                              hover:bg-slate-100
                              dark:text-slate-300
                              dark:hover:bg-slate-900
                            `
                        }
                      `
                    }
                  >
                    {item.label}
                  </NavLink>
                ),
              )}

              {/* Mobile CV link */}
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenu}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    px-3 py-3
                    text-base
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-100
                    hover:text-cyan-600
                    dark:text-slate-300
                    dark:hover:bg-slate-900
                    dark:hover:text-cyan-400
                  "
                >
                  <span>
                    CV
                  </span>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="
                      h-4 w-4
                    "
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              )}
            </nav>

            {/* Theme */}
            <div
              className="
                mt-5
                border-t
                border-slate-200
                pt-5
                dark:border-slate-800
              "
            >
              <p
                className="
                  mb-3
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Appearance
              </p>

              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar