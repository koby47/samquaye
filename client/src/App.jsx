import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import PublicLayout from './components/layout/PublicLayout.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'

import ProtectedRoute from './components/auth/ProtectedRoute.jsx'

import HomePage from './pages/public/HomePage.jsx'
import ProjectsPage from './pages/public/ProjectsPage.jsx'
import ProjectDetailPage from './pages/public/ProjectDetailPage.jsx'
import ContactPage from './pages/public/ContactPage.jsx'

import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminProjectsPage from './pages/admin/AdminProjectsPage.jsx'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage.jsx'
import AdminMediaPage from './pages/admin/AdminMediaPage.jsx'
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage.jsx'
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx'
import AdminAuditPage from './pages/admin/AdminAuditPage.jsx'
import AdminProjectCreatePage from './pages/admin/AdminProjectCreatePage.jsx'
import AdminProjectEditPage from './pages/admin/AdminProjectEditPage.jsx'

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/projects"
          element={<ProjectsPage />}
        />

        <Route
          path="/projects/:slug"
          element={
            <ProjectDetailPage />
          }
        />

        <Route
          path="/contact"
          element={<ContactPage />}
        />
      </Route>

      {/* Admin login */}
      <Route
        path="/admin/login"
        element={<AdminLoginPage />}
      />

      {/* Protected admin */}
      <Route
        element={<ProtectedRoute />}
      >
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route
            index
            element={
              <AdminDashboardPage />
            }
          />

          <Route
            path="projects"
            element={
              <AdminProjectsPage />
            }
          />

          <Route
  path="projects/new"
  element={
    <AdminProjectCreatePage />
  }
/>

<Route
  path="projects/:id/edit"
  element={
    <AdminProjectEditPage />
  }
/>

          <Route
            path="categories"
            element={
              <AdminCategoriesPage />
            }
          />

          <Route
            path="media"
            element={
              <AdminMediaPage />
            }
          />

          <Route
            path="enquiries"
            element={
              <AdminEnquiriesPage />
            }
          />

          <Route
            path="settings"
            element={
              <AdminSettingsPage />
            }
          />

          <Route
            path="audit"
            element={
              <AdminAuditPage />
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  )
}

export default App