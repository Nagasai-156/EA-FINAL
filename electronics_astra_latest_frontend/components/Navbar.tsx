'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Menu, X, User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false)
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="container mx-auto bg-white rounded-full border-4 border-black shadow-sticker px-6 py-3"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl border-2 border-black"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-display font-black text-black">
              Electronics<span className="text-secondary-500">Astra</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-secondary-500 transition-colors font-bold text-base">
              Home
            </Link>
            <Link href="/problems" className="text-gray-700 hover:text-secondary-500 transition-colors font-bold text-base">
              Problems
            </Link>
            <Link href="/tutorials" className="text-gray-700 hover:text-secondary-500 transition-colors font-bold text-base">
              Tutorials
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-secondary-500 transition-colors font-bold text-base">
              Profile
            </Link>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary-100 text-primary-700 rounded-full font-bold border-2 border-primary-300 hover:border-primary-500 transition-all text-base"
                >
                  <User className="w-4 h-4" />
                  <span>{user.firstName}</span>
                </button>
                
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-neutral-100 transition-colors font-bold text-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 transition-colors font-bold text-red-600 border-t-2 border-gray-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/signin" 
                  className="px-5 py-2.5 text-gray-700 hover:text-secondary-500 font-bold border-2 border-gray-300 rounded-full hover:border-secondary-500 transition-all text-base"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="px-5 py-2.5 bg-secondary-500 text-white rounded-full font-black border-3 border-black shadow-button hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-base"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-black hover:bg-neutral-100 rounded-full transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-3 border-t-2 border-black pt-4"
          >
            <Link href="/" className="block text-gray-700 hover:text-secondary-500 transition-colors font-bold py-2">
              Home
            </Link>
            <Link href="/problems" className="block text-gray-700 hover:text-secondary-500 transition-colors font-bold py-2">
              Problems
            </Link>
            <Link href="/tutorials" className="block text-gray-700 hover:text-secondary-500 transition-colors font-bold py-2">
              Tutorials
            </Link>
            <Link href="/profile" className="block text-gray-700 hover:text-secondary-500 transition-colors font-bold py-2">
              Profile
            </Link>
            <div className="flex gap-3 mt-4">
              {isAuthenticated && user ? (
                <>
                  <div className="flex-1 px-4 py-2.5 bg-primary-100 text-primary-700 rounded-full font-bold border-2 border-primary-300 text-center">
                    {user.firstName}
                  </div>
                  <button
                    onClick={signOut}
                    className="flex-1 text-center px-4 py-2.5 bg-red-500 text-white rounded-full font-black border-3 border-black shadow-button"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/signin" 
                    className="flex-1 text-center px-4 py-2.5 text-gray-700 font-bold border-2 border-gray-300 rounded-full hover:border-secondary-500 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/signup" 
                    className="flex-1 text-center px-4 py-2.5 bg-secondary-500 text-white rounded-full font-black border-3 border-black shadow-button"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>
    </div>
  )
}
