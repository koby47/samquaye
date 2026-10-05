import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'portfolio-theme'

const ThemeContext = createContext(null)

function getSystemTheme() {
  return window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches
    ? 'dark'
    : 'light'
}

function getInitialTheme() {
  const storedTheme =
    localStorage.getItem(STORAGE_KEY)

  if (
    storedTheme === 'light' ||
    storedTheme === 'dark' ||
    storedTheme === 'system'
  ) {
    return storedTheme
  }

  return 'system'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] =
    useState(getInitialTheme)

  const [systemTheme, setSystemTheme] =
    useState(getSystemTheme)

  const resolvedTheme =
    theme === 'system'
      ? systemTheme
      : theme

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    )

    function handleChange(event) {
      setSystemTheme(
        event.matches ? 'dark' : 'light',
      )
    }

    mediaQuery.addEventListener(
      'change',
      handleChange,
    )

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleChange,
      )
    }
  }, [])

  useEffect(() => {
    const root =
      document.documentElement

    root.classList.toggle(
      'dark',
      resolvedTheme === 'dark',
    )

    root.style.colorScheme =
      resolvedTheme

    localStorage.setItem(
      STORAGE_KEY,
      theme,
    )
  }, [theme, resolvedTheme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext }