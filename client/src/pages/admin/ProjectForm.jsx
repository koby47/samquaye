import {
  useEffect,
  useState,
} from 'react'

import { Link } from 'react-router-dom'

import {
  getCategories,
} from '../../services/categoryService.js'

import MediaPicker from './MediaPicker.jsx'

const EMPTY_FORM = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  problem: '',
  solution: '',
  role: '',
  technologies: [],
  features: [],
  architecture: '',
  challenges: [],
  outcomes: [],
  category: '',
  coverImage: null,
  gallery: [],
  repositoryUrl: '',
  liveUrl: '',
  featured: false,
  status: 'draft',
  sortOrder: 0,
  seo: {
    title: '',
    description: '',
  },
}

function createEmptyForm() {
  return {
    ...EMPTY_FORM,
    technologies: [],
    features: [],
    challenges: [],
    outcomes: [],
    gallery: [],
    seo: {
      ...EMPTY_FORM.seo,
    },
  }
}

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeProject(
  project,
) {
  if (!project) {
    return createEmptyForm()
  }

  return {
    title: project.title || '',
    slug: project.slug || '',
    summary: project.summary || '',
    description:
      project.description || '',
    problem: project.problem || '',
    solution: project.solution || '',
    role: project.role || '',

    technologies:
      Array.isArray(
        project.technologies,
      )
        ? [...project.technologies]
        : [],

    features:
      Array.isArray(
        project.features,
      )
        ? [...project.features]
        : [],

    architecture:
      project.architecture || '',

    challenges:
      Array.isArray(
        project.challenges,
      )
        ? [...project.challenges]
        : [],

    outcomes:
      Array.isArray(
        project.outcomes,
      )
        ? [...project.outcomes]
        : [],

    category:
      project.category?._id ||
      project.category ||
      '',

    /*
     * Keep the populated MediaAsset
     * object so the form can display
     * its publicUrl, filename, alt text,
     * dimensions, etc.
     *
     * It is converted to its MongoDB
     * ObjectId only when submitting.
     */
    coverImage:
      project.coverImage || null,

    gallery:
      Array.isArray(project.gallery)
        ? [...project.gallery]
        : [],

    repositoryUrl:
      project.repositoryUrl || '',

    liveUrl:
      project.liveUrl || '',

    featured:
      Boolean(project.featured),

    status:
      project.status || 'draft',

    sortOrder:
      project.sortOrder ?? 0,

    seo: {
      title:
        project.seo?.title || '',

      description:
        project.seo
          ?.description || '',
    },
  }
}

function TextField({
  label,
  name,
  value,
  onChange,
  required = false,
  type = 'text',
  maxLength,
  min,
  placeholder,
  helpText,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="
          block
          text-sm
          font-semibold
          text-slate-700
          dark:text-slate-200
        "
      >
        {label}

        {required && (
          <span className="text-red-500">
            {' '}*
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        min={min}
        placeholder={placeholder}
        className="
          mt-2
          w-full
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4 py-3
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

      {helpText && (
        <p
          className="
            mt-1.5
            text-xs
            text-slate-500
            dark:text-slate-400
          "
        >
          {helpText}
        </p>
      )}
    </div>
  )
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  required = false,
  maxLength,
  rows = 5,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="
          block
          text-sm
          font-semibold
          text-slate-700
          dark:text-slate-200
        "
      >
        {label}

        {required && (
          <span className="text-red-500">
            {' '}*
          </span>
        )}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        rows={rows}
        placeholder={placeholder}
        className="
          mt-2
          w-full
          resize-y
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4 py-3
          text-sm
          leading-6
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

      {maxLength && (
        <p
          className="
            mt-1
            text-right
            text-xs
            text-slate-400
          "
        >
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  )
}

function ArrayField({
  label,
  items,
  onChange,
  placeholder,
  maxItems,
}) {
  const [value, setValue] =
    useState('')

  function addItem() {
    const trimmedValue =
      value.trim()

    if (
      !trimmedValue ||
      items.length >= maxItems
    ) {
      return
    }

    onChange([
      ...items,
      trimmedValue,
    ])

    setValue('')
  }

  function handleKeyDown(
    event,
  ) {
    if (event.key === 'Enter') {
      event.preventDefault()
      addItem()
    }
  }

  function removeItem(index) {
    onChange(
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      ),
    )
  }

  return (
    <div>
      <label
        className="
          block
          text-sm
          font-semibold
          text-slate-700
          dark:text-slate-200
        "
      >
        {label}
      </label>

      <div
        className="
          mt-2
          flex
          gap-2
        "
      >
        <input
          type="text"
          value={value}
          onChange={(event) =>
            setValue(
              event.target.value,
            )
          }
          onKeyDown={
            handleKeyDown
          }
          placeholder={placeholder}
          className="
            min-w-0
            flex-1
            rounded-xl
            border
            border-slate-300
            bg-white
            px-4 py-3
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

        <button
          type="button"
          onClick={addItem}
          disabled={
            items.length >= maxItems
          }
          className="
            rounded-xl
            border
            border-slate-300
            px-4
            text-sm
            font-semibold
            transition
            hover:bg-slate-50
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:border-slate-700
            dark:hover:bg-slate-800
          "
        >
          Add
        </button>
      </div>

      {items.length > 0 && (
        <div
          className="
            mt-3
            flex
            flex-wrap
            gap-2
          "
        >
          {items.map(
            (item, index) => (
              <span
                key={`${item}-${index}`}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-slate-100
                  px-3 py-1.5
                  text-sm
                  text-slate-700
                  dark:bg-slate-800
                  dark:text-slate-300
                "
              >
                {item}

                <button
                  type="button"
                  onClick={() =>
                    removeItem(index)
                  }
                  aria-label={`Remove ${item}`}
                  className="
                    text-slate-400
                    transition
                    hover:text-red-500
                  "
                >
                  ×
                </button>
              </span>
            ),
          )}
        </div>
      )}

      <p
        className="
          mt-2
          text-xs
          text-slate-400
        "
      >
        {items.length}/{maxItems}
      </p>
    </div>
  )
}

function Section({
  title,
  description,
  children,
}) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        sm:p-6
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div
        className="
          border-b
          border-slate-200
          pb-4
          dark:border-slate-800
        "
      >
        <h2
          className="
            text-lg
            font-semibold
          "
        >
          {title}
        </h2>

        {description && (
          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {description}
          </p>
        )}
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  )
}

function ProjectForm({
  initialProject = null,
  onSubmit,
  submitting = false,
  submitLabel = 'Save project',
}) {
  const [
    form,
    setForm,
  ] = useState(() =>
    normalizeProject(
      initialProject,
    ),
  )

  const [
    categories,
    setCategories,
  ] = useState([])

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true)

  const [
    categoryError,
    setCategoryError,
  ] = useState('')

  const [
    slugTouched,
    setSlugTouched,
  ] = useState(
    Boolean(initialProject),
  )

  useEffect(() => {
    setForm(
      normalizeProject(
        initialProject,
      ),
    )

    setSlugTouched(
      Boolean(initialProject),
    )
  }, [initialProject])

  useEffect(() => {
    let active = true

    async function loadCategories() {
      try {
        setCategoriesLoading(true)
        setCategoryError('')

        const response =
          await getCategories()

        if (!active) {
          return
        }

        setCategories(
          Array.isArray(
            response?.categories,
          )
            ? response.categories
            : [],
        )
      } catch (error) {
        if (!active) {
          return
        }

        setCategoryError(
          error?.message ||
            'Unable to load categories.',
        )
      } finally {
        if (active) {
          setCategoriesLoading(
            false,
          )
        }
      }
    }

    loadCategories()

    return () => {
      active = false
    }
  }, [])

  function handleFieldChange(
    event,
  ) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target

    /*
     * Title is handled in one state
     * update so automatic slug
     * generation stays predictable.
     */
    if (name === 'title') {
      setForm((current) => ({
        ...current,
        title: value,
        ...(!slugTouched
          ? {
              slug:
                createSlug(value),
            }
          : {}),
      }))

      return
    }

    setForm((current) => ({
      ...current,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))
  }

  function handleSlugChange(
    event,
  ) {
    setSlugTouched(true)

    setForm((current) => ({
      ...current,

      slug: createSlug(
        event.target.value,
      ),
    }))
  }

  function updateArray(
    field,
    value,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function updateSeo(
    event,
  ) {
    const {
      name,
      value,
    } = event.target

    setForm((current) => ({
      ...current,

      seo: {
        ...current.seo,
        [name]: value,
      },
    }))
  }

  function handleCoverChange(
    assets,
  ) {
    setForm((current) => ({
      ...current,
      coverImage:
        assets[0] || null,
    }))
  }

  function removeCoverImage() {
    setForm((current) => ({
      ...current,
      coverImage: null,
    }))
  }

  function handleGalleryChange(
    assets,
  ) {
    setForm((current) => ({
      ...current,
      gallery: assets,
    }))
  }

  function removeGalleryImage(
    index,
  ) {
    setForm((current) => ({
      ...current,

      gallery:
        current.gallery.filter(
          (_, itemIndex) =>
            itemIndex !== index,
        ),
    }))
  }

  async function handleSubmit(
    event,
  ) {
    event.preventDefault()

    /*
     * The UI stores complete MediaAsset
     * objects for rendering previews.
     *
     * The API receives only ObjectIds.
     */
    const coverImageId =
      form.coverImage
        ? typeof form.coverImage ===
          'string'
          ? form.coverImage
          : form.coverImage._id
        : null

    const galleryIds =
      form.gallery
        .map((asset) =>
          typeof asset === 'string'
            ? asset
            : asset?._id,
        )
        .filter(Boolean)

    const payload = {
      ...form,

      sortOrder:
        Number(form.sortOrder) || 0,

      category:
        form.category,

      coverImage:
        coverImageId,

      gallery:
        galleryIds,

      technologies:
        form.technologies
          .map((item) =>
            item.trim(),
          )
          .filter(Boolean),

      features:
        form.features
          .map((item) =>
            item.trim(),
          )
          .filter(Boolean),

      challenges:
        form.challenges
          .map((item) =>
            item.trim(),
          )
          .filter(Boolean),

      outcomes:
        form.outcomes
          .map((item) =>
            item.trim(),
          )
          .filter(Boolean),

      seo: {
        title:
          form.seo.title.trim(),

        description:
          form.seo.description.trim(),
      },
    }

    await onSubmit(payload)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        mt-8
        space-y-6
      "
    >
      {/* Basic information */}
      <Section
        title="Basic information"
        description="The primary information displayed for this project."
      >
        <div
          className="
            grid
            gap-5
            md:grid-cols-2
          "
        >
          <TextField
            label="Project title"
            name="title"
            value={form.title}
            onChange={
              handleFieldChange
            }
            required
            maxLength={150}
            placeholder="Sign Natural Academy"
          />

          <TextField
            label="Slug"
            name="slug"
            value={form.slug}
            onChange={
              handleSlugChange
            }
            required
            maxLength={180}
            placeholder="sign-natural-academy"
            helpText="Used in the public project URL."
          />

          <div>
            <label
              htmlFor="category"
              className="
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-200
              "
            >
              Category

              <span className="text-red-500">
                {' '}*
              </span>
            </label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={
                handleFieldChange
              }
              required
              disabled={
                categoriesLoading
              }
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4 py-3
                text-sm
                text-slate-950
                outline-none
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/20
                disabled:opacity-50
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-white
              "
            >
              <option value="">
                {categoriesLoading
                  ? 'Loading categories...'
                  : 'Select category'}
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={
                      category._id
                    }
                    value={
                      category._id
                    }
                  >
                    {category.name}
                  </option>
                ),
              )}
            </select>

            {categoryError && (
              <p
                className="
                  mt-2
                  text-xs
                  text-red-600
                  dark:text-red-400
                "
              >
                {categoryError}
              </p>
            )}
          </div>

          <TextField
            label="Role"
            name="role"
            value={form.role}
            onChange={
              handleFieldChange
            }
            maxLength={200}
            placeholder="Full-Stack Developer"
          />
        </div>

        <div className="mt-5">
          <TextAreaField
            label="Summary"
            name="summary"
            value={form.summary}
            onChange={
              handleFieldChange
            }
            required
            maxLength={500}
            rows={3}
            placeholder="A concise overview of the project."
          />
        </div>

        <div className="mt-5">
          <TextAreaField
            label="Description"
            name="description"
            value={
              form.description
            }
            onChange={
              handleFieldChange
            }
            required
            maxLength={5000}
            rows={7}
            placeholder="Describe the project in detail."
          />
        </div>
      </Section>

      {/* Case study */}
      <Section
        title="Case study"
        description="Explain the problem, solution and technical approach."
      >
        <div className="space-y-5">
          <TextAreaField
            label="Problem"
            name="problem"
            value={form.problem}
            onChange={
              handleFieldChange
            }
            maxLength={3000}
            rows={5}
            placeholder="What problem did the project address?"
          />

          <TextAreaField
            label="Solution"
            name="solution"
            value={form.solution}
            onChange={
              handleFieldChange
            }
            maxLength={5000}
            rows={6}
            placeholder="How did you solve the problem?"
          />

          <TextAreaField
            label="Architecture"
            name="architecture"
            value={
              form.architecture
            }
            onChange={
              handleFieldChange
            }
            maxLength={5000}
            rows={6}
            placeholder="Describe the system architecture."
          />
        </div>
      </Section>

      {/* Technologies and features */}
      <Section
        title="Technologies & features"
        description="Add the technologies, functionality, challenges and outcomes."
      >
        <div className="space-y-6">
          <ArrayField
            label="Technologies"
            items={
              form.technologies
            }
            onChange={(value) =>
              updateArray(
                'technologies',
                value,
              )
            }
            placeholder="React"
            maxItems={30}
          />

          <ArrayField
            label="Features"
            items={form.features}
            onChange={(value) =>
              updateArray(
                'features',
                value,
              )
            }
            placeholder="Role-based authentication"
            maxItems={30}
          />

          <ArrayField
            label="Challenges"
            items={form.challenges}
            onChange={(value) =>
              updateArray(
                'challenges',
                value,
              )
            }
            placeholder="Describe a challenge"
            maxItems={20}
          />

          <ArrayField
            label="Outcomes"
            items={form.outcomes}
            onChange={(value) =>
              updateArray(
                'outcomes',
                value,
              )
            }
            placeholder="Describe an outcome"
            maxItems={20}
          />
        </div>
      </Section>

      {/* Media */}
      <Section
        title="Media"
        description="Select existing images from your Cloudflare R2 media library or upload new ones."
      >
        <div className="space-y-8">
          {/* Cover image */}
          <div>
            <MediaPicker
              mode="single"
              title="Cover image"
              description="Select one image to represent this project across the portfolio."
              selected={
                form.coverImage
                  ? [
                      form.coverImage,
                    ]
                  : []
              }
              onChange={
                handleCoverChange
              }
            />

            {form.coverImage &&
              typeof form.coverImage !==
                'string' &&
              form.coverImage
                .publicUrl && (
                <div className="mt-5">
                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                      gap-3
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
                      Selected cover
                    </p>

                    <button
                      type="button"
                      onClick={
                        removeCoverImage
                      }
                      className="
                        text-xs
                        font-semibold
                        text-red-600
                        transition
                        hover:text-red-700
                        dark:text-red-400
                        dark:hover:text-red-300
                      "
                    >
                      Remove
                    </button>
                  </div>

                  <div
                    className="
                      max-w-lg
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      dark:border-slate-800
                      dark:bg-slate-950
                    "
                  >
                    <img
                      src={
                        form
                          .coverImage
                          .publicUrl
                      }
                      alt={
                        form
                          .coverImage
                          .altText ||
                        form
                          .coverImage
                          .originalFilename ||
                        'Project cover'
                      }
                      className="
                        aspect-video
                        w-full
                        object-cover
                      "
                    />

                    <div
                      className="
                        p-3
                      "
                    >
                      <p
                        className="
                          truncate
                          text-xs
                          text-slate-600
                          dark:text-slate-400
                        "
                        title={
                          form
                            .coverImage
                            .originalFilename
                        }
                      >
                        {
                          form
                            .coverImage
                            .originalFilename
                        }
                      </p>

                      {form
                        .coverImage
                        .width &&
                        form
                          .coverImage
                          .height && (
                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-400
                            "
                          >
                            {
                              form
                                .coverImage
                                .width
                            }
                            {' × '}
                            {
                              form
                                .coverImage
                                .height
                            }
                            {' px'}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}

            {form.coverImage &&
              typeof form.coverImage ===
                'string' && (
                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    dark:border-slate-800
                    dark:bg-slate-950
                  "
                >
                  <p
                    className="
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Existing cover image
                    selected.
                  </p>

                  <button
                    type="button"
                    onClick={
                      removeCoverImage
                    }
                    className="
                      text-xs
                      font-semibold
                      text-red-600
                      dark:text-red-400
                    "
                  >
                    Remove
                  </button>
                </div>
              )}
          </div>

          {/* Gallery */}
          <div>
            <MediaPicker
              mode="multiple"
              title="Project gallery"
              description="Select screenshots or other images for the project detail page."
              selected={
                form.gallery
              }
              onChange={
                handleGalleryChange
              }
            />

            {form.gallery.length >
              0 && (
              <div className="mt-5">
                <div
                  className="
                    mb-3
                    flex
                    items-center
                    justify-between
                    gap-3
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
                    Selected gallery
                  </p>

                  <span
                    className="
                      rounded-full
                      bg-slate-100
                      px-2.5 py-1
                      text-xs
                      font-semibold
                      text-slate-600
                      dark:bg-slate-800
                      dark:text-slate-300
                    "
                  >
                    {
                      form.gallery
                        .length
                    }
                  </span>
                </div>

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-3
                    xl:grid-cols-4
                  "
                >
                  {form.gallery.map(
                    (
                      asset,
                      index,
                    ) => {
                      const assetId =
                        typeof asset ===
                        'string'
                          ? asset
                          : asset?._id

                      return (
                        <div
                          key={
                            assetId ||
                            index
                          }
                          className="
                            group
                            relative
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-100
                            dark:border-slate-800
                            dark:bg-slate-800
                          "
                        >
                          {typeof asset !==
                            'string' &&
                          asset.publicUrl ? (
                            <img
                              src={
                                asset.publicUrl
                              }
                              alt={
                                asset.altText ||
                                asset.originalFilename ||
                                'Project gallery'
                              }
                              className="
                                aspect-video
                                w-full
                                object-cover
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                aspect-video
                                items-center
                                justify-center
                                px-3
                                text-center
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                              "
                            >
                              Image selected
                            </div>
                          )}

                          <button
                            type="button"
                            aria-label="Remove gallery image"
                            onClick={() =>
                              removeGalleryImage(
                                index,
                              )
                            }
                            className="
                              absolute
                              right-2
                              top-2
                              flex
                              h-8 w-8
                              items-center
                              justify-center
                              rounded-full
                              bg-slate-950/80
                              text-base
                              font-bold
                              text-white
                              backdrop-blur
                              transition
                              hover:bg-red-600
                            "
                          >
                            ×
                          </button>

                          {typeof asset !==
                            'string' &&
                            asset.originalFilename && (
                              <div
                                className="
                                  border-t
                                  border-slate-200
                                  bg-white
                                  px-3 py-2
                                  dark:border-slate-800
                                  dark:bg-slate-900
                                "
                              >
                                <p
                                  className="
                                    truncate
                                    text-xs
                                    text-slate-600
                                    dark:text-slate-400
                                  "
                                  title={
                                    asset.originalFilename
                                  }
                                >
                                  {
                                    asset.originalFilename
                                  }
                                </p>
                              </div>
                            )}
                        </div>
                      )
                    },
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Project links */}
      <Section
        title="Project links"
        description="Link visitors to the source code or deployed application."
      >
        <div
          className="
            grid
            gap-5
            md:grid-cols-2
          "
        >
          <TextField
            label="Repository URL"
            name="repositoryUrl"
            value={
              form.repositoryUrl
            }
            onChange={
              handleFieldChange
            }
            type="url"
            placeholder="https://github.com/..."
          />

          <TextField
            label="Live URL"
            name="liveUrl"
            value={form.liveUrl}
            onChange={
              handleFieldChange
            }
            type="url"
            placeholder="https://..."
          />
        </div>
      </Section>

      {/* Publishing */}
      <Section
        title="Publishing"
        description="Control the visibility and ordering of this project."
      >
        <div
          className="
            grid
            gap-5
            md:grid-cols-2
          "
        >
          <div>
            <label
              htmlFor="status"
              className="
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-200
              "
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={
                handleFieldChange
              }
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4 py-3
                text-sm
                text-slate-950
                outline-none
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/20
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-white
              "
            >
              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>

              <option value="archived">
                Archived
              </option>
            </select>
          </div>

          <TextField
            label="Sort order"
            name="sortOrder"
            value={form.sortOrder}
            onChange={
              handleFieldChange
            }
            type="number"
            min={0}
            helpText="Lower numbers appear first."
          />
        </div>

        <label
          className="
            mt-6
            flex
            cursor-pointer
            items-start
            gap-3
            rounded-xl
            border
            border-slate-200
            p-4
            dark:border-slate-800
          "
        >
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={
              handleFieldChange
            }
            className="
              mt-1
              h-4 w-4
              accent-cyan-600
            "
          />

          <span>
            <span
              className="
                block
                text-sm
                font-semibold
              "
            >
              Featured project
            </span>

            <span
              className="
                mt-1
                block
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Featured projects can
              appear prominently on the
              portfolio homepage.
            </span>
          </span>
        </label>
      </Section>

      {/* SEO */}
      <Section
        title="SEO"
        description="Optional search-engine metadata for the project."
      >
        <div className="space-y-5">
          <TextField
            label="SEO title"
            name="title"
            value={form.seo.title}
            onChange={updateSeo}
            maxLength={70}
            placeholder="Project title for search engines"
          />

          <TextAreaField
            label="SEO description"
            name="description"
            value={
              form.seo.description
            }
            onChange={updateSeo}
            maxLength={170}
            rows={3}
            placeholder="Short search-engine description."
          />
        </div>
      </Section>

      {/* Save actions */}
      <div
        className="
          sticky
          bottom-4
          z-20
          flex
          flex-col
          gap-3
          rounded-2xl
          border
          border-slate-200
          bg-white/95
          p-4
          shadow-lg
          backdrop-blur
          sm:flex-row
          sm:items-center
          sm:justify-end
          dark:border-slate-800
          dark:bg-slate-900/95
        "
      >
        <Link
          to="/admin/projects"
          className="
            inline-flex
            min-h-11
            items-center
            justify-center
            rounded-xl
            border
            border-slate-300
            px-5
            text-sm
            font-semibold
            transition
            hover:bg-slate-50
            dark:border-slate-700
            dark:hover:bg-slate-800
          "
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={
            submitting ||
            categoriesLoading
          }
          className="
            inline-flex
            min-h-11
            items-center
            justify-center
            rounded-xl
            bg-cyan-600
            px-6
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-cyan-700
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:bg-cyan-400
            dark:text-slate-950
            dark:hover:bg-cyan-300
          "
        >
          {submitting
            ? 'Saving...'
            : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ProjectForm