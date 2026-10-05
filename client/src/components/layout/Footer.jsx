import { Link } from 'react-router-dom'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="
        border-t border-slate-200
        bg-white
        dark:border-slate-800
        dark:bg-slate-950
      "
    >
      <div
        className="
          mx-auto max-w-7xl
          px-6 py-10
          lg:px-8
        "
      >
        <div
          className="
            flex flex-col gap-6
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <Link
              to="/"
              className="
                font-semibold
                text-slate-950
                dark:text-white
              "
            >
              Samuel Mensah Quaye
            </Link>

            <p
              className="
                mt-2 text-sm
                text-slate-600
                dark:text-slate-400
              "
            >
              Software Developer
            </p>
          </div>

          <nav
            className="
              flex flex-wrap gap-5
              text-sm
            "
            aria-label="Footer navigation"
          >
            <Link
              to="/projects"
              className="
                text-slate-600
                transition
                hover:text-cyan-600
                dark:text-slate-400
                dark:hover:text-cyan-400
              "
            >
              Projects
            </Link>

            <Link
              to="/contact"
              className="
                text-slate-600
                transition
                hover:text-cyan-600
                dark:text-slate-400
                dark:hover:text-cyan-400
              "
            >
              Contact
            </Link>
          </nav>
        </div>

        <div
          className="
            mt-8
            border-t border-slate-200
            pt-6
            dark:border-slate-800
          "
        >
          <p
            className="
              text-sm text-slate-500
              dark:text-slate-500
            "
          >
            © {year} Samuel Mensah Quaye.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer