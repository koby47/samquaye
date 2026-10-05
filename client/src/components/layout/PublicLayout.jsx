import { Outlet } from 'react-router-dom'

import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'

function PublicLayout() {
  return (
    <div
      className="
        flex min-h-screen flex-col
        bg-slate-50
        text-slate-950
        transition-colors
        dark:bg-slate-950
        dark:text-white
      "
    >
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default PublicLayout