import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  deleteAdminEnquiry,
  getAdminEnquiries,
  updateAdminEnquiryStatus,
} from '../../services/contactService.js'

const STATUSES = [
  'new',
  'read',
  'replied',
  'archived',
]

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date =
    new Date(value)

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
      timeStyle: 'short',
    },
  ).format(date)
}

function statusLabel(status) {
  switch (status) {
    case 'new':
      return 'New'

    case 'read':
      return 'Read'

    case 'replied':
      return 'Replied'

    case 'archived':
      return 'Archived'

    default:
      return status
  }
}

function AdminEnquiriesPage() {
  const [
    enquiries,
    setEnquiries,
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
    selectedEnquiry,
    setSelectedEnquiry,
  ] = useState(null)

  const [
    updatingId,
    setUpdatingId,
  ] = useState(null)

  const [
    deletingId,
    setDeletingId,
  ] = useState(null)

  const loadEnquiries =
    useCallback(async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await getAdminEnquiries()

        setEnquiries(
          Array.isArray(
            response?.enquiries,
          )
            ? response.enquiries
            : [],
        )
      } catch (requestError) {
        setError(
          requestError?.message ||
            'Unable to load enquiries.',
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    loadEnquiries()
  }, [loadEnquiries])

  const statistics =
    useMemo(() => {
      return {
        total:
          enquiries.length,

        new:
          enquiries.filter(
            (enquiry) =>
              enquiry.status ===
              'new',
          ).length,

        read:
          enquiries.filter(
            (enquiry) =>
              enquiry.status ===
              'read',
          ).length,

        replied:
          enquiries.filter(
            (enquiry) =>
              enquiry.status ===
              'replied',
          ).length,

        archived:
          enquiries.filter(
            (enquiry) =>
              enquiry.status ===
              'archived',
          ).length,
      }
    }, [enquiries])

  const filteredEnquiries =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      return enquiries.filter(
        (enquiry) => {
          if (
            filter !== 'all' &&
            enquiry.status !==
              filter
          ) {
            return false
          }

          if (!query) {
            return true
          }

          return [
            enquiry.name,
            enquiry.email,
            enquiry.subject,
            enquiry.message,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        },
      )
    }, [
      enquiries,
      search,
      filter,
    ])

  function replaceEnquiry(
    updatedEnquiry,
  ) {
    setEnquiries(
      (current) =>
        current.map(
          (enquiry) =>
            enquiry._id ===
            updatedEnquiry._id
              ? updatedEnquiry
              : enquiry,
        ),
    )

    setSelectedEnquiry(
      (current) =>
        current?._id ===
        updatedEnquiry._id
          ? updatedEnquiry
          : current,
    )
  }

  async function updateStatus(
    enquiry,
    status,
    {
      showSuccess = true,
    } = {},
  ) {
    if (
      enquiry.status === status
    ) {
      return enquiry
    }

    try {
      setUpdatingId(
        enquiry._id,
      )

      setError('')

      if (showSuccess) {
        setSuccess('')
      }

      const response =
        await updateAdminEnquiryStatus(
          enquiry._id,
          status,
        )

      const updatedEnquiry =
        response?.enquiry

      if (updatedEnquiry) {
        replaceEnquiry(
          updatedEnquiry,
        )

        if (showSuccess) {
          setSuccess(
            `Enquiry marked as ${statusLabel(
              status,
            ).toLowerCase()}.`,
          )
        }

        return updatedEnquiry
      }

      await loadEnquiries()

      return null
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to update enquiry.',
      )

      return null
    } finally {
      setUpdatingId(null)
    }
  }

  async function openEnquiry(
    enquiry,
  ) {
    setSelectedEnquiry(
      enquiry,
    )

    setError('')
    setSuccess('')

    /*
     * Opening a new enquiry counts
     * as reading it.
     *
     * The backend sets readAt the
     * first time status becomes read.
     */
    if (
      enquiry.status === 'new'
    ) {
      await updateStatus(
        enquiry,
        'read',
        {
          showSuccess: false,
        },
      )
    }
  }

  async function handleDelete(
    enquiry,
  ) {
    const confirmed =
      window.confirm(
        `Delete the enquiry from "${enquiry.name}"?\n\nThis permanently removes the enquiry.`,
      )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(
        enquiry._id,
      )

      setError('')
      setSuccess('')

      await deleteAdminEnquiry(
        enquiry._id,
      )

      setEnquiries(
        (current) =>
          current.filter(
            (item) =>
              item._id !==
              enquiry._id,
          ),
      )

      if (
        selectedEnquiry?._id ===
        enquiry._id
      ) {
        setSelectedEnquiry(
          null,
        )
      }

      setSuccess(
        'Enquiry deleted successfully.',
      )
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to delete enquiry.',
      )
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
          Communication
        </p>

        <h1
          className="
            mt-2
            text-3xl
            font-bold
            tracking-tight
          "
        >
          Enquiries
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
          Review and manage messages
          submitted through your
          portfolio contact form.
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
            flex
            flex-col
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            text-red-700
            sm:flex-row
            sm:items-center
            sm:justify-between
            dark:border-red-900
            dark:bg-red-950/30
            dark:text-red-300
          "
        >
          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={
              loadEnquiries
            }
            className="
              shrink-0
              font-semibold
            "
          >
            Reload
          </button>
        </div>
      )}

      {/* Statistics */}
      <div
        className="
          mt-8
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-5
        "
      >
        <StatCard
          label="Total"
          value={
            statistics.total
          }
        />

        <StatCard
          label="New"
          value={
            statistics.new
          }
        />

        <StatCard
          label="Read"
          value={
            statistics.read
          }
        />

        <StatCard
          label="Replied"
          value={
            statistics.replied
          }
        />

        <StatCard
          label="Archived"
          value={
            statistics.archived
          }
        />
      </div>

      {/* Filters */}
      <section
        className="
          mt-6
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            lg:flex-row
          "
        >
          <input
            type="search"
            value={search}
            onChange={(
              event,
            ) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search name, email, subject or message..."
            aria-label="Search enquiries"
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

          <select
            value={filter}
            onChange={(
              event,
            ) =>
              setFilter(
                event.target.value,
              )
            }
            aria-label="Filter enquiries"
            className="
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
            <option value="all">
              All enquiries
            </option>

            {STATUSES.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {statusLabel(
                    status,
                  )}
                </option>
              ),
            )}
          </select>
        </div>
      </section>

      {/* Inbox */}
      <section
        className="
          mt-6
          overflow-hidden
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
            flex
            items-center
            justify-between
            gap-4
            border-b
            border-slate-200
            p-5
            dark:border-slate-800
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Inbox
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
                filteredEnquiries
                  .length
              }{' '}
              {filteredEnquiries
                .length === 1
                ? 'message'
                : 'messages'}
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadEnquiries
            }
            disabled={loading}
            className="
              rounded-lg
              border
              border-slate-300
              px-3 py-2
              text-xs
              font-semibold
              transition
              hover:bg-slate-50
              disabled:opacity-50
              dark:border-slate-700
              dark:hover:bg-slate-800
            "
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <LoadingList />
        ) : filteredEnquiries
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
              No enquiries found
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
                : 'New contact enquiries will appear here.'}
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
            {filteredEnquiries.map(
              (enquiry) => (
                <EnquiryRow
                  key={
                    enquiry._id
                  }
                  enquiry={
                    enquiry
                  }
                  updating={
                    updatingId ===
                    enquiry._id
                  }
                  deleting={
                    deletingId ===
                    enquiry._id
                  }
                  onOpen={() =>
                    openEnquiry(
                      enquiry,
                    )
                  }
                  onStatusChange={(
                    status,
                  ) =>
                    updateStatus(
                      enquiry,
                      status,
                    )
                  }
                  onDelete={() =>
                    handleDelete(
                      enquiry,
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </section>

      {/* Enquiry modal */}
      {selectedEnquiry && (
        <EnquiryModal
          enquiry={
            selectedEnquiry
          }
          updating={
            updatingId ===
            selectedEnquiry._id
          }
          deleting={
            deletingId ===
            selectedEnquiry._id
          }
          onClose={() =>
            setSelectedEnquiry(
              null,
            )
          }
          onStatusChange={(
            status,
          ) =>
            updateStatus(
              selectedEnquiry,
              status,
            )
          }
          onDelete={() =>
            handleDelete(
              selectedEnquiry,
            )
          }
        />
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

function LoadingList() {
  return (
    <div className="p-5">
      <div className="space-y-3">
        {Array.from({
          length: 5,
        }).map(
          (_, index) => (
            <div
              key={index}
              className="
                h-28
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
  )
}

function EnquiryRow({
  enquiry,
  updating,
  deleting,
  onOpen,
  onStatusChange,
  onDelete,
}) {
  return (
    <article
      className={`
        p-5
        transition
        ${
          enquiry.status ===
          'new'
            ? `
              bg-cyan-50/40
              dark:bg-cyan-950/10
            `
            : ''
        }
      `}
    >
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
        <button
          type="button"
          onClick={onOpen}
          className="
            min-w-0
            flex-1
            text-left
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <h3
              className={`
                text-sm
                ${
                  enquiry.status ===
                  'new'
                    ? 'font-bold'
                    : 'font-semibold'
                }
              `}
            >
              {enquiry.name}
            </h3>

            <StatusBadge
              status={
                enquiry.status
              }
            />
          </div>

          <p
            className="
              mt-1
              truncate
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            {enquiry.email}
          </p>

          <p
            className="
              mt-3
              font-semibold
              text-slate-800
              dark:text-slate-200
            "
          >
            {enquiry.subject}
          </p>

          <p
            className="
              mt-1
              line-clamp-2
              text-sm
              leading-6
              text-slate-600
              dark:text-slate-400
            "
          >
            {enquiry.message}
          </p>

          <p
            className="
              mt-3
              text-xs
              text-slate-400
            "
          >
            {formatDate(
              enquiry.createdAt,
            )}
          </p>
        </button>

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
            onClick={onOpen}
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
            View
          </button>

          <select
            value={
              enquiry.status
            }
            onChange={(
              event,
            ) =>
              onStatusChange(
                event.target.value,
              )
            }
            disabled={updating}
            aria-label={`Change status for ${enquiry.name}`}
            className="
              rounded-lg
              border
              border-slate-300
              bg-white
              px-3 py-2
              text-xs
              font-semibold
              outline-none
              disabled:opacity-50
              dark:border-slate-700
              dark:bg-slate-950
              dark:text-white
            "
          >
            {STATUSES.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {statusLabel(
                    status,
                  )}
                </option>
              ),
            )}
          </select>

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

function StatusBadge({
  status,
}) {
  const styles = {
    new: `
      bg-cyan-100
      text-cyan-700
      dark:bg-cyan-950/50
      dark:text-cyan-300
    `,

    read: `
      bg-slate-100
      text-slate-700
      dark:bg-slate-800
      dark:text-slate-300
    `,

    replied: `
      bg-emerald-100
      text-emerald-700
      dark:bg-emerald-950/50
      dark:text-emerald-300
    `,

    archived: `
      bg-amber-100
      text-amber-700
      dark:bg-amber-950/50
      dark:text-amber-300
    `,
  }

  return (
    <span
      className={`
        rounded-full
        px-2.5 py-1
        text-[10px]
        font-bold
        uppercase
        tracking-wider
        ${
          styles[status] ||
          styles.read
        }
      `}
    >
      {statusLabel(status)}
    </span>
  )
}

function EnquiryModal({
  enquiry,
  updating,
  deleting,
  onClose,
  onStatusChange,
  onDelete,
}) {
  const replySubject =
    encodeURIComponent(
      `Re: ${enquiry.subject}`,
    )

  const replyUrl =
    `mailto:${enquiry.email}?subject=${replySubject}`

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-950/70
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(
        event,
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Contact enquiry"
        className="
          max-h-[90vh]
          w-full
          max-w-3xl
          overflow-y-auto
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        {/* Modal header */}
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            border-b
            border-slate-200
            p-5
            dark:border-slate-800
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
              <h2
                className="
                  text-lg
                  font-semibold
                "
              >
                {enquiry.subject}
              </h2>

              <StatusBadge
                status={
                  enquiry.status
                }
              />
            </div>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {formatDate(
                enquiry.createdAt,
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              flex
              h-9 w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-slate-300
              text-xl
              transition
              hover:bg-slate-50
              dark:border-slate-700
              dark:hover:bg-slate-800
            "
          >
            ×
          </button>
        </div>

        <div className="p-5">
          {/* Sender */}
          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              p-4
              dark:border-slate-800
              dark:bg-slate-950
            "
          >
            <dl
              className="
                grid
                gap-4
                sm:grid-cols-2
              "
            >
              <Detail
                label="Name"
                value={
                  enquiry.name
                }
              />

              <div>
                <dt
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Email
                </dt>

                <dd className="mt-1">
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="
                      break-all
                      text-sm
                      font-medium
                      text-cyan-600
                      hover:underline
                      dark:text-cyan-400
                    "
                  >
                    {enquiry.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Message */}
          <div className="mt-6">
            <h3
              className="
                text-sm
                font-semibold
              "
            >
              Message
            </h3>

            <div
              className="
                mt-3
                whitespace-pre-wrap
                rounded-xl
                border
                border-slate-200
                p-5
                text-sm
                leading-7
                text-slate-700
                dark:border-slate-800
                dark:text-slate-300
              "
            >
              {enquiry.message}
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-6">
            <h3
              className="
                text-sm
                font-semibold
              "
            >
              Activity
            </h3>

            <dl
              className="
                mt-3
                grid
                gap-4
                rounded-xl
                border
                border-slate-200
                p-4
                sm:grid-cols-2
                dark:border-slate-800
              "
            >
              <Detail
                label="Received"
                value={formatDate(
                  enquiry.createdAt,
                )}
              />

              <Detail
                label="Read"
                value={formatDate(
                  enquiry.readAt,
                )}
              />

              <Detail
                label="Replied"
                value={formatDate(
                  enquiry.repliedAt,
                )}
              />

              <Detail
                label="Archived"
                value={formatDate(
                  enquiry.archivedAt,
                )}
              />
            </dl>
          </div>

          {/* Status */}
          <div className="mt-6">
            <label
              htmlFor="enquiry-status"
              className="
                block
                text-sm
                font-semibold
              "
            >
              Status
            </label>

            <select
              id="enquiry-status"
              value={
                enquiry.status
              }
              onChange={(
                event,
              ) =>
                onStatusChange(
                  event.target
                    .value,
                )
              }
              disabled={updating}
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
              {STATUSES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {statusLabel(
                      status,
                    )}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Actions */}
          <div
            className="
              mt-6
              flex
              flex-col
              gap-3
              border-t
              border-slate-200
              pt-5
              sm:flex-row
              sm:flex-wrap
              sm:justify-end
              dark:border-slate-800
            "
          >
            <button
              type="button"
              onClick={() =>
                onStatusChange(
                  'archived',
                )
              }
              disabled={
                updating ||
                enquiry.status ===
                  'archived'
              }
              className="
                inline-flex
                min-h-10
                items-center
                justify-center
                rounded-lg
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
              Archive
            </button>

            <a
              href={replyUrl}
              className="
                inline-flex
                min-h-10
                items-center
                justify-center
                rounded-lg
                border
                border-cyan-600
                px-4
                text-sm
                font-semibold
                text-cyan-700
                transition
                hover:bg-cyan-50
                dark:border-cyan-400
                dark:text-cyan-300
                dark:hover:bg-cyan-950/30
              "
            >
              Reply by email
            </a>

            <button
              type="button"
              onClick={() =>
                onStatusChange(
                  'replied',
                )
              }
              disabled={
                updating ||
                enquiry.status ===
                  'replied'
              }
              className="
                inline-flex
                min-h-10
                items-center
                justify-center
                rounded-lg
                bg-cyan-600
                px-4
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
              {updating
                ? 'Updating...'
                : 'Mark replied'}
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="
                inline-flex
                min-h-10
                items-center
                justify-center
                rounded-lg
                bg-red-600
                px-4
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-red-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {deleting
                ? 'Deleting...'
                : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Detail({
  label,
  value,
}) {
  return (
    <div>
      <dt
        className="
          text-xs
          font-semibold
          uppercase
          tracking-wider
          text-slate-500
          dark:text-slate-400
        "
      >
        {label}
      </dt>

      <dd
        className="
          mt-1
          wrap-break-word
          text-sm
          text-slate-800
          dark:text-slate-200
        "
      >
        {value}
      </dd>
    </div>
  )
}

export default AdminEnquiriesPage