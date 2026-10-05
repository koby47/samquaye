function SectionHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p
          className="
            text-sm font-semibold
            uppercase
            tracking-[0.2em]
            text-cyan-600
            dark:text-cyan-400
          "
        >
          {eyebrow}
        </p>
      )}

      <h2
        className="
          mt-3 text-3xl
          font-bold tracking-tight
          text-slate-950
          sm:text-4xl
          dark:text-white
        "
      >
        {title}
      </h2>

      {description && (
        <p
          className="
            mt-5 text-lg
            leading-8
            text-slate-600
            dark:text-slate-400
          "
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeading