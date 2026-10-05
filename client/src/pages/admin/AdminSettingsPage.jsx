import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import MediaPicker from './MediaPicker.jsx'

import {
  getAdminSettings,
  updateAdminSettings,
} from '../../services/settingsService.js'

const EMPTY_FORM = {
  siteName: '',
  headline: '',
  shortBio: '',
  email: '',
  location: '',

  socialLinks: {
    github: '',
    linkedin: '',
  },

  profileImage: null,
  cv: null,

  seo: {
    title: '',
    description: '',
  },
}

function normalizeSettings(
  settings,
) {
  return {
    siteName:
      settings?.siteName || '',

    headline:
      settings?.headline || '',

    shortBio:
      settings?.shortBio || '',

    email:
      settings?.email || '',

    location:
      settings?.location || '',

    socialLinks: {
      github:
        settings?.socialLinks
          ?.github || '',

      linkedin:
        settings?.socialLinks
          ?.linkedin || '',
    },

    profileImage:
      settings?.profileImage ||
      null,

    cv:
      settings?.cv || null,

    seo: {
      title:
        settings?.seo?.title ||
        '',

      description:
        settings?.seo
          ?.description || '',
    },
  }
}

function getAssetId(asset) {
  if (!asset) {
    return null
  }

  if (
    typeof asset === 'string'
  ) {
    return asset
  }

  return asset._id || null
}

function AdminSettingsPage() {
  const [
    form,
    setForm,
  ] = useState({
    ...EMPTY_FORM,
  })

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    success,
    setSuccess,
  ] = useState('')

  const [
    updatedAt,
    setUpdatedAt,
  ] = useState(null)

  const loadSettings =
    useCallback(async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await getAdminSettings()

        const settings =
          response?.settings

        setForm(
          normalizeSettings(
            settings,
          ),
        )

        setUpdatedAt(
          settings?.updatedAt ||
            null,
        )
      } catch (requestError) {
        setError(
          requestError?.message ||
            'Unable to load portfolio settings.',
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  function updateField(
    event,
  ) {
    const {
      name,
      value,
    } = event.target

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      }),
    )
  }

  function updateSocial(
    event,
  ) {
    const {
      name,
      value,
    } = event.target

    setForm(
      (current) => ({
        ...current,

        socialLinks: {
          ...current.socialLinks,
          [name]: value,
        },
      }),
    )
  }

  function updateSeo(
    event,
  ) {
    const {
      name,
      value,
    } = event.target

    setForm(
      (current) => ({
        ...current,

        seo: {
          ...current.seo,
          [name]: value,
        },
      }),
    )
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
        siteName:
          form.siteName.trim(),

        headline:
          form.headline.trim(),

        shortBio:
          form.shortBio.trim(),

        email:
          form.email.trim(),

        location:
          form.location.trim(),

        socialLinks: {
          github:
            form.socialLinks
              .github.trim(),

          linkedin:
            form.socialLinks
              .linkedin.trim(),
        },

        profileImage:
          getAssetId(
            form.profileImage,
          ),

        cv:
          getAssetId(
            form.cv,
          ),

        seo: {
          title:
            form.seo.title.trim(),

          description:
            form.seo.description.trim(),
        },
      }

      const response =
        await updateAdminSettings(
          payload,
        )

      if (
        response?.settings
      ) {
        setForm(
          normalizeSettings(
            response.settings,
          ),
        )

        setUpdatedAt(
          response.settings
            .updatedAt || null,
        )
      }

      setSuccess(
        'Portfolio settings updated successfully.',
      )
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to update portfolio settings.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <SettingsHeader />

        <div
          className="
            mt-8
            grid
            gap-6
            xl:grid-cols-[minmax(0,1fr)_360px]
          "
        >
          <div className="space-y-6">
            {Array.from({
              length: 3,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    h-72
                    animate-pulse
                    rounded-2xl
                    bg-slate-100
                    dark:bg-slate-800
                  "
                />
              ),
            )}
          </div>

          <div
            className="
              h-96
              animate-pulse
              rounded-2xl
              bg-slate-100
              dark:bg-slate-800
            "
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <SettingsHeader
        updatedAt={
          updatedAt
        }
      />

      {success && (
        <Message
          type="success"
        >
          {success}
        </Message>
      )}

      {error && (
        <Message type="error">
          {error}
        </Message>
      )}

      <form
        onSubmit={
          handleSubmit
        }
        className="
          mt-8
          grid
          gap-6
          xl:grid-cols-[minmax(0,1fr)_360px]
        "
      >
        <div className="space-y-6">
          {/* Identity */}
          <SettingsSection
            title="Portfolio identity"
            description="Primary information displayed across your portfolio."
          >
            <div
              className="
                grid
                gap-5
                md:grid-cols-2
              "
            >
              <TextField
                label="Site name"
                name="siteName"
                value={
                  form.siteName
                }
                onChange={
                  updateField
                }
                required
                maxLength={100}
                placeholder="Samuel Mensah Quaye"
              />

              <TextField
                label="Headline"
                name="headline"
                value={
                  form.headline
                }
                onChange={
                  updateField
                }
                required
                maxLength={200}
                placeholder="Software Developer | Full-Stack Developer"
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={
                  form.email
                }
                onChange={
                  updateField
                }
                maxLength={254}
                placeholder="you@example.com"
              />

              <TextField
                label="Location"
                name="location"
                value={
                  form.location
                }
                onChange={
                  updateField
                }
                maxLength={150}
                placeholder="Accra, Ghana"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="shortBio"
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  dark:text-slate-200
                "
              >
                Short bio
              </label>

              <textarea
                id="shortBio"
                name="shortBio"
                value={
                  form.shortBio
                }
                onChange={
                  updateField
                }
                maxLength={1000}
                rows={7}
                placeholder="Introduce your software development experience, focus and the type of solutions you build."
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
                  leading-7
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

              <CharacterCount
                current={
                  form.shortBio
                    .length
                }
                maximum={1000}
              />
            </div>
          </SettingsSection>

          {/* Social */}
          <SettingsSection
            title="Professional links"
            description="Links visitors can use to explore your development work and professional profile."
          >
            <div
              className="
                grid
                gap-5
                md:grid-cols-2
              "
            >
              <TextField
                label="GitHub URL"
                name="github"
                type="url"
                value={
                  form.socialLinks
                    .github
                }
                onChange={
                  updateSocial
                }
                placeholder="https://github.com/..."
              />

              <TextField
                label="LinkedIn URL"
                name="linkedin"
                type="url"
                value={
                  form.socialLinks
                    .linkedin
                }
                onChange={
                  updateSocial
                }
                placeholder="https://www.linkedin.com/in/..."
              />
            </div>
          </SettingsSection>

          {/* SEO */}
          <SettingsSection
            title="Search engine metadata"
            description="Control the default title and description used for portfolio search metadata."
          >
            <TextField
              label="SEO title"
              name="title"
              value={
                form.seo.title
              }
              onChange={
                updateSeo
              }
              maxLength={70}
              placeholder="Samuel Mensah Quaye | Software Developer"
            />

            <CharacterCount
              current={
                form.seo.title
                  .length
              }
              maximum={70}
            />

            <div className="mt-5">
              <label
                htmlFor="seo-description"
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  dark:text-slate-200
                "
              >
                SEO description
              </label>

              <textarea
                id="seo-description"
                name="description"
                value={
                  form.seo
                    .description
                }
                onChange={
                  updateSeo
                }
                maxLength={170}
                rows={4}
                placeholder="Software developer building secure, scalable full-stack web applications."
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
                  focus:border-cyan-500
                  focus:ring-2
                  focus:ring-cyan-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
              />

              <CharacterCount
                current={
                  form.seo
                    .description
                    .length
                }
                maximum={170}
              />
            </div>
          </SettingsSection>
        </div>

        {/* Media / save sidebar */}
        <aside
          className="
            space-y-6
            xl:self-start
            xl:sticky
            xl:top-6
          "
        >
          {/* Profile image */}
          <SettingsSection
            title="Profile image"
            description="Image used to represent you across the portfolio."
          >
            {form.profileImage && (
              <div
                className="
                  mb-5
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  dark:border-slate-800
                "
              >
                <div
                  className="
                    aspect-square
                    bg-slate-100
                    dark:bg-slate-950
                  "
                >
                  <img
                    src={
                      form.profileImage
                        .publicUrl
                    }
                    alt={
                      form.profileImage
                        .altText ||
                      'Current profile'
                    }
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    p-3
                  "
                >
                  <p
                    className="
                      min-w-0
                      truncate
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {form.profileImage
                      .originalFilename ||
                      form.profileImage
                        .filename}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setForm(
                        (
                          current,
                        ) => ({
                          ...current,
                          profileImage:
                            null,
                        }),
                      )
                    }
                    className="
                      shrink-0
                      text-xs
                      font-semibold
                      text-red-600
                      dark:text-red-400
                    "
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            <MediaPicker
              label="Choose profile image"
              helpText="Select an existing image or upload a JPEG, PNG or WebP image."
              mediaType="image"
              value={
                form.profileImage
              }
              onChange={(
                asset,
              ) =>
                setForm(
                  (current) => ({
                    ...current,
                    profileImage:
                      asset,
                  }),
                )
              }
            />
          </SettingsSection>

          {/* CV */}
          <SettingsSection
            title="Curriculum Vitae"
            description="PDF visitors can access from your portfolio."
          >
            {form.cv && (
              <div
                className="
                  mb-5
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-4
                  dark:border-slate-800
                  dark:bg-slate-950
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-12 w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-red-100
                      text-xs
                      font-black
                      text-red-600
                      dark:bg-red-950/40
                      dark:text-red-400
                    "
                  >
                    PDF
                  </div>

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                      "
                    >
                      {form.cv
                        .originalFilename ||
                        form.cv
                          .filename}
                    </p>

                    {form.cv
                      .publicUrl && (
                      <a
                        href={
                          form.cv
                            .publicUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="
                          mt-1
                          inline-block
                          text-xs
                          font-semibold
                          text-cyan-600
                          hover:underline
                          dark:text-cyan-400
                        "
                      >
                        Open current CV
                      </a>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setForm(
                      (
                        current,
                      ) => ({
                          ...current,
                          cv: null,
                        }),
                    )
                  }
                  className="
                    mt-4
                    text-xs
                    font-semibold
                    text-red-600
                    dark:text-red-400
                  "
                >
                  Remove CV
                </button>
              </div>
            )}

            <MediaPicker
              label="Choose CV"
              helpText="Select an existing PDF or upload a new CV."
              mediaType="document"
              value={form.cv}
              onChange={(
                asset,
              ) =>
                setForm(
                  (current) => ({
                    ...current,
                    cv: asset,
                  }),
                )
              }
            />
          </SettingsSection>

          {/* Save */}
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
            <h2
              className="
                text-sm
                font-semibold
              "
            >
              Publish settings
            </h2>

            <p
              className="
                mt-2
                text-xs
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              Saving updates the
              portfolio settings used
              by the public website.
            </p>

            <button
              type="submit"
              disabled={saving}
              className="
                mt-5
                inline-flex
                min-h-11
                w-full
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
                : 'Save settings'}
            </button>
          </div>
        </aside>
      </form>
    </div>
  )
}

function SettingsHeader({
  updatedAt,
}) {
  return (
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
        Portfolio configuration
      </p>

      <div
        className="
          mt-2
          flex
          flex-col
          gap-2
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
            "
          >
            Settings
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
            Manage your public
            identity, professional
            links, profile media,
            CV and search metadata.
          </p>
        </div>

        {updatedAt && (
          <p
            className="
              text-xs
              text-slate-400
            "
          >
            Last updated{' '}
            {new Intl.DateTimeFormat(
              'en',
              {
                dateStyle:
                  'medium',
                timeStyle:
                  'short',
              },
            ).format(
              new Date(
                updatedAt,
              ),
            )}
          </p>
        )}
      </div>
    </div>
  )
}

function SettingsSection({
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
            leading-6
            text-slate-500
            dark:text-slate-400
          "
        >
          {description}
        </p>
      )}

      <div className="mt-6">
        {children}
      </div>
    </section>
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
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={`settings-${name}`}
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
        id={`settings-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
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
    </div>
  )
}

function CharacterCount({
  current,
  maximum,
}) {
  return (
    <p
      className="
        mt-1.5
        text-right
        text-xs
        text-slate-400
      "
    >
      {current}/{maximum}
    </p>
  )
}

function Message({
  type,
  children,
}) {
  const success =
    type === 'success'

  return (
    <div
      role={
        success
          ? 'status'
          : 'alert'
      }
      className={`
        mt-6
        rounded-xl
        border
        p-4
        text-sm
        ${
          success
            ? `
              border-emerald-200
              bg-emerald-50
              text-emerald-700
              dark:border-emerald-900
              dark:bg-emerald-950/30
              dark:text-emerald-300
            `
            : `
              border-red-200
              bg-red-50
              text-red-700
              dark:border-red-900
              dark:bg-red-950/30
              dark:text-red-300
            `
        }
      `}
    >
      {children}
    </div>
  )
}

export default AdminSettingsPage