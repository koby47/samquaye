import { useTheme } from '../../hooks/useTheme.js'

const themes = [
  {
    value: 'light',
    label: 'Light',
  },
  {
    value: 'dark',
    label: 'Dark',
  },
  {
    value: 'system',
    label: 'System',
  },
]

function ThemeToggle() {
  const {
    theme,
    setTheme,
  } = useTheme()

  return (
    <div
      className="
        inline-flex rounded-lg
        border border-slate-200
        bg-slate-100 p-1
        dark:border-slate-700
        dark:bg-slate-900
      "
      aria-label="Theme preference"
    >
      {themes.map((option) => {
        const isActive =
          theme === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              setTheme(option.value)
            }
            className={`
              rounded-md px-3 py-2
              text-xs font-medium
              transition
              ${
                isActive
                  ? `
                    bg-white
                    text-slate-950
                    shadow-sm
                    dark:bg-slate-700
                    dark:text-white
                  `
                  : `
                    text-slate-600
                    hover:text-slate-950
                    dark:text-slate-400
                    dark:hover:text-white
                  `
              }
            `}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default ThemeToggle