import {
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import ProjectForm from './ProjectForm.jsx'

import {
  createAdminProject,
} from '../../services/projectService.js'

function AdminProjectCreatePage() {
  const navigate =
    useNavigate()

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  async function handleSubmit(
    data,
  ) {
    try {
      setSubmitting(true)
      setError('')

      const response =
        await createAdminProject(
          data,
        )

      const project =
        response?.project

      if (project?._id) {
        navigate(
          `/admin/projects/${project._id}/edit`,
          {
            replace: true,
          },
        )

        return
      }

      navigate(
        '/admin/projects',
        {
          replace: true,
        },
      )
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to create project.',
      )

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
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
          Create project
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
          Add a new software
          development project to your
          portfolio.
        </p>
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

      <ProjectForm
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Create project"
      />
    </div>
  )
}

export default AdminProjectCreatePage