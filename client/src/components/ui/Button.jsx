import { Link } from 'react-router-dom'

const variants = {
  primary: `
    bg-cyan-600 text-white
    hover:bg-cyan-700
    dark:bg-cyan-400
    dark:text-slate-950
    dark:hover:bg-cyan-300
  `,
  secondary: `
    border border-slate-300
    bg-white text-slate-950
    hover:bg-slate-100
    dark:border-slate-700
    dark:bg-slate-900
    dark:text-white
    dark:hover:bg-slate-800
  `,
}

const baseClasses = `
  inline-flex min-h-11
  items-center justify-center
  rounded-lg px-5 py-3
  text-sm font-semibold
  transition
  focus:outline-none
  focus:ring-2
  focus:ring-cyan-500
  focus:ring-offset-2
  dark:focus:ring-offset-slate-950
`

function Button({
  children,
  to,
  href,
  variant = 'primary',
  className = '',
  ...props
}) {
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${className}
  `

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        {...props}
      >
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button