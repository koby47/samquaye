import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Link,
} from 'react-router-dom'

import {
  deleteAdminProject,
  getAdminProjects,
  updateAdminProject,
} from '../../services/projectService.js'

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (
    Number.isNaN(date.getTime())
  ) {
    return '—'
  }

  return new Intl.DateTimeFormat(
    'en',
    {
      dateStyle: 'medium',
    },
  ).format(date)
}

function StatusBadge({
  status,
}) {
  const styles = {
    published: `
      bg-emerald-50
      text-emerald-700
      dark:bg-emerald-950/40
      dark:text-emerald-400
    `,

    draft: `
      bg-amber-50
      text-amber-700
      dark:bg-amber-950/40
      dark:text-amber-400
    `,

    archived: `
      bg-slate-100
      text-slate-600
      dark:bg-slate-800
      dark:text-slate-300
    `,
  }

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5 py-1
        text-xs
        font-semibold
        capitalize
        ${
          styles[status] ||
          styles.draft
        }
      `}
    >
      {status}
    </span>
  )
}

function AdminProjectsPage() {
  const [
    projects,
    setProjects,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('all')

  const [
    updatingId,
    setUpdatingId,
  ] = useState(null)

  const [
    deletingId,
    setDeletingId,
  ] = useState(null)

  const loadProjects =
    useCallback(async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await getAdminProjects()

        setProjects(
          Array.isArray(
            response?.projects,
          )
            ? response.projects
            : [],
        )
      } catch (requestError) {
        console.error(
          'Unable to load projects:',
          requestError,
        )

        setError(
          requestError?.message ||
            'Unable to load projects.',
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const counts = useMemo(
    () => ({
      total: projects.length,

      published:
        projects.filter(
          (project) =>
            project.status ===
            'published',
        ).length,

      draft:
        projects.filter(
          (project) =>
            project.status ===
            'draft',
        ).length,

      archived:
        projects.filter(
          (project) =>
            project.status ===
            'archived',
        ).length,
    }),
    [projects],
  )

  const filteredProjects =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase()

      return projects.filter(
        (project) => {
          const matchesStatus =
            statusFilter === 'all' ||
            project.status ===
              statusFilter

          if (!matchesStatus) {
            return false
          }

          if (!normalizedSearch) {
            return true
          }

          const searchableText = [
            project.title,
            project.slug,
            project.summary,
            project.category?.name,
            ...(project.technologies ||
              []),
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

          return searchableText.includes(
            normalizedSearch,
          )
        },
      )
    }, [
      projects,
      search,
      statusFilter,
    ])

  async function changeStatus(
    project,
    status,
  ) {
    if (
      updatingId ||
      project.status === status
    ) {
      return
    }

    try {
      setUpdatingId(project._id)
      setError('')

      const response =
        await updateAdminProject(
          project._id,
          {
            status,
          },
        )

      const updatedProject =
        response?.project

      if (updatedProject) {
        setProjects(
          (currentProjects) =>
            currentProjects.map(
              (currentProject) =>
                currentProject._id ===
                project._id
                  ? {
                      ...currentProject,
                      ...updatedProject,
                    }
                  : currentProject,
            ),
        )
      } else {
        await loadProjects()
      }
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to update project status.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function toggleFeatured(
    project,
  ) {
    if (updatingId) {
      return
    }

    try {
      setUpdatingId(project._id)
      setError('')

      const response =
        await updateAdminProject(
          project._id,
          {
            featured:
              !project.featured,
          },
        )

      const updatedProject =
        response?.project

      if (updatedProject) {
        setProjects(
          (currentProjects) =>
            currentProjects.map(
              (currentProject) =>
                currentProject._id ===
                project._id
                  ? {
                      ...currentProject,
                      ...updatedProject,
                    }
                  : currentProject,
            ),
        )
      } else {
        await loadProjects()
      }
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to update featured status.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(
    project,
  ) {
    const confirmed =
      window.confirm(
        `Permanently delete "${project.title}"?\n\nThis action cannot be undone.`,
      )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(project._id)
      setError('')

      await deleteAdminProject(
        project._id,
      )

      setProjects(
        (currentProjects) =>
          currentProjects.filter(
            (currentProject) =>
              currentProject._id !==
              project._id,
          ),
      )
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to delete project.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-end
          lg:justify-between
        "
      >
        <div>
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
            Portfolio Content
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
            "
          >
            Projects
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-slate-600
              dark:text-slate-400
            "
          >
            Create, publish and
            manage the projects
            displayed on your
            portfolio.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="
            inline-flex
            min-h-11
            items-center
            justify-center
            rounded-xl
            bg-cyan-600
            px-5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-cyan-700
            dark:bg-cyan-400
            dark:text-slate-950
            dark:hover:bg-cyan-300
          "
        >
          + New project
        </Link>
      </div>

      {/* Counts */}
      <div
        className="
          mt-8
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {[
          [
            'Total',
            counts.total,
          ],
          [
            'Published',
            counts.published,
          ],
          [
            'Draft',
            counts.draft,
          ],
          [
            'Archived',
            counts.archived,
          ],
        ].map(
          ([label, value]) => (
            <div
              key={label}
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
              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {label}
              </p>

              <p
                className="
                  mt-2
                  text-3xl
                  font-bold
                "
              >
                {value}
              </p>
            </div>
          ),
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="
            mt-6
            flex
            flex-col
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            dark:border-red-900
            dark:bg-red-950/30
          "
        >
          <p
            className="
              text-sm
              text-red-700
              dark:text-red-300
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={loadProjects}
            className="
              text-sm
              font-semibold
              text-red-700
              dark:text-red-300
            "
          >
            Reload
          </button>
        </div>
      )}

      {/* Filters */}
      <div
        className="
          mt-6
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          lg:flex-row
          lg:items-center
          lg:justify-between
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div
          className="
            w-full
            lg:max-w-md
          "
        >
          <label
            htmlFor="project-search"
            className="sr-only"
          >
            Search projects
          </label>

          <input
            id="project-search"
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search projects..."
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4 py-2.5
              text-sm
              outline-none
              transition
              focus:border-cyan-500
              focus:ring-2
              focus:ring-cyan-500/20
              dark:border-slate-700
              dark:bg-slate-950
            "
          />
        </div>

        <div
          className="
            flex
            flex-wrap
            gap-2
          "
        >
          {[
            'all',
            'published',
            'draft',
            'archived',
          ].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                setStatusFilter(
                  status,
                )
              }
              className={`
                rounded-lg
                px-3 py-2
                text-sm
                font-medium
                capitalize
                transition
                ${
                  statusFilter ===
                  status
                    ? `
                      bg-cyan-600
                      text-white
                      dark:bg-cyan-400
                      dark:text-slate-950
                    `
                    : `
                      bg-slate-100
                      text-slate-600
                      hover:bg-slate-200
                      dark:bg-slate-800
                      dark:text-slate-300
                      dark:hover:bg-slate-700
                    `
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div
          className="
            mt-6
            space-y-4
          "
        >
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <div
              key={index}
              className="
                h-32
                animate-pulse
                rounded-2xl
                border
                border-slate-200
                bg-white
                dark:border-slate-800
                dark:bg-slate-900
              "
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        filteredProjects.length ===
          0 && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-6 py-16
              text-center
              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            <h2
              className="
                text-lg
                font-semibold
              "
            >
              No projects found
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {projects.length === 0
                ? 'Create your first portfolio project.'
                : 'No projects match the current filters.'}
            </p>

            {projects.length ===
              0 && (
              <Link
                to="/admin/projects/new"
                className="
                  mt-5
                  inline-flex
                  rounded-xl
                  bg-cyan-600
                  px-5 py-2.5
                  text-sm
                  font-semibold
                  text-white
                  dark:bg-cyan-400
                  dark:text-slate-950
                "
              >
                Create project
              </Link>
            )}
          </div>
        )}

      {/* Project list */}
      {!loading &&
        filteredProjects.length >
          0 && (
          <div
            className="
              mt-6
              space-y-4
            "
          >
            {filteredProjects.map(
              (project) => {
                const busy =
                  updatingId ===
                    project._id ||
                  deletingId ===
                    project._id

                return (
                  <article
                    key={project._id}
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
                        grid
                        gap-5
                        p-5
                        md:grid-cols-[160px_minmax(0,1fr)]
                        lg:grid-cols-[180px_minmax(0,1fr)_auto]
                      "
                    >
                      {/* Image */}
                      <div
                        className="
                          aspect-video
                          overflow-hidden
                          rounded-xl
                          bg-slate-100
                          md:aspect-4/3
                          dark:bg-slate-800
                        "
                      >
                        {project
                          .coverImage
                          ?.publicUrl ? (
                          <img
                            src={
                              project
                                .coverImage
                                .publicUrl
                            }
                            alt={
                              project
                                .coverImage
                                .altText ||
                              project.title
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-full
                              items-center
                              justify-center
                              px-4
                              text-center
                              text-xs
                              text-slate-400
                            "
                          >
                            No cover image
                          </div>
                        )}
                      </div>

                      {/* Information */}
                      <div className="min-w-0">
                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >
                          <StatusBadge
                            status={
                              project.status
                            }
                          />

                          {project.featured && (
                            <span
                              className="
                                rounded-full
                                bg-violet-50
                                px-2.5 py-1
                                text-xs
                                font-semibold
                                text-violet-700
                                dark:bg-violet-950/40
                                dark:text-violet-400
                              "
                            >
                              Featured
                            </span>
                          )}
                        </div>

                        <h2
                          className="
                            mt-3
                            truncate
                            text-lg
                            font-semibold
                          "
                        >
                          {project.title}
                        </h2>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          {project
                            .category
                            ?.name ||
                            'No category'}
                        </p>

                        <p
                          className="
                            mt-3
                            line-clamp-2
                            text-sm
                            leading-6
                            text-slate-600
                            dark:text-slate-400
                          "
                        >
                          {project.summary}
                        </p>

                        <div
                          className="
                            mt-4
                            flex
                            flex-wrap
                            gap-x-5
                            gap-y-2
                            text-xs
                            text-slate-400
                            dark:text-slate-500
                          "
                        >
                          <span>
                            Updated{' '}
                            {formatDate(
                              project.updatedAt,
                            )}
                          </span>

                          <span>
                            Order:{' '}
                            {project.sortOrder}
                          </span>

                          <span>
                            /{project.slug}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        className="
                          flex
                          flex-wrap
                          items-start
                          gap-2
                          lg:w-48
                          lg:flex-col
                        "
                      >
                        <Link
                          to={`/admin/projects/${project._id}/edit`}
                          className="
                            inline-flex
                            min-h-10
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-slate-300
                            px-3
                            text-sm
                            font-semibold
                            transition
                            hover:bg-slate-50
                            lg:w-full
                            dark:border-slate-700
                            dark:hover:bg-slate-800
                          "
                        >
                          Edit
                        </Link>

                        {project.status !==
                          'published' && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              changeStatus(
                                project,
                                'published',
                              )
                            }
                            className="
                              inline-flex
                              min-h-10
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-emerald-300
                              px-3
                              text-sm
                              font-semibold
                              text-emerald-700
                              transition
                              hover:bg-emerald-50
                              disabled:opacity-50
                              lg:w-full
                              dark:border-emerald-900
                              dark:text-emerald-400
                              dark:hover:bg-emerald-950/30
                            "
                          >
                            Publish
                          </button>
                        )}

                        {project.status !==
                          'archived' && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              changeStatus(
                                project,
                                'archived',
                              )
                            }
                            className="
                              inline-flex
                              min-h-10
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-slate-300
                              px-3
                              text-sm
                              font-semibold
                              text-slate-600
                              transition
                              hover:bg-slate-50
                              disabled:opacity-50
                              lg:w-full
                              dark:border-slate-700
                              dark:text-slate-300
                              dark:hover:bg-slate-800
                            "
                          >
                            Archive
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            toggleFeatured(
                              project,
                            )
                          }
                          className="
                            inline-flex
                            min-h-10
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-slate-300
                            px-3
                            text-sm
                            font-semibold
                            text-slate-600
                            transition
                            hover:bg-slate-50
                            disabled:opacity-50
                            lg:w-full
                            dark:border-slate-700
                            dark:text-slate-300
                            dark:hover:bg-slate-800
                          "
                        >
                          {project.featured
                            ? 'Unfeature'
                            : 'Feature'}
                        </button>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            handleDelete(
                              project,
                            )
                          }
                          className="
                            inline-flex
                            min-h-10
                            items-center
                            justify-center
                            rounded-lg
                            px-3
                            text-sm
                            font-semibold
                            text-red-600
                            transition
                            hover:bg-red-50
                            disabled:opacity-50
                            lg:w-full
                            dark:text-red-400
                            dark:hover:bg-red-950/30
                          "
                        >
                          {deletingId ===
                          project._id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              },
            )}
          </div>
        )}
    </div>
  )
}

export default AdminProjectsPage