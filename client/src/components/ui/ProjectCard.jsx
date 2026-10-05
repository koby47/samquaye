import { Link } from 'react-router-dom'

function ProjectCard({ project }) {
  const coverImage =
    project.coverImage || null

  const imageUrl =
    coverImage?.publicUrl || null

  const technologies =
    Array.isArray(project.technologies)
      ? project.technologies
      : []

  return (
    <article
      className="
        group overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        transition
        hover:border-slate-300
        dark:border-slate-800
        dark:bg-slate-900/60
        dark:hover:border-slate-700
      "
    >
      <Link
        to={`/projects/${project.slug}`}
        className="block"
        aria-label={`View ${project.title}`}
      >
        <div
          className="
            aspect-16/10
            overflow-hidden
            bg-slate-100
            dark:bg-slate-900
          "
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={
                coverImage.altText ||
                `${project.title} project`
              }
              loading="lazy"
              className="
                h-full w-full
                object-cover
                transition-transform
                duration-300
                group-hover:scale-[1.03]
              "
            />
          ) : (
            <div
              className="
                flex h-full
                items-center
                justify-center
                px-6 text-center
                text-sm
                text-slate-500
              "
            >
              {project.title}
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        {project.category?.name && (
          <p
            className="
              text-xs font-semibold
              uppercase
              tracking-[0.15em]
              text-cyan-600
              dark:text-cyan-400
            "
          >
            {project.category.name}
          </p>
        )}

        <h3
          className="
            mt-3 text-xl
            font-semibold
            text-slate-950
            dark:text-white
          "
        >
          <Link
            to={`/projects/${project.slug}`}
            className="
              transition
              hover:text-cyan-600
              dark:hover:text-cyan-400
            "
          >
            {project.title}
          </Link>
        </h3>

        {project.summary && (
          <p
            className="
              mt-3 line-clamp-3
              leading-7
              text-slate-600
              dark:text-slate-400
            "
          >
            {project.summary}
          </p>
        )}

        {technologies.length > 0 && (
          <div
            className="
              mt-5 flex
              flex-wrap gap-2
            "
          >
            {technologies
              .slice(0, 5)
              .map((technology) => (
                <span
                  key={technology}
                  className="
                    rounded-full
                    border border-slate-200
                    bg-slate-50
                    px-3 py-1
                    text-xs font-medium
                    text-slate-600
                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-slate-300
                  "
                >
                  {technology}
                </span>
              ))}
          </div>
        )}

        <Link
          to={`/projects/${project.slug}`}
          className="
            mt-6 inline-flex
            items-center
            font-semibold
            text-cyan-600
            transition
            hover:text-cyan-700
            dark:text-cyan-400
            dark:hover:text-cyan-300
          "
        >
          View project
          <span
            className="ml-2"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  )
}

export default ProjectCard