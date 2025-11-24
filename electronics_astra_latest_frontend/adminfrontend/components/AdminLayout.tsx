'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, FileText, Settings, LogOut, Menu, X,
  Shield, Zap, User
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Problems', href: '/dashboard/problems', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    router.push('/login')
  }

  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    setAdminEmail(localStorage.getItem('adminEmail') || '')
  }, [])

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white border-r-4 border-black z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6 border-b-3 border-black">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl border-2 border-black">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-display font-black text-black">
                        Admin Portal
                      </h1>
                      <p className="text-xs text-gray-600 font-semibold">
                        Electronics<span className="text-secondary-500">Astra</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                      <motion.button
                        key={item.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          router.push(item.href)
                          setSidebarOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                          isActive
                            ? 'bg-secondary-500 text-white border-2 border-black shadow-button'
                            : 'text-gray-700 hover:bg-neutral-100 border-2 border-transparent'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </motion.button>
                    )
                  })}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t-3 border-black">
                  <div className="flex items-center gap-3 mb-3 p-3 bg-neutral-50 rounded-xl border-2 border-gray-200">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center border-2 border-black">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black truncate">Admin</p>
                      <p className="text-xs text-gray-600 truncate">{adminEmail}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-black border-3 border-black shadow-button hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </motion.button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-72 bg-white border-r-4 border-black z-50 hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b-3 border-black">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl border-2 border-black">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-display font-black text-black">
                  Admin Portal
                </h1>
                <p className="text-xs text-gray-600 font-semibold">
                  Electronics<span className="text-secondary-500">Astra</span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    isActive
                      ? 'bg-secondary-500 text-white border-2 border-black shadow-button'
                      : 'text-gray-700 hover:bg-neutral-100 border-2 border-transparent'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </motion.button>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t-3 border-black">
            <div className="flex items-center gap-3 mb-3 p-3 bg-neutral-50 rounded-xl border-2 border-gray-200">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center border-2 border-black">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black truncate">Admin</p>
                <p className="text-xs text-gray-600 truncate">{adminEmail}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-black border-3 border-black shadow-button hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b-3 border-black">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="flex items-center gap-2 ml-auto">
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold border-2 border-green-300">
                ● Online
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
