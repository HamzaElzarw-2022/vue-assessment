import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Layers,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  Menu,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/features/auth/useAuth'
import RightSidebar from '@/shared/components/RightSidebar'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/posts', icon: FileText, label: 'Posts' },
  { to: '/comments', icon: MessageSquare, label: 'Comments' },
]

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  // Extract the base path (e.g., /posts, /users, /comments) for sidebar close navigation
  const basePath = '/' + (location.pathname.split('/')[1] || '')

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Left Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex-col transition-all duration-300 hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Posts Admin
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 text-sm text-slate-500">
          Admin Dashboard v1.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700 md:hidden cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
              A
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 ml-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Global Right Sidebar */}
      <RightSidebar basePath={basePath} />
    </div>
  )
}
