import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import TurnstileWidget from '../../components/contact/TurnstileWidget.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'

import {
  useTheme,
} from '../../hooks/useTheme.js'

import {
  submitContactEnquiry,
} from '../../services/contactService.js'

import {
  getPublicSettings,
} from '../../services/settingsService.js'

const INITIAL_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

function extractSettings(response) {
  if (response?.settings) {
    return response.settings
  }

  if (
    response?.data &&
    !Array.isArray(response.data)
  ) {
    return response.data
  }

  return response || null
}

function validateForm(form) {
  const errors = {}

  const name = form.name.trim()
  const email = form.email.trim()
  const subject =
    form.subject.trim()
  const message =
    form.message.trim()

  if (name.length < 2) {
    errors.name =
      'Name must contain at least 2 characters.'
  } else if (name.length > 100) {
    errors.name =
      'Name must not exceed 100 characters.'
  }

  if (!email) {
    errors.email =
      'Email address is required.'
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email,
    )
  ) {
    errors.email =
      'Enter a valid email address.'
  } else if (email.length > 254) {
    errors.email =
      'Email address is too long.'
  }

  if (subject.length < 3) {
    errors.subject =
      'Subject must contain at least 3 characters.'
  } else if (
    subject.length > 200
  ) {
    errors.subject =
      'Subject must not exceed 200 characters.'
  }

  if (message.length < 10) {
    errors.message =
      'Message must contain at least 10 characters.'
  } else if (
    message.length > 5000
  ) {
    errors.message =
      'Message must not exceed 5000 characters.'
  }

  return errors
}

function ContactPage() {
  const { resolvedTheme } =
    useTheme()

  const [settings, setSettings] =
    useState(null)

  const [form, setForm] =
    useState(INITIAL_FORM)

  const [
    validationErrors,
    setValidationErrors,
  ] = useState({})

  const [
    turnstileToken,
    setTurnstileToken,
  ] = useState('')

  const [
    turnstileResetKey,
    setTurnstileResetKey,
  ] = useState(0)

  const [submitting, setSubmitting] =
    useState(false)

  const [success, setSuccess] =
    useState('')

  const [error, setError] =
    useState('')

  useEffect(() => {
    let active = true

    async function loadSettings() {
      try {
        const response =
          await getPublicSettings()

        if (!active) {
          return
        }

        setSettings(
          extractSettings(response),
        )
      } catch (requestError) {
        console.error(
          'Unable to load contact settings:',
          requestError,
        )
      }
    }

    loadSettings()

    return () => {
      active = false
    }
  }, [])

  const handleTurnstileVerify =
    useCallback((token) => {
      setTurnstileToken(token)
      setError('')
    }, [])

  const handleTurnstileExpire =
    useCallback(() => {
      setTurnstileToken('')

      setError(
        'Verification expired. Please verify again.',
      )
    }, [])

  const handleTurnstileError =
    useCallback(() => {
      setTurnstileToken('')

      setError(
        'Verification could not be completed. Please try again.',
      )
    }, [])

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setValidationErrors(
      (current) => ({
        ...current,
        [name]: '',
      }),
    )

    setError('')
    setSuccess('')
  }

  async function handleSubmit(
    event,
  ) {
    event.preventDefault()

    const formErrors =
      validateForm(form)

    setValidationErrors(
      formErrors,
    )

    if (
      Object.keys(formErrors)
        .length > 0
    ) {
      return
    }

    if (!turnstileToken) {
      setError(
        'Please complete the verification before sending your message.',
      )

      return
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const response =
        await submitContactEnquiry({
          name: form.name.trim(),
          email:
            form.email.trim(),
          subject:
            form.subject.trim(),
          message:
            form.message.trim(),
          turnstileToken,
        })

      setSuccess(
        response?.message ||
          'Your message has been received successfully.',
      )

      setForm(INITIAL_FORM)

      setTurnstileToken('')

      setTurnstileResetKey(
        (current) =>
          current + 1,
      )
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Your message could not be sent. Please try again.',
      )

      /*
       * Turnstile tokens are
       * single-use. Reset after a
       * failed submission as well.
       */
      setTurnstileToken('')

      setTurnstileResetKey(
        (current) =>
          current + 1,
      )
    } finally {
      setSubmitting(false)
    }
  }

  const email =
    settings?.email || ''

  const location =
    settings?.location || ''

  const github =
    settings?.socialLinks
      ?.github || ''

  const linkedin =
    settings?.socialLinks
      ?.linkedin || ''

  const inputClassName = `
    mt-2
    block
    w-full
    rounded-xl
    border
    border-slate-300
    bg-white
    px-4 py-3
    text-slate-950
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-cyan-500
    focus:ring-2
    focus:ring-cyan-500/20
    disabled:cursor-not-allowed
    disabled:opacity-60
    dark:border-slate-700
    dark:bg-slate-950
    dark:text-white
  `

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-950
        dark:bg-slate-950
        dark:text-white
      "
    >
      {/* Header */}
      <section
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
            py-20
            lg:px-8
            lg:py-24
          "
        >
          <SectionHeading
            eyebrow="Contact"
            title="Let's discuss your next project."
            description="Have a software project, collaboration or professional opportunity in mind? Send me a message."
          />
        </div>
      </section>

      <section>
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            gap-12
            px-6
            py-16
            lg:grid-cols-[0.7fr_1.3fr]
            lg:px-8
            lg:py-20
          "
        >
          {/* Contact details */}
          <aside>
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
              Get in touch
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
              Contact information
            </h2>

            <p
              className="
                mt-5
                max-w-md
                leading-7
                text-slate-600
                dark:text-slate-400
              "
            >
              I am open to software
              development projects,
              technical collaborations
              and professional
              opportunities.
            </p>

            <div
              className="
                mt-10
                space-y-6
              "
            >
              {email && (
                <div>
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Email
                  </p>

                  <a
                    href={`mailto:${email}`}
                    className="
                      mt-2
                      inline-block
                      font-medium
                      text-slate-950
                      transition
                      hover:text-cyan-600
                      dark:text-white
                      dark:hover:text-cyan-400
                    "
                  >
                    {email}
                  </a>
                </div>
              )}

              {location && (
                <div>
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Location
                  </p>

                  <p
                    className="
                      mt-2
                      font-medium
                      text-slate-950
                      dark:text-white
                    "
                  >
                    {location}
                  </p>
                </div>
              )}

              {(github ||
                linkedin) && (
                <div>
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    Online
                  </p>

                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      gap-4
                    "
                  >
                    {github && (
                      <a
                        href={github}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          font-semibold
                          text-cyan-600
                          hover:text-cyan-700
                          dark:text-cyan-400
                          dark:hover:text-cyan-300
                        "
                      >
                        GitHub ↗
                      </a>
                    )}

                    {linkedin && (
                      <a
                        href={
                          linkedin
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="
                          font-semibold
                          text-cyan-600
                          hover:text-cyan-700
                          dark:text-cyan-400
                          dark:hover:text-cyan-300
                        "
                      >
                        LinkedIn ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Form */}
          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              sm:p-8
              lg:p-10
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <h2
              className="
                text-2xl
                font-bold
                text-slate-950
                dark:text-white
              "
            >
              Send a message
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-slate-600
                dark:text-slate-400
              "
            >
              Complete the form below
              and your enquiry will be
              sent directly to my
              portfolio inbox.
            </p>

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
                  text-emerald-800
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

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8"
            >
              <div
                className="
                  grid
                  gap-6
                  sm:grid-cols-2
                "
              >
                <div>
                  <label
                    htmlFor="name"
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={form.name}
                    onChange={
                      handleChange
                    }
                    disabled={
                      submitting
                    }
                    aria-invalid={
                      Boolean(
                        validationErrors.name,
                      )
                    }
                    className={
                      inputClassName
                    }
                    placeholder="Your name"
                  />

                  {validationErrors.name && (
                    <p
                      className="
                        mt-2
                        text-sm
                        text-red-600
                        dark:text-red-400
                      "
                    >
                      {
                        validationErrors.name
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      submitting
                    }
                    aria-invalid={
                      Boolean(
                        validationErrors.email,
                      )
                    }
                    className={
                      inputClassName
                    }
                    placeholder="you@example.com"
                  />

                  {validationErrors.email && (
                    <p
                      className="
                        mt-2
                        text-sm
                        text-red-600
                        dark:text-red-400
                      "
                    >
                      {
                        validationErrors.email
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="subject"
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  maxLength={200}
                  value={form.subject}
                  onChange={
                    handleChange
                  }
                  disabled={
                    submitting
                  }
                  aria-invalid={
                    Boolean(
                      validationErrors.subject,
                    )
                  }
                  className={
                    inputClassName
                  }
                  placeholder="What would you like to discuss?"
                />

                {validationErrors.subject && (
                  <p
                    className="
                      mt-2
                      text-sm
                      text-red-600
                      dark:text-red-400
                    "
                  >
                    {
                      validationErrors.subject
                    }
                  </p>
                )}
              </div>

              <div className="mt-6">
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <label
                    htmlFor="message"
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Message
                  </label>

                  <span
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    {
                      form.message
                        .length
                    }
                    /5000
                  </span>
                </div>

                <textarea
                  id="message"
                  name="message"
                  rows={8}
                  maxLength={5000}
                  value={form.message}
                  onChange={
                    handleChange
                  }
                  disabled={
                    submitting
                  }
                  aria-invalid={
                    Boolean(
                      validationErrors.message,
                    )
                  }
                  className={`
                    ${inputClassName}
                    resize-y
                  `}
                  placeholder="Tell me about your project, opportunity or enquiry..."
                />

                {validationErrors.message && (
                  <p
                    className="
                      mt-2
                      text-sm
                      text-red-600
                      dark:text-red-400
                    "
                  >
                    {
                      validationErrors.message
                    }
                  </p>
                )}
              </div>

              <div className="mt-7">
                <p
                  className="
                    mb-3
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  Verification
                </p>

                <TurnstileWidget
                  resetKey={
                    turnstileResetKey
                  }
                  theme={
                    resolvedTheme ===
                    'dark'
                      ? 'dark'
                      : 'light'
                  }
                  onVerify={
                    handleTurnstileVerify
                  }
                  onExpire={
                    handleTurnstileExpire
                  }
                  onError={
                    handleTurnstileError
                  }
                />
              </div>

              <button
                type="submit"
                disabled={
                  submitting ||
                  !turnstileToken
                }
                className="
                  mt-8
                  inline-flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-600
                  px-6 py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-cyan-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-500
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:w-auto
                  dark:bg-cyan-400
                  dark:text-slate-950
                  dark:hover:bg-cyan-300
                  dark:focus:ring-offset-slate-900
                "
              >
                {submitting
                  ? 'Sending...'
                  : 'Send message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage