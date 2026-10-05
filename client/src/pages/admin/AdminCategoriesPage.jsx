import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../../services/categoryService.js'

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  isActive: true,
  sortOrder: 0,
}

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
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

function AdminCategoriesPage() {
  const [
    categories,
    setCategories,
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
    success,
    setSuccess,
  ] = useState('')

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    filter,
    setFilter,
  ] = useState('all')

  const [
    form,
    setForm,
  ] = useState({
    ...EMPTY_FORM,
  })

  const [
    editingCategory,
    setEditingCategory,
  ] = useState(null)

  const [
    slugTouched,
    setSlugTouched,
  ] = useState(false)

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    deletingId,
    setDeletingId,
  ] = useState(null)

  const [
    updatingId,
    setUpdatingId,
  ] = useState(null)

  const loadCategories =
    useCallback(async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await getAdminCategories()

        setCategories(
          Array.isArray(
            response?.categories,
          )
            ? response.categories
            : [],
        )
      } catch (requestError) {
        setError(
          requestError?.message ||
            'Unable to load categories.',
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const statistics =
    useMemo(
      () => ({
        total:
          categories.length,

        active:
          categories.filter(
            (category) =>
              category.isActive,
          ).length,

        inactive:
          categories.filter(
            (category) =>
              !category.isActive,
          ).length,
      }),
      [categories],
    )

  const filteredCategories =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      return categories.filter(
        (category) => {
          if (
            filter === 'active' &&
            !category.isActive
          ) {
            return false
          }

          if (
            filter === 'inactive' &&
            category.isActive
          ) {
            return false
          }

          if (!query) {
            return true
          }

          return [
            category.name,
            category.slug,
            category.description,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        },
      )
    }, [
      categories,
      search,
      filter,
    ])

  function resetForm() {
    setForm({
      ...EMPTY_FORM,
    })

    setEditingCategory(null)
    setSlugTouched(false)
  }

  function startCreate() {
    resetForm()
    setError('')
    setSuccess('')
  }

  function startEdit(
    category,
  ) {
    setEditingCategory(
      category,
    )

    setSlugTouched(true)

    setForm({
      name:
        category.name || '',

      slug:
        category.slug || '',

      description:
        category.description ||
        '',

      isActive:
        Boolean(
          category.isActive,
        ),

      sortOrder:
        category.sortOrder ?? 0,
    })

    setError('')
    setSuccess('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function handleFieldChange(
    event,
  ) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target

    if (name === 'name') {
      setForm((current) => ({
        ...current,

        name: value,

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

  async function handleSubmit(
    event,
  ) {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const payload = {
        name:
          form.name.trim(),

        slug:
          createSlug(form.slug),

        description:
          form.description.trim(),

        isActive:
          Boolean(
            form.isActive,
          ),

        sortOrder:
          Math.max(
            0,
            Number(
              form.sortOrder,
            ) || 0,
          ),
      }

      if (editingCategory) {
        const response =
          await updateAdminCategory(
            editingCategory._id,
            payload,
          )

        const updatedCategory =
          response?.category

        if (updatedCategory) {
          setCategories(
            (current) =>
              current
                .map(
                  (category) =>
                    category._id ===
                    updatedCategory._id
                      ? updatedCategory
                      : category,
                )
                .sort(
                  sortCategories,
                ),
          )
        } else {
          await loadCategories()
        }

        setSuccess(
          'Category updated successfully.',
        )
      } else {
        const response =
          await createAdminCategory(
            payload,
          )

        const newCategory =
          response?.category

        if (newCategory) {
          setCategories(
            (current) =>
              [
                ...current,
                newCategory,
              ].sort(
                sortCategories,
              ),
          )
        } else {
          await loadCategories()
        }

        setSuccess(
          'Category created successfully.',
        )
      }

      resetForm()
    } catch (requestError) {
      if (
        requestError?.status ===
        409
      ) {
        setError(
          requestError?.message ||
            'A category with that name or slug already exists.',
        )
      } else {
        setError(
          requestError?.message ||
            'Unable to save category.',
        )
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(
    category,
  ) {
    try {
      setUpdatingId(
        category._id,
      )

      setError('')
      setSuccess('')

      const response =
        await updateAdminCategory(
          category._id,
          {
            isActive:
              !category.isActive,
          },
        )

      const updatedCategory =
        response?.category

      if (updatedCategory) {
        setCategories(
          (current) =>
            current
              .map(
                (item) =>
                  item._id ===
                  updatedCategory._id
                    ? updatedCategory
                    : item,
              )
              .sort(
                sortCategories,
              ),
        )
      } else {
        await loadCategories()
      }

      setSuccess(
        category.isActive
          ? 'Category deactivated.'
          : 'Category activated.',
      )

      if (
        editingCategory?._id ===
        category._id
      ) {
        setEditingCategory(
          updatedCategory ||
            null,
        )

        if (
          updatedCategory
        ) {
          setForm(
            (current) => ({
              ...current,

              isActive:
                updatedCategory
                  .isActive,
            }),
          )
        }
      }
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to update category.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleDelete(
    category,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${category.name}"?\n\nThis permanently removes the category. Categories referenced by projects cannot be deleted.`,
      )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(
        category._id,
      )

      setError('')
      setSuccess('')

      await deleteAdminCategory(
        category._id,
      )

      setCategories(
        (current) =>
          current.filter(
            (item) =>
              item._id !==
              category._id,
          ),
      )

      if (
        editingCategory?._id ===
        category._id
      ) {
        resetForm()
      }

      setSuccess(
        'Category deleted successfully.',
      )
    } catch (requestError) {
      if (
        requestError?.status ===
        409
      ) {
        setError(
          'This category is currently used by one or more projects and cannot be deleted. Reassign those projects first, or deactivate the category instead.',
        )
      } else {
        setError(
          requestError?.message ||
            'Unable to delete category.',
        )
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      {/* Header */}
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
          Portfolio structure
        </p>

        <h1
          className="
            mt-2
            text-3xl
            font-bold
            tracking-tight
          "
        >
          Categories
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
          Organize portfolio projects
          into reusable development
          categories.
        </p>
      </div>

      {/* Messages */}
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

      {/* Statistics */}
      <div
        className="
          mt-8
          grid
          gap-4
          sm:grid-cols-3
        "
      >
        <StatCard
          label="Total categories"
          value={statistics.total}
        />

        <StatCard
          label="Active"
          value={statistics.active}
        />

        <StatCard
          label="Inactive"
          value={
            statistics.inactive
          }
        />
      </div>

      <div
        className="
          mt-6
          grid
          gap-6
          xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]
        "
      >
        {/* Editor */}
        <section
          className="
            self-start
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-5
            xl:sticky
            xl:top-6
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <h2
                className="
                  text-lg
                  font-semibold
                "
              >
                {editingCategory
                  ? 'Edit category'
                  : 'New category'}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {editingCategory
                  ? 'Update this category and save your changes.'
                  : 'Create a category for grouping portfolio projects.'}
              </p>
            </div>

            {editingCategory && (
              <button
                type="button"
                onClick={
                  startCreate
                }
                className="
                  shrink-0
                  text-xs
                  font-semibold
                  text-cyan-600
                  hover:text-cyan-700
                  dark:text-cyan-400
                "
              >
                New
              </button>
            )}
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="
              mt-6
              space-y-5
            "
          >
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={
                handleFieldChange
              }
              required
              maxLength={80}
              placeholder="Full-Stack Development"
            />

            <TextField
              label="Slug"
              name="slug"
              value={form.slug}
              onChange={
                handleSlugChange
              }
              required
              maxLength={100}
              placeholder="full-stack-development"
              helpText="Generated automatically from the name until you edit it manually."
            />

            <div>
              <label
                htmlFor="category-description"
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  dark:text-slate-200
                "
              >
                Description
              </label>

              <textarea
                id="category-description"
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleFieldChange
                }
                maxLength={500}
                rows={5}
                placeholder="Describe the type of projects included in this category."
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

              <p
                className="
                  mt-1
                  text-right
                  text-xs
                  text-slate-400
                "
              >
                {
                  form.description
                    .length
                }
                /500
              </p>
            </div>

            <TextField
              label="Sort order"
              name="sortOrder"
              value={
                form.sortOrder
              }
              onChange={
                handleFieldChange
              }
              type="number"
              min={0}
              helpText="Lower numbers appear first."
            />

            <label
              className="
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
                name="isActive"
                checked={
                  form.isActive
                }
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
                  Active category
                </span>

                <span
                  className="
                    mt-1
                    block
                    text-xs
                    leading-5
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Active categories
                  are available on the
                  public portfolio and
                  in the project form.
                </span>
              </span>
            </label>

            <div
              className="
                flex
                flex-col
                gap-3
                border-t
                border-slate-200
                pt-5
                sm:flex-row
                dark:border-slate-800
              "
            >
              {editingCategory && (
                <button
                  type="button"
                  onClick={
                    resetForm
                  }
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
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="
                  inline-flex
                  min-h-11
                  flex-1
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
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:bg-cyan-400
                  dark:text-slate-950
                  dark:hover:bg-cyan-300
                "
              >
                {saving
                  ? 'Saving...'
                  : editingCategory
                    ? 'Save changes'
                    : 'Create category'}
              </button>
            </div>
          </form>
        </section>

        {/* Category list */}
        <section
          className="
            min-w-0
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
              border-b
              border-slate-200
              p-5
              dark:border-slate-800
            "
          >
            <div
              className="
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              <div>
                <h2
                  className="
                    text-lg
                    font-semibold
                  "
                >
                  Category library
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {
                    filteredCategories
                      .length
                  }{' '}
                  {filteredCategories
                    .length === 1
                    ? 'category'
                    : 'categories'}
                </p>
              </div>

              <div
                className="
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                "
              >
                <input
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
                  placeholder="Search categories..."
                  aria-label="Search categories"
                  className="
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4 py-2.5
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
                />

                <select
                  value={filter}
                  onChange={(
                    event,
                  ) =>
                    setFilter(
                      event.target
                        .value,
                    )
                  }
                  aria-label="Filter categories"
                  className="
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4 py-2.5
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
                  <option value="all">
                    All
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-5">
              <div className="space-y-3">
                {Array.from({
                  length: 4,
                }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="
                        h-32
                        animate-pulse
                        rounded-xl
                        bg-slate-100
                        dark:bg-slate-800
                      "
                    />
                  ),
                )}
              </div>
            </div>
          ) : filteredCategories
              .length === 0 ? (
            <div
              className="
                px-6 py-16
                text-center
              "
            >
              <h3
                className="
                  text-base
                  font-semibold
                "
              >
                No categories found
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {search ||
                filter !== 'all'
                  ? 'Try changing your search or filter.'
                  : 'Create your first portfolio category.'}
              </p>
            </div>
          ) : (
            <div
              className="
                divide-y
                divide-slate-200
                dark:divide-slate-800
              "
            >
              {filteredCategories.map(
                (category) => (
                  <CategoryRow
                    key={
                      category._id
                    }
                    category={
                      category
                    }
                    updating={
                      updatingId ===
                      category._id
                    }
                    deleting={
                      deletingId ===
                      category._id
                    }
                    onEdit={() =>
                      startEdit(
                        category,
                      )
                    }
                    onToggle={() =>
                      handleToggleActive(
                        category,
                      )
                    }
                    onDelete={() =>
                      handleDelete(
                        category,
                      )
                    }
                  />
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function TextField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  maxLength,
  min,
  placeholder,
  helpText,
}) {
  return (
    <div>
      <label
        htmlFor={`category-${name}`}
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
        id={`category-${name}`}
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
            leading-5
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

function StatCard({
  label,
  value,
}) {
  return (
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
          tracking-tight
        "
      >
        {value}
      </p>
    </div>
  )
}

function CategoryRow({
  category,
  updating,
  deleting,
  onEdit,
  onToggle,
  onDelete,
}) {
  return (
    <article className="p-5">
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
        <div className="min-w-0">
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <h3
              className="
                text-base
                font-semibold
              "
            >
              {category.name}
            </h3>

            <span
              className={`
                rounded-full
                px-2.5 py-1
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                ${
                  category.isActive
                    ? `
                      bg-emerald-50
                      text-emerald-700
                      dark:bg-emerald-950/40
                      dark:text-emerald-300
                    `
                    : `
                      bg-slate-100
                      text-slate-600
                      dark:bg-slate-800
                      dark:text-slate-300
                    `
                }
              `}
            >
              {category.isActive
                ? 'Active'
                : 'Inactive'}
            </span>
          </div>

          <p
            className="
              mt-1
              text-xs
              font-mono
              text-slate-500
              dark:text-slate-400
            "
          >
            {category.slug}
          </p>

          {category.description ? (
            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-slate-600
                dark:text-slate-400
              "
            >
              {
                category.description
              }
            </p>
          ) : (
            <p
              className="
                mt-3
                text-sm
                italic
                text-slate-400
              "
            >
              No description.
            </p>
          )}

          <div
            className="
              mt-4
              flex
              flex-wrap
              gap-x-5
              gap-y-2
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            <span>
              Order:{' '}
              <strong
                className="
                  text-slate-700
                  dark:text-slate-300
                "
              >
                {category.sortOrder}
              </strong>
            </span>

            <span>
              Created:{' '}
              <strong
                className="
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                {formatDate(
                  category.createdAt,
                )}
              </strong>
            </span>
          </div>
        </div>

        <div
          className="
            flex
            shrink-0
            flex-wrap
            gap-2
          "
        >
          <button
            type="button"
            onClick={onEdit}
            className="
              rounded-lg
              border
              border-slate-300
              px-3 py-2
              text-xs
              font-semibold
              transition
              hover:bg-slate-50
              dark:border-slate-700
              dark:hover:bg-slate-800
            "
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onToggle}
            disabled={updating}
            className="
              rounded-lg
              border
              border-slate-300
              px-3 py-2
              text-xs
              font-semibold
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:border-slate-700
              dark:hover:bg-slate-800
            "
          >
            {updating
              ? 'Updating...'
              : category.isActive
                ? 'Deactivate'
                : 'Activate'}
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="
              rounded-lg
              border
              border-red-200
              px-3 py-2
              text-xs
              font-semibold
              text-red-600
              transition
              hover:bg-red-50
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:border-red-900
              dark:text-red-400
              dark:hover:bg-red-950/30
            "
          >
            {deleting
              ? 'Deleting...'
              : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  )
}

function sortCategories(
  first,
  second,
) {
  const orderDifference =
    (first.sortOrder ?? 0) -
    (second.sortOrder ?? 0)

  if (orderDifference !== 0) {
    return orderDifference
  }

  return (
    first.name || ''
  ).localeCompare(
    second.name || '',
  )
}

export default AdminCategoriesPage