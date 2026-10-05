import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import Button from '../../components/ui/Button.jsx'

import {
  getProjectBySlug,
} from '../../services/projectService.js'

function extractProject(response) {
  if (response?.project) {
    return response.project
  }

  if (response?.data?.project) {
    return response.data.project
  }

  if (
    response?.data &&
    !Array.isArray(response.data)
  ) {
    return response.data
  }

  if (
    response &&
    typeof response === 'object'
  ) {
    return response
  }

  return null
}

function ProjectDetailPage() {
  const { slug } = useParams()

  const [project, setProject] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let active = true

    async function loadProject() {
      try {
        setLoading(true)
        setError('')

        const response =
          await getProjectBySlug(slug)

        if (!active) {
          return
        }

        const projectData =
          extractProject(response)

        if (!projectData) {
          setError(
            'Project information could not be found.',
          )

          return
        }

        setProject(projectData)
      } catch (requestError) {
        if (!active) {
          return
        }

        console.error(
          'Unable to load project:',
          requestError,
        )

        if (
          requestError?.status === 404
        ) {
          setError(
            'This project could not be found.',
          )
        } else {
          setError(
            'The project could not be loaded. Please try again.',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProject()

    return () => {
      active = false
    }
  }, [slug])

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-50
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
          "
        >
          <div
            className="
              h-4 w-32
              animate-pulse
              rounded
              bg-slate-200
              dark:bg-slate-800
            "
          />

          <div
            className="
              mt-8
              h-14
              max-w-3xl
              animate-pulse
              rounded-xl
              bg-slate-200
              dark:bg-slate-800
            "
          />

          <div
            className="
              mt-5
              h-6
              max-w-2xl
              animate-pulse
              rounded
              bg-slate-200
              dark:bg-slate-800
            "
          />

          <div
            className="
              mt-12
              aspect-16/8
              w-full
              animate-pulse
              rounded-3xl
              bg-slate-200
              dark:bg-slate-800
            "
          />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div
        className="
          flex min-h-[70vh]
          items-center
          bg-slate-50
          px-6
          dark:bg-slate-950
        "
      >
        <div
          className="
            mx-auto
            max-w-xl
            text-center
          "
        >
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
            Project
          </p>

          <h1
            className="
              mt-4
              text-3xl
              font-bold
              text-slate-950
              dark:text-white
            "
          >
            Project unavailable
          </h1>

          <p
            className="
              mt-4
              text-slate-600
              dark:text-slate-400
            "
          >
            {error}
          </p>

          <Button
            to="/projects"
            className="mt-8"
          >
            Back to projects
          </Button>
        </div>
      </div>
    )
  }

  const technologies =
    Array.isArray(
      project.technologies,
    )
      ? project.technologies
      : []

  const features =
    Array.isArray(project.features)
      ? project.features
      : []

  const gallery =
    Array.isArray(project.gallery)
      ? project.gallery.filter(
          (image) =>
            image?.publicUrl,
        )
      : []

  const coverImage =
    project.coverImage?.publicUrl
      ? project.coverImage
      : null

  const liveUrl =
    project.liveUrl ||
    project.demoUrl ||
    ''

  const repositoryUrl =
    project.repositoryUrl ||
    project.githubUrl ||
    ''

  const description =
    project.description ||
    project.summary ||
    ''

  return (
    <article
      className="
        min-h-screen
        bg-slate-50
        text-slate-950
        transition-colors
        dark:bg-slate-950
        dark:text-white
      "
    >
      {/* Hero */}
      <header
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
            py-16
            lg:px-8
            lg:py-20
          "
        >
          <Link
            to="/projects"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-600
              transition
              hover:text-cyan-600
              dark:text-slate-400
              dark:hover:text-cyan-400
            "
          >
            <span aria-hidden="true">
              ←
            </span>

            All projects
          </Link>

          <div
            className="
              mt-10
              grid
              gap-10
              lg:grid-cols-[1fr_auto]
              lg:items-end
            "
          >
            <div className="max-w-4xl">
              {project.category?.name && (
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
                  {
                    project.category
                      .name
                  }
                </p>
              )}

              <h1
                className="
                  mt-4
                  text-4xl
                  font-bold
                  tracking-tight
                  text-slate-950
                  sm:text-5xl
                  lg:text-6xl
                  dark:text-white
                "
              >
                {project.title}
              </h1>

              {project.summary && (
                <p
                  className="
                    mt-6
                    max-w-3xl
                    text-lg
                    leading-8
                    text-slate-600
                    sm:text-xl
                    dark:text-slate-400
                  "
                >
                  {project.summary}
                </p>
              )}
            </div>

            {(liveUrl ||
              repositoryUrl) && (
              <div
                className="
                  flex
                  flex-wrap
                  gap-3
                "
              >
                {liveUrl && (
                  <Button
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View live site ↗
                  </Button>
                )}

                {repositoryUrl && (
                  <Button
                    href={
                      repositoryUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    variant="secondary"
                  >
                    View source ↗
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Cover image */}
      {coverImage && (
        <section
          className="
            border-b
            border-slate-200
            bg-slate-100
            dark:border-slate-800
            dark:bg-slate-900/50
          "
        >
          <div
            className="
              mx-auto
              max-w-7xl
              px-6
              py-12
              lg:px-8
              lg:py-16
            "
          >
            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <img
                src={
                  coverImage.publicUrl
                }
                alt={
                  coverImage.altText ||
                  `${project.title} screenshot`
                }
                width={
                  coverImage.width ||
                  undefined
                }
                height={
                  coverImage.height ||
                  undefined
                }
                className="
                  h-auto
                  w-full
                  object-cover
                "
              />
            </div>
          </div>
        </section>
      )}

      {/* Main case study */}
      <section
        className="
          bg-white
          dark:bg-slate-950
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            gap-12
            px-6
            py-20
            lg:grid-cols-[minmax(0,1fr)_300px]
            lg:px-8
            lg:py-24
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
              Project Overview
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-bold
                tracking-tight
                text-slate-950
                dark:text-white
              "
            >
              About this project
            </h2>

            {description ? (
              <div
                className="
                  mt-6
                  whitespace-pre-line
                  text-lg
                  leading-8
                  text-slate-600
                  dark:text-slate-400
                "
              >
                {description}
              </div>
            ) : (
              <p
                className="
                  mt-6
                  text-slate-600
                  dark:text-slate-400
                "
              >
                Additional project
                information will be
                added soon.
              </p>
            )}

            {features.length > 0 && (
              <div className="mt-14">
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
                  Features
                </p>

                <h2
                  className="
                    mt-3
                    text-3xl
                    font-bold
                    tracking-tight
                    text-slate-950
                    dark:text-white
                  "
                >
                  Key functionality
                </h2>

                <div
                  className="
                    mt-7
                    grid
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  {features.map(
                    (
                      feature,
                      index,
                    ) => (
                      <div
                        key={`${feature}-${index}`}
                        className="
                          flex
                          gap-3
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-5
                          dark:border-slate-800
                          dark:bg-slate-900
                        "
                      >
                        <span
                          className="
                            mt-0.5
                            flex
                            h-6 w-6
                            shrink-0
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
                          ✓
                        </span>

                        <p
                          className="
                            text-sm
                            leading-6
                            text-slate-700
                            dark:text-slate-300
                          "
                        >
                          {feature}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Technology sidebar */}
          <aside>
            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-6
                lg:sticky
                lg:top-28
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <h2
                className="
                  font-semibold
                  text-slate-950
                  dark:text-white
                "
              >
                Technology stack
              </h2>

              {technologies.length >
              0 ? (
                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  {technologies.map(
                    (technology) => (
                      <span
                        key={
                          technology
                        }
                        className="
                          rounded-full
                          border
                          border-slate-200
                          bg-white
                          px-3
                          py-1.5
                          text-xs
                          font-medium
                          text-slate-700
                          dark:border-slate-700
                          dark:bg-slate-950
                          dark:text-slate-300
                        "
                      >
                        {technology}
                      </span>
                    ),
                  )}
                </div>
              ) : (
                <p
                  className="
                    mt-4
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Technology details
                  will be added soon.
                </p>
              )}

              {project.category?.name && (
                <div
                  className="
                    mt-7
                    border-t
                    border-slate-200
                    pt-5
                    dark:border-slate-700
                  "
                >
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Category
                  </p>

                  <p
                    className="
                      mt-2
                      text-sm
                      font-medium
                      text-slate-950
                      dark:text-white
                    "
                  >
                    {
                      project.category
                        .name
                    }
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section
          className="
            border-y
            border-slate-200
            bg-slate-50
            dark:border-slate-800
            dark:bg-slate-900/30
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
              Project Gallery
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-bold
                tracking-tight
                text-slate-950
                sm:text-4xl
                dark:text-white
              "
            >
              Inside the application
            </h2>

            <div
              className="
                mt-10
                grid
                gap-6
                md:grid-cols-2
              "
            >
              {gallery.map(
                (image, index) => (
                  <figure
                    key={
                      image._id ||
                      image.publicUrl
                    }
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
                    <img
                      src={
                        image.publicUrl
                      }
                      alt={
                        image.altText ||
                        `${project.title} screenshot ${index + 1}`
                      }
                      loading="lazy"
                      width={
                        image.width ||
                        undefined
                      }
                      height={
                        image.height ||
                        undefined
                      }
                      className="
                        h-auto
                        w-full
                      "
                    />

                    {image.altText && (
                      <figcaption
                        className="
                          border-t
                          border-slate-200
                          px-5
                          py-4
                          text-sm
                          text-slate-600
                          dark:border-slate-800
                          dark:text-slate-400
                        "
                      >
                        {image.altText}
                      </figcaption>
                    )}
                  </figure>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section
        className="
          bg-white
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
          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-slate-50
              p-8
              sm:p-12
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                flex
                flex-col
                gap-8
                lg:flex-row
                lg:items-center
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
                  More Work
                </p>

                <h2
                  className="
                    mt-3
                    text-3xl
                    font-bold
                    tracking-tight
                    text-slate-950
                    dark:text-white
                  "
                >
                  Explore more projects
                </h2>

                <p
                  className="
                    mt-4
                    max-w-xl
                    text-slate-600
                    dark:text-slate-400
                  "
                >
                  View more of my work
                  across JavaScript,
                  Python and full-stack
                  web development.
                </p>
              </div>

              <div
                className="
                  flex
                  flex-wrap
                  gap-3
                "
              >
                <Button to="/projects">
                  All projects
                </Button>

                <Button
                  to="/contact"
                  variant="secondary"
                >
                  Contact me
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}

export default ProjectDetailPage