import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import ProjectForm from './ProjectForm.jsx'

import {
  getAdminProject,
  updateAdminProject,
} from '../../services/projectService.js'

function AdminProjectEditPage() {
  const { id } = useParams()

  const [
    project,
    setProject,
  ] = useState(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    success,
    setSuccess,
  ] = useState('')

  const loadProject =
    useCallback(async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await getAdminProject(id)

        if (!response?.project) {
          throw new Error(
            'Project not found.',
          )
        }

        setProject(
          response.project,
        )
      } catch (requestError) {
        setError(
          requestError?.message ||
            'Unable to load project.',
        )
      } finally {
        setLoading(false)
      }
    }, [id])

  useEffect(() => {
    loadProject()
  }, [loadProject])

  async function handleSubmit(
    data,
  ) {
    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const response =
        await updateAdminProject(
          id,
          data,
        )

      if (response?.project) {
        setProject(
          response.project,
        )
      }

      setSuccess(
        response?.message ||
          'Project updated successfully.',
      )

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to update project.',
      )

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div
          className="
            h-10 w-64
            animate-pulse
            rounded-lg
            bg-slate-200
            dark:bg-slate-800
          "
        />

        <div
          className="
            h-96
            animate-pulse
            rounded-2xl
            bg-slate-200
            dark:bg-slate-900
          "
        />
      </div>
    )
  }

  if (!project) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-6
          dark:border-red-900
          dark:bg-red-950/30
        "
      >
        <h1
          className="
            text-xl
            font-semibold
          "
        >
          Unable to load project
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-red-700
            dark:text-red-300
          "
        >
          {error ||
            'Project not found.'}
        </p>

        <Link
          to="/admin/projects"
          className="
            mt-5
            inline-flex
            text-sm
            font-semibold
            text-cyan-600
            dark:text-cyan-400
          "
        >
          ← Back to projects
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-start
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
            Projects
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
            "
          >
            Edit project
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-600
              dark:text-slate-400
            "
          >
            {project.title}
          </p>
        </div>

        {project.status ===
          'published' && (
          <Link
            to={`/projects/${project.slug}`}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex
              min-h-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-300
              px-4
              text-sm
              font-semibold
              transition
              hover:bg-slate-50
              dark:border-slate-700
              dark:hover:bg-slate-800
            "
          >
            View live project ↗
          </Link>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="
            mt-6
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
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

      {success && (
        <div
          role="status"
          className="
            mt-6
            rounded-xl
            border
            border-emerald-200
            bg-emerald-50
            p-4
            text-sm
            text-emerald-700
            dark:border-emerald-900
            dark:bg-emerald-950/30
            dark:text-emerald-300
          "
        >
          {success}
        </div>
      )}

      <ProjectForm
        initialProject={project}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Save changes"
      />
    </div>
  )
}

export default AdminProjectEditPage