import {
  useEffect,
  useState,
} from 'react'

import Button from '../../components/ui/Button.jsx'
import ProjectCard from '../../components/ui/ProjectCard.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'

import {
  getProjects,
} from '../../services/projectService.js'

import {
  getPublicSettings,
} from '../../services/settingsService.js'

const capabilities = [
  {
    title: 'Frontend Development',
    description:
      'React, Vite, Tailwind CSS, JavaScript, HTML5, CSS3 and Bootstrap.',
  },
  {
    title: 'Backend Development',
    description:
      'Node.js, Express, Python, Flask and REST API development.',
  },
  {
    title: 'Databases',
    description:
      'MongoDB, Mongoose, MySQL and application data modelling.',
  },
  {
    title: 'Cloud & Deployment',
    description:
      'Cloudflare, AWS, Render, Netlify, Git and GitHub workflows.',
  },
]

const developmentStacks = [
  {
    label: 'JavaScript Full Stack',
    title: 'MERN Development',
    description:
      'Building modern full-stack applications with React, Node.js, Express and MongoDB.',
    technologies: [
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'Mongoose',
      'REST APIs',
    ],
  },
  {
    label: 'Python Full Stack',
    title: 'Python & Flask Development',
    description:
      'Building server-rendered full-stack applications with Python, Flask, MySQL and Jinja2.',
    technologies: [
      'Python',
      'Flask',
      'MySQL',
      'Jinja2',
      'Bootstrap',
      'JavaScript',
    ],
  },
]

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

function extractSettings(response) {
  if (
    response?.data &&
    !Array.isArray(response.data)
  ) {
    return response.data
  }

  if (response?.settings) {
    return response.settings
  }

  return response || null
}

function HomePage() {
  const [projects, setProjects] =
    useState([])

  const [settings, setSettings] =
    useState(null)

  const [loadingProjects, setLoadingProjects] =
    useState(true)

  const [loadingSettings, setLoadingSettings] =
    useState(true)

  const [projectError, setProjectError] =
    useState('')

  useEffect(() => {
    let active = true

    async function loadHomepage() {
      const [
        settingsResult,
        projectsResult,
      ] = await Promise.allSettled([
        getPublicSettings(),
        getProjects({
          featured: true,
        }),
      ])

      if (!active) {
        return
      }

      if (
        settingsResult.status ===
        'fulfilled'
      ) {
        setSettings(
          extractSettings(
            settingsResult.value,
          ),
        )
      }

      setLoadingSettings(false)

      if (
        projectsResult.status ===
        'fulfilled'
      ) {
        setProjects(
          extractProjects(
            projectsResult.value,
          ),
        )
      } else {
        console.error(
          'Unable to load featured projects:',
          projectsResult.reason,
        )

        setProjectError(
          'Featured projects could not be loaded.',
        )
      }

      setLoadingProjects(false)
    }

    loadHomepage()

    return () => {
      active = false
    }
  }, [])

  const siteName =
    settings?.siteName ||
    'Samuel Mensah Quaye'

  const headline =
    settings?.headline ||
    'Software Developer | Full-Stack Developer'

  const shortBio =
    settings?.shortBio ||
    'I build full-stack web applications using modern JavaScript and Python technologies, from responsive interfaces and backend systems to databases, APIs and deployment.'

  const profileImage =
    settings?.profileImage || null

  const cv =
    settings?.cv || null

  const github =
    settings?.socialLinks?.github ||
    ''

  const linkedin =
    settings?.socialLinks?.linkedin ||
    ''

  return (
    <div
      className="
        bg-slate-50
        text-slate-950
        transition-colors
        duration-200
        dark:bg-slate-950
        dark:text-white
      "
    >
      {/* Hero */}
      <section
        className="
          relative
          overflow-hidden
          border-b
          border-slate-200
          bg-slate-50
          dark:border-slate-800
          dark:bg-slate-950
        "
      >
        <div
          className="
            pointer-events-none
            absolute inset-0
          "
          aria-hidden="true"
        >
          <div
            className="
              absolute
              -right-32
              -top-32
              h-96 w-96
              rounded-full
              bg-cyan-200/50
              blur-3xl
              dark:bg-cyan-500/10
            "
          />

          <div
            className="
              absolute
              -bottom-40
              -left-40
              h-96 w-96
              rounded-full
              bg-slate-300/40
              blur-3xl
              dark:bg-slate-800/40
            "
          />
        </div>

        <div
          className="
            relative
            mx-auto
            grid
            max-w-7xl
            items-center
            gap-14
            px-6
            py-20
            lg:grid-cols-[1.2fr_0.8fr]
            lg:px-8
            lg:py-28
          "
        >
          {/* Hero content */}
          <div>
            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.25em]
                text-cyan-600
                dark:text-cyan-400
              "
            >
              Full-Stack Software Developer
            </p>

            <h1
              className="
                mt-6
                max-w-4xl
                text-5xl
                font-bold
                tracking-tight
                text-slate-950
                sm:text-6xl
                lg:text-7xl
                dark:text-white
              "
            >
              Building practical,
              secure and scalable
              web applications.
            </h1>

            <p
              className="
                mt-6
                text-lg
                font-medium
                text-slate-700
                dark:text-slate-300
              "
            >
              {headline}
            </p>

            <p
              className="
                mt-5
                max-w-2xl
                text-lg
                leading-8
                text-slate-600
                dark:text-slate-400
              "
            >
              {shortBio}
            </p>

            <div
              className="
                mt-9
                flex
                flex-wrap
                gap-4
              "
            >
              <Button to="/projects">
                View my projects
              </Button>

              <Button
                to="/contact"
                variant="secondary"
              >
                Contact me
              </Button>

              {cv?.publicUrl && (
                <Button
                  href={cv.publicUrl}
                  variant="secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  View CV
                </Button>
              )}
            </div>

            {(github || linkedin) && (
              <div
                className="
                  mt-8
                  flex
                  flex-wrap
                  items-center
                  gap-5
                "
              >
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      text-sm
                      font-semibold
                      text-slate-600
                      transition
                      hover:text-cyan-600
                      dark:text-slate-400
                      dark:hover:text-cyan-400
                    "
                  >
                    GitHub ↗
                  </a>
                )}

                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      text-sm
                      font-semibold
                      text-slate-600
                      transition
                      hover:text-cyan-600
                      dark:text-slate-400
                      dark:hover:text-cyan-400
                    "
                  >
                    LinkedIn ↗
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Hero image */}
          <div
            className="
              mx-auto
              w-full
              max-w-md
              lg:mx-0
              lg:justify-self-end
            "
          >
            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-3
                shadow-xl
                shadow-slate-200/60
                dark:border-slate-800
                dark:bg-slate-900
                dark:shadow-black/20
              "
            >
              <div
                className="
                  aspect-4/5
                  overflow-hidden
                  rounded-2xl
                  bg-slate-100
                  dark:bg-slate-800
                "
              >
                {profileImage?.publicUrl ? (
                  <img
                    src={
                      profileImage.publicUrl
                    }
                    alt={
                      profileImage.altText ||
                      siteName
                    }
                    width={
                      profileImage.width ||
                      undefined
                    }
                    height={
                      profileImage.height ||
                      undefined
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
                      p-8
                      text-center
                    "
                  >
                    <div>
                      <div
                        className="
                          mx-auto
                          flex
                          h-20 w-20
                          items-center
                          justify-center
                          rounded-full
                          bg-cyan-100
                          text-2xl
                          font-bold
                          text-cyan-700
                          dark:bg-cyan-950
                          dark:text-cyan-400
                        "
                      >
                        SMQ
                      </div>

                      <p
                        className="
                          mt-5
                          font-semibold
                          text-slate-950
                          dark:text-white
                        "
                      >
                        {siteName}
                      </p>

                      <p
                        className="
                          mt-2
                          text-sm
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        Profile image
                        will appear here.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="
                  absolute
                  bottom-7
                  left-7
                  right-7
                  rounded-xl
                  border
                  border-white/60
                  bg-white/90
                  p-4
                  backdrop-blur
                  dark:border-slate-700/70
                  dark:bg-slate-950/90
                "
              >
                <p
                  className="
                    font-semibold
                    text-slate-950
                    dark:text-white
                  "
                >
                  {siteName}
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-600
                    dark:text-slate-400
                  "
                >
                  Software Developer
                </p>
              </div>
            </div>

            {loadingSettings && (
              <p
                className="
                  mt-3
                  text-center
                  text-xs
                  text-slate-500
                  dark:text-slate-500
                "
              >
                Loading portfolio
                information...
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section
        className="
          bg-white
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
          <SectionHeading
            eyebrow="Capabilities"
            title="Full-stack development across multiple technologies"
            description="I work across frontend, backend, database and deployment layers to build complete web applications."
          />

          <div
            className="
              mt-12
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {capabilities.map(
              (capability) => (
                <article
                  key={
                    capability.title
                  }
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-6
                    transition
                    hover:-translate-y-1
                    hover:border-cyan-300
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:hover:border-cyan-800
                  "
                >
                  <h3
                    className="
                      text-lg
                      font-semibold
                      text-slate-950
                      dark:text-white
                    "
                  >
                    {
                      capability.title
                    }
                  </h3>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {
                      capability.description
                    }
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Development experience */}
      <section
        className="
          border-y
          border-slate-200
          bg-slate-50
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
            eyebrow="Development Experience"
            title="JavaScript and Python full-stack development"
            description="My project experience spans modern JavaScript applications as well as Python and Flask-based full-stack development."
          />

          <div
            className="
              mt-12
              grid
              gap-6
              lg:grid-cols-2
            "
          >
            {developmentStacks.map(
              (stack) => (
                <article
                  key={stack.title}
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-7
                    sm:p-8
                    dark:border-slate-800
                    dark:bg-slate-900
                  "
                >
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-cyan-600
                      dark:text-cyan-400
                    "
                  >
                    {stack.label}
                  </p>

                  <h3
                    className="
                      mt-3
                      text-2xl
                      font-bold
                      text-slate-950
                      dark:text-white
                    "
                  >
                    {stack.title}
                  </h3>

                  <p
                    className="
                      mt-4
                      leading-7
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {
                      stack.description
                    }
                  </p>

                  <div
                    className="
                      mt-6
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {stack.technologies.map(
                      (technology) => (
                        <span
                          key={
                            technology
                          }
                          className="
                            rounded-full
                            border
                            border-slate-200
                            bg-slate-50
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
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section
        className="
          bg-white
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
          <div
            className="
              flex
              flex-col
              gap-8
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <SectionHeading
              eyebrow="Selected Work"
              title="Featured projects"
              description="Selected applications demonstrating my work across frontend, backend, databases and application architecture."
            />

            <Button
              to="/projects"
              variant="secondary"
            >
              View all projects
            </Button>
          </div>

          <div className="mt-12">
            {loadingProjects && (
              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-8
                  text-slate-600
                  dark:border-slate-800
                  dark:bg-slate-950
                  dark:text-slate-400
                "
              >
                Loading featured
                projects...
              </div>
            )}

            {!loadingProjects &&
              projectError && (
                <div
                  role="alert"
                  className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    p-6
                    text-red-700
                    dark:border-red-900
                    dark:bg-red-950/30
                    dark:text-red-300
                  "
                >
                  {projectError}
                </div>
              )}

            {!loadingProjects &&
              !projectError &&
              projects.length === 0 && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-8
                    text-slate-600
                    dark:border-slate-800
                    dark:bg-slate-950
                    dark:text-slate-400
                  "
                >
                  Featured projects
                  will appear here.
                </div>
              )}

            {!loadingProjects &&
              !projectError &&
              projects.length > 0 && (
                <div
                  className="
                    grid
                    gap-8
                    md:grid-cols-2
                    xl:grid-cols-3
                  "
                >
                  {projects.map(
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
          </div>
        </div>
      </section>

      {/* About */}
      <section
        className="
          border-y
          border-slate-200
          bg-slate-50
          dark:border-slate-800
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
            lg:grid-cols-2
            lg:px-8
            lg:py-24
          "
        >
          <SectionHeading
            eyebrow="About Me"
            title="Building software with purpose."
          />

          <div
            className="
              space-y-5
              text-lg
              leading-8
              text-slate-600
              dark:text-slate-400
            "
          >
            <p>
              My development experience
              covers both JavaScript and
              Python full-stack
              applications, including
              responsive interfaces,
              backend application logic,
              databases and API
              development.
            </p>

            <p>
              I have worked with the
              MERN ecosystem using
              React, Node.js, Express
              and MongoDB, as well as
              Python applications using
              Flask, MySQL and Jinja2.
            </p>

            <p>
              My broader technical
              interests in cybersecurity,
              cloud infrastructure and
              DevSecOps also influence
              how I approach application
              security, deployment and
              maintainability.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="
          bg-white
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
          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-slate-50
              p-8
              sm:p-12
              lg:p-16
              dark:border-slate-800
              dark:bg-slate-950
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
              Let's work together
            </p>

            <h2
              className="
                mt-4
                max-w-3xl
                text-3xl
                font-bold
                tracking-tight
                text-slate-950
                sm:text-5xl
                dark:text-white
              "
            >
              Have a project or
              opportunity you'd like
              to discuss?
            </h2>

            <p
              className="
                mt-6
                max-w-2xl
                text-lg
                leading-8
                text-slate-600
                dark:text-slate-400
              "
            >
              Get in touch to discuss
              software development
              projects, collaborations
              or professional
              opportunities.
            </p>

            <Button
              to="/contact"
              className="mt-8"
            >
              Start a conversation
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage