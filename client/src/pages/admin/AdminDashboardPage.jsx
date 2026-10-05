import { useCallback, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getAdminDashboard } from "../../services/dashboardService.js";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatAction(action) {
  if (!action) {
    return "Activity recorded";
  }

  return action
    .replaceAll(".", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function StatusBadge({ status }) {
  const styles = {
    new: `
      bg-cyan-50
      text-cyan-700
      dark:bg-cyan-950/40
      dark:text-cyan-400
    `,

    read: `
      bg-slate-100
      text-slate-700
      dark:bg-slate-800
      dark:text-slate-300
    `,

    replied: `
      bg-emerald-50
      text-emerald-700
      dark:bg-emerald-950/40
      dark:text-emerald-400
    `,

    archived: `
      bg-amber-50
      text-amber-700
      dark:bg-amber-950/40
      dark:text-amber-400
    `,
  };

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5 py-1
        text-xs
        font-semibold
        capitalize
        ${styles[status] || styles.read}
      `}
    >
      {status || "Unknown"}
    </span>
  );
}

function StatCard({ label, value, description, to, icon }) {
  const content = (
    <div
      className="
        h-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        transition
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
          <p
            className="
              text-sm
              font-medium
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
              text-slate-950
              dark:text-white
            "
          >
            {value}
          </p>
        </div>

        <div
          className="
            flex
            h-11 w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-cyan-50
            text-cyan-700
            dark:bg-cyan-950/40
            dark:text-cyan-400
          "
        >
          <span className="h-5 w-5">{icon}</span>
        </div>
      </div>

      {description && (
        <p
          className="
            mt-4
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          {description}
        </p>
      )}
    </div>
  );

  if (!to) {
    return content;
  }

  return (
    <Link
      to={to}
      className="
        block
        rounded-2xl
        outline-none
        transition
        hover:-translate-y-0.5
        hover:shadow-sm
        focus-visible:ring-2
        focus-visible:ring-cyan-500
        focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-slate-950
      "
    >
      {content}
    </Link>
  );
}

function LoadingDashboard() {
  return (
    <div
      className="
        grid
        gap-5
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="
            h-36
            animate-pulse
            rounded-2xl
            border
            border-slate-200
            bg-white
            dark:border-slate-800
            dark:bg-slate-900
          "
        />
      ))}
    </div>
  );
}

function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminDashboard();

      setDashboard(response?.dashboard || null);
    } catch (requestError) {
      console.error("Unable to load dashboard:", requestError);

      setError(requestError?.message || "Unable to load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const projects = dashboard?.projects || {
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
  };

  const categories = dashboard?.categories || {
    total: 0,
  };

  const media = dashboard?.media || {
    total: 0,
  };

  const enquiries = dashboard?.enquiries || {
    total: 0,
    new: 0,
  };

  const recentEnquiries = Array.isArray(dashboard?.recentEnquiries)
    ? dashboard.recentEnquiries
    : [];

  const recentActivity = Array.isArray(dashboard?.recentActivity)
    ? dashboard.recentActivity
    : [];

  return (
    <div>
      {/* Page heading */}
      <div
        className="
          flex
          flex-col
          gap-5
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
            Overview
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
              dark:text-white
            "
          >
            Dashboard
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
            Monitor portfolio content, enquiries and recent administrative
            activity.
          </p>
        </div>

        <Link
          to="/admin/projects"
          className="
            inline-flex
            min-h-11
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
            dark:bg-cyan-400
            dark:text-slate-950
            dark:hover:bg-cyan-300
          "
        >
          Manage projects
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="
            mt-8
            flex
            flex-col
            gap-4
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-5
            sm:flex-row
            sm:items-center
            sm:justify-between
            dark:border-red-900
            dark:bg-red-950/30
          "
        >
          <div>
            <p
              className="
                font-semibold
                text-red-800
                dark:text-red-300
              "
            >
              Dashboard unavailable
            </p>

            <p
              className="
                mt-1
                text-sm
                text-red-700
                dark:text-red-400
              "
            >
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            className="
              rounded-lg
              border
              border-red-300
              px-4 py-2
              text-sm
              font-semibold
              text-red-700
              transition
              hover:bg-red-100
              dark:border-red-800
              dark:text-red-300
              dark:hover:bg-red-950
            "
          >
            Try again
          </button>
        </div>
      )}

      {/* Main statistics */}
      <section className="mt-8">
        {loading ? (
          <LoadingDashboard />
        ) : (
          <div
            className="
              grid
              gap-5
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            <StatCard
              label="Projects"
              value={projects.total}
              description={`${projects.published} published · ${projects.draft} draft`}
              to="/admin/projects"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 5h16v14H4z" />
                  <path d="M8 9h8" />
                  <path d="M8 13h5" />
                </svg>
              }
            />

            <StatCard
              label="Categories"
              value={categories.total}
              description="Project categories"
              to="/admin/categories"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="4" y="4" width="6" height="6" />
                  <rect x="14" y="4" width="6" height="6" />
                  <rect x="4" y="14" width="6" height="6" />
                  <rect x="14" y="14" width="6" height="6" />
                </svg>
              }
            />

            <StatCard
              label="Media"
              value={media.total}
              description="Active media assets"
              to="/admin/media"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="m21 15-5-5L5 20" />
                </svg>
              }
            />

            <StatCard
              label="Enquiries"
              value={enquiries.total}
              description={`${enquiries.new} new ${
                enquiries.new === 1 ? "enquiry" : "enquiries"
              }`}
              to="/admin/enquiries"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 5h16v14H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              }
            />
          </div>
        )}
      </section>

      {/* Project status */}
      {!loading && !error && (
        <section className="mt-6">
          <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                dark:border-slate-800
                dark:bg-slate-900
              "
          >
            <div
              className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-4
                "
            >
              <div>
                <h2
                  className="
                      text-lg
                      font-semibold
                      text-slate-950
                      dark:text-white
                    "
                >
                  Project status
                </h2>

                <p
                  className="
                      mt-1
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                >
                  Current project distribution.
                </p>
              </div>

              <Link
                to="/admin/projects"
                className="
                    text-sm
                    font-semibold
                    text-cyan-600
                    transition
                    hover:text-cyan-700
                    dark:text-cyan-400
                    dark:hover:text-cyan-300
                  "
              >
                View projects →
              </Link>
            </div>

            <div
              className="
                  mt-6
                  grid
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-4
                "
            >
              <div
                className="
                    rounded-xl
                    bg-slate-50
                    p-4
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
                  Total
                </p>

                <p
                  className="
                      mt-1
                      text-2xl
                      font-bold
                    "
                >
                  {projects.total}
                </p>
              </div>

              <div
                className="
                    rounded-xl
                    bg-slate-50
                    p-4
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
                  Published
                </p>

                <p
                  className="
                      mt-1
                      text-2xl
                      font-bold
                      text-emerald-600
                      dark:text-emerald-400
                    "
                >
                  {projects.published}
                </p>
              </div>

              <div
                className="
                    rounded-xl
                    bg-slate-50
                    p-4
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
                  Draft
                </p>

                <p
                  className="
                      mt-1
                      text-2xl
                      font-bold
                      text-amber-600
                      dark:text-amber-400
                    "
                >
                  {projects.draft}
                </p>
              </div>

              <div
                className="
                    rounded-xl
                    bg-slate-50
                    p-4
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
                  Archived
                </p>

                <p
                  className="
                      mt-1
                      text-2xl
                      font-bold
                      text-slate-600
                      dark:text-slate-300
                    "
                >
                  {projects.archived}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enquiries + activity */}
      {!loading && !error && (
        <div
          className="
              mt-6
              grid
              gap-6
              xl:grid-cols-2
            "
        >
          {/* Recent enquiries */}
          <section
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
            <div
              className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-slate-200
                  px-6 py-5
                  dark:border-slate-800
                "
            >
              <div>
                <h2
                  className="
                      font-semibold
                      text-slate-950
                      dark:text-white
                    "
                >
                  Recent enquiries
                </h2>

                <p
                  className="
                      mt-1
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                >
                  Latest messages received through your portfolio.
                </p>
              </div>

              <Link
                to="/admin/enquiries"
                className="
                    shrink-0
                    text-sm
                    font-semibold
                    text-cyan-600
                    dark:text-cyan-400
                  "
              >
                View all
              </Link>
            </div>

            {recentEnquiries.length === 0 ? (
              <div
                className="
                    px-6 py-10
                    text-center
                  "
              >
                <p
                  className="
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                >
                  No enquiries have been received yet.
                </p>
              </div>
            ) : (
              <div>
                {recentEnquiries.map((enquiry) => (
                  <div
                    key={enquiry._id}
                    className="
    border-b
    border-slate-100
    px-6 py-4
    last:border-b-0
    dark:border-slate-800
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
                      <div className="min-w-0">
                        <p
                          className="
                                truncate
                                text-sm
                                font-semibold
                                text-slate-950
                                dark:text-white
                              "
                        >
                          {enquiry.subject}
                        </p>

                        <p
                          className="
                                mt-1
                                truncate
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                              "
                        >
                          {enquiry.name} · {enquiry.email}
                        </p>

                        <p
                          className="
                                mt-2
                                text-xs
                                text-slate-400
                                dark:text-slate-500
                              "
                        >
                          {formatDate(enquiry.createdAt)}
                        </p>
                      </div>

                      <StatusBadge status={enquiry.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent activity */}
          <section
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
            <div
              className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  border-b
                  border-slate-200
                  px-6 py-5
                  dark:border-slate-800
                "
            >
              <div>
                <h2
                  className="
                      font-semibold
                      text-slate-950
                      dark:text-white
                    "
                >
                  Recent activity
                </h2>

                <p
                  className="
                      mt-1
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                >
                  Latest recorded administrative actions.
                </p>
              </div>

              <Link
                to="/admin/audit"
                className="
                    shrink-0
                    text-sm
                    font-semibold
                    text-cyan-600
                    dark:text-cyan-400
                  "
              >
                Audit log
              </Link>
            </div>

            {recentActivity.length === 0 ? (
              <div
                className="
                    px-6 py-10
                    text-center
                  "
              >
                <p
                  className="
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                >
                  No administrative activity has been recorded yet.
                </p>
              </div>
            ) : (
              <div>
                {recentActivity.map((activity) => (
                  <div
                    key={activity._id}
                    className="
                          border-b
                          border-slate-100
                          px-6 py-4
                          last:border-b-0
                          dark:border-slate-800
                        "
                  >
                    <div
                      className="
                            flex
                            gap-3
                          "
                    >
                      <div
                        className="
                              mt-1
                              h-2 w-2
                              shrink-0
                              rounded-full
                              bg-cyan-500
                            "
                      />

                      <div className="min-w-0">
                        <p
                          className="
                                text-sm
                                font-medium
                                text-slate-800
                                dark:text-slate-200
                              "
                        >
                          {formatAction(activity.action)}
                        </p>

                        {activity.actor && (
                          <p
                            className="
                                  mt-1
                                  truncate
                                  text-xs
                                  text-slate-500
                                  dark:text-slate-400
                                "
                          >
                            {activity.actor.name ||
                              activity.actor.email ||
                              "Administrator"}
                          </p>
                        )}

                        <p
                          className="
                                mt-1
                                text-xs
                                text-slate-400
                                dark:text-slate-500
                              "
                        >
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Quick actions */}
      {!loading && !error && (
        <section className="mt-6">
          <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
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
              Quick actions
            </h2>

            <div
              className="
                  mt-5
                  grid
                  gap-3
                  sm:grid-cols-2
                  lg:grid-cols-4
                "
            >
              <Link
                to="/admin/projects"
                className="
                    rounded-xl
                    border
                    border-slate-200
                    p-4
                    text-sm
                    font-semibold
                    transition
                    hover:border-cyan-300
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    dark:border-slate-700
                    dark:hover:border-cyan-800
                    dark:hover:bg-cyan-950/30
                    dark:hover:text-cyan-400
                  "
              >
                Manage projects →
              </Link>

              <Link
                to="/admin/media"
                className="
                    rounded-xl
                    border
                    border-slate-200
                    p-4
                    text-sm
                    font-semibold
                    transition
                    hover:border-cyan-300
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    dark:border-slate-700
                    dark:hover:border-cyan-800
                    dark:hover:bg-cyan-950/30
                    dark:hover:text-cyan-400
                  "
              >
                Media library →
              </Link>

              <Link
                to="/admin/enquiries"
                className="
                    rounded-xl
                    border
                    border-slate-200
                    p-4
                    text-sm
                    font-semibold
                    transition
                    hover:border-cyan-300
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    dark:border-slate-700
                    dark:hover:border-cyan-800
                    dark:hover:bg-cyan-950/30
                    dark:hover:text-cyan-400
                  "
              >
                View enquiries →
              </Link>

              <Link
                to="/admin/settings"
                className="
                    rounded-xl
                    border
                    border-slate-200
                    p-4
                    text-sm
                    font-semibold
                    transition
                    hover:border-cyan-300
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    dark:border-slate-700
                    dark:hover:border-cyan-800
                    dark:hover:bg-cyan-950/30
                    dark:hover:text-cyan-400
                  "
              >
                Portfolio settings →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminDashboardPage;
