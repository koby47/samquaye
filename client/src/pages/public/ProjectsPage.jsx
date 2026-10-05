import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import ProjectCard from '../../components/ui/ProjectCard.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'

import {
  getCategories,
} from '../../services/categoryService.js'

import {
  getProjects,
} from '../../services/projectService.js'

function extractProjects(response) {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.projects)) {
    return response.projects
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (
    Array.isArray(
      response?.data?.projects,
    )
  ) {
    return response.data.projects
  }

  return []
}

function extractCategories(response) {
  if (Array.isArray(response)) {
    return response
  }

  if (
    Array.isArray(
      response?.categories,
    )
  ) {
    return response.categories
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (
    Array.isArray(
      response?.data?.categories,
    )
  ) {
    return response.data.categories
  }

  return []
}

function ProjectsPage() {
  const [projects, setProjects] =
    useState([])

  const [categories, setCategories] =
    useState([])

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('all')

  const [search, setSearch] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        setLoading(true)
        setError('')

        const [
          projectResponse,
          categoryResponse,
        ] = await Promise.all([
          getProjects(),
          getCategories(),
        ])

        if (!active) {
          return
        }

        setProjects(
          extractProjects(
            projectResponse,
          ),
        )

        setCategories(
          extractCategories(
            categoryResponse,
          ),
        )
      } catch (requestError) {
        if (!active) {
          return
        }

        console.error(
          'Unable to load projects:',
          requestError,
        )

        setError(
          'Projects could not be loaded. Please try again.',
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [])

  const filteredProjects =
    useMemo(() => {
      const searchTerm =
        search.trim().toLowerCase()

      return projects.filter(
        (project) => {
          const categoryMatches =
            selectedCategory ===
              'all' ||
            project.category?.slug ===
              selectedCategory ||
            project.category?._id ===
              selectedCategory

          if (!categoryMatches) {
            return false
          }

          if (!searchTerm) {
            return true
          }

          const searchableContent = [
            project.title,
            project.summary,
            project.category?.name,
            ...(Array.isArray(
              project.technologies,
            )
              ? project.technologies
              : []),
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

          return searchableContent.includes(
            searchTerm,
          )
        },
      )
    }, [
      projects,
      search,
      selectedCategory,
    ])

  function clearFilters() {
    setSearch('')
    setSelectedCategory('all')
  }

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-950
        transition-colors
        dark:bg-slate-950
        dark:text-white
      "
    >
      {/* Header */}
      <section
        className="
          border-b
          border-slate-200
          bg-white
          dark:border-slate-800
          dark:bg-slate-950
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-6
            py-20
            lg:px-8
            lg:py-24
          "
        >
          <SectionHeading
            eyebrow="Projects"
            title="Selected software development work"
            description="Explore applications I've built across JavaScript, Python, frontend, backend, databases and full-stack development."
          />
        </div>
      </section>

      {/* Projects */}
      <section
        className="
          bg-slate-50
          dark:bg-slate-950
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-6
            py-16
            lg:px-8
            lg:py-20
          "
        >
          {/* Search and filters */}
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                flex
                flex-col
                gap-5
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              <div
                className="
                  w-full
                  lg:max-w-sm
                "
              >
                <label
                  htmlFor="project-search"
                  className="sr-only"
                >
                  Search projects
                </label>

                <div className="relative">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      h-5 w-5
                      -translate-y-1/2
                      text-slate-400
                    "
                    aria-hidden="true"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                    />

                    <path d="m20 20-3.5-3.5" />
                  </svg>

                  <input
                    id="project-search"
                    type="search"
                    value={search}
                    onChange={(
                      event,
                    ) =>
                      setSearch(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Search projects or technologies..."
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      py-3
                      pl-11
                      pr-4
                      text-sm
                      text-slate-950
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-500/20
                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-white
                    "
                  />
                </div>
              </div>

              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                "
                aria-label="Project categories"
              >
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      'all',
                    )
                  }
                  className={`
                    rounded-full
                    border
                    px-4 py-2
                    text-sm
                    font-medium
                    transition
                    ${
                      selectedCategory ===
                      'all'
                        ? `
                          border-cyan-600
                          bg-cyan-600
                          text-white
                          dark:border-cyan-400
                          dark:bg-cyan-400
                          dark:text-slate-950
                        `
                        : `
                          border-slate-300
                          bg-white
                          text-slate-600
                          hover:border-cyan-400
                          hover:text-cyan-700
                          dark:border-slate-700
                          dark:bg-slate-950
                          dark:text-slate-300
                          dark:hover:border-cyan-700
                          dark:hover:text-cyan-400
                        `
                    }
                  `}
                >
                  All
                </button>

                {categories.map(
                  (category) => {
                    const value =
                      category.slug ||
                      category._id

                    const active =
                      selectedCategory ===
                      value

                    return (
                      <button
                        key={
                          category._id ||
                          category.slug
                        }
                        type="button"
                        onClick={() =>
                          setSelectedCategory(
                            value,
                          )
                        }
                        className={`
                          rounded-full
                          border
                          px-4 py-2
                          text-sm
                          font-medium
                          transition
                          ${
                            active
                              ? `
                                border-cyan-600
                                bg-cyan-600
                                text-white
                                dark:border-cyan-400
                                dark:bg-cyan-400
                                dark:text-slate-950
                              `
                              : `
                                border-slate-300
                                bg-white
                                text-slate-600
                                hover:border-cyan-400
                                hover:text-cyan-700
                                dark:border-slate-700
                                dark:bg-slate-950
                                dark:text-slate-300
                                dark:hover:border-cyan-700
                                dark:hover:text-cyan-400
                              `
                          }
                        `}
                      >
                        {category.name}
                      </button>
                    )
                  },
                )}
              </div>
            </div>
          </div>

          {/* Results information */}
          {!loading &&
            !error &&
            projects.length > 0 && (
              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-4
                "
              >
                <p
                  className="
                    text-sm
                    text-slate-600
                    dark:text-slate-400
                  "
                >
                  Showing{' '}
                  <span
                    className="
                      font-semibold
                      text-slate-950
                      dark:text-white
                    "
                  >
                    {
                      filteredProjects.length
                    }
                  </span>{' '}
                  {filteredProjects.length ===
                  1
                    ? 'project'
                    : 'projects'}
                </p>

                {(search ||
                  selectedCategory !==
                    'all') && (
                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="
                      text-sm
                      font-semibold
                      text-cyan-600
                      transition
                      hover:text-cyan-700
                      dark:text-cyan-400
                      dark:hover:text-cyan-300
                    "
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

          {/* Loading */}
          {loading && (
            <div
              className="
                mt-10
                grid
                gap-8
                md:grid-cols-2
                xl:grid-cols-3
              "
              aria-label="Loading projects"
            >
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    dark:border-slate-800
                    dark:bg-slate-900
                  "
                >
                  <div
                    className="
                      aspect-16/10
                      animate-pulse
                      bg-slate-200
                      dark:bg-slate-800
                    "
                  />

                  <div className="p-6">
                    <div
                      className="
                        h-3 w-28
                        animate-pulse
                        rounded
                        bg-slate-200
                        dark:bg-slate-800
                      "
                    />

                    <div
                      className="
                        mt-5
                        h-6 w-3/4
                        animate-pulse
                        rounded
                        bg-slate-200
                        dark:bg-slate-800
                      "
                    />

                    <div
                      className="
                        mt-4
                        h-4 w-full
                        animate-pulse
                        rounded
                        bg-slate-200
                        dark:bg-slate-800
                      "
                    />

                    <div
                      className="
                        mt-2
                        h-4 w-2/3
                        animate-pulse
                        rounded
                        bg-slate-200
                        dark:bg-slate-800
                      "
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div
              role="alert"
              className="
                mt-10
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-8
                text-red-700
                dark:border-red-900
                dark:bg-red-950/30
                dark:text-red-300
              "
            >
              <h2 className="font-semibold">
                Unable to load projects
              </h2>

              <p className="mt-2 text-sm">
                {error}
              </p>
            </div>
          )}

          {/* Project grid */}
          {!loading &&
            !error &&
            filteredProjects.length >
              0 && (
              <div
                className="
                  mt-10
                  grid
                  gap-8
                  md:grid-cols-2
                  xl:grid-cols-3
                "
              >
                {filteredProjects.map(
                  (project) => (
                    <ProjectCard
                      key={
                        project._id
                      }
                      project={
                        project
                      }
                    />
                  ),
                )}
              </div>
            )}

          {/* No projects in database */}
          {!loading &&
            !error &&
            projects.length === 0 && (
              <div
                className="
                  mt-10
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-10
                  text-center
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                <h2
                  className="
                    text-xl
                    font-semibold
                    text-slate-950
                    dark:text-white
                  "
                >
                  No projects available
                </h2>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-md
                    text-slate-600
                    dark:text-slate-400
                  "
                >
                  Published projects
                  will appear here once
                  they are added to the
                  portfolio.
                </p>
              </div>
            )}

          {/* No filtered results */}
          {!loading &&
            !error &&
            projects.length > 0 &&
            filteredProjects.length ===
              0 && (
              <div
                className="
                  mt-10
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-10
                  text-center
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                <h2
                  className="
                    text-xl
                    font-semibold
                    text-slate-950
                    dark:text-white
                  "
                >
                  No matching projects
                </h2>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-md
                    text-slate-600
                    dark:text-slate-400
                  "
                >
                  Try another search
                  term or choose a
                  different category.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    mt-6
                    font-semibold
                    text-cyan-600
                    transition
                    hover:text-cyan-700
                    dark:text-cyan-400
                    dark:hover:text-cyan-300
                  "
                >
                  Clear filters
                </button>
              </div>
            )}
        </div>
      </section>
    </div>
  )
}

export default ProjectsPage