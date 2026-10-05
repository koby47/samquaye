import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  getAdminAuditLog,
  getAdminAuditLogs,
} from '../../services/auditService.js'

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
      timeStyle: 'short',
    },
  ).format(date)
}

function formatAction(action) {
  if (!action) {
    return 'Unknown action'
  }

  return action
    .replace(/\./g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    )
}

function formatResourceType(
  resourceType,
) {
  if (!resourceType) {
    return 'Unknown'
  }

  return resourceType
    .replace(
      /([a-z])([A-Z])/g,
      '$1 $2',
    )
    .trim()
}

function getActorName(actor) {
  if (!actor) {
    return 'System'
  }

  if (
    typeof actor === 'string'
  ) {
    return actor
  }

  return (
    actor.name ||
    actor.email ||
    'Admin'
  )
}

function getActorEmail(actor) {
  if (
    !actor ||
    typeof actor === 'string'
  ) {
    return ''
  }

  return actor.email || ''
}

function AdminAuditPage() {
  const [
    auditLogs,
    setAuditLogs,
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
    search,
    setSearch,
  ] = useState('')

  const [
    actionFilter,
    setActionFilter,
  ] = useState('all')

  const [
    resourceFilter,
    setResourceFilter,
  ] = useState('all')

  const [
    selectedLog,
    setSelectedLog,
  ] = useState(null)

  const [
    detailLoading,
    setDetailLoading,
  ] = useState(false)

  const loadAuditLogs =
    useCallback(async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await getAdminAuditLogs({
            limit: 100,
          })

        setAuditLogs(
          Array.isArray(
            response?.auditLogs,
          )
            ? response.auditLogs
            : [],
        )
      } catch (requestError) {
        setError(
          requestError?.message ||
            'Unable to load audit logs.',
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    loadAuditLogs()
  }, [loadAuditLogs])

  const actions =
    useMemo(() => {
      return [
        ...new Set(
          auditLogs
            .map(
              (log) =>
                log.action,
            )
            .filter(Boolean),
        ),
      ].sort()
    }, [auditLogs])

  const resourceTypes =
    useMemo(() => {
      return [
        ...new Set(
          auditLogs
            .map(
              (log) =>
                log.resourceType,
            )
            .filter(Boolean),
        ),
      ].sort()
    }, [auditLogs])

  const filteredLogs =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      return auditLogs.filter(
        (log) => {
          if (
            actionFilter !==
              'all' &&
            log.action !==
              actionFilter
          ) {
            return false
          }

          if (
            resourceFilter !==
              'all' &&
            log.resourceType !==
              resourceFilter
          ) {
            return false
          }

          if (!query) {
            return true
          }

          let metadata = ''

          try {
            metadata =
              JSON.stringify(
                log.metadata || {},
              )
          } catch {
            metadata = ''
          }

          const searchable =
            [
              log.action,
              log.resourceType,
              log.resourceId,
              getActorName(
                log.actor,
              ),
              getActorEmail(
                log.actor,
              ),
              metadata,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase()

          return searchable.includes(
            query,
          )
        },
      )
    }, [
      auditLogs,
      search,
      actionFilter,
      resourceFilter,
    ])

  const statistics =
    useMemo(() => {
      const actorIds =
        new Set()

      auditLogs.forEach(
        (log) => {
          if (
            log.actor &&
            typeof log.actor ===
              'object' &&
            log.actor._id
          ) {
            actorIds.add(
              log.actor._id,
            )
          } else if (
            typeof log.actor ===
            'string'
          ) {
            actorIds.add(
              log.actor,
            )
          }
        },
      )

      return {
        loaded:
          auditLogs.length,

        actions:
          actions.length,

        resources:
          resourceTypes.length,

        actors:
          actorIds.size,
      }
    }, [
      auditLogs,
      actions,
      resourceTypes,
    ])

  async function openLog(
    log,
  ) {
    try {
      setSelectedLog(log)
      setDetailLoading(true)
      setError('')

      const response =
        await getAdminAuditLog(
          log._id,
        )

      if (
        response?.auditLog
      ) {
        setSelectedLog(
          response.auditLog,
        )
      }
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to load audit log details.',
      )
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-end
          sm:justify-between
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
            Security &amp;
            accountability
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
            "
          >
            Audit Logs
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
            Review administrative
            activity recorded by the
            portfolio API. Audit
            records are read-only.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAuditLogs}
          disabled={loading}
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
            disabled:opacity-50
            dark:border-slate-700
            dark:hover:bg-slate-800
          "
        >
          {loading
            ? 'Refreshing...'
            : 'Refresh logs'}
        </button>
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

      {/* Stats */}
      <div
        className="
          mt-8
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <StatCard
          label="Loaded records"
          value={
            statistics.loaded
          }
        />

        <StatCard
          label="Action types"
          value={
            statistics.actions
          }
        />

        <StatCard
          label="Resource types"
          value={
            statistics.resources
          }
        />

        <StatCard
          label="Admin actors"
          value={
            statistics.actors
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
            grid
            gap-3
            lg:grid-cols-[minmax(0,1fr)_220px_220px]
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
            placeholder="Search action, resource, actor or metadata..."
            aria-label="Search audit logs"
            className="
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4 py-3
              text-sm
              text-slate-950
              outline-none
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
            value={
              actionFilter
            }
            onChange={(
              event,
            ) =>
              setActionFilter(
                event.target.value,
              )
            }
            aria-label="Filter by action"
            className="
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4 py-3
              text-sm
              outline-none
              dark:border-slate-700
              dark:bg-slate-950
              dark:text-white
            "
          >
            <option value="all">
              All actions
            </option>

            {actions.map(
              (action) => (
                <option
                  key={action}
                  value={action}
                >
                  {formatAction(
                    action,
                  )}
                </option>
              ),
            )}
          </select>

          <select
            value={
              resourceFilter
            }
            onChange={(
              event,
            ) =>
              setResourceFilter(
                event.target.value,
              )
            }
            aria-label="Filter by resource"
            className="
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4 py-3
              text-sm
              outline-none
              dark:border-slate-700
              dark:bg-slate-950
              dark:text-white
            "
          >
            <option value="all">
              All resources
            </option>

            {resourceTypes.map(
              (resource) => (
                <option
                  key={
                    resource
                  }
                  value={
                    resource
                  }
                >
                  {formatResourceType(
                    resource,
                  )}
                </option>
              ),
            )}
          </select>
        </div>
      </section>

      {/* Logs */}
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
              Activity history
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Showing{' '}
              {
                filteredLogs.length
              }{' '}
              of{' '}
              {auditLogs.length}{' '}
              loaded records.
            </p>
          </div>

          <span
            className="
              rounded-full
              bg-slate-100
              px-3 py-1
              text-xs
              font-semibold
              text-slate-600
              dark:bg-slate-800
              dark:text-slate-300
            "
          >
            Read only
          </span>
        </div>

        {loading ? (
          <AuditLoading />
        ) : filteredLogs
            .length === 0 ? (
          <div
            className="
              px-6 py-16
              text-center
            "
          >
            <h3
              className="
                font-semibold
              "
            >
              No audit logs found
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
              actionFilter !==
                'all' ||
              resourceFilter !==
                'all'
                ? 'Try changing your search or filters.'
                : 'Administrative activity will appear here.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div
              className="
                hidden
                overflow-x-auto
                md:block
              "
            >
              <table
                className="
                  min-w-full
                  text-left
                "
              >
                <thead
                  className="
                    bg-slate-50
                    text-xs
                    uppercase
                    tracking-wider
                    text-slate-500
                    dark:bg-slate-950
                    dark:text-slate-400
                  "
                >
                  <tr>
                    <th
                      className="
                        px-5 py-3
                        font-semibold
                      "
                    >
                      Action
                    </th>

                    <th
                      className="
                        px-5 py-3
                        font-semibold
                      "
                    >
                      Resource
                    </th>

                    <th
                      className="
                        px-5 py-3
                        font-semibold
                      "
                    >
                      Actor
                    </th>

                    <th
                      className="
                        px-5 py-3
                        font-semibold
                      "
                    >
                      Date
                    </th>

                    <th
                      className="
                        px-5 py-3
                        text-right
                        font-semibold
                      "
                    >
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody
                  className="
                    divide-y
                    divide-slate-200
                    dark:divide-slate-800
                  "
                >
                  {filteredLogs.map(
                    (log) => (
                      <AuditTableRow
                        key={
                          log._id
                        }
                        log={log}
                        onOpen={() =>
                          openLog(
                            log,
                          )
                        }
                      />
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div
              className="
                divide-y
                divide-slate-200
                md:hidden
                dark:divide-slate-800
              "
            >
              {filteredLogs.map(
                (log) => (
                  <AuditMobileRow
                    key={
                      log._id
                    }
                    log={log}
                    onOpen={() =>
                      openLog(log)
                    }
                  />
                ),
              )}
            </div>
          </>
        )}
      </section>

      {selectedLog && (
        <AuditDetailModal
          log={selectedLog}
          loading={
            detailLoading
          }
          onClose={() =>
            setSelectedLog(
              null,
            )
          }
        />
      )}
    </div>
  )
}

function AuditTableRow({
  log,
  onOpen,
}) {
  return (
    <tr
      className="
        transition
        hover:bg-slate-50
        dark:hover:bg-slate-800/50
      "
    >
      <td
        className="
          px-5 py-4
        "
      >
        <ActionBadge
          action={
            log.action
          }
        />
      </td>

      <td
        className="
          px-5 py-4
        "
      >
        <p
          className="
            text-sm
            font-medium
          "
        >
          {formatResourceType(
            log.resourceType,
          )}
        </p>

        {log.resourceId && (
          <p
            className="
              mt-1
              max-w-40
              truncate
              font-mono
              text-[10px]
              text-slate-400
            "
          >
            {log.resourceId}
          </p>
        )}
      </td>

      <td
        className="
          px-5 py-4
        "
      >
        <p
          className="
            text-sm
            font-medium
          "
        >
          {getActorName(
            log.actor,
          )}
        </p>

        {getActorEmail(
          log.actor,
        ) && (
          <p
            className="
              mt-1
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            {getActorEmail(
              log.actor,
            )}
          </p>
        )}
      </td>

      <td
        className="
          whitespace-nowrap
          px-5 py-4
          text-xs
          text-slate-500
          dark:text-slate-400
        "
      >
        {formatDate(
          log.createdAt,
        )}
      </td>

      <td
        className="
          px-5 py-4
          text-right
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
            hover:bg-slate-100
            dark:border-slate-700
            dark:hover:bg-slate-800
          "
        >
          View
        </button>
      </td>
    </tr>
  )
}

function AuditMobileRow({
  log,
  onOpen,
}) {
  return (
    <article className="p-5">
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <ActionBadge
          action={log.action}
        />

        <button
          type="button"
          onClick={onOpen}
          className="
            text-xs
            font-semibold
            text-cyan-600
            dark:text-cyan-400
          "
        >
          View
        </button>
      </div>

      <p
        className="
          mt-3
          text-sm
          font-semibold
        "
      >
        {formatResourceType(
          log.resourceType,
        )}
      </p>

      <p
        className="
          mt-2
          text-xs
          text-slate-500
          dark:text-slate-400
        "
      >
        {getActorName(
          log.actor,
        )}
      </p>

      <p
        className="
          mt-1
          text-xs
          text-slate-400
        "
      >
        {formatDate(
          log.createdAt,
        )}
      </p>
    </article>
  )
}

function ActionBadge({
  action,
}) {
  const prefix =
    action?.split('.')[0]

  const styles = {
    project: `
      bg-cyan-100
      text-cyan-700
      dark:bg-cyan-950/50
      dark:text-cyan-300
    `,

    category: `
      bg-violet-100
      text-violet-700
      dark:bg-violet-950/50
      dark:text-violet-300
    `,

    media: `
      bg-blue-100
      text-blue-700
      dark:bg-blue-950/50
      dark:text-blue-300
    `,

    contact_enquiry: `
      bg-amber-100
      text-amber-700
      dark:bg-amber-950/50
      dark:text-amber-300
    `,

    portfolio: `
      bg-emerald-100
      text-emerald-700
      dark:bg-emerald-950/50
      dark:text-emerald-300
    `,

    auth: `
      bg-slate-100
      text-slate-700
      dark:bg-slate-800
      dark:text-slate-300
    `,
  }

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5 py-1
        text-[10px]
        font-bold
        uppercase
        tracking-wider
        ${
          styles[prefix] ||
          styles.auth
        }
      `}
    >
      {formatAction(action)}
    </span>
  )
}

function AuditDetailModal({
  log,
  loading,
  onClose,
}) {
  let metadata = '{}'

  try {
    metadata =
      JSON.stringify(
        log.metadata || {},
        null,
        2,
      )
  } catch {
    metadata =
      'Unable to display metadata.'
  }

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
        aria-label="Audit log details"
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
          <div>
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
              Audit record
            </p>

            <h2
              className="
                mt-2
                text-xl
                font-semibold
              "
            >
              {formatAction(
                log.action,
              )}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              flex
              h-9 w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-300
              text-xl
              dark:border-slate-700
            "
          >
            ×
          </button>
        </div>

        <div className="p-5">
          {loading && (
            <p
              className="
                mb-5
                text-sm
                text-slate-500
              "
            >
              Loading complete
              record...
            </p>
          )}

          <dl
            className="
              grid
              gap-5
              sm:grid-cols-2
            "
          >
            <Detail
              label="Action"
              value={
                log.action
              }
            />

            <Detail
              label="Resource type"
              value={
                log.resourceType
              }
            />

            <Detail
              label="Actor"
              value={getActorName(
                log.actor,
              )}
            />

            <Detail
              label="Actor email"
              value={
                getActorEmail(
                  log.actor,
                ) || '—'
              }
            />

            <Detail
              label="Resource ID"
              value={
                log.resourceId ||
                '—'
              }
              mono
            />

            <Detail
              label="Recorded"
              value={formatDate(
                log.createdAt,
              )}
            />

            <Detail
              label="Audit ID"
              value={
                log._id || '—'
              }
              mono
            />
          </dl>

          <div className="mt-8">
            <h3
              className="
                text-sm
                font-semibold
              "
            >
              Metadata
            </h3>

            <pre
              className="
                mt-3
                max-h-96
                overflow-auto
                whitespace-pre-wrap
                wrap-break-word
                rounded-xl
                border
                border-slate-200
                bg-slate-950
                p-4
                font-mono
                text-xs
                leading-6
                text-slate-200
                dark:border-slate-700
              "
            >
              {metadata}
            </pre>
          </div>

          <div
            className="
              mt-6
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              p-4
              text-xs
              leading-5
              text-slate-500
              dark:border-slate-800
              dark:bg-slate-950
              dark:text-slate-400
            "
          >
            This record is
            read-only. Audit records
            cannot be edited or
            deleted through the
            portfolio admin
            interface.
          </div>
        </div>
      </div>
    </div>
  )
}

function Detail({
  label,
  value,
  mono = false,
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
        className={`
          mt-1
          break-all
          text-sm
          text-slate-800
          dark:text-slate-200
          ${
            mono
              ? 'font-mono text-xs'
              : ''
          }
        `}
      >
        {value}
      </dd>
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

function AuditLoading() {
  return (
    <div className="p-5">
      <div className="space-y-3">
        {Array.from({
          length: 6,
        }).map(
          (_, index) => (
            <div
              key={index}
              className="
                h-16
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

export default AdminAuditPage